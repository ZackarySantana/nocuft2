import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const generatedPaths = [
    "packages/sdk/events.ts",
    "packages/sdk/generated",
    "packages/compiler/generated",
    "packages/frontends/typescript/generated",
];

const before = await snapshot(generatedPaths);
const result = spawnSync("npm", ["run", "generate"], {
    cwd: repositoryRoot,
    stdio: "inherit",
    shell: false,
});
if (result.error !== undefined) {
    throw result.error;
}
if (result.status !== 0) {
    process.exit(result.status ?? 1);
}

const after = await snapshot(generatedPaths);
const changed = new Set([...before.keys(), ...after.keys()]);
for (const path of changed) {
    if (before.get(path) === after.get(path)) {
        changed.delete(path);
    }
}

if (changed.size > 0) {
    console.error("Generated source was stale:");
    for (const path of [...changed].sort()) {
        console.error(`  ${path}`);
    }
    console.error("Review and commit the regenerated files, then run npm run check again.");
    process.exit(1);
}

async function snapshot(paths) {
    const files = new Map();
    for (const path of paths) {
        await collect(path, files);
    }
    return files;
}

async function collect(path, files) {
    const absolutePath = new URL(path, new URL("file://" + repositoryRoot + "/"));
    const metadata = await stat(absolutePath);
    if (metadata.isDirectory()) {
        for (const entry of await readdir(absolutePath)) {
            await collect(`${path}/${entry}`, files);
        }
        return;
    }
    const digest = createHash("sha256").update(await readFile(absolutePath)).digest("hex");
    files.set(path, digest);
}
