import { readFile } from "node:fs/promises";
import { dirname, join, parse, resolve } from "node:path";

export async function findProjectRoot(start = process.cwd()): Promise<string> {
    let directory = resolve(start);
    const root = parse(directory).root;
    for (;;) {
        const path = join(directory, "nocuft.json");
        try {
            const value: unknown = JSON.parse(await readFile(path, "utf8"));
            if (isRecord(value) && value.format === "nocuft-project" && value.version === 1
                && typeof value.id === "string" && UUID.test(value.id)) {
                return directory;
            }
            throw new Error(`${path} is not a nocuft-project version 1 file`);
        } catch (error: unknown) {
            if (!isMissing(error)) {
                throw error;
            }
        }
        if (directory === root) {
            throw new Error(`Could not find nocuft.json above ${start}`);
        }
        directory = dirname(directory);
    }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isMissing(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
