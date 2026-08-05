import assert from "node:assert/strict";
import test from "node:test";
import { runWeb, type WebIo } from "../web-command.js";
import type { WebServer } from "../web-server.js";
import type { WebSnapshot } from "../web-state.js";

test("starts the viewer before building and publishes the successful result", async () => {
    const output = capture();
    const snapshots: WebSnapshot[] = [];
    let initial: WebSnapshot | undefined;
    let closed = false;
    const server: WebServer = {
        url: "http://127.0.0.1:31381/",
        failed: new Promise(() => {}),
        publish: (snapshot) => snapshots.push(snapshot),
        close: async () => {
            closed = true;
        },
    };

    const result = await runWeb([{
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        build: async () => ({
            ok: true,
            templates: [{
                name: "hello",
                nativeName: "hello",
                kind: "function",
                json: "unused",
                template: { blocks: [] },
            }],
            sources: [{ path: "/work/plot.ts", sha256: "one" }],
        }),
    }], { port: 31381, debounceMs: 350 }, output.io, {
        startServer: async (options) => {
            initial = options.snapshot();
            return server;
        },
        startWatcher: () => ({ close: () => {} }),
        waitForStop: async () => "signal",
    });

    assert.equal(result, 0);
    assert.equal(initial?.projects[0]?.status, "compiling");
    assert.deepEqual(snapshots.map(({ revision }) => revision), [1, 2]);
    assert.equal(snapshots[1]?.projects[0]?.templates[0]?.id, "hello/hello");
    assert.equal(closed, true);
    assert.match(output.stdout(), /Nocuft web viewer: http:\/\/127\.0\.0\.1:31381\//u);
    assert.equal(output.stderr(), "");
});

test("reports empty registrations and occupied ports", async () => {
    const empty = capture();
    assert.equal(await runWeb([], { port: 31381, debounceMs: 350 }, empty.io), 1);
    assert.match(empty.stderr(), /web\.no_projects/u);

    const occupied = capture();
    const error = Object.assign(new Error("listen EADDRINUSE"), { code: "EADDRINUSE" });
    assert.equal(await runWeb([{
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        build: async () => ({ ok: false, diagnostics: [], watchPaths: [] }),
    }], { port: 31381, debounceMs: 350 }, occupied.io, {
        startServer: async () => { throw error; },
    }), 1);
    assert.match(occupied.stderr(), /web\.port_in_use/u);
    assert.match(occupied.stderr(), /--port/u);
});

function capture(): { io: WebIo; stdout(): string; stderr(): string } {
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
