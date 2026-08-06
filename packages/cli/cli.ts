import { randomUUID } from "node:crypto";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { colorizeCliText, supportsColor } from "./cli-color.js";
import { renderTextTable } from "./text-table.js";
import { buildProject, findTsconfig, type ProjectBuildResult } from "./build-project.js";
import { runGui, type GuiDependencies } from "./gui-command.js";
import { runWeb, type WebDependencies } from "./web-command.js";
import { runPackageCommand, type PackageCommand } from "./package-command.js";
import { createItemCaptureHandler, runItemCommand, type ItemCommand } from "./item-command.js";
import { compareProject, registeredProjectStates } from "./item-manager.js";
import { createItemCatalogStore } from "./item-store.js";
import { findProjectRoot } from "./project-root.js";
import {
    conventionalProjectRoot,
    findProjectManifest,
    readProjectIdentity,
    readProjectManifest,
    relativeProjectEntry,
    resolveProjectEntry,
    writeProjectManifest,
    type ProjectIdentity,
    type ProjectManifest,
} from "./project-identity.js";
import {
    defaultProjectStore,
    ProjectStoreError,
    type ProjectStore,
    type RegisteredProject,
    validModuleId,
    validProjectName,
} from "./project-store.js";

const GLOBAL_USAGE = `Usage:
  nocuft init <name> <entry.ts> [options]
  nocuft local <command> [options]
  nocuft gui [options]
  nocuft web [options]
  nocuft package <command>
  nocuft items <command>

Commands:
  init                      Create or import a portable project definition
  local                     Manage projects saved on this machine
  gui                       Feed the in-game screen with local projects
  web                       View live compiled code in a local website
  package                   Manage fully vendored reusable functions
  items                     Manage versioned captured item snapshots

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
  nocuft local add <path> [--force]
  nocuft local list
  nocuft local show <name>
  nocuft local remove <name>...

Commands:
  add                       Add an existing project to this machine
  list                      List saved projects
  show                      Show one saved project
  remove                    Forget projects without deleting their source
`;

const ITEMS_USAGE = `Usage:
  nocuft items list [--deleted]
  nocuft items history <name>
  nocuft items install <name>[@version]
  nocuft items outdated [--all-projects]
  nocuft items update [name] [--all-projects]
  nocuft items rollback <name> --to <version>
  nocuft items restore <name> --from <version>
  nocuft items remove <name>
  nocuft items rename <name> <new-name>
  nocuft items export <name>[@version] [--history]
  nocuft items import <path>

Projects vendor complete item payloads. Catalog access is only needed by these
management commands.
`;

const INIT_USAGE = `Usage:
  nocuft init <name> <entry.ts> [options]

Options:
  -m, --module <id>          Module namespace (default: app.<name>)
  -f, --force                Replace a conflicting project definition
  -h, --help                 Show this help

Creates a Hello World entry and tsconfig.json when they do not exist.
Existing source and TypeScript configuration files are never replaced.
`;

const LOCAL_ADD_USAGE = `Usage:
  nocuft local add <path> [--force]

Options:
  -f, --force                Replace conflicting local tracking
  -h, --help                 Show this help
`;

const GUI_USAGE = `Usage:
  nocuft gui [options]

Options:
      --open                 Raise the screen in Minecraft after sending builds
      --debounce <ms>        Rebuild delay in milliseconds (default: 350)
  -h, --help                 Show this help

Sends every local project and keeps it current until stopped.
It never applies changes to a plot. Applying remains an in-game decision.
`;

const WEB_USAGE = `Usage:
  nocuft web [options]

Options:
      --port <number>        Local HTTP port (default: 31381)
      --debounce <ms>        Rebuild delay in milliseconds (default: 350)
  -h, --help                 Show this help

Serves every local project's compiled DiamondFire code and keeps it
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
    stdout: (text) => process.stdout.write(colorizeCliText(text, supportsColor(process.stdout))),
    stderr: (text) => process.stderr.write(colorizeCliText(text, supportsColor(process.stderr))),
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
    | { kind: "init"; name: string; entryPath: string; module: string; force: boolean }
    | { kind: "add"; path: string; force: boolean }
    | { kind: "list" }
    | { kind: "show"; name: string }
    | { kind: "remove"; names: string[] }
    | { kind: "gui"; open: boolean; debounceMs: number }
    | { kind: "web"; port: number; debounceMs: number }
    | { kind: "package"; package: PackageCommand }
    | { kind: "items"; items: ItemCommand };

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
            case "init":
                return await initialize(command, io, dependencies);
            case "add":
                return await add(command, io, dependencies.projectStore);
            case "list":
                return await list(io, dependencies.projectStore, dependencies.isFile);
            case "show":
                return await show(command.name, io, dependencies.projectStore);
            case "remove":
                return await remove(command.names, io, dependencies.projectStore);
            case "package":
                return await runPackageCommand(command.package, await findProjectRoot(), io);
            case "items":
                return await runItemCommand(command.items, dependencies.projectStore, io);
            case "gui": {
                const projects = await dependencies.projectStore.load();
                await warnUnavailableProjects(projects, dependencies.isFile, io);
                requireAvailableProjects(projects);
                try {
                    const catalog = await createItemCatalogStore().load();
                    const states = await registeredProjectStates(projects);
                    const outdated = states.flatMap((state) => compareProject(catalog, state))
                        .filter(({ status }) => status !== "current").length;
                    if (outdated > 0) {
                        io.stdout(`warning: ${outdated} vendored project item${outdated === 1 ? " is" : "s are"} outdated.\n`);
                    }
                } catch {
                    // GUI build delivery remains available when optional item drift inspection cannot run.
                }
                return await runGui(
                    projects.map((project) => ({
                        name: project.name,
                        entryPath: project.entryPath,
                        module: project.module,
                        identify: () => dependencies.identify(project.entryPath),
                        build: () => dependencies.build(project.entryPath),
                    })),
                    {
                        open: command.open,
                        debounceMs: command.debounceMs,
                        onRequest: createItemCaptureHandler(dependencies.projectStore),
                    },
                    io,
                    dependencies.gui,
                );
            }
            case "web": {
                const projects = await dependencies.projectStore.load();
                await warnUnavailableProjects(projects, dependencies.isFile, io);
                requireAvailableProjects(projects);
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

async function initialize(
    command: Extract<Command, { kind: "init" }>,
    io: CliIo,
    dependencies: CliDependencies,
): Promise<number> {
    const entryExists = await dependencies.isFile(command.entryPath);
    const found = await findProjectManifest(command.entryPath);
    const manifestPath = found ?? join(conventionalProjectRoot(command.entryPath), "nocuft.json");
    const root = dirname(manifestPath);
    const previous = found === undefined ? undefined : await readProjectManifest(found);
    const manifest: ProjectManifest = {
        format: "nocuft-project",
        version: 1,
        id: previous?.id ?? randomUUID(),
        name: command.name,
        language: "typescript",
        entry: relativeProjectEntry(root, command.entryPath),
        module: command.module,
    };
    const matches = previous !== undefined
        && previous.name === manifest.name
        && previous.language === manifest.language
        && previous.entry === manifest.entry
        && previous.module === manifest.module;
    if (previous !== undefined && !matches && !command.force) {
        throw new CliError(
            "project.manifest_conflict",
            `${manifestPath} belongs to existing project ${JSON.stringify(previous.name)}. `
            + `Use "nocuft local add ${root}" to add it to this machine, or rerun init with --force to replace its definition.`,
        );
    }
    await ensureTrackable(manifest.id, manifest.name, command.force, dependencies.projectStore);
    if (!entryExists) {
        await mkdir(dirname(command.entryPath), { recursive: true });
        await writeFile(command.entryPath, STARTER_ENTRY, { encoding: "utf8", flag: "wx" });
        io.stdout(`Created ${command.entryPath}.\n`);
    }
    try {
        await dependencies.findTsconfig(dirname(command.entryPath));
    } catch {
        const tsconfigPath = join(root, "tsconfig.json");
        await mkdir(root, { recursive: true });
        await writeFile(tsconfigPath, starterTsconfig(manifest.entry), {
            encoding: "utf8",
            flag: "wx",
        });
        io.stdout(`Created ${tsconfigPath}.\n`);
    }
    if (!matches) await writeProjectManifest(manifestPath, manifest);
    const project = resolvedProject(manifest, root, manifestPath);
    await trackProject(project, command.force, dependencies.projectStore);
    io.stdout(`${matches ? "Added" : previous === undefined ? "Initialized" : "Updated"} project ${manifest.name} at ${root}.\n`);
    if (!matches) io.stdout(`Commit ${manifestPath}.\n`);
    return 0;
}

const STARTER_ENTRY = `import { events } from "nocuft";

export const join = events.player.join((event) => {
    event.player.sendMessage("Hello, world!");
});
`;

function starterTsconfig(entry: string): string {
    return `${JSON.stringify({
        compilerOptions: {
            target: "ESNext",
            module: "ESNext",
            moduleResolution: "Bundler",
            strict: true,
            noEmit: true,
            skipLibCheck: true,
        },
        include: [entry],
    }, undefined, 2)}\n`;
}

async function add(
    command: Extract<Command, { kind: "add" }>,
    io: CliIo,
    store: ProjectStore,
): Promise<number> {
    const manifestPath = await findProjectManifest(command.path);
    if (manifestPath === undefined) {
        throw new CliError("project.manifest_not_found", `Could not find nocuft.json at or above ${command.path}.`);
    }
    const manifest = await readProjectManifest(manifestPath);
    const root = dirname(manifestPath);
    await trackProject(resolvedProject(manifest, root, manifestPath), command.force, store);
    io.stdout(`Added project ${manifest.name} at ${root}.\n`);
    return 0;
}

async function list(
    io: CliIo,
    store: ProjectStore,
    isFile: (path: string) => Promise<boolean>,
): Promise<number> {
    const projects = await store.load();
    if (projects.length === 0) {
        io.stdout("No local projects.\n");
        return 0;
    }
    const availability = new Map(await Promise.all(projects.map(async (project) =>
        [project.name, project.available !== false && await isFile(project.entryPath)] as const)));
    io.stdout(renderTextTable(["NAME", "STATUS", "MODULE", "ENTRY"], projects.map((project) => [
        project.name,
        availability.get(project.name) ? "ready" : "missing",
        project.module,
        project.entryPath,
    ])));
    await warnUnavailableProjects(projects, isFile, io);
    return 0;
}

async function warnUnavailableProjects(
    projects: readonly RegisteredProject[],
    isFile: (path: string) => Promise<boolean>,
    io: CliIo,
): Promise<void> {
    for (const project of projects) {
        if (project.available === false || !await isFile(project.entryPath)) {
            io.stderr(
                `warning[projects.unavailable]: Local project ${project.name} is missing at ${project.entryPath}.\n`
                + `Remove it with "nocuft local remove ${project.name}" if it is no longer needed.\n`,
            );
        }
    }
}

async function show(name: string, io: CliIo, store: ProjectStore): Promise<number> {
    const project = (await store.load()).find((entry) => entry.name === name);
    if (project === undefined) {
        throw new CliError("projects.not_found", `Project ${JSON.stringify(name)} is not tracked locally.`);
    }
    io.stdout(
        `Name:     ${project.name}\nEntry:    ${project.entryPath}\nModule:   ${project.module}\n`
        + `${project.root === undefined ? "" : `Root:     ${project.root}\n`}`
        + `${project.id === undefined ? "" : `ID:       ${project.id}\n`}`,
    );
    return 0;
}

async function remove(
    names: readonly string[],
    io: CliIo,
    store: ProjectStore,
): Promise<number> {
    const projects = await store.load();
    const tracked = new Set(projects.map(({ name }) => name));
    const missing = names.filter((name) => !tracked.has(name));
    if (missing.length > 0) {
        throw new CliError(
            "projects.not_found",
            `Projects are not tracked locally: ${missing.join(", ")}.`,
        );
    }
    const removed = new Set(names);
    await store.save(projects.filter(({ name }) => !removed.has(name)));
    io.stdout(`Removed local ${names.length === 1 ? "project" : "projects"}: ${names.join(", ")}.\n`);
    return 0;
}

async function trackProject(
    project: RegisteredProject,
    force: boolean,
    store: ProjectStore,
): Promise<void> {
    const projects = await store.load();
    await ensureTrackable(project.id, project.name, force, store, projects);
    await store.save([
        ...projects.filter((existing) =>
            existing.id !== project.id && existing.name !== project.name),
        project,
    ]);
}

async function ensureTrackable(
    id: string,
    name: string,
    force: boolean,
    store: ProjectStore,
    loaded?: readonly RegisteredProject[],
): Promise<void> {
    const projects = loaded ?? await store.load();
    const conflict = projects.find((existing) =>
        existing.name === name && existing.id !== id);
    if (conflict !== undefined && !force) {
        throw new CliError(
            "projects.already_exists",
            `A different project named ${JSON.stringify(name)} is already tracked locally. Use --force to replace it.`,
        );
    }
}

function resolvedProject(
    manifest: ProjectManifest,
    root: string,
    manifestPath: string,
): RegisteredProject {
    return {
        id: manifest.id,
        name: manifest.name,
        entryPath: resolveProjectEntry(root, manifest.entry),
        module: manifest.module,
        root,
        manifestPath,
        available: true,
    };
}

function requireAvailableProjects(projects: readonly RegisteredProject[]): void {
    const unavailable = projects.filter(({ available }) => available === false);
    if (unavailable.length > 0) {
        throw new CliError(
            "projects.unavailable",
            `Project manifests are unavailable or invalid: ${unavailable.map(({ name }) => name).join(", ")}. Restore nocuft.json or remove the local project.`,
        );
    }
}

function parseCommand(args: readonly string[]): ParseResult {
    const noun = args[0];
    if (noun === undefined || noun === "--help" || noun === "-h") {
        return { ok: false, help: true, usage: GLOBAL_USAGE };
    }
    if (noun === "local") {
        return parseLocal(args.slice(1));
    }
    if (noun === "init") {
        return parseInit(args.slice(1));
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
    if (noun === "items") {
        return parseItems(args.slice(1));
    }
    return failure(`Unknown command: ${noun}`, GLOBAL_USAGE);
}

function parseItems(args: readonly string[]): ParseResult {
    const [verb, ...rest] = args;
    if (verb === undefined || verb === "--help" || verb === "-h") {
        return { ok: false, help: true, usage: ITEMS_USAGE };
    }
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: [...rest],
            allowPositionals: true,
            strict: true,
            options: {
                deleted: { type: "boolean", default: false },
                "all-projects": { type: "boolean", default: false },
                history: { type: "boolean", default: false },
                to: { type: "string" },
                from: { type: "string" },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (error: unknown) {
        return failure(messageOf(error), ITEMS_USAGE);
    }
    if (parsed.values.help === true) return { ok: false, help: true, usage: ITEMS_USAGE };
    const positionals = parsed.positionals;
    const allProjects = parsed.values["all-projects"] === true;
    const noExtraOptions = parsed.values.to === undefined && parsed.values.from === undefined
        && parsed.values.deleted !== true && parsed.values.history !== true && !allProjects;
    if (verb === "list" && positionals.length === 0 && parsed.values.to === undefined
        && parsed.values.from === undefined && !allProjects && parsed.values.history !== true) {
        return { ok: true, command: { kind: "items", items: { verb, deleted: parsed.values.deleted === true } } };
    }
    if (["history", "remove"].includes(verb)
        && positionals.length === 1 && noExtraOptions) {
        return { ok: true, command: { kind: "items", items: { verb: verb as "history" | "remove", name: positionals[0]! } } };
    }
    if (verb === "install" && positionals.length === 1 && noExtraOptions) {
        const spec = parseItemSpec(positionals[0]!);
        if (spec !== undefined) return { ok: true, command: { kind: "items", items: { verb, ...spec } } };
    }
    if (verb === "rename" && positionals.length === 2 && noExtraOptions
        && validItemName(positionals[0]!) && validItemName(positionals[1]!)) {
        return { ok: true, command: { kind: "items", items: {
            verb,
            name: positionals[0]!,
            nextName: positionals[1]!,
        } } };
    }
    if (verb === "outdated" && positionals.length === 0 && parsed.values.to === undefined
        && parsed.values.from === undefined && parsed.values.deleted !== true && parsed.values.history !== true) {
        return { ok: true, command: { kind: "items", items: { verb, allProjects } } };
    }
    if (verb === "update" && positionals.length <= 1 && parsed.values.to === undefined
        && parsed.values.from === undefined && parsed.values.deleted !== true && parsed.values.history !== true) {
        return { ok: true, command: { kind: "items", items: {
            verb,
            ...(positionals[0] === undefined ? {} : { name: positionals[0] }),
            allProjects,
        } } };
    }
    if (verb === "rollback" && positionals.length === 1 && typeof parsed.values.to === "string"
        && parsed.values.from === undefined && parsed.values.deleted !== true
        && parsed.values.history !== true && !allProjects) {
        const to = positiveVersion(parsed.values.to);
        if (to !== undefined) return { ok: true, command: { kind: "items", items: { verb, name: positionals[0]!, to } } };
    }
    if (verb === "restore" && positionals.length === 1 && typeof parsed.values.from === "string"
        && parsed.values.to === undefined && parsed.values.deleted !== true
        && parsed.values.history !== true && !allProjects) {
        const from = positiveVersion(parsed.values.from);
        if (from !== undefined) return { ok: true, command: { kind: "items", items: { verb, name: positionals[0]!, from } } };
    }
    if (verb === "export" && positionals.length === 1 && parsed.values.to === undefined
        && parsed.values.from === undefined && parsed.values.deleted !== true && !allProjects) {
        const spec = parseItemSpec(positionals[0]!);
        if (spec !== undefined && !(parsed.values.history === true && spec.version !== undefined)) {
            return { ok: true, command: { kind: "items", items: { verb, ...spec, history: parsed.values.history === true } } };
        }
    }
    if (verb === "import" && positionals.length === 1 && noExtraOptions) {
        return { ok: true, command: { kind: "items", items: { verb, path: resolve(positionals[0]!) } } };
    }
    return failure(`Invalid items ${verb} arguments.`, ITEMS_USAGE);
}

function parseItemSpec(value: string): { name: string; version?: number } | undefined {
    const match = /^(?<name>[a-z][a-z0-9-]{0,63})(?:@(?<version>[1-9][0-9]*))?$/u.exec(value);
    if (match?.groups === undefined) return undefined;
    const version = match.groups.version === undefined ? undefined : positiveVersion(match.groups.version);
    if (match.groups.version !== undefined && version === undefined) return undefined;
    return { name: match.groups.name!, ...(version === undefined ? {} : { version }) };
}

function validItemName(value: string): boolean {
    return /^[a-z][a-z0-9-]{0,63}$/u.test(value);
}

function positiveVersion(value: string): number | undefined {
    const version = Number(value);
    return Number.isSafeInteger(version) && version >= 1 ? version : undefined;
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
    if (verb === "add") {
        return parseLocalAdd(args.slice(1));
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
    if (verb === "remove") {
        if (args.length === 2 && (args[1] === "--help" || args[1] === "-h")) {
            return { ok: false, help: true, usage: LOCAL_USAGE };
        }
        const names = args.slice(1);
        if (names.length === 0) {
            return failure("The local remove command requires at least one project name.", LOCAL_USAGE);
        }
        if (new Set(names).size !== names.length) {
            return failure("Project names must not be repeated.", LOCAL_USAGE);
        }
        return { ok: true, command: { kind: "remove", names } };
    }
    return failure(`Unknown local command: ${verb}`, LOCAL_USAGE);
}

function parseInit(args: readonly string[]): ParseResult {
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
        return failure(messageOf(error), INIT_USAGE);
    }
    if (parsed.values.help === true) {
        return { ok: false, help: true, usage: INIT_USAGE };
    }
    const [name, entry, ...extra] = parsed.positionals;
    if (name === undefined || entry === undefined || extra.length > 0) {
        return failure("The init command requires one name and one entry file.", INIT_USAGE);
    }
    if (!validProjectName(name)) {
        return failure("Project names must be lowercase identifiers up to 64 characters.", INIT_USAGE);
    }
    if (extname(entry).toLowerCase() !== ".ts") {
        return failure("The entry file must end in .ts. Go and Java are not supported yet.", INIT_USAGE);
    }
    const module = typeof parsed.values.module === "string"
        ? parsed.values.module
        : `app.${name}`;
    if (!validModuleId(module)) {
        return failure("The module must be a lowercase canonical identifier up to 255 characters.", INIT_USAGE);
    }
    return {
        ok: true,
        command: {
            kind: "init",
            name,
            entryPath: resolve(entry),
            module,
            force: parsed.values.force === true,
        },
    };
}

function parseLocalAdd(args: readonly string[]): ParseResult {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: [...args],
            allowPositionals: true,
            strict: true,
            options: {
                force: { type: "boolean", short: "f", default: false },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (error: unknown) {
        return failure(messageOf(error), LOCAL_ADD_USAGE);
    }
    if (parsed.values.help === true) return { ok: false, help: true, usage: LOCAL_ADD_USAGE };
    if (parsed.positionals.length !== 1) {
        return failure("The local add command requires exactly one file or directory path.", LOCAL_ADD_USAGE);
    }
    return {
        ok: true,
        command: {
            kind: "add",
            path: resolve(parsed.positionals[0]!),
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
        return failure("The gui command sends every local project and takes no targets.", GUI_USAGE);
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
        return failure("The web command serves every local project and takes no targets.", WEB_USAGE);
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
