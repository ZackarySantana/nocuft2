import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
if (!args.includes("--help") && !args.includes("-h")) {
    run("node", [new URL("./build-mod.mjs", import.meta.url).pathname]);
}
run("node", [new URL("./install-mod.mjs", import.meta.url).pathname, ...args]);

function run(executable, commandArgs) {
    const result = spawnSync(executable, commandArgs, {
        stdio: "inherit",
        shell: false,
    });
    if (result.error !== undefined) {
        throw result.error;
    }
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}
