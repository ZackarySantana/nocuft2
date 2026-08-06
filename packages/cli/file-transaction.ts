import { randomUUID } from "node:crypto";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface FileReplacement {
    path: string;
    content: string;
    mode?: number;
}

interface StagedReplacement extends FileReplacement {
    temporary: string;
    backup: string;
    existed: boolean;
    backedUp: boolean;
    replaced: boolean;
}

export async function replaceFilesAtomically(replacements: readonly FileReplacement[]): Promise<void> {
    const paths = new Set<string>();
    for (const replacement of replacements) {
        if (paths.has(replacement.path)) {
            throw new Error("A file transaction cannot replace the same path twice.");
        }
        paths.add(replacement.path);
    }
    const staged: StagedReplacement[] = [];
    try {
        for (const replacement of replacements) {
            const directory = dirname(replacement.path);
            await mkdir(directory, { recursive: true, mode: 0o755 });
            const token = randomUUID();
            const temporary = join(directory, `.nocuft-${token}.tmp`);
            const backup = join(directory, `.nocuft-${token}.bak`);
            let existed = true;
            try {
                await readFile(replacement.path);
            } catch (error: unknown) {
                if (isMissing(error)) existed = false;
                else throw error;
            }
            await writeFile(temporary, replacement.content, {
                encoding: "utf8",
                flag: "wx",
                mode: replacement.mode ?? 0o644,
            });
            staged.push({ ...replacement, temporary, backup, existed, backedUp: false, replaced: false });
        }
        for (const entry of staged) {
            if (entry.existed) {
                await rename(entry.path, entry.backup);
                entry.backedUp = true;
            }
            await rename(entry.temporary, entry.path);
            entry.replaced = true;
            await chmod(entry.path, entry.mode ?? 0o644);
        }
        await Promise.allSettled(staged.map(({ backup }) => rm(backup, { force: true })));
    } catch (error: unknown) {
        for (const entry of staged.toReversed()) {
            if (entry.replaced) {
                await rm(entry.path, { force: true });
            }
            if (entry.backedUp) await rename(entry.backup, entry.path);
            await rm(entry.temporary, { force: true });
            await rm(entry.backup, { force: true });
        }
        throw error;
    }
}

function isMissing(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
