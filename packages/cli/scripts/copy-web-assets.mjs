import { copyFile, mkdir } from "node:fs/promises";

const source = new URL("../web/", import.meta.url);
const destination = new URL("../dist/web/", import.meta.url);

await mkdir(destination, { recursive: true });
await Promise.all(["index.html", "app.js", "styles.css"].map((name) =>
    copyFile(new URL(name, source), new URL(name, destination))));
