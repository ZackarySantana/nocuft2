import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createVersionedFile } from "./versioned-file.js";

export const PACKAGE_DIRECTORY = "nocuft";
export const PACKAGE_LOCKFILE_NAME = "nocuft.lock.json";

export interface InstalledPackage {
    alias: string;
    source: string;
    resolvedSource: string;
    language: "typescript";
    sourceSha256: string;
    artifactSha256: string;
    exportsSha256: string;
    stubSha256: string;
    toolchain: string;
    exports: string[];
}

export interface PackageStore {
    load(): Promise<InstalledPackage[]>;
    save(packages: readonly InstalledPackage[]): Promise<void>;
}

export function validPackageAlias(alias: string): boolean {
    return /^[a-z][a-z0-9]{0,15}$/u.test(alias) && !RESERVED.has(alias);
}

export function createPackageStore(projectRoot: string): PackageStore {
    const file = createVersionedFile<InstalledPackage[]>({
        path: join(projectRoot, PACKAGE_LOCKFILE_NAME),
        missing: () => [],
        parse: parseLock,
        serialize: serializeLock,
        directoryMode: 0o755,
        fileMode: 0o644,
        chmodDirectory: false,
    });
    return { load: file.read, save: file.write };
}

export async function readJson(path: string): Promise<unknown> {
    return JSON.parse(await readFile(path, "utf8"));
}

function parseLock(text: string): InstalledPackage[] {
    const value: unknown = JSON.parse(text);
    if (!isRecord(value) || value.format !== "nocuft-lock" || value.version !== 1 || !isRecord(value.packages)) {
        throw new Error("nocuft.lock.json must use format nocuft-lock version 1");
    }
    const result = Object.entries(value.packages).map(([alias, entry]) => {
        if (!validPackageAlias(alias) || !isRecord(entry) || typeof entry.source !== "string"
            || typeof entry.resolvedSource !== "string" || entry.language !== "typescript"
            || typeof entry.sourceSha256 !== "string" || typeof entry.artifactSha256 !== "string"
            || typeof entry.exportsSha256 !== "string" || typeof entry.stubSha256 !== "string"
            || typeof entry.toolchain !== "string" || !Array.isArray(entry.exports)
            || entry.exports.some((name) => typeof name !== "string")) {
            throw new Error(`Invalid lock entry for package ${JSON.stringify(alias)}`);
        }
        return { alias, ...entry } as InstalledPackage;
    });
    return result.toSorted((left, right) => left.alias.localeCompare(right.alias));
}

function serializeLock(packages: readonly InstalledPackage[]): string {
    const entries = packages.toSorted((left, right) => left.alias.localeCompare(right.alias)).map(({ alias, ...entry }) => [alias, entry]);
    return `${JSON.stringify({ format: "nocuft-lock", version: 1, packages: Object.fromEntries(entries) }, undefined, 2)}\n`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

const RESERVED = new Set([
    "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else",
    "enum", "export", "extends", "false", "finally", "for", "function", "if", "import", "in",
    "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public",
    "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof", "var",
    "void", "while", "with", "yield", "go", "map", "range", "select", "struct", "type",
]);
