import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { readProjectIdentity, ProjectIdentityError } from "../project-identity.js";

const temporary: string[] = [];

afterEach(async () => {
    await Promise.all(temporary.splice(0).map((path) =>
        rm(path, { recursive: true, force: true })));
});

test("creates and reuses a versioned project identity above src", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-identity-"));
    temporary.push(root);
    const source = join(root, "src");
    await import("node:fs/promises").then(({ mkdir }) => mkdir(source));
    const entry = join(source, "plot.ts");
    await writeFile(entry, "export {};\n");

    const created = await readProjectIdentity(entry);
    assert.equal(created.path, join(root, "nocuft.json"));
    assert.equal(created.created, true);
    const value = JSON.parse(await readFile(created.path, "utf8")) as Record<string, unknown>;
    assert.equal(value.format, "nocuft-project");
    assert.equal(value.version, 1);

    const reused = await readProjectIdentity(entry);
    assert.equal(reused.id, created.id);
    assert.equal(reused.created, false);
});

test("refuses an incompatible identity rather than replacing it", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-identity-"));
    temporary.push(root);
    const entry = join(root, "plot.ts");
    await writeFile(entry, "export {};\n");
    await writeFile(join(root, "nocuft.json"), '{"id":"old-contract"}\n');
    await assert.rejects(
        readProjectIdentity(entry),
        (error) => error instanceof ProjectIdentityError
            && error.code === "project.identity_invalid",
    );
});
