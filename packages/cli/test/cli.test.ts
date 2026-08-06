import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, test } from "node:test";
import { runCli, type CliDependencies, type CliIo } from "../cli.js";
import type { RegisteredProject } from "../project-store.js";

const temporary: string[] = [];

afterEach(async () => {
    await Promise.all(temporary.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

function capture(): { io: CliIo; stdout(): string; stderr(): string } {
    const stdout: string[] = [];
    const stderr: string[] = [];
    return {
        io: {
            stdout: (text) => stdout.push(text),
            stderr: (text) => stderr.push(text),
        },
        stdout: () => stdout.join(""),
        stderr: () => stderr.join(""),
    };
}

function dependencies(initial: readonly RegisteredProject[] = []):
    CliDependencies & { projects(): RegisteredProject[] } {
    let projects = [...initial];
    return {
        projects: () => [...projects],
        projectStore: {
            load: async () => [...projects],
            save: async (next) => {
                projects = [...next];
            },
        },
        isFile: async () => true,
        findTsconfig: async () => "/work/tsconfig.json",
        identify: async (entryPath) => ({
            id: "4c026963-a287-4e18-a86c-747d86e3a917",
            path: `${entryPath}/../nocuft.json`,
            created: true,
        }),
        build: async () => ({ ok: false, diagnostics: [], watchPaths: [] }),
    };
}

test("shows compact command help and removes compile", async () => {
    const help = capture();
    const compile = capture();
    assert.equal(await runCli(["--help"], help.io, dependencies()), 0);
    assert.match(help.stdout(), /nocuft local/u);
    assert.match(help.stdout(), /nocuft gui/u);
    assert.match(help.stdout(), /nocuft web/u);
    assert.equal(await runCli(["compile", "plot.ts"], compile.io, dependencies()), 2);
    assert.match(compile.stderr(), /Unknown command: compile/u);
});

test("parses web options and rejects invalid web arguments", async () => {
    const deps = dependencies([{
        id: "4c026963-a287-4e18-a86c-747d86e3a917",
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        root: "/work",
        manifestPath: "/work/nocuft.json",
        available: true,
    }]);
    let port = 0;
    let closed = false;
    deps.web = {
        startServer: async (options) => {
            port = options.port;
            return {
                url: `http://127.0.0.1:${port}/`,
                failed: new Promise(() => {}),
                publish: () => {},
                close: async () => {
                    closed = true;
                },
            };
        },
        digestOf: async () => undefined,
        startWatcher: () => ({ close: () => {} }),
        waitForStop: async () => "signal",
    };
    const valid = capture();
    assert.equal(await runCli(
        ["web", "--port", "43181", "--debounce", "12"],
        valid.io,
        deps,
    ), 0);
    assert.equal(port, 43181);
    assert.equal(closed, true);

    const invalidPort = capture();
    assert.equal(await runCli(["web", "--port", "0"], invalidPort.io, deps), 2);
    assert.match(invalidPort.stderr(), /--port must be an integer/u);

    const target = capture();
    assert.equal(await runCli(["web", "hello"], target.io, deps), 2);
    assert.match(target.stderr(), /takes no targets/u);
});

test("initializes and updates a portable manifest while preserving its UUID", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-cli-init-"));
    temporary.push(root);
    const source = join(root, "src");
    await mkdir(source);
    await writeFile(join(root, "tsconfig.json"), "{}\n");
    const entry = join(source, "plot.ts");
    await writeFile(entry, "export {};\n");
    const deps = dependencies();
    const derived = capture();
    assert.equal(await runCli(
        ["init", "arena", entry],
        derived.io,
        deps,
    ), 0);
    assert.equal(deps.projects()[0]?.module, "app.arena");
    const created = JSON.parse(await readFile(join(root, "nocuft.json"), "utf8")) as Record<string, unknown>;
    assert.equal(created.version, 1);
    assert.equal(created.entry, "src/plot.ts");
    assert.equal(created.language, "typescript");
    assert.equal(created.module, "app.arena");
    assert.equal(String(created.entry).startsWith("/"), false);

    const id = created.id;
    const overridden = capture();
    assert.equal(await runCli([
        "init", "arena", entry, "--module", "games.arena", "--force",
    ], overridden.io, deps), 0);
    assert.equal(deps.projects()[0]?.module, "games.arena");
    const upgraded = JSON.parse(await readFile(join(root, "nocuft.json"), "utf8")) as Record<string, unknown>;
    assert.equal(upgraded.id, id);
    assert.equal(upgraded.version, 1);
});

test("scaffolds a missing entry and tsconfig without replacing existing files", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-cli-scaffold-"));
    temporary.push(root);
    const entry = join(root, "src", "plot.ts");
    const deps = dependencies();
    deps.isFile = async (path) => {
        try {
            return (await stat(path)).isFile();
        } catch {
            return false;
        }
    };
    deps.findTsconfig = async (start) => {
        let current = start;
        for (;;) {
            const path = join(current, "tsconfig.json");
            if (await deps.isFile(path)) return path;
            const parent = dirname(current);
            if (parent === current) throw new Error("No tsconfig");
            current = parent;
        }
    };

    const output = capture();
    assert.equal(await runCli(["init", "hello", entry], output.io, deps), 0);
    const starter = await readFile(entry, "utf8");
    assert.match(starter, /events\.player\.join/u);
    assert.match(starter, /Hello, world!/u);
    const tsconfig = JSON.parse(await readFile(join(root, "tsconfig.json"), "utf8")) as {
        compilerOptions: Record<string, unknown>;
        include: string[];
    };
    assert.equal(tsconfig.compilerOptions.strict, true);
    assert.deepEqual(tsconfig.include, ["src/plot.ts"]);
    assert.match(output.stdout(), /Created .*plot\.ts/u);
    assert.match(output.stdout(), /Created .*tsconfig\.json/u);

    await writeFile(entry, "export const sentinel = true;\n");
    await writeFile(join(root, "tsconfig.json"), "{}\n");
    assert.equal(await runCli(["init", "hello", entry], capture().io, deps), 0);
    assert.equal(await readFile(entry, "utf8"), "export const sentinel = true;\n");
    assert.equal(await readFile(join(root, "tsconfig.json"), "utf8"), "{}\n");
});

test("refuses conflicting init and imports an existing project without rewriting it", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-cli-add-"));
    temporary.push(root);
    const entry = join(root, "plot.ts");
    await writeFile(entry, "export {};\n");
    await writeFile(join(root, "tsconfig.json"), "{}\n");
    const deps = dependencies();
    assert.equal(await runCli(["init", "arena", entry], capture().io, deps), 0);
    const before = await readFile(join(root, "nocuft.json"), "utf8");

    const conflict = capture();
    assert.equal(await runCli(["init", "other", entry], conflict.io, deps), 1);
    assert.match(conflict.stderr(), /belongs to existing project/u);
    assert.match(conflict.stderr(), /nocuft local add/u);
    assert.match(conflict.stderr(), /--force/u);

    await deps.projectStore.save([]);
    assert.equal(await runCli(["local", "add", entry], capture().io, deps), 0);
    assert.equal(await readFile(join(root, "nocuft.json"), "utf8"), before);
    assert.equal(deps.projects()[0]?.name, "arena");

    const original = JSON.parse(before) as Record<string, unknown>;
    assert.equal(await runCli(["init", "other", entry, "--force"], capture().io, deps), 0);
    const replaced = JSON.parse(await readFile(join(root, "nocuft.json"), "utf8")) as Record<string, unknown>;
    assert.equal(replaced.id, original.id);
    assert.equal(replaced.name, "other");
});

test("checks local name conflicts before writing a project manifest", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocuft-cli-conflict-"));
    temporary.push(root);
    const entry = join(root, "plot.ts");
    await writeFile(entry, "export {};\n");
    await writeFile(join(root, "tsconfig.json"), "{}\n");
    const deps = dependencies([{
        id: "4c026963-a287-4e18-a86c-747d86e3a917",
        name: "arena",
        entryPath: "/other/plot.ts",
        module: "app.arena",
        root: "/other",
        manifestPath: "/other/nocuft.json",
    }]);
    const output = capture();
    assert.equal(await runCli(["init", "arena", entry], output.io, deps), 1);
    await assert.rejects(readFile(join(root, "nocuft.json")), { code: "ENOENT" });
});

test("rejects unsupported entries and validates package arguments", async () => {
    const java = capture();
    const packages = capture();
    const removedHold = capture();
    assert.equal(await runCli(
        ["init", "arena", "Plot.java"],
        java.io,
        dependencies(),
    ), 2);
    assert.match(java.stderr(), /Go and Java are not supported/u);
    assert.equal(await runCli(["package", "install"], packages.io, dependencies()), 2);
    assert.match(packages.stderr(), /nocuft package install/u);
    assert.equal(await runCli(["items", "hold", "token"], removedHold.io, dependencies()), 2);
    assert.match(removedHold.stderr(), /Invalid items hold arguments/u);
});

test("lists, shows, and removes projects", async () => {
    const deps = dependencies([
        {
            id: "4c026963-a287-4e18-a86c-747d86e3a917",
            name: "arena",
            entryPath: "/work/arena/plot.ts",
            module: "app.arena",
            root: "/work/arena",
            manifestPath: "/work/arena/nocuft.json",
        },
    ]);
    const listed = capture();
    const shown = capture();
    const removed = capture();
    assert.equal(await runCli(["local", "list"], listed.io, deps), 0);
    assert.match(listed.stdout(), /NAME\s+STATUS\s+MODULE\s+ENTRY/u);
    assert.equal(await runCli(["local", "show", "arena"], shown.io, deps), 0);
    assert.match(shown.stdout(), /Module:\s+app\.arena/u);
    assert.equal(await runCli(["local", "remove", "arena"], removed.io, deps), 0);
    assert.deepEqual(deps.projects(), []);
});

test("warns when a local project entry is missing", async () => {
    const deps = dependencies([
        {
            id: "4c026963-a287-4e18-a86c-747d86e3a917",
            name: "stale",
            entryPath: "/work/missing/plot.ts",
            module: "app.stale",
            root: "/work/missing",
            manifestPath: "/work/missing/nocuft.json",
        },
    ]);
    deps.isFile = async () => false;
    const output = capture();
    assert.equal(await runCli(["local", "list"], output.io, deps), 0);
    assert.match(output.stdout(), /stale\s+missing/u);
    assert.match(output.stderr(), /warning\[projects\.unavailable\]/u);
    assert.match(output.stderr(), /nocuft local remove stale/u);
});

test("does not retain removed register aliases", async () => {
    const output = capture();
    assert.equal(await runCli(["local", "register", "arena", "plot.ts"], output.io, dependencies()), 2);
    assert.match(output.stderr(), /Unknown local command: register/u);
});
