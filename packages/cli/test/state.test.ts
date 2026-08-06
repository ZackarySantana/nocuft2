import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import {
    findProjectManifest,
    ProjectIdentityError,
    readProjectIdentity,
    readProjectManifest,
    relativeProjectEntry,
} from "../project-identity.js";

const temporary: string[] = [];
const id = "4c026963-a287-4e18-a86c-747d86e3a917";

afterEach(async () => {
    await Promise.all(temporary.splice(0).map((path) =>
        rm(path, { recursive: true, force: true })));
});

test("finds and reads a portable project definition above src", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-identity-"));
    temporary.push(root);
    const source = join(root, "src");
    await mkdir(source);
    const entry = join(source, "plot.ts");
    await writeFile(entry, "export {};\n");
    const path = join(root, "nocuft.json");
    await writeFile(path, `${JSON.stringify({
        format: "nocuft-project",
        version: 1,
        id,
        name: "arena",
        language: "typescript",
        entry: "src/plot.ts",
        module: "app.arena",
    })}\n`);

    assert.equal(await findProjectManifest(entry), path);
    assert.equal((await readProjectManifest(path)).version, 1);
    assert.deepEqual(await readProjectIdentity(entry), { id, path, created: false });
    assert.equal(relativeProjectEntry(root, entry), "src/plot.ts");
});

test("refuses invalid and absolute manifest entries", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-identity-"));
    temporary.push(root);
    const path = join(root, "nocuft.json");
    await writeFile(path, `${JSON.stringify({
        format: "nocuft-project",
        version: 1,
        id,
        name: "arena",
        language: "typescript",
        entry: "/tmp/plot.ts",
        module: "app.arena",
    })}\n`);
    await assert.rejects(
        readProjectManifest(path),
        (error) => error instanceof ProjectIdentityError
            && error.code === "project.manifest_invalid",
    );
});
