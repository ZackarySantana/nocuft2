import { randomUUID } from "node:crypto";
import { chmod, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface VersionedFile<T> {
    read(): Promise<T>;
    write(value: T): Promise<void>;
}

export function createVersionedFile<T>(options: {
    path: string;
    parse(text: string): T;
    serialize(value: T): string;
    missing(): T;
    directoryMode?: number;
    fileMode?: number;
    chmodDirectory?: boolean;
}): VersionedFile<T> {
    return {
        read: async () => {
            try {
                return options.parse(await readFile(options.path, "utf8"));
            } catch (error: unknown) {
                if (isMissing(error)) {
                    return options.missing();
                }
                throw error;
            }
        },
        write: async (value) => {
            const directory = dirname(options.path);
            const directoryMode = options.directoryMode ?? 0o700;
            const fileMode = options.fileMode ?? 0o600;
            await mkdir(directory, { recursive: true, mode: directoryMode });
            if (options.chmodDirectory !== false) {
                await chmod(directory, directoryMode);
            }
            const temporary = join(directory, `.nocuft-${randomUUID()}.tmp`);
            try {
                await writeFile(temporary, options.serialize(value), {
                    encoding: "utf8",
                    flag: "wx",
                    mode: fileMode,
                });
                await rename(temporary, options.path);
                await chmod(options.path, fileMode);
            } catch (error: unknown) {
                try {
                    await unlink(temporary);
                } catch {
                    // The temporary file may not have been created.
                }
                throw error;
            }
        },
    };
}

function isMissing(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
