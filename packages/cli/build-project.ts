import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { emitTemplates, linkPackageArtifacts, lowerHighModule, pruneHostModule, type EmittedTemplate } from "@nocuft/compiler";
import {
    analyzeTypeScriptProject,
    TypeScriptAnalysisError,
} from "@nocuft/frontend-typescript";
import { loadVerifiedPackages } from "./package-manager.js";
import { findProjectRoot } from "./project-root.js";
import { PACKAGE_LOCKFILE_NAME } from "./package-store.js";

export interface BuildSource {
    path: string;
    sha256: string;
}

export interface BuildDiagnostic {
    severity: "error";
    code: string;
    message: string;
}

export type ProjectBuildResult =
    | { ok: true; templates: EmittedTemplate[]; sources: BuildSource[]; watchPaths?: string[] }
    | { ok: false; diagnostics: BuildDiagnostic[]; watchPaths: string[] };

export interface BuildProjectOptions {
    entryPath: string;
    tsconfigPath?: string;
}

export async function buildProject(
    options: BuildProjectOptions,
): Promise<ProjectBuildResult> {
    let tsconfigPath: string;
    try {
        tsconfigPath = options.tsconfigPath ?? await findTsconfig(dirname(options.entryPath));
    } catch (error: unknown) {
        return failed("typescript.tsconfig_not_found", error, [options.entryPath]);
    }
    try {
        let packages: Awaited<ReturnType<typeof loadVerifiedPackages>> = [];
        let projectRoot: string | undefined;
        try {
            projectRoot = await findProjectRoot(dirname(options.entryPath));
            packages = await loadVerifiedPackages(projectRoot);
        } catch (error: unknown) {
            if (String(error).includes("Could not find nocuft.json")) {
                packages = [];
            } else {
                throw error;
            }
        }
        const analysis = analyzeTypeScriptProject({
            entryFile: options.entryPath,
            tsconfigPath,
            packages: packages.map((pkg) => ({
                alias: pkg.entry.alias,
                stubPath: pkg.paths[3],
                exports: pkg.exports.functions,
            })),
        });
        const watchPaths = [...new Set([
            resolve(options.entryPath),
            resolve(tsconfigPath),
            ...analysis.sourceFiles,
            ...(projectRoot ? [join(projectRoot, PACKAGE_LOCKFILE_NAME)] : []),
            ...packages.flatMap((pkg) => pkg.paths),
        ])].toSorted();
        const paths = (await Promise.all(watchPaths.map(async (path) => {
            try {
                return (await stat(path)).isFile() ? path : undefined;
            } catch {
                return undefined;
            }
        }))).filter((path): path is string => path !== undefined);
        const sources = await Promise.all(paths.map(async (path) => ({
            path,
            sha256: createHash("sha256").update(await readFile(path)).digest("hex"),
        })));
        const host = pruneHostModule(lowerHighModule(analysis.module));
        const templates = emitTemplates(linkPackageArtifacts(host, packages.map((pkg) => pkg.artifact)));
        if (templates.length === 0) {
            return {
                ok: false,
                diagnostics: [{
                    severity: "error",
                    code: "compiler.no_templates",
                    message: "The entry file does not export any functions or events.",
                }],
                watchPaths: paths,
            };
        }
        return {
            ok: true,
            templates,
            sources,
            watchPaths,
        };
    } catch (error: unknown) {
        return failed(
            "typescript.build_failed",
            error,
            [
                resolve(options.entryPath),
                resolve(tsconfigPath),
                ...(error instanceof TypeScriptAnalysisError
                    ? error.sourceFiles
                    : []),
            ],
        );
    }
}

export async function findTsconfig(start: string): Promise<string> {
    let directory = resolve(start);
    for (;;) {
        const candidate = join(directory, "tsconfig.json");
        try {
            await readFile(candidate);
            return candidate;
        } catch {
            // Keep looking toward the filesystem root.
        }
        const parent = dirname(directory);
        if (parent === directory) {
            throw new Error(`Could not find tsconfig.json above ${start}`);
        }
        directory = parent;
    }
}

function failed(
    code: string,
    error: unknown,
    watchPaths: string[],
): ProjectBuildResult {
    return {
        ok: false,
        diagnostics: [{
            severity: "error",
            code,
            message: error instanceof Error ? error.message : String(error),
        }],
        watchPaths: [...new Set(watchPaths)].toSorted(),
    };
}
