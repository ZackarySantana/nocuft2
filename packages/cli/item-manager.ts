import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { replaceFilesAtomically, type FileReplacement } from "./file-transaction.js";
import {
    createCatalogItem,
    createItemCatalogStore,
    createProjectItemStore,
    DEFAULT_ITEM_CATALOG_PATH,
    ITEM_FACADE_PATH,
    ITEM_LOCKFILE_NAME,
    canonicalizeSnbt,
    itemDigest,
    latestRevision,
    renderItemFacade,
    serializeCatalog,
    serializeProjectItems,
    validateCatalog,
    validateProjectItems,
    type CatalogItem,
    type InstalledItem,
    type ItemCatalog,
    type ItemRevision,
    type ItemRevisionMetadata,
    type ProjectItems,
} from "./item-store.js";
import { findProjectRoot } from "./project-root.js";
import type { RegisteredProject } from "./project-store.js";

export interface ProjectItemState {
    project: string;
    root: string;
    manifest: ProjectItems;
}

export interface RegisteredProjectPreflight {
    states: ProjectItemState[];
    warnings: Array<{ project: string; message: string }>;
}

export interface OutdatedItem {
    project: string;
    name: string;
    installed: number;
    latest: number;
    status: "current" | "outdated" | "deleted";
}

export interface CaptureResult {
    item: CatalogItem;
    revision: ItemRevision;
    unchanged: boolean;
    eligibleProjects: ProjectItemState[];
    outdatedProjects: number;
}

export interface CapturePreview {
    item?: CatalogItem;
    unchanged: boolean;
    currentVersion: number;
    nextVersion: number;
    eligibleProjects: number;
    installedProjects: number;
}

export async function registeredProjectStates(
    projects: readonly RegisteredProject[],
): Promise<ProjectItemState[]> {
    const states: ProjectItemState[] = [];
    const roots = new Set<string>();
    for (const project of projects) {
        const root = await findProjectRoot(dirname(project.entryPath));
        if (roots.has(root)) continue;
        roots.add(root);
        const manifest = await createProjectItemStore(root).load();
        if (manifest.items.length > 0) {
            let facade: string;
            try {
                facade = await readFile(join(root, ITEM_FACADE_PATH), "utf8");
            } catch (error: unknown) {
                if (isMissing(error)) {
                    throw itemError("items.facade_missing", `${project.name} is missing its generated item facade.`);
                }
                throw error;
            }
            if (facade !== renderItemFacade(manifest)) {
                throw itemError("items.facade_drift", `${project.name} has a modified generated item facade.`);
            }
        }
        states.push({ project: project.name, root, manifest });
    }
    return states;
}

export async function preflightRegisteredProjects(
    projects: readonly RegisteredProject[],
): Promise<RegisteredProjectPreflight> {
    const states: ProjectItemState[] = [];
    const warnings: Array<{ project: string; message: string }> = [];
    const roots = new Set<string>();
    for (const project of projects) {
        try {
            const [state] = await registeredProjectStates([project]);
            if (state !== undefined && !roots.has(state.root)) {
                roots.add(state.root);
                states.push(state);
            }
        } catch (error: unknown) {
            warnings.push({
                project: project.name,
                message: error instanceof Error ? error.message : String(error),
            });
        }
    }
    return { states, warnings };
}

export function findCatalogItem(catalog: ItemCatalog, nameOrId: string): CatalogItem {
    const item = catalog.items.find(({ name, id }) => name === nameOrId || id === nameOrId);
    if (item === undefined) throw itemError("items.not_found", `Catalog item ${JSON.stringify(nameOrId)} was not found.`);
    return item;
}

export function findRevision(item: CatalogItem, version = item.latest): ItemRevision {
    const revision = item.revisions.find((entry) => entry.version === version);
    if (revision === undefined) throw itemError("items.revision_not_found", `${item.name} has no v${version}.`);
    return revision;
}

export function installFromRevision(item: CatalogItem, revision: ItemRevision): InstalledItem {
    if (revision.status === "deleted" || revision.digest === null || revision.snbt === undefined) {
        throw itemError("items.deleted", `${item.name}@${revision.version} is deleted and cannot be installed.`);
    }
    return {
        catalogId: item.id,
        name: item.name,
        version: revision.version,
        digest: revision.digest,
        snbt: revision.snbt,
    };
}

export async function installProjectItem(
    projectRoot: string,
    nameOrId: string,
    version?: number,
): Promise<InstalledItem> {
    const catalog = await createItemCatalogStore().load();
    const item = findCatalogItem(catalog, nameOrId);
    const revision = findRevision(item, version);
    const store = createProjectItemStore(projectRoot);
    const project = await store.load();
    const existing = project.items.find(({ catalogId, name }) => catalogId === item.id || name === item.name);
    const installed = installFromRevision(item, revision);
    const next = {
        items: [...project.items.filter(({ catalogId }) => catalogId !== item.id), installed],
    };
    if (existing !== undefined && existing.catalogId !== item.id) {
        throw itemError("items.name_collision", `Project item ${JSON.stringify(item.name)} tracks another catalog UUID.`);
    }
    await writeProjectManifests([{ project: "current", root: projectRoot, manifest: next }]);
    return installed;
}

export function compareProject(catalog: ItemCatalog, state: ProjectItemState): OutdatedItem[] {
    return state.manifest.items.map((installed) => {
        const item = catalog.items.find(({ id }) => id === installed.catalogId);
        if (item === undefined) {
            throw itemError("items.catalog_missing", `${state.project}/${installed.name} references an unknown catalog UUID.`);
        }
        const latest = latestRevision(item);
        const status = latest.status === "deleted"
            ? "deleted" as const
            : installed.version === item.latest && installed.digest === latest.digest
                ? "current" as const
                : "outdated" as const;
        return {
            project: state.project,
            name: item.name,
            installed: installed.version,
            latest: item.latest,
            status,
        };
    }).toSorted((left, right) => left.name.localeCompare(right.name));
}

export async function updateProjectStates(
    catalog: ItemCatalog,
    states: readonly ProjectItemState[],
    name?: string,
): Promise<number> {
    validateCatalog(catalog);
    const changed: ProjectItemState[] = [];
    let updates = 0;
    for (const state of states) {
        const items = state.manifest.items.map((installed) => {
            const catalogItem = catalog.items.find(({ id }) => id === installed.catalogId);
            if (catalogItem === undefined) {
                throw itemError("items.catalog_missing", `${state.project}/${installed.name} references an unknown catalog UUID.`);
            }
            if (name !== undefined && catalogItem.name !== name) return installed;
            const revision = latestRevision(catalogItem);
            if (revision.status === "deleted") return installed;
            if (installed.version === revision.version && installed.digest === revision.digest
                && installed.name === catalogItem.name) return installed;
            updates += 1;
            return installFromRevision(catalogItem, revision);
        });
        if (items.some((item, index) => item !== state.manifest.items[index])) {
            changed.push({ ...state, manifest: { items } });
        }
    }
    if (name !== undefined && !states.some(({ manifest }) => manifest.items.some((item) => {
        const catalogItem = catalog.items.find(({ id }) => id === item.catalogId);
        return catalogItem?.name === name;
    }))) {
        throw itemError("items.not_installed", `Item ${JSON.stringify(name)} is not installed in the selected projects.`);
    }
    await writeProjectManifests(changed);
    return updates;
}

export async function rollbackProjectItem(projectRoot: string, name: string, version: number): Promise<{
    from: number;
    item: InstalledItem;
}> {
    const catalog = await createItemCatalogStore().load();
    const project = await createProjectItemStore(projectRoot).load();
    const current = project.items.find((item) => item.name === name);
    if (current === undefined) throw itemError("items.not_installed", `Item ${JSON.stringify(name)} is not installed.`);
    const catalogItem = catalog.items.find(({ id }) => id === current.catalogId);
    if (catalogItem === undefined) throw itemError("items.catalog_missing", `${name} references an unknown catalog UUID.`);
    const item = installFromRevision(catalogItem, findRevision(catalogItem, version));
    await writeProjectManifests([{
        project: "current",
        root: projectRoot,
        manifest: { items: project.items.map((entry) => entry === current ? item : entry) },
    }]);
    return { from: current.version, item };
}

export async function captureCatalogItem(options: {
    name: string;
    snbt: string;
    metadata?: ItemRevisionMetadata;
    projects?: readonly ProjectItemState[];
    updateAll?: boolean;
    catalogPath?: string;
}): Promise<CaptureResult> {
    const path = options.catalogPath ?? DEFAULT_ITEM_CATALOG_PATH;
    const store = createItemCatalogStore(path);
    const catalog = await store.load();
    let item = catalog.items.find(({ name }) => name === options.name);
    if (item === undefined) {
        item = createCatalogItem(options.name, options.snbt, options.metadata);
        const next = { items: [...catalog.items, item] };
        if (options.updateAll) {
            await writeCatalogAndProjects(path, next, []);
        } else {
            await store.save(next);
        }
        return { item, revision: latestRevision(item), unchanged: false, eligibleProjects: [], outdatedProjects: 0 };
    }
    const current = latestRevision(item);
    const digest = itemDigest(options.snbt);
    const projects = options.projects ?? [];
    const eligibleProjects = projects.filter(({ manifest }) => manifest.items.some((installed) =>
        installed.catalogId === item!.id));
    const affected = projects.filter(({ manifest }) => manifest.items.some(({ catalogId }) => catalogId === item!.id));
    if (current.status === "active" && current.digest === digest) {
        return {
            item,
            revision: current,
            unchanged: true,
            eligibleProjects,
            outdatedProjects: affected.filter((state) => !eligibleProjects.includes(state)).length,
        };
    }
    const revision: ItemRevision = {
        version: item.latest + 1,
        digest,
        status: "active",
        snbt: canonicalizeSnbt(options.snbt),
        ...(options.metadata === undefined ? {} : { metadata: options.metadata }),
    };
    item = { ...item, latest: revision.version, revisions: [...item.revisions, revision] };
    const nextCatalog = { items: catalog.items.map((entry) => entry.id === item!.id ? item! : entry) };
    if (options.updateAll) {
        const updated = eligibleProjects.map((state) => ({
            ...state,
            manifest: {
                items: state.manifest.items.map((installed) => installed.catalogId === item!.id
                    ? installFromRevision(item!, revision) : installed),
            },
        }));
        await writeCatalogAndProjects(path, nextCatalog, updated);
    } else {
        await store.save(nextCatalog);
    }
    return {
        item,
        revision,
        unchanged: false,
        eligibleProjects,
        outdatedProjects: options.updateAll ? affected.length - eligibleProjects.length : affected.length,
    };
}

export async function previewCatalogCapture(options: {
    name: string;
    snbt: string;
    projects: readonly ProjectItemState[];
}): Promise<CapturePreview> {
    const catalog = await createItemCatalogStore().load();
    const item = catalog.items.find(({ name }) => name === options.name);
    if (item === undefined) {
        return {
            unchanged: false,
            currentVersion: 0,
            nextVersion: 1,
            eligibleProjects: 0,
            installedProjects: 0,
        };
    }
    const current = latestRevision(item);
    const installed = options.projects.filter(({ manifest }) =>
        manifest.items.some(({ catalogId }) => catalogId === item.id));
    const eligible = installed;
    await preflight([
        { path: DEFAULT_ITEM_CATALOG_PATH, content: "" },
        ...eligible.flatMap(({ root }) => [
            { path: join(root, ITEM_LOCKFILE_NAME), content: "" },
            { path: join(root, ITEM_FACADE_PATH), content: "" },
        ]),
    ]);
    return {
        item,
        unchanged: current.status === "active" && current.digest === itemDigest(options.snbt),
        currentVersion: item.latest,
        nextVersion: item.latest + 1,
        eligibleProjects: eligible.length,
        installedProjects: installed.length,
    };
}

export async function restoreCatalogItem(name: string, from: number): Promise<ItemRevision> {
    const store = createItemCatalogStore();
    const catalog = await store.load();
    const item = findCatalogItem(catalog, name);
    const source = findRevision(item, from);
    if (source.status === "deleted" || source.snbt === undefined || source.digest === null) {
        throw itemError("items.deleted", `Cannot restore ${item.name} from deleted v${from}.`);
    }
    const revision: ItemRevision = {
        version: item.latest + 1,
        status: "active",
        digest: source.digest,
        snbt: source.snbt,
        ...(source.metadata === undefined ? {} : { metadata: source.metadata }),
        restoredFrom: from,
    };
    const updated = { ...item, latest: revision.version, revisions: [...item.revisions, revision] };
    await store.save({ items: catalog.items.map((entry) => entry.id === item.id ? updated : entry) });
    return revision;
}

export async function removeCatalogItem(name: string): Promise<ItemRevision> {
    const store = createItemCatalogStore();
    const catalog = await store.load();
    const item = findCatalogItem(catalog, name);
    const current = latestRevision(item);
    if (current.status === "deleted") throw itemError("items.deleted", `${item.name} is already deleted at v${item.latest}.`);
    const revision: ItemRevision = { version: item.latest + 1, status: "deleted", digest: null };
    const updated = { ...item, latest: revision.version, revisions: [...item.revisions, revision] };
    await store.save({ items: catalog.items.map((entry) => entry.id === item.id ? updated : entry) });
    return revision;
}

export async function renameCatalogItem(name: string, nextName: string): Promise<CatalogItem> {
    const store = createItemCatalogStore();
    const catalog = await store.load();
    const item = findCatalogItem(catalog, name);
    if (catalog.items.some((entry) => entry.name === nextName)) {
        throw itemError("items.name_collision", `Catalog item ${JSON.stringify(nextName)} already exists.`);
    }
    const renamed = { ...item, name: nextName };
    const next = { items: catalog.items.map((entry) => entry.id === item.id ? renamed : entry) };
    validateCatalog(next);
    await store.save(next);
    return renamed;
}

export function exportCatalogItem(item: CatalogItem, version?: number, history = false): string {
    if (history) return `${JSON.stringify({ format: "nocuft-item-export", version: 1, item }, undefined, 2)}\n`;
    const revision = findRevision(item, version);
    return `${JSON.stringify({
        format: "nocuft-item-export",
        version: 1,
        item: { id: item.id, name: item.name, latest: revision.version, revisions: [revision] },
    }, undefined, 2)}\n`;
}

export async function importCatalogItem(path: string): Promise<"added" | "merged" | "unchanged"> {
    const value: unknown = JSON.parse(await readFile(path, "utf8"));
    if (!isRecord(value) || value.format !== "nocuft-item-export" || value.version !== 1 || !isRecord(value.item)) {
        throw itemError("items.invalid_import", "The import must use nocuft-item-export version 1.");
    }
    const incoming = value.item as unknown as CatalogItem;
    validateImportedItem(incoming);
    const store = createItemCatalogStore();
    const catalog = await store.load();
    const sameId = catalog.items.find(({ id }) => id === incoming.id);
    const sameName = catalog.items.find(({ name }) => name === incoming.name);
    if (sameId === undefined) {
        if (sameName !== undefined) {
            throw itemError("items.name_collision", `Another UUID already uses ${JSON.stringify(incoming.name)}. Rename it before importing.`);
        }
        await store.save({ items: [...catalog.items, incoming] });
        return "added";
    }
    if (sameId.name !== incoming.name && sameName !== undefined) {
        throw itemError("items.name_collision", `Another UUID already uses ${JSON.stringify(incoming.name)}.`);
    }
    const revisions = new Map(sameId.revisions.map((revision) => [revision.version, revision]));
    let changed = sameId.name !== incoming.name;
    for (const revision of incoming.revisions) {
        const existing = revisions.get(revision.version);
        if (existing !== undefined) {
            if (existing.digest !== revision.digest || existing.status !== revision.status) {
                throw itemError("items.import_corrupt", `${incoming.name}@${revision.version} conflicts with the catalog.`);
            }
        } else {
            revisions.set(revision.version, revision);
            changed = true;
        }
    }
    if (!changed) return "unchanged";
    const mergedRevisions = [...revisions.values()].toSorted((left, right) => left.version - right.version);
    const merged: CatalogItem = {
        id: sameId.id,
        name: incoming.name,
        latest: Math.max(sameId.latest, incoming.latest),
        revisions: mergedRevisions,
    };
    validateImportedItem(merged);
    await store.save({ items: catalog.items.map((entry) => entry.id === sameId.id ? merged : entry) });
    return "merged";
}

async function writeProjectManifests(states: readonly ProjectItemState[]): Promise<void> {
    const replacements: FileReplacement[] = [];
    for (const state of states) {
        validateProjectItems(state.manifest);
        replacements.push(
            { path: join(state.root, ITEM_LOCKFILE_NAME), content: serializeProjectItems(state.manifest) },
            { path: join(state.root, ITEM_FACADE_PATH), content: renderItemFacade(state.manifest) },
        );
    }
    await preflight(replacements);
    await replaceFilesAtomically(replacements);
}

async function writeCatalogAndProjects(
    catalogPath: string,
    catalog: ItemCatalog,
    states: readonly ProjectItemState[],
): Promise<void> {
    validateCatalog(catalog);
    const replacements: FileReplacement[] = [{ path: catalogPath, content: serializeCatalog(catalog), mode: 0o600 }];
    for (const state of states) {
        validateProjectItems(state.manifest);
        replacements.push(
            { path: join(state.root, ITEM_LOCKFILE_NAME), content: serializeProjectItems(state.manifest) },
            { path: join(state.root, ITEM_FACADE_PATH), content: renderItemFacade(state.manifest) },
        );
    }
    await preflight(replacements);
    await replaceFilesAtomically(replacements);
}

async function preflight(replacements: readonly FileReplacement[]): Promise<void> {
    const paths = new Set<string>();
    for (const replacement of replacements) {
        if (paths.has(replacement.path)) throw itemError("items.project_collision", `Multiple projects resolve to ${replacement.path}.`);
        paths.add(replacement.path);
        try {
            await access(replacement.path, constants.W_OK);
        } catch (error: unknown) {
            if (!isMissing(error)) throw itemError("items.not_writable", `Cannot write ${replacement.path}.`);
            try {
                await access(dirname(replacement.path), constants.W_OK);
            } catch (parentError: unknown) {
                if (!isMissing(parentError)) throw itemError("items.not_writable", `Cannot write ${replacement.path}.`);
            }
        }
    }
}

function validateImportedItem(item: CatalogItem): void {
    validateCatalog({ items: [item] });
}

function itemError(code: string, message: string): Error & { code: string } {
    return Object.assign(new Error(message), { code });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isMissing(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
