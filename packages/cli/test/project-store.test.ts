import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { createProjectStore, ProjectStoreError } from "../project-store.js";

const temporary: string[] = [];
const ids = [
    "4c026963-a287-4e18-a86c-747d86e3a917",
    "7b310fbc-8053-4128-b6f6-c0fb8cd15a73",
];

afterEach(async () => {
    await Promise.all(temporary.splice(0).map((path) =>
        rm(path, { recursive: true, force: true })));
});

test("persists only local identity and resolves current manifest values", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-projects-"));
    temporary.push(directory);
    const roots = [join(directory, "zeta"), join(directory, "alpha")];
    await Promise.all(roots.map((root) => mkdir(root)));
    for (const [index, root] of roots.entries()) {
        await writeManifest(root, ids[index]!, index === 0 ? "zeta" : "alpha", "plot.ts", `app.${index}`);
        await writeFile(join(root, "plot.ts"), "export {};\n");
    }
    const path = join(directory, "config", "projects.json");
    const store = createProjectStore(path);
    await store.save(roots.map((root, index) => ({
        id: ids[index],
        name: index === 0 ? "zeta" : "alpha",
        entryPath: join(root, "plot.ts"),
        module: `app.${index}`,
        root,
        manifestPath: join(root, "nocuft.json"),
        available: true,
    })));

    const parsed = JSON.parse(await readFile(path, "utf8")) as {
        version: number;
        projects: Record<string, Record<string, unknown>>;
    };
    assert.equal(parsed.version, 1);
    assert.equal(parsed.projects.alpha?.entry, undefined);
    assert.equal(parsed.projects.alpha?.module, undefined);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
    assert.equal((await stat(join(directory, "config"))).mode & 0o777, 0o700);

    await writeManifest(roots[1]!, ids[1]!, "renamed", "next.ts", "games.renamed");
    const loaded = await store.load();
    assert.deepEqual(loaded.map(({ name }) => name), ["renamed", "zeta"]);
    assert.equal(loaded[0]?.entryPath, join(roots[1]!, "next.ts"));
    assert.equal(loaded[0]?.module, "games.renamed");
});

test("fails closed on a malformed schema", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-projects-"));
    temporary.push(directory);
    const path = join(directory, "projects.json");
    await writeFile(path, '{"version":1,"projects":{}}\n');
    await assert.rejects(
        createProjectStore(path).load(),
        (error) => error instanceof ProjectStoreError
            && error.code === "projects.invalid_config"
            && error.message.endsWith(`Configuration file: ${path}`),
    );
});

async function writeManifest(
    root: string,
    id: string,
    name: string,
    entry: string,
    module: string,
): Promise<void> {
    await writeFile(join(root, "nocuft.json"), `${JSON.stringify({
        format: "nocuft-project",
        version: 1,
        id,
        name,
        language: "typescript",
        entry,
        module,
    })}\n`);
}
