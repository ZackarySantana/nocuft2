import { stat } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { buildProject, findTsconfig, type ProjectBuildResult } from "./build-project.js";
import { runGui, type GuiDependencies } from "./gui-command.js";
import { runWeb, type WebDependencies } from "./web-command.js";
import { runPackageCommand, type PackageCommand } from "./package-command.js";
import { findProjectRoot } from "./project-root.js";
import { readProjectIdentity, type ProjectIdentity } from "./project-identity.js";
import {
    defaultProjectStore,
    ProjectStoreError,
    type ProjectStore,
    type RegisteredProject,
    validModuleId,
    validProjectName,
} from "./project-store.js";

const GLOBAL_USAGE = `Usage:
  nocuft local <command> [options]
  nocuft gui [options]
  nocuft web [options]
  nocuft package <command>

Commands:
  local                     Manage projects saved on this machine
  gui                       Feed the in-game screen with registered projects
  web                       View live compiled code in a local website
  package                   Manage fully vendored reusable functions

Run "nocuft <command> --help" for command details.
`;

const PACKAGE_USAGE = `Usage:
  nocuft package install <name> <url-or-path>
  nocuft package uninstall <name>...
  nocuft package list
  nocuft package show <name>
  nocuft package verify
  nocuft package outdated
  nocuft package update [name...]

Package commands discover the nearest nocuft.json above the current directory.
Builds use committed artifacts and never fetch package sources.
`;

const LOCAL_USAGE = `Usage:
  nocuft local register <name> <entry.ts> [options]
  nocuft local list
  nocuft local show <name>
  nocuft local unregister <name>...

Commands:
  register                  Save a named TypeScript project
  list                      List saved projects
  show                      Show one saved project
  unregister                Forget projects without deleting their source
`;

const REGISTER_USAGE = `Usage:
  nocuft local register <name> <entry.ts> [options]

Options:
  -m, --module <id>          Module namespace (default: app.<name>)
  -f, --force                Replace an existing registration
  -h, --help                 Show this help
`;

const GUI_USAGE = `Usage:
  nocuft gui [options]

Options:
      --open                 Raise the screen in Minecraft after sending builds
      --debounce <ms>        Rebuild delay in milliseconds (default: 350)
  -h, --help                 Show this help

Sends every registered project and keeps it current until stopped.
It never applies changes to a plot. Applying remains an in-game decision.
`;

const WEB_USAGE = `Usage:
  nocuft web [options]

Options:
      --port <number>        Local HTTP port (default: 31381)
      --debounce <ms>        Rebuild delay in milliseconds (default: 350)
  -h, --help                 Show this help

Serves every registered project's compiled DiamondFire code and keeps it
current until stopped. Minecraft is not required or contacted.
`;

export interface CliIo {
    stdout(text: string): void;
    stderr(text: string): void;
}

export interface CliDependencies {
    projectStore: ProjectStore;
    isFile(path: string): Promise<boolean>;
    findTsconfig(start: string): Promise<string>;
    identify(entryPath: string): Promise<ProjectIdentity>;
    build(entryPath: string): Promise<ProjectBuildResult>;
    gui?: GuiDependencies;
    web?: WebDependencies;
}

const processIo: CliIo = {
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
};

const defaultDependencies: CliDependencies = {
    projectStore: defaultProjectStore,
    isFile: async (path) => {
        try {
            return (await stat(path)).isFile();
        } catch {
            return false;
        }
    },
    findTsconfig,
    identify: readProjectIdentity,
    build: (entryPath) => buildProject({ entryPath }),
};

type Command =
    | { kind: "register"; name: string; entryPath: string; module: string; force: boolean }
    | { kind: "list" }
    | { kind: "show"; name: string }
    | { kind: "unregister"; names: string[] }
    | { kind: "gui"; open: boolean; debounceMs: number }
    | { kind: "web"; port: number; debounceMs: number }
    | { kind: "package"; package: PackageCommand };

type ParseResult =
    | { ok: true; command: Command }
    | { ok: false; help: boolean; usage: string; message?: string };

export async function runCli(
    args: readonly string[],
    io: CliIo = processIo,
    dependencies: CliDependencies = defaultDependencies,
): Promise<number> {
    const parsed = parseCommand(args);
    if (!parsed.ok) {
        if (parsed.message !== undefined) {
            io.stderr(`${parsed.message}\n\n`);
        }
        (parsed.help ? io.stdout : io.stderr)(parsed.usage);
        return parsed.help ? 0 : 2;
    }

    const command = parsed.command;
    try {
        switch (command.kind) {
            case "register":
                return await register(command, io, dependencies);
            case "list":
                return await list(io, dependencies.projectStore);
            case "show":
                return await show(command.name, io, dependencies.projectStore);
            case "unregister":
                return await unregister(command.names, io, dependencies.projectStore);
            case "package":
                return await runPackageCommand(command.package, await findProjectRoot(), io);
            case "gui": {
                const projects = await dependencies.projectStore.load();
                return await runGui(
                    projects.map((project) => ({
                        name: project.name,
                        entryPath: project.entryPath,
                        module: project.module,
                        identify: () => dependencies.identify(project.entryPath),
                        build: () => dependencies.build(project.entryPath),
                    })),
                    { open: command.open, debounceMs: command.debounceMs },
                    io,
                    dependencies.gui,
                );
            }
            case "web": {
                const projects = await dependencies.projectStore.load();
                return await runWeb(
                    projects.map((project) => ({
                        name: project.name,
                        entryPath: project.entryPath,
                        module: project.module,
                        build: () => dependencies.build(project.entryPath),
                    })),
                    { port: command.port, debounceMs: command.debounceMs },
                    io,
                    dependencies.web,
                );
            }
        }
    } catch (error: unknown) {
        io.stderr(`error[${codeOf(error)}]: ${messageOf(error)}\n`);
        return 1;
    }
}

async function register(
    command: Extract<Command, { kind: "register" }>,
    io: CliIo,
    dependencies: CliDependencies,
): Promise<number> {
    if (!await dependencies.isFile(command.entryPath)) {
        throw new CliError(
            "projects.entry_not_found",
            `Entry file does not exist: ${command.entryPath}`,
        );
    }
    try {
        await dependencies.findTsconfig(dirname(command.entryPath));
    } catch (error: unknown) {
        throw new CliError(
            "typescript.tsconfig_not_found",
            messageOf(error),
        );
    }
    const projects = await dependencies.projectStore.load();
    const existing = projects.find(({ name }) => name === command.name);
    if (existing !== undefined && !command.force) {
        throw new CliError(
            "projects.already_exists",
            `Project ${JSON.stringify(command.name)} is already registered. Use --force to replace it.`,
        );
    }
    const project: RegisteredProject = {
        name: command.name,
        entryPath: command.entryPath,
        module: command.module,
    };
    const identity = await dependencies.identify(command.entryPath);
    await dependencies.projectStore.save([
        ...projects.filter(({ name }) => name !== command.name),
        project,
    ]);
    io.stdout(
        `${existing === undefined ? "Registered" : "Updated"} project ${command.name}`
        + ` at ${command.entryPath} with module ${command.module}.\n`,
    );
    if (identity.created) {
        io.stdout(`Created project identity ${identity.id}.\nCommit ${identity.path}.\n`);
    } else {
        io.stdout(`Project identity: ${identity.id}.\n`);
    }
    return 0;
}

async function list(io: CliIo, store: ProjectStore): Promise<number> {
    const projects = await store.load();
    if (projects.length === 0) {
        io.stdout("No registered projects.\n");
        return 0;
    }
    const width = Math.max(4, ...projects.map(({ name }) => name.length));
    io.stdout(`${"NAME".padEnd(width)}  MODULE  ENTRY\n`);
    for (const project of projects) {
        io.stdout(`${project.name.padEnd(width)}  ${project.module}  ${project.entryPath}\n`);
    }
    return 0;
}

async function show(name: string, io: CliIo, store: ProjectStore): Promise<number> {
    const project = (await store.load()).find((entry) => entry.name === name);
    if (project === undefined) {
        throw new CliError("projects.not_found", `Project ${JSON.stringify(name)} is not registered.`);
    }
    io.stdout(`Name:   ${project.name}\nEntry:  ${project.entryPath}\nModule: ${project.module}\n`);
    return 0;
}

async function unregister(
    names: readonly string[],
    io: CliIo,
    store: ProjectStore,
): Promise<number> {
    const projects = await store.load();
    const registered = new Set(projects.map(({ name }) => name));
    const missing = names.filter((name) => !registered.has(name));
    if (missing.length > 0) {
        throw new CliError(
            "projects.not_found",
            `Projects are not registered: ${missing.join(", ")}.`,
        );
    }
    const removed = new Set(names);
    await store.save(projects.filter(({ name }) => !removed.has(name)));
    io.stdout(`Unregistered ${names.length === 1 ? "project" : "projects"}: ${names.join(", ")}.\n`);
    return 0;
}

function parseCommand(args: readonly string[]): ParseResult {
    const noun = args[0];
    if (noun === undefined || noun === "--help" || noun === "-h") {
        return { ok: false, help: true, usage: GLOBAL_USAGE };
    }
    if (noun === "local") {
        return parseLocal(args.slice(1));
    }
    if (noun === "gui") {
        return parseGui(args.slice(1));
    }
    if (noun === "web") {
        return parseWeb(args.slice(1));
    }
    if (noun === "package") {
        return parsePackage(args.slice(1));
    }
    return failure(`Unknown command: ${noun}`, GLOBAL_USAGE);
}

function parsePackage(args: readonly string[]): ParseResult {
    const [verb, ...positionals] = args;
    if (!verb || verb === "--help" || verb === "-h") {
        return { ok: false, help: true, usage: PACKAGE_USAGE };
    }
    const unique = new Set(positionals).size === positionals.length;
    if (verb === "install" && positionals.length === 2) {
        return { ok: true, command: { kind: "package", package: { verb, alias: positionals[0], source: positionals[1] } } };
    }
    if (verb === "uninstall" && positionals.length > 0 && unique) {
        return { ok: true, command: { kind: "package", package: { verb, aliases: [...positionals] } } };
    }
    if (verb === "show" && positionals.length === 1) {
        return { ok: true, command: { kind: "package", package: { verb, alias: positionals[0] } } };
    }
    if (["list", "verify", "outdated"].includes(verb) && positionals.length === 0) {
        return { ok: true, command: { kind: "package", package: { verb: verb as "list" | "verify" | "outdated" } } };
    }
    if (verb === "update" && unique) {
        return { ok: true, command: { kind: "package", package: { verb, aliases: [...positionals] } } };
    }
    return failure(`Invalid package ${verb} arguments.`, PACKAGE_USAGE);
}

function parseLocal(args: readonly string[]): ParseResult {
    const verb = args[0];
    if (verb === undefined || verb === "--help" || verb === "-h") {
        return { ok: false, help: true, usage: LOCAL_USAGE };
    }
    if (verb === "register") {
        return parseRegister(args.slice(1));
    }
    if (verb === "list") {
        return argumentless(args, { kind: "list" }, "local list");
    }
    if (verb === "show") {
        if (args.length === 2 && (args[1] === "--help" || args[1] === "-h")) {
            return { ok: false, help: true, usage: LOCAL_USAGE };
        }
        if (args.length === 2 && args[1] !== undefined) {
            return { ok: true, command: { kind: "show", name: args[1] } };
        }
        return failure("The local show command requires exactly one project name.", LOCAL_USAGE);
    }
    if (verb === "unregister") {
        if (args.length === 2 && (args[1] === "--help" || args[1] === "-h")) {
            return { ok: false, help: true, usage: LOCAL_USAGE };
        }
        const names = args.slice(1);
        if (names.length === 0) {
            return failure("The local unregister command requires at least one project name.", LOCAL_USAGE);
        }
        if (new Set(names).size !== names.length) {
            return failure("Project names must not be repeated.", LOCAL_USAGE);
        }
        return { ok: true, command: { kind: "unregister", names } };
    }
    return failure(`Unknown local command: ${verb}`, LOCAL_USAGE);
}

function parseRegister(args: readonly string[]): ParseResult {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: [...args],
            allowPositionals: true,
            strict: true,
            options: {
                module: { type: "string", short: "m" },
                force: { type: "boolean", short: "f", default: false },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (error: unknown) {
        return failure(messageOf(error), REGISTER_USAGE);
    }
    if (parsed.values.help === true) {
        return { ok: false, help: true, usage: REGISTER_USAGE };
    }
    const [name, entry, ...extra] = parsed.positionals;
    if (name === undefined || entry === undefined || extra.length > 0) {
        return failure("The local register command requires one name and one entry file.", REGISTER_USAGE);
    }
    if (!validProjectName(name)) {
        return failure("Project names must be lowercase identifiers up to 64 characters.", REGISTER_USAGE);
    }
    if (extname(entry).toLowerCase() !== ".ts") {
        return failure("The entry file must end in .ts. Go and Java are not supported yet.", REGISTER_USAGE);
    }
    const module = typeof parsed.values.module === "string"
        ? parsed.values.module
        : `app.${name}`;
    if (!validModuleId(module)) {
        return failure("The module must be a lowercase canonical identifier up to 255 characters.", REGISTER_USAGE);
    }
    return {
        ok: true,
        command: {
            kind: "register",
            name,
            entryPath: resolve(entry),
            module,
            force: parsed.values.force === true,
        },
    };
}

function parseGui(args: readonly string[]): ParseResult {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: [...args],
            allowPositionals: true,
            strict: true,
            options: {
                open: { type: "boolean", default: false },
                debounce: { type: "string", default: "350" },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (error: unknown) {
        return failure(messageOf(error), GUI_USAGE);
    }
    if (parsed.values.help === true) {
        return { ok: false, help: true, usage: GUI_USAGE };
    }
    if (parsed.positionals.length > 0) {
        return failure("The gui command sends every registered project and takes no targets.", GUI_USAGE);
    }
    const debounceMs = Number(parsed.values.debounce);
    if (!Number.isSafeInteger(debounceMs) || debounceMs < 0 || debounceMs > 60_000) {
        return failure("--debounce must be an integer from 0 through 60000.", GUI_USAGE);
    }
    return {
        ok: true,
        command: {
            kind: "gui",
            open: parsed.values.open === true,
            debounceMs,
        },
    };
}

function parseWeb(args: readonly string[]): ParseResult {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: [...args],
            allowPositionals: true,
            strict: true,
            options: {
                port: { type: "string", default: "31381" },
                debounce: { type: "string", default: "350" },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (error: unknown) {
        return failure(messageOf(error), WEB_USAGE);
    }
    if (parsed.values.help === true) {
        return { ok: false, help: true, usage: WEB_USAGE };
    }
    if (parsed.positionals.length > 0) {
        return failure("The web command serves every registered project and takes no targets.", WEB_USAGE);
    }
    const port = Number(parsed.values.port);
    if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
        return failure("--port must be an integer from 1 through 65535.", WEB_USAGE);
    }
    const debounceMs = Number(parsed.values.debounce);
    if (!Number.isSafeInteger(debounceMs) || debounceMs < 0 || debounceMs > 60_000) {
        return failure("--debounce must be an integer from 0 through 60000.", WEB_USAGE);
    }
    return {
        ok: true,
        command: { kind: "web", port, debounceMs },
    };
}

function argumentless(
    args: readonly string[],
    command: Command,
    name: string,
): ParseResult {
    if (args.length === 1) {
        return { ok: true, command };
    }
    if (args.length === 2 && (args[1] === "--help" || args[1] === "-h")) {
        return { ok: false, help: true, usage: LOCAL_USAGE };
    }
    return failure(`The ${name} command does not accept arguments.`, LOCAL_USAGE);
}

function failure(message: string, usage: string): ParseResult {
    return { ok: false, help: false, message, usage };
}

class CliError extends Error {
    override readonly name = "CliError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

function codeOf(error: unknown): string {
    if (error instanceof CliError || error instanceof ProjectStoreError) {
        return error.code;
    }
    if (error instanceof Error && "code" in error && typeof error.code === "string") {
        return error.code;
    }
    return "cli.internal";
}

function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
