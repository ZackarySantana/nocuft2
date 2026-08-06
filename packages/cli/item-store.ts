import { createHash, randomUUID } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import { createVersionedFile } from "./versioned-file.js";

export const ITEM_LOCKFILE_NAME = "nocuft.items.json";
export const ITEM_FACADE_PATH = join("nocuft", "items.ts");

export interface ItemRevisionMetadata {
    minecraft?: string;
    data?: number;
    registries?: string;
}

export interface ItemRevision {
    version: number;
    digest: string | null;
    status: "active" | "deleted";
    snbt?: string;
    metadata?: ItemRevisionMetadata;
    restoredFrom?: number;
}

export interface CatalogItem {
    id: string;
    name: string;
    latest: number;
    revisions: ItemRevision[];
}

export interface ItemCatalog {
    items: CatalogItem[];
}

export interface InstalledItem {
    catalogId: string;
    name: string;
    version: number;
    digest: string;
    snbt: string;
}

export interface ProjectItems {
    items: InstalledItem[];
}

export interface ItemCatalogStore {
    load(): Promise<ItemCatalog>;
    save(catalog: ItemCatalog): Promise<void>;
}

export interface ProjectItemStore {
    load(): Promise<ProjectItems>;
    save(items: ProjectItems): Promise<void>;
}

export class ItemStoreError extends Error {
    override readonly name = "ItemStoreError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

function defaultDataRoot(): string {
    return process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
}

export const DEFAULT_ITEM_CATALOG_PATH = join(defaultDataRoot(), "nocuft", "items.json");

export function createItemCatalogStore(path = DEFAULT_ITEM_CATALOG_PATH): ItemCatalogStore {
    const file = createVersionedFile<ItemCatalog>({
        path,
        missing: () => ({ items: [] }),
        parse: parseCatalog,
        serialize: serializeCatalog,
    });
    return {
        load: file.read,
        save: async (catalog) => {
            validateCatalog(catalog);
            await file.write(catalog);
        },
    };
}

export function createProjectItemStore(projectRoot: string): ProjectItemStore {
    const file = createVersionedFile<ProjectItems>({
        path: join(projectRoot, ITEM_LOCKFILE_NAME),
        missing: () => ({ items: [] }),
        parse: parseProjectItems,
        serialize: serializeProjectItems,
        directoryMode: 0o755,
        fileMode: 0o644,
        chmodDirectory: false,
    });
    return {
        load: file.read,
        save: async (items) => {
            validateProjectItems(items);
            await file.write(items);
        },
    };
}

export function canonicalizeSnbt(snbt: string): string {
    const input = snbt.trim();
    if (input.length === 0) {
        throw invalid("items.invalid_payload", "An item payload cannot be empty.");
    }
    let quote: "'" | "\"" | undefined;
    let escaped = false;
    let output = "";
    for (const character of input) {
        if (quote !== undefined) {
            output += character;
            if (escaped) {
                escaped = false;
            } else if (character === "\\") {
                escaped = true;
            } else if (character === quote) {
                quote = undefined;
            }
            continue;
        }
        if (character === "'" || character === "\"") {
            quote = character;
            output += character;
        } else if (!/\s/u.test(character)) {
            output += character;
        }
    }
    if (quote !== undefined) {
        throw invalid("items.invalid_payload", "The item payload contains an unterminated string.");
    }
    return output;
}

export function itemDigest(snbt: string): string {
    return createHash("sha256").update(canonicalizeSnbt(snbt), "utf8").digest("hex");
}

export function createCatalogItem(
    name: string,
    snbt: string,
    metadata?: ItemRevisionMetadata,
): CatalogItem {
    assertItemName(name);
    const canonical = canonicalizeSnbt(snbt);
    return {
        id: randomUUID(),
        name,
        latest: 1,
        revisions: [{
            version: 1,
            digest: itemDigest(canonical),
            status: "active",
            snbt: canonical,
            ...(metadata === undefined ? {} : { metadata }),
        }],
    };
}

export function latestRevision(item: CatalogItem): ItemRevision {
    const revision = item.revisions.find(({ version }) => version === item.latest);
    if (revision === undefined) {
        throw invalid("items.catalog_corrupt", `Item ${JSON.stringify(item.name)} has no latest revision.`);
    }
    return revision;
}

export function validateCatalog(catalog: ItemCatalog): void {
    const ids = new Set<string>();
    const names = new Set<string>();
    for (const item of catalog.items) {
        assertItemName(item.name);
        if (!UUID.test(item.id) || ids.has(item.id) || names.has(item.name)) {
            throw invalid("items.catalog_corrupt", "Catalog item IDs and names must be unique and valid.");
        }
        ids.add(item.id);
        names.add(item.name);
        if (item.revisions.length === 0 || latestRevision(item).version !== item.latest) {
            throw invalid("items.catalog_corrupt", `Item ${JSON.stringify(item.name)} has non-monotonic revisions.`);
        }
        let previous = 0;
        for (const revision of item.revisions) {
            if (revision.version <= previous) {
                throw invalid("items.catalog_corrupt", `Item ${JSON.stringify(item.name)} has non-monotonic revisions.`);
            }
            validateRevision(item, revision);
            previous = revision.version;
        }
    }
}

export function validateProjectItems(project: ProjectItems): void {
    const ids = new Set<string>();
    const names = new Set<string>();
    for (const item of project.items) {
        assertItemName(item.name);
        if (!UUID.test(item.catalogId) || ids.has(item.catalogId) || names.has(item.name)
            || !Number.isSafeInteger(item.version) || item.version < 1
            || !SHA256.test(item.digest) || itemDigest(item.snbt) !== item.digest) {
            throw invalid("items.project_corrupt", `Invalid installed item ${JSON.stringify(item.name)}.`);
        }
        ids.add(item.catalogId);
        names.add(item.name);
    }
}

export function serializeProjectItems(project: ProjectItems): string {
    validateProjectItems(project);
    const items = project.items
        .toSorted((left, right) => left.name.localeCompare(right.name))
        .map((item) => ({
            catalogId: item.catalogId,
            name: item.name,
            version: item.version,
            digest: item.digest,
            snbt: canonicalizeSnbt(item.snbt),
        }));
    return `${JSON.stringify({ format: "nocuft-items", version: 1, items }, undefined, 2)}\n`;
}

export function renderItemFacade(project: ProjectItems): string {
    validateProjectItems(project);
    const entries = project.items
        .toSorted((left, right) => left.name.localeCompare(right.name))
        .map(({ name, snbt }) => `    ${JSON.stringify(name)}: itemSnapshot(${JSON.stringify(snbt)}),`);
    return [
        "// Generated by Nocuft. Do not edit.",
        "import { itemSnapshot } from \"nocuft\";",
        "",
        "export const items = {",
        ...entries,
        "} as const;",
        "",
        "export type ItemName = keyof typeof items;",
        "",
    ].join("\n");
}

export function serializeCatalog(catalog: ItemCatalog): string {
    validateCatalog(catalog);
    const items = catalog.items.toSorted((left, right) => left.name.localeCompare(right.name));
    return `${JSON.stringify({ format: "nocuft-item-catalog", version: 1, items }, undefined, 2)}\n`;
}

function parseCatalog(text: string): ItemCatalog {
    const value: unknown = parseJson(text, "The item catalog is not valid JSON.");
    if (!isRecord(value) || value.format !== "nocuft-item-catalog" || value.version !== 1
        || !Array.isArray(value.items)) {
        throw invalid("items.catalog_corrupt", "The item catalog must use nocuft-item-catalog version 1.");
    }
    const catalog = { items: value.items as CatalogItem[] };
    validateCatalog(catalog);
    return catalog;
}

function parseProjectItems(text: string): ProjectItems {
    const value: unknown = parseJson(text, `${ITEM_LOCKFILE_NAME} is not valid JSON.`);
    if (!isRecord(value) || value.format !== "nocuft-items" || value.version !== 1
        || !Array.isArray(value.items)) {
        throw invalid("items.project_corrupt", `${ITEM_LOCKFILE_NAME} must use nocuft-items version 1.`);
    }
    const project = { items: value.items.map((entry) => {
        if (!isRecord(entry)) {
            throw invalid("items.project_corrupt", `${ITEM_LOCKFILE_NAME} contains an invalid item.`);
        }
        return {
            catalogId: entry.catalogId,
            name: entry.name,
            version: entry.version,
            digest: entry.digest,
            snbt: entry.snbt,
        } as InstalledItem;
    }) };
    validateProjectItems(project);
    return project;
}

function validateRevision(item: CatalogItem, revision: ItemRevision): void {
    if (!Number.isSafeInteger(revision.version) || revision.version < 1
        || (revision.status !== "active" && revision.status !== "deleted")) {
        throw invalid("items.catalog_corrupt", `Item ${JSON.stringify(item.name)} has an invalid revision.`);
    }
    if (revision.status === "deleted") {
        if (revision.digest !== null || revision.snbt !== undefined) {
            throw invalid("items.catalog_corrupt", `Deleted revision ${item.name}@${revision.version} contains a payload.`);
        }
        return;
    }
    if (typeof revision.snbt !== "string" || typeof revision.digest !== "string"
        || !SHA256.test(revision.digest) || itemDigest(revision.snbt) !== revision.digest) {
        throw invalid("items.catalog_corrupt", `Digest mismatch for ${item.name}@${revision.version}.`);
    }
    if (revision.restoredFrom !== undefined
        && (!Number.isSafeInteger(revision.restoredFrom) || revision.restoredFrom < 1
            || revision.restoredFrom >= revision.version)) {
        throw invalid("items.catalog_corrupt", `Invalid restore source for ${item.name}@${revision.version}.`);
    }
}

function assertItemName(name: string): void {
    if (!/^[a-z][a-z0-9-]{0,63}$/u.test(name)) {
        throw invalid("items.invalid_name", "Item names must be lowercase identifiers up to 64 characters.");
    }
}

function parseJson(text: string, message: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch {
        throw invalid("items.invalid_json", message);
    }
}

function invalid(code: string, message: string): ItemStoreError {
    return new ItemStoreError(code, message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const SHA256 = /^[0-9a-f]{64}$/u;
