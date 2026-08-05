import { spawnSync } from "node:child_process";
import { readdir, rm, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const clientRoot = fileURLToPath(new URL("..", import.meta.url));
const distRoot = path.join(clientRoot, "dist");
const coreClasses = path.join(distRoot, "java-classes", "core");
const coreJar = path.join(distRoot, "nocuft-client-core.jar");

async function javaSources(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name))) {
    const item = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await javaSources(item));
    } else if (entry.isFile() && entry.name.endsWith(".java")) {
      files.push(item);
    }
  }
  return files;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: clientRoot,
    encoding: "utf8",
  });
  if (result.error !== undefined) {
    throw result.error;
  }
  if (result.status !== 0) {
    if (result.stdout.length > 0) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr.length > 0) {
      process.stderr.write(result.stderr);
    }
    throw new Error(`${command} exited with status ${result.status}.`);
  }
}

const coreSources = await javaSources(
  path.join(clientRoot, "core", "src", "main", "java"),
);
if (coreSources.length === 0) {
  throw new Error("Client core sources are required.");
}

await rm(path.join(distRoot, "java-classes"), { recursive: true, force: true });
await rm(coreJar, { force: true });
await mkdir(coreClasses, { recursive: true });

run("javac", [
  "--release",
  "21",
  "-proc:none",
  "-Xlint:all",
  "-Werror",
  "-encoding",
  "UTF-8",
  "-d",
  coreClasses,
  ...coreSources,
]);

run("jar", ["--create", "--file", coreJar, "-C", coreClasses, "."]);
