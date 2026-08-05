import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { createProjectStore, ProjectStoreError } from "../project-store.js";

const temporary: string[] = [];

afterEach(async () => {
    await Promise.all(temporary.splice(0).map((path) =>
        rm(path, { recursive: true, force: true })));
});

test("round trips sorted projects through a private file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-projects-"));
    temporary.push(directory);
    const path = join(directory, "config", "projects.json");
    const store = createProjectStore(path);
    await store.save([
        { name: "zeta", entryPath: "/work/zeta.ts", module: "app.zeta" },
        { name: "alpha", entryPath: "/work/alpha.ts", module: "app.alpha" },
    ]);

    assert.deepEqual((await store.load()).map(({ name }) => name), ["alpha", "zeta"]);
    const parsed = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
    assert.equal(parsed.format, "nocuft-projects");
    assert.equal(parsed.version, 1);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
    assert.equal((await stat(join(directory, "config"))).mode & 0o777, 0o700);
});

test("fails closed on an old or malformed schema", async () => {
    const directory = await mkdtemp(join(tmpdir(), "nocuft-projects-"));
    temporary.push(directory);
    const path = join(directory, "projects.json");
    await import("node:fs/promises").then(({ writeFile }) =>
        writeFile(path, '{"version":1,"projects":{}}\n'));
    await assert.rejects(
        createProjectStore(path).load(),
        (error) => error instanceof ProjectStoreError
            && error.code === "projects.invalid_config",
    );
});
