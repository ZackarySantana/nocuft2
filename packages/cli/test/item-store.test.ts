import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { replaceFilesAtomically } from "../file-transaction.js";
import { captureCatalogItem, compareProject, preflightRegisteredProjects, updateProjectStates } from "../item-manager.js";
import {
    createItemCatalogStore,
    createProjectItemStore,
    itemDigest,
    latestRevision,
    type ProjectItems,
} from "../item-store.js";

test("captures immutable revisions and detects canonical-equivalent payloads", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-items-"));
    const path = join(directory, "catalog.json");
    try {
        const first = await captureCatalogItem({ name: "sword-of-doom", snbt: "{id: 'sword', count: 1}", catalogPath: path });
        const unchanged = await captureCatalogItem({ name: "sword-of-doom", snbt: " { id:'sword',count:1 } ", catalogPath: path });
        const second = await captureCatalogItem({ name: "sword-of-doom", snbt: "{id:'sword',count:2}", catalogPath: path });
        assert.equal(first.revision.version, 1);
        assert.equal(unchanged.unchanged, true);
        assert.equal(second.revision.version, 2);
        const item = (await createItemCatalogStore(path).load()).items[0]!;
        assert.equal(item.id, first.item.id);
        assert.deepEqual(item.revisions.map(({ version }) => version), [1, 2]);
        assert.equal(itemDigest(item.revisions[0]!.snbt!), item.revisions[0]!.digest);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("updates every outdated project payload and generated facade", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-project-items-"));
    const catalogPath = join(directory, "catalog.json");
    const one = join(directory, "one");
    const two = join(directory, "two");
    try {
        const captured = await captureCatalogItem({ name: "token", snbt: "{count:1}", catalogPath });
        const v1 = latestRevision(captured.item);
        const installed = {
            catalogId: captured.item.id,
            name: captured.item.name,
            version: 1,
            digest: v1.digest!,
            snbt: v1.snbt!,
        };
        await createProjectItemStore(one).save({ items: [installed] });
        await createProjectItemStore(two).save({ items: [installed] });
        const next = await captureCatalogItem({ name: "token", snbt: "{count:2}", catalogPath });
        const catalog = await createItemCatalogStore(catalogPath).load();
        const states = [
            { project: "one", root: one, manifest: await createProjectItemStore(one).load() },
            { project: "two", root: two, manifest: await createProjectItemStore(two).load() },
        ];
        assert.deepEqual(compareProject(catalog, states[0]!).map(({ status }) => status), ["outdated"]);
        assert.deepEqual(compareProject(catalog, states[1]!).map(({ status }) => status), ["outdated"]);
        assert.equal(await updateProjectStates(catalog, states), 2);
        assert.equal((await createProjectItemStore(one).load()).items[0]!.version, next.revision.version);
        assert.equal((await createProjectItemStore(two).load()).items[0]!.version, next.revision.version);
        const facade = await readFile(join(one, "nocuft", "items.ts"), "utf8");
        assert.match(facade, /import \{ itemSnapshot \} from "nocuft"/u);
        assert.match(facade, /"token": itemSnapshot\("\{count:2\}"\)/u);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("restores every replacement when a transaction cannot finish", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-transaction-"));
    const original = join(directory, "original.txt");
    const impossible = join(directory, "blocked", "child.txt");
    try {
        await replaceFilesAtomically([{ path: original, content: "before" }]);
        await replaceFilesAtomically([{ path: join(directory, "blocked"), content: "not a directory" }]);
        await assert.rejects(replaceFilesAtomically([
            { path: original, content: "after" },
            { path: impossible, content: "never" },
        ]));
        assert.equal(await readFile(original, "utf8"), "before");
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("keeps valid projects available when another registration is stale", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-project-preflight-"));
    const valid = join(directory, "valid");
    try {
        await mkdir(valid);
        await writeFile(join(valid, "nocuft.json"), JSON.stringify({
            format: "nocuft-project",
            version: 1,
            id: "4c026963-a287-4e18-a86c-747d86e3a917",
            name: "valid",
            language: "typescript",
            entry: "plot.ts",
            module: "app.valid",
        }));
        const result = await preflightRegisteredProjects([
            {
                id: "4c026963-a287-4e18-a86c-747d86e3a917",
                name: "valid",
                entryPath: join(valid, "plot.ts"),
                module: "app.valid",
                root: valid,
                manifestPath: join(valid, "nocuft.json"),
            },
            {
                id: "7b310fbc-8053-4128-b6f6-c0fb8cd15a73",
                name: "stale",
                entryPath: join(directory, "missing", "plot.ts"),
                module: "app.stale",
                root: join(directory, "missing"),
                manifestPath: join(directory, "missing", "nocuft.json"),
            },
        ]);
        assert.deepEqual(result.states.map(({ project }) => project), ["valid"]);
        assert.equal(result.warnings.length, 1);
        assert.equal(result.warnings[0]!.project, "stale");
        assert.match(result.warnings[0]!.message, /Could not find nocuft\.json/u);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("drops legacy hold metadata from project manifests", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-legacy-hold-"));
    const snbt = "{count:1}";
    try {
        await writeFile(join(directory, "nocuft.items.json"), JSON.stringify({
            format: "nocuft-items",
            version: 1,
            items: [{
                catalogId: "4c026963-a287-4e18-a86c-747d86e3a917",
                name: "token",
                version: 1,
                digest: itemDigest(snbt),
                snbt,
                held: true,
            }],
        }));
        const store = createProjectItemStore(directory);
        const project = await store.load();
        assert.equal("held" in project.items[0]!, false);
        await store.save(project);
        assert.doesNotMatch(await readFile(join(directory, "nocuft.items.json"), "utf8"), /"held"/u);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});
