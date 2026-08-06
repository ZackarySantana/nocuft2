import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
    createPackageArtifact,
    lowerHighModule,
    parsePackageArtifact,
    type PackageArtifact,
    type PackageExportParameter,
} from "@nocuft/compiler";
import { visitValueType } from "@nocuft/dfir";
import { analyzeTypeScriptProject } from "@nocuft/frontend-typescript";
import { findTsconfig } from "./build-project.js";
import { fetchPackageSource } from "./package-fetch.js";
import {
    createPackageStore,
    PACKAGE_DIRECTORY,
    type InstalledPackage,
    validPackageAlias,
} from "./package-store.js";

export const PACKAGE_TOOLCHAIN = "nocuft-cli@0.1.0;package@2";
export const PACKAGE_ARTIFACT_FILE = "package.dfir.json";
export const PACKAGE_FACADE_FILE = "index.d.ts";

export interface LoadedPackage {
    entry: InstalledPackage;
    artifact: PackageArtifact;
    sourcePaths: string[];
    facadePath: string;
}

export async function installPackage(
    projectRoot: string,
    alias: string,
    source: string,
    options: { replace?: boolean; baseDirectory?: string; sourceLabel?: string } = {},
): Promise<LoadedPackage> {
    if (!validPackageAlias(alias)) {
        throw new Error("Package names must be 1 to 16 lowercase letters or digits, start with a letter, and not be reserved");
    }
    const store = createPackageStore(projectRoot);
    const installed = await store.load();
    const previous = installed.find((entry) => entry.alias === alias);
    if (previous && !options.replace) {
        throw new Error(`Package ${JSON.stringify(alias)} is already installed. Use package update ${alias}.`);
    }
    const fetched = await fetchPackageSource(source, options.baseDirectory ?? projectRoot);
    if (!new URL(fetched.resolvedSource).pathname.toLowerCase().endsWith(".ts")) {
        throw new Error("Package sources must be a single .ts file");
    }
    const sourceText = new TextDecoder("utf-8", { fatal: true }).decode(fetched.bytes);

    const packageRoot = join(projectRoot, PACKAGE_DIRECTORY);
    const staging = join(packageRoot, `stage-${alias}-${randomUUID()}`);
    const sourcePath = join(staging, "src", "source.ts");
    await mkdir(dirname(sourcePath), { recursive: true });
    try {
        await writeFile(sourcePath, sourceText, "utf8");
        const analysis = analyzeTypeScriptProject({
            entryFile: sourcePath,
            tsconfigPath: await findTsconfig(projectRoot),
            packageMode: true,
        });
        const artifact = createPackageArtifact(alias, lowerHighModule(analysis.module));
        const artifactText = json(artifact);
        await writeFile(join(staging, PACKAGE_ARTIFACT_FILE), artifactText, "utf8");
        await writeFile(join(staging, PACKAGE_FACADE_FILE), renderPackageFacade(artifact), "utf8");

        const entry: InstalledPackage = {
            alias,
            source: options.sourceLabel ?? source,
            resolvedSource: fetched.resolvedSource,
            language: "typescript",
            sourceSha256: digest(fetched.bytes),
            artifactSha256: digest(artifactText),
            toolchain: PACKAGE_TOOLCHAIN,
        };
        const finalPath = join(packageRoot, alias);
        const backup = join(packageRoot, `.backup-${alias}-${randomUUID()}`);
        if (previous) await rename(finalPath, backup);
        try {
            await rename(staging, finalPath);
            await store.save([...installed.filter((item) => item.alias !== alias), entry]);
        } catch (error: unknown) {
            await rm(finalPath, { recursive: true, force: true });
            if (previous) await rename(backup, finalPath);
            throw error;
        }
        if (previous) await rm(backup, { recursive: true, force: true });
        return { entry, artifact, ...packagePaths(finalPath) };
    } finally {
        await rm(staging, { recursive: true, force: true });
    }
}

export async function loadVerifiedPackages(projectRoot: string): Promise<LoadedPackage[]> {
    const entries = await createPackageStore(projectRoot).load();
    return await Promise.all(entries.map(async (entry) => {
        const paths = packagePaths(join(projectRoot, PACKAGE_DIRECTORY, entry.alias));
        const [source, artifactBytes] = await Promise.all(paths.sourcePaths.map((path) => readFile(path)));
        compareDigest(entry.alias, "source", source, entry.sourceSha256);
        compareDigest(entry.alias, "artifact", artifactBytes, entry.artifactSha256);
        if (entry.toolchain !== PACKAGE_TOOLCHAIN) {
            throw new Error(
                `Package ${entry.alias} uses incompatible toolchain ${entry.toolchain}; ` +
                `run nocuft package update ${entry.alias} or reinstall it`,
            );
        }
        const artifact = parsePackageArtifact(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(artifactBytes)));
        await regenerateFacade(paths.facadePath, renderPackageFacade(artifact));
        return { entry, artifact, ...paths };
    }));
}

export function renderPackageFacade(artifact: PackageArtifact): string {
    const importedTypes = new Set<string>();
    for (const entry of artifact.functions) {
        for (const parameter of entry.parameters) {
            if (parameter.kind === "target") importedTypes.add("PlayerTarget");
            else collectSourceTypes(parameter.type, importedTypes);
        }
    }
    const imports = [...importedTypes].toSorted().map((type) => `type ${type}`);
    const lines = ["// Generated by nocuft. Do not edit."];
    if (imports.length > 0) lines.push(`import { ${imports.join(", ")} } from "nocuft";`);
    lines.push("");
    for (const entry of artifact.functions) {
        const parameters = entry.parameters.map((parameter) => {
            if (parameter.kind === "target") return `${parameter.name}: PlayerTarget`;
            if (parameter.rest === true) {
                return `...${parameter.name}: ${sourceType(parameter.type.elementType)}[]`;
            }
            return `${parameter.name}: ${sourceType(parameter.type)}`;
        });
        lines.push(`export declare function ${entry.name}(${parameters.join(", ")}): void;`);
    }
    return `${lines.join("\n").trimEnd()}\n`;
}

function packagePaths(root: string): { sourcePaths: string[]; facadePath: string } {
    return {
        sourcePaths: [join(root, "src", "source.ts"), join(root, PACKAGE_ARTIFACT_FILE)],
        facadePath: join(root, PACKAGE_FACADE_FILE),
    };
}

async function regenerateFacade(path: string, text: string): Promise<void> {
    const current = await readFile(path, "utf8").catch(() => undefined);
    if (current !== text) await writeFile(path, text, "utf8");
}

function sourceType(
    type: Extract<PackageExportParameter, { kind: "value" }>["type"],
): string {
    if (typeof type === "object") {
        return type.kind === "list"
            ? `List<${sourceType(type.elementType)}>`
            : `Dictionary<${sourceType(type.valueType)}>`;
    }
    switch (type) {
        case "text": return "string";
        case "number": return "number";
        case "boolean": return "boolean";
        case "component": return "ComponentInput";
        case "location": return "Location";
        case "item": return "Item";
        case "sound": return "SoundInput";
        case "any": return "AnyValueInput";
    }
}

function collectSourceTypes(
    type: Extract<PackageExportParameter, { kind: "value" }>["type"],
    result: Set<string>,
): void {
    visitValueType(type, (node) => {
        if (typeof node === "object") {
            result.add(node.kind === "list" ? "List" : "Dictionary");
            return;
        }
        const source = sourceType(node);
        if (!["string", "number", "boolean"].includes(source)) result.add(source);
    });
}

function json(value: unknown): string {
    return `${JSON.stringify(value, undefined, 2)}\n`;
}

function digest(value: Uint8Array | string): string {
    return createHash("sha256").update(value).digest("hex");
}

function compareDigest(alias: string, label: string, value: Uint8Array, expected: string): void {
    if (digest(value) !== expected) throw new Error(`Package ${alias} ${label} digest does not match nocuft.lock.json`);
}
