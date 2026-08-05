import assert from "node:assert/strict";
import test from "node:test";
import { runCli, type CliDependencies, type CliIo } from "../cli.js";
import type { RegisteredProject } from "../project-store.js";

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
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
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

test("registers with a derived or overridden module", async () => {
    const deps = dependencies();
    const derived = capture();
    assert.equal(await runCli(
        ["local", "register", "arena", "/work/arena/src/plot.ts"],
        derived.io,
        deps,
    ), 0);
    assert.equal(deps.projects()[0]?.module, "app.arena");
    assert.match(derived.stdout(), /Commit .*nocuft\.json/u);

    const overridden = capture();
    assert.equal(await runCli([
        "local", "register", "arena", "/work/arena/src/new.ts",
        "--module", "games.arena", "--force",
    ], overridden.io, deps), 0);
    assert.equal(deps.projects()[0]?.module, "games.arena");
});

test("rejects unsupported entries and validates package arguments", async () => {
    const java = capture();
    const packages = capture();
    assert.equal(await runCli(
        ["local", "register", "arena", "Plot.java"],
        java.io,
        dependencies(),
    ), 2);
    assert.match(java.stderr(), /Go and Java are not supported/u);
    assert.equal(await runCli(["package", "install"], packages.io, dependencies()), 2);
    assert.match(packages.stderr(), /nocuft package install/u);
});

test("lists, shows, and unregisters projects", async () => {
    const deps = dependencies([
        { name: "arena", entryPath: "/work/arena/plot.ts", module: "app.arena" },
    ]);
    const listed = capture();
    const shown = capture();
    const removed = capture();
    assert.equal(await runCli(["local", "list"], listed.io, deps), 0);
    assert.match(listed.stdout(), /NAME\s+MODULE\s+ENTRY/u);
    assert.equal(await runCli(["local", "show", "arena"], shown.io, deps), 0);
    assert.match(shown.stdout(), /Module: app\.arena/u);
    assert.equal(await runCli(["local", "unregister", "arena"], removed.io, deps), 0);
    assert.deepEqual(deps.projects(), []);
});
