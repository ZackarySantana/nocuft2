import assert from "node:assert/strict";
import test from "node:test";
import type { NocuftSession } from "@nocuft/deployment";
import type { ProjectBuildTemplate } from "../build-project.js";
import { runGui, type GuiDependencies, type GuiIo } from "../gui-command.js";

const template: ProjectBuildTemplate = {
    name: "hello",
    nativeName: "hello",
    kind: "function",
    template: {
        blocks: [{ id: "block", block: "func", data: "hello", args: { items: [] } }],
    },
    json: "unused",
    origin: { kind: "host" },
};

test("builds, sends, opens, watches, and stops cleanly", async () => {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const io: GuiIo = {
        stdout: (text) => stdout.push(text),
        stderr: (text) => stderr.push(text),
    };
    const pushed: string[] = [];
    let opened = false;
    let closed = false;
    const session: NocuftSession = {
        modName: "test-mod",
        modVersion: "1.0.0",
        push: async (bundle) => {
            pushed.push(bundle.project.module);
            return { project: bundle.project.id, digest: "abcdef012345", units: 1 };
        },
        openScreen: async () => {
            opened = true;
        },
        close: () => {
            closed = true;
        },
    };
    const watched: string[] = [];
    const dependencies: GuiDependencies = {
        openSession: async () => session,
        digestOf: async () => "source-hash",
        startWatcher: (path) => {
            watched.push(path);
            return { close: () => {} };
        },
        waitForStop: async () => "signal",
    };

    const result = await runGui([{
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        identify: async () => ({
            id: "4c026963-a287-4e18-a86c-747d86e3a917",
            path: "/work/nocuft.json",
            created: false,
        }),
        build: async () => ({
            ok: true,
            templates: [template],
            sources: [{ path: "/work/plot.ts", sha256: "source-hash" }],
        }),
    }], { debounceMs: 0, open: true }, io, dependencies);

    assert.equal(result, 0);
    assert.deepEqual(pushed, ["app.hello"]);
    assert.deepEqual(watched, ["/work/plot.ts"]);
    assert.equal(opened, true);
    assert.equal(closed, true);
    assert.match(stdout.join(""), /Watching 1 file/u);
    assert.equal(stderr.join(""), "");
});

test("refuses to open an empty screen", async () => {
    const errors: string[] = [];
    const result = await runGui([], { debounceMs: 350, open: false }, {
        stdout: () => {},
        stderr: (text) => errors.push(text),
    }, {} as GuiDependencies);
    assert.equal(result, 1);
    assert.match(errors.join(""), /gui\.no_projects/u);
});
