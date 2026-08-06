import { basename } from "node:path";
import type { CliIo } from "./cli.js";
import {
    compareProject,
    exportCatalogItem,
    findCatalogItem,
    importCatalogItem,
    installProjectItem,
    previewCatalogCapture,
    preflightRegisteredProjects,
    captureCatalogItem,
    removeCatalogItem,
    renameCatalogItem,
    restoreCatalogItem,
    rollbackProjectItem,
    updateProjectStates,
    type ProjectItemState,
} from "./item-manager.js";
import { createItemCatalogStore, createProjectItemStore, latestRevision } from "./item-store.js";
import type { ItemRevisionMetadata } from "./item-store.js";
import { findProjectRoot } from "./project-root.js";
import type { ProjectStore } from "./project-store.js";
import type { NocuftInboundRequest } from "@nocuft/deployment";
import { renderTextTable } from "./text-table.js";

export type ItemCommand =
    | { verb: "list"; deleted: boolean }
    | { verb: "history"; name: string }
    | { verb: "install"; name: string; version?: number }
    | { verb: "outdated"; allProjects: boolean }
    | { verb: "update"; name?: string; allProjects: boolean }
    | { verb: "rollback"; name: string; to: number }
    | { verb: "restore"; name: string; from: number }
    | { verb: "remove"; name: string }
    | { verb: "rename"; name: string; nextName: string }
    | { verb: "export"; name: string; version?: number; history: boolean }
    | { verb: "import"; path: string };

export async function runItemCommand(
    command: ItemCommand,
    projectStore: ProjectStore,
    io: CliIo,
): Promise<number> {
    const catalogStore = createItemCatalogStore();
    switch (command.verb) {
        case "list": {
            const catalog = await catalogStore.load();
            const items = catalog.items.filter((item) => command.deleted || latestRevision(item).status !== "deleted");
            if (items.length === 0) {
                io.stdout(command.deleted ? "No catalog items.\n" : "No active catalog items.\n");
                return 0;
            }
            io.stdout(renderTextTable(["ITEM", "VERSION", "STATUS", "ID"], items.map((item) => {
                const revision = latestRevision(item);
                return [item.name, `v${item.latest}`, revision.status, item.id];
            })));
            return 0;
        }
        case "history": {
            const item = findCatalogItem(await catalogStore.load(), command.name);
            io.stdout(`${item.name}  ${item.id}\n`);
            io.stdout(renderTextTable(["VERSION", "STATUS", "DIGEST", "DETAIL"], item.revisions.toReversed().map((revision) => [
                `v${revision.version}`,
                revision.status,
                revision.digest ?? "-",
                revision.restoredFrom === undefined ? "" : `restored from v${revision.restoredFrom}`,
            ])));
            return 0;
        }
        case "install": {
            const root = await findProjectRoot();
            const installed = await installProjectItem(root, command.name, command.version);
            io.stdout(`Installed ${installed.name}@${installed.version}.\n`);
            return 0;
        }
        case "outdated": {
            const catalog = await catalogStore.load();
            const states = await selectedStates(command.allProjects, projectStore, io, false);
            if (command.allProjects) {
                const tableRows: string[][] = [];
                for (const state of states) {
                    const rows = compareProject(catalog, state).filter(({ status }) => status !== "current");
                    if (rows.length === 0) tableRows.push([state.project, "-", "-", "-", "current"]);
                    for (const row of rows) {
                        tableRows.push([
                            row.project,
                            row.name,
                            `v${row.installed}`,
                            `v${row.latest}`,
                            row.status,
                        ]);
                    }
                }
                if (tableRows.length === 0) io.stdout("No registered project items.\n");
                else io.stdout(renderTextTable(
                    ["PROJECT", "ITEM", "INSTALLED", "LATEST", "STATUS"],
                    tableRows,
                ));
            } else {
                const rows = compareProject(catalog, states[0]!);
                if (rows.length === 0) {
                    io.stdout("No installed items.\n");
                    return 0;
                }
                io.stdout(renderTextTable(["ITEM", "INSTALLED", "LATEST", "STATUS"], rows.map((row) => [
                    row.name,
                    `v${row.installed}`,
                    `v${row.latest}`,
                    row.status,
                ])));
            }
            return 0;
        }
        case "update": {
            const catalog = await catalogStore.load();
            const states = await selectedStates(command.allProjects, projectStore, io, true);
            const count = await updateProjectStates(catalog, states, command.name);
            io.stdout(count === 0 ? "All selected items are current.\n" : `Updated ${count} project item${count === 1 ? "" : "s"}.\n`);
            return 0;
        }
        case "rollback": {
            const root = await findProjectRoot();
            const result = await rollbackProjectItem(root, command.name, command.to);
            io.stdout(`Rolled ${basename(root)}/${result.item.name} back from v${result.from} to v${result.item.version}.\n`);
            return 0;
        }
        case "restore": {
            const before = findCatalogItem(await catalogStore.load(), command.name).latest;
            const revision = await restoreCatalogItem(command.name, command.from);
            io.stdout(`Restored ${command.name} from v${command.from} as v${revision.version}. v${before} remains in history.\n`);
            return 0;
        }
        case "remove": {
            const revision = await removeCatalogItem(command.name);
            io.stdout(`Removed ${command.name} in tombstone v${revision.version}. Existing projects were not changed.\n`);
            return 0;
        }
        case "rename": {
            const item = await renameCatalogItem(command.name, command.nextName);
            io.stdout(`Renamed ${command.name} to ${item.name}. Projects continue tracking ${item.id}.\n`);
            return 0;
        }
        case "export": {
            const item = findCatalogItem(await catalogStore.load(), command.name);
            io.stdout(exportCatalogItem(item, command.version, command.history));
            return 0;
        }
        case "import": {
            const result = await importCatalogItem(command.path);
            io.stdout(`Catalog import ${result}. Registered projects were not changed.\n`);
            return 0;
        }
    }
}

export function createItemCaptureHandler(
    projectStore: ProjectStore,
): (request: NocuftInboundRequest) => Promise<Record<string, unknown>> {
    return async (request) => {
        if (request.method !== "item.capture") {
            throw coded("protocol.unknown_method", `Unsupported client request ${request.method}.`);
        }
        const name = requiredString(request.params, "name");
        const snbt = requiredString(request.params, "snbt");
        const action = request.params.action === undefined ? "preview" : requiredString(request.params, "action");
        const metadata = captureMetadata(request.params.metadata);
        const preflight = await preflightRegisteredProjects(await projectStore.load());
        const projects = preflight.states;
        const warning = preflight.warnings.length === 0
            ? undefined
            : `Update all unavailable: ${preflight.warnings.map(({ project, message }) => `${project}: ${message}`).join("; ")}`;
        const preview = await previewCatalogCapture({ name, snbt, projects });
        if (action === "preview") {
            if (preview.unchanged) {
                return { state: "unchanged", name, version: preview.currentVersion };
            }
            if (preview.currentVersion === 0) {
                const created = await captureCatalogItem({ name, snbt, metadata });
                return {
                    state: "created",
                    name,
                    version: created.revision.version,
                    updatedProjects: 0,
                };
            }
            return {
                state: "confirm",
                name,
                currentVersion: preview.currentVersion,
                nextVersion: preview.nextVersion,
                eligibleProjects: preview.eligibleProjects,
                installedProjects: preview.installedProjects,
                updateAllAvailable: warning === undefined,
            };
        }
        if (action !== "update-all" && action !== "catalog-only") {
            throw coded("items.invalid_action", `Unknown capture action ${JSON.stringify(action)}.`);
        }
        if (action === "update-all" && warning !== undefined) {
            throw coded("items.preflight_failed", warning);
        }
        if (request.params.expectedVersion !== preview.currentVersion) {
            throw coded(
                "items.capture_raced",
                `${name} changed while confirmation was open. Capture it again before creating a revision.`,
            );
        }
        if (preview.unchanged) return { state: "unchanged", name, version: preview.currentVersion };
        const result = await captureCatalogItem({
            name,
            snbt,
            projects,
            updateAll: action === "update-all",
            metadata,
        });
        return {
            state: "created",
            name,
            version: result.revision.version,
            updatedProjects: action === "update-all" ? result.eligibleProjects.length : 0,
            outdatedProjects: result.outdatedProjects,
        };
    };
}

async function selectedStates(
    allProjects: boolean,
    store: ProjectStore,
    io: CliIo,
    requireEveryProject: boolean,
): Promise<ProjectItemState[]> {
    if (allProjects) {
        const preflight = await preflightRegisteredProjects(await store.load());
        for (const warning of preflight.warnings) {
            io.stderr(
                `warning[projects.unavailable]: ${warning.project}: ${warning.message}\n`
                + `Remove it with "nocuft local unregister ${warning.project}" if it is no longer needed.\n`,
            );
        }
        if (requireEveryProject && preflight.warnings.length > 0) {
            throw coded(
                "items.preflight_failed",
                "No projects were updated because every registered project must pass preflight.",
            );
        }
        return preflight.states;
    }
    const root = await findProjectRoot();
    return [{ project: basename(root), root, manifest: await createProjectItemStore(root).load() }];
}

function requiredString(value: Record<string, unknown>, key: string): string {
    if (typeof value[key] !== "string" || value[key].length === 0) {
        throw coded("protocol.malformed", `item.capture requires ${key}.`);
    }
    return value[key];
}

function coded(code: string, message: string): Error & { code: string } {
    return Object.assign(new Error(message), { code });
}

function captureMetadata(value: unknown): ItemRevisionMetadata | undefined {
    if (value === undefined) return undefined;
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw coded("protocol.malformed", "item.capture metadata must be an object.");
    }
    const metadata = value as Record<string, unknown>;
    if (typeof metadata.minecraft !== "string" || metadata.minecraft.length === 0
        || !Number.isSafeInteger(metadata.data)) {
        throw coded("protocol.malformed", "item.capture metadata requires Minecraft and data versions.");
    }
    if (metadata.registries !== undefined && typeof metadata.registries !== "string") {
        throw coded("protocol.malformed", "item.capture registry metadata must be text.");
    }
    return {
        minecraft: metadata.minecraft,
        data: metadata.data as number,
        ...(typeof metadata.registries === "string" ? { registries: metadata.registries } : {}),
    };
}
