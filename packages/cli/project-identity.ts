import { randomUUID } from "node:crypto";
import { readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, parse, relative, resolve, sep } from "node:path";

export interface ProjectIdentity {
    id: string;
    path: string;
    created: boolean;
}

export interface ProjectManifest {
    format: "nocuft-project";
    version: 1;
    id: string;
    name: string;
    language: "typescript";
    entry: string;
    module: string;
}

export class ProjectIdentityError extends Error {
    override readonly name = "ProjectIdentityError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

export async function readProjectIdentity(entryPath: string): Promise<ProjectIdentity> {
    const path = await findProjectManifest(entryPath);
    if (path === undefined) {
        throw new ProjectIdentityError(
            "project.manifest_not_found",
            `Could not find nocuft.json above ${entryPath}. Run nocuft init first.`,
        );
    }
    const manifest = await readProjectManifest(path);
    return { id: manifest.id, path, created: false };
}

export async function readProjectManifest(path: string): Promise<ProjectManifest> {
    let value: unknown;
    try {
        value = JSON.parse(await readFile(path, "utf8"));
    } catch (error: unknown) {
        throw new ProjectIdentityError(
            "project.manifest_unreadable",
            `${path} could not be read as JSON: ${messageOf(error)}`,
        );
    }
    if (!isRecord(value)
        || value.format !== "nocuft-project"
        || value.version !== 1
        || typeof value.id !== "string"
        || !UUID.test(value.id)) {
        throw invalidManifest(path);
    }
    if (typeof value.name !== "string"
        || typeof value.entry !== "string"
        || typeof value.module !== "string"
        || value.language !== "typescript"
        || !/^[a-z][a-z0-9._-]{0,63}$/u.test(value.name)
        || value.module.length > 255
        || !/^[a-z][a-z0-9]*(?:[._/-][a-z0-9]+)*$/u.test(value.module)
        || !validRelativeEntry(value.entry)) {
        throw invalidManifest(path);
    }
    return {
        format: "nocuft-project",
        version: 1,
        id: value.id,
        name: value.name,
        language: "typescript",
        entry: value.entry,
        module: value.module,
    };
}

export async function findProjectManifest(start: string): Promise<string | undefined> {
    const absolute = resolve(start);
    let directory: string;
    try {
        directory = (await stat(absolute)).isDirectory() ? absolute : dirname(absolute);
    } catch {
        directory = dirname(absolute);
    }
    const root = parse(directory).root;
    for (;;) {
        const candidate = join(directory, "nocuft.json");
        try {
            if ((await stat(candidate)).isFile()) return candidate;
        } catch {
            // Keep looking toward the filesystem root.
        }
        if (directory === root) return undefined;
        directory = dirname(directory);
    }
}

export function conventionalProjectRoot(entryPath: string): string {
    const sourceDirectory = dirname(resolve(entryPath));
    return basename(sourceDirectory) === "src"
        ? dirname(sourceDirectory)
        : sourceDirectory;
}

export function relativeProjectEntry(root: string, entryPath: string): string {
    const path = relative(root, resolve(entryPath));
    if (path === "" || isAbsolute(path) || path === ".." || path.startsWith(`..${sep}`)) {
        throw new ProjectIdentityError(
            "project.entry_outside_root",
            `Entry ${entryPath} must be inside project root ${root}.`,
        );
    }
    return path.split(sep).join("/");
}

export function resolveProjectEntry(root: string, entry: string): string {
    return resolve(root, ...entry.split("/"));
}

export async function writeProjectManifest(
    path: string,
    manifest: ProjectManifest,
): Promise<void> {
    const temporary = join(dirname(path), `.nocuft-${randomUUID()}.tmp`);
    try {
        await writeFile(temporary, `${JSON.stringify(manifest, undefined, 2)}\n`, {
            encoding: "utf8",
            flag: "wx",
        });
        await rename(temporary, path);
    } catch (error: unknown) {
        try {
            await unlink(temporary);
        } catch {
            // The temporary file may not have been created.
        }
        throw error;
    }
}

function validRelativeEntry(path: string): boolean {
    return path.length > 0
        && path.toLowerCase().endsWith(".ts")
        && !path.startsWith("/")
        && !path.includes("\\")
        && path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

function invalidManifest(path: string): ProjectIdentityError {
    return new ProjectIdentityError(
        "project.manifest_invalid",
        `${path} must contain a valid nocuft-project version 1 definition.`,
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
