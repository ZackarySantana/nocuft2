import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Builds the Fabric mod.
 *
 * This is deliberately not part of `npm run build`. Gradle downloads
 * Minecraft, its mappings, and the Fabric API the first time it runs, so the
 * contributor check stays fast and offline while the mod is built on request.
 */
const clientRoot = fileURLToPath(new URL("..", import.meta.url));
const modRoot = path.join(clientRoot, "mod");
const wrapper = process.platform === "win32" ? "gradlew.bat" : "./gradlew";

const result = spawnSync(wrapper, ["build", ...process.argv.slice(2)], {
  cwd: modRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (result.error !== undefined) {
  throw result.error;
}
if (result.status !== 0) {
  throw new Error(`${wrapper} exited with status ${result.status}.`);
}
