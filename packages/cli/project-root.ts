import { stat } from "node:fs/promises";
import { dirname, join, parse, resolve } from "node:path";
import { readProjectManifest } from "./project-identity.js";

export async function findProjectRoot(start = process.cwd()): Promise<string> {
    let directory = resolve(start);
    const root = parse(directory).root;
    for (;;) {
        const path = join(directory, "nocuft.json");
        try {
            await stat(path);
            await readProjectManifest(path);
            return directory;
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

function isMissing(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
