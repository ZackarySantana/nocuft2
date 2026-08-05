import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const clientRoot = fileURLToPath(new URL("..", import.meta.url));
const repositoryRoot = path.resolve(clientRoot, "..");
const coreJar = path.join(clientRoot, "dist", "nocuft-client-core.jar");

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
    stdio: "inherit",
  });
  if (result.error !== undefined) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}.`);
  }
}

try {
  await access(coreJar);
} catch {
  throw new Error(`${coreJar} is missing. Run npm run build before the client tests.`);
}

const testSources = await javaSources(
  path.join(clientRoot, "core", "src", "test", "java"),
);
if (testSources.length === 0) {
  throw new Error("Client core test sources are required.");
}

const workDir = await mkdtemp(path.join(tmpdir(), "nocuft-client-test-"));
try {
  const testClasses = path.join(workDir, "test-classes");
  run("javac", [
    "--release",
    "21",
    "-proc:none",
    "-Xlint:all",
    "-Werror",
    "-encoding",
    "UTF-8",
    "-cp",
    coreJar,
    "-d",
    testClasses,
    ...testSources,
  ]);
  run("java", [
    "-cp",
    [testClasses, coreJar].join(path.delimiter),
    "dev.nocuft.client.CoreTest",
    repositoryRoot,
  ]);
} finally {
  await rm(workDir, { recursive: true, force: true });
}
