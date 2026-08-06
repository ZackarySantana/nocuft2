import { chmod, copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const packageRoot = new URL("../", import.meta.url);
const outputDirectory = new URL("../dist/bin/", import.meta.url);
const output = new URL("nocuft.js", outputDirectory);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(new URL("web/", outputDirectory), { recursive: true });
await build({
    entryPoints: [fileURLToPath(new URL("../cli/main.ts", packageRoot))],
    outfile: fileURLToPath(output),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    external: ["typescript"],
});
await Promise.all(["index.html", "app.js", "styles.css"].map((name) =>
    copyFile(
        new URL(`../cli/web/${name}`, packageRoot),
        new URL(`web/${name}`, outputDirectory),
    )));
await chmod(output, 0o755);
