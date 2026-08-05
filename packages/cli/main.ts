#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { emitTemplates, lowerHighModule } from "@nocuft/compiler";
import { analyzeTypeScript } from "@nocuft/frontend-typescript";

function usage(): never {
    console.error("Usage: nocuft compile <entry.ts> [--tsconfig <path>]");
    process.exit(1);
}

const [command, ...rest] = process.argv.slice(2);
if (command !== "compile") {
    usage();
}

let entry: string | undefined;
let tsconfig: string | undefined;

for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument === "--tsconfig") {
        tsconfig = rest[index + 1];
        if (!tsconfig) {
            usage();
        }
        index += 1;
        continue;
    }
    if (argument.startsWith("-") || entry !== undefined) {
        usage();
    }
    entry = argument;
}

if (!entry) {
    usage();
}

const entryFile = resolve(entry);
const tsconfigPath = tsconfig
    ? resolve(tsconfig)
    : findTsconfig(dirname(entryFile));

const high = analyzeTypeScript({ tsconfigPath, entryFile });
const low = lowerHighModule(high);

for (const template of emitTemplates(low)) {
    console.log(template.json);
}

function findTsconfig(start: string): string {
    let directory = start;
    while (true) {
        const candidate = join(directory, "tsconfig.json");
        if (existsSync(candidate)) {
            return candidate;
        }
        const parent = dirname(directory);
        if (parent === directory) {
            throw new Error(`Could not find tsconfig.json above ${start}`);
        }
        directory = parent;
    }
}
