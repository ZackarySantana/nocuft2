import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Initialize every runnable example with `nocuft init`.
 *
 * The shared `examples` module prefix lets the in-game screen group these
 * projects under one namespace. Re-running replaces conflicting definitions
 * by default. Pass `--no-force` to preserve an existing definition.
 */

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const argumentsSet = new Set(process.argv.slice(2));
const supportedArguments = new Set([
    "--dry-run",
    "--force",
    "--help",
    "--no-force",
]);

for (const argument of argumentsSet) {
    if (!supportedArguments.has(argument)) {
        console.error(`Unknown option: ${argument}`);
        process.exit(2);
    }
}

if (argumentsSet.has("--help")) {
    console.log(`Usage: npm run init:examples -- [options]

Options:
  --force       Replace conflicting definitions (default)
  --no-force    Fail rather than replace a conflicting definition
  --dry-run     Print init commands without changing project files
  --help        Show this help`);
    process.exit(0);
}

const dryRun = argumentsSet.has("--dry-run");
const force = argumentsSet.has("--force") || !argumentsSet.has("--no-force");
const examples = [
    { name: "hello", entry: "examples/hello/plot.ts" },
    { name: "arena", entry: "examples/arena/plot.ts" },
];
const executable = join(
    repositoryRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "nocuft.cmd" : "nocuft",
);

if (!dryRun && !existsSync(executable)) {
    console.error("nocuft is not installed in this workspace. Run npm install first.");
    process.exit(1);
}

let failed = 0;
let initialized = 0;

for (const example of examples) {
    const entry = join(repositoryRoot, example.entry);
    if (!existsSync(entry)) {
        console.error(`Missing entry: ${entry}`);
        failed += 1;
        continue;
    }

    const args = [
        "init",
        example.name,
        entry,
        "--module",
        `examples.${example.name}`,
    ];
    if (force) {
        args.push("--force");
    }

    if (dryRun) {
        console.log([executable, ...args].map(quoteArgument).join(" "));
        initialized += 1;
        continue;
    }

    const result = spawnSync(executable, args, {
        cwd: repositoryRoot,
        encoding: "utf8",
    });
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    if (result.error !== undefined || result.status !== 0) {
        console.error(
            `Failed ${example.name}: ${output || result.error?.message}`,
        );
        failed += 1;
        continue;
    }
    console.log(output || `Initialized ${example.name}`);
    initialized += 1;
}

console.log(
    `${dryRun ? "Prepared" : "Initialized"} ${initialized} example project${initialized === 1 ? "" : "s"}.`,
);
if (failed > 0) {
    process.exitCode = 1;
}

function quoteArgument(value) {
    return JSON.stringify(value);
}
