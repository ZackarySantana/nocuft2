import { randomUUID } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, parse } from "node:path";

export interface ProjectIdentity {
    id: string;
    path: string;
    created: boolean;
}

export class ProjectIdentityError extends Error {
    override readonly name = "ProjectIdentityError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

export async function readProjectIdentity(entryPath: string): Promise<ProjectIdentity> {
    const found = await findIdentity(entryPath);
    if (found !== undefined) {
        return { id: await readIdentity(found), path: found, created: false };
    }
    const path = join(conventionalRoot(entryPath), "nocuft.json");
    const id = randomUUID();
    await writeFile(path, `${JSON.stringify({
        format: "nocuft-project",
        version: 1,
        id,
    }, undefined, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return { id, path, created: true };
}

async function readIdentity(path: string): Promise<string> {
    let value: unknown;
    try {
        value = JSON.parse(await readFile(path, "utf8"));
    } catch (error: unknown) {
        throw new ProjectIdentityError(
            "project.identity_unreadable",
            `${path} could not be read as JSON: ${messageOf(error)}`,
        );
    }
    if (!isRecord(value)
        || value.format !== "nocuft-project"
        || value.version !== 1
        || typeof value.id !== "string"
        || !UUID.test(value.id)) {
        throw new ProjectIdentityError(
            "project.identity_invalid",
            `${path} must contain a nocuft-project version 1 UUID. Restore or remove it explicitly.`,
        );
    }
    return value.id;
}

async function findIdentity(entryPath: string): Promise<string | undefined> {
    const root = parse(entryPath).root;
    let directory = dirname(entryPath);
    for (;;) {
        const candidate = join(directory, "nocuft.json");
        try {
            if ((await stat(candidate)).isFile()) {
                return candidate;
            }
        } catch {
            // Keep looking toward the filesystem root.
        }
        if (directory === root) {
            return undefined;
        }
        const parent = dirname(directory);
        if (parent === directory) {
            return undefined;
        }
        directory = parent;
    }
}

function conventionalRoot(entryPath: string): string {
    const sourceDirectory = dirname(entryPath);
    return basename(sourceDirectory) === "src"
        ? dirname(sourceDirectory)
        : sourceDirectory;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
