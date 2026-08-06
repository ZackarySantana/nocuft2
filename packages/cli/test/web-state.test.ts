import assert from "node:assert/strict";
import test from "node:test";
import type { ProjectBuildTemplate } from "../build-project.js";
import { createWebState } from "../web-state.js";

const template: ProjectBuildTemplate = {
    name: "joined",
    nativeName: "Join",
    kind: "player_event",
    json: "unused",
    origin: { kind: "host" },
    template: {
        blocks: [{
            id: "block",
            block: "event",
            action: "Join",
            args: { items: [] },
        }],
    },
};

test("retains the last successful templates and marks them stale after failure", async () => {
    const published: number[] = [];
    const project = {
        name: "arena",
        entryPath: "/work/events.ts",
        module: "examples.arena",
        build: async () => assert.fail("Not used"),
    };
    const modified = new Map([
        ["/work/events.ts", 200],
        ["/work/imported.ts", 400],
        ["/work/tsconfig.json", 600],
    ]);
    const state = createWebState(
        [project],
        (snapshot) => published.push(snapshot.revision),
        { modifiedAt: async (path) => modified.get(path) },
    );

    await state.observer.building(project);
    await state.observer.built(project, {
        ok: true,
        templates: [template],
        sources: [
            { path: "/work/events.ts", sha256: "one" },
            { path: "/work/imported.ts", sha256: "two" },
            { path: "/work/tsconfig.json", sha256: "three" },
        ],
    }, 12);
    await state.observer.building(project);
    await state.observer.built(project, {
        ok: false,
        diagnostics: [{ severity: "error", code: "typescript.broken", message: "Broken" }],
        watchPaths: ["/work/events.ts"],
    }, 4);

    const snapshot = state.snapshot();
    assert.equal(snapshot.revision, 4);
    assert.deepEqual(published, [1, 2, 3, 4]);
    assert.equal(snapshot.projects[0]?.status, "failed");
    assert.equal(snapshot.projects[0]?.stale, true);
    assert.equal(snapshot.projects[0]?.durationMs, 4);
    assert.equal(snapshot.projects[0]?.modifiedAtMs, 600);
    assert.equal(snapshot.projects[0]?.templates[0]?.id, "arena/joined");
    assert.deepEqual(snapshot.projects[0]?.templates[0]?.origin, { kind: "host" });
    assert.equal(snapshot.projects[0]?.templates[0]?.blocks[0]?.action, "Join");
    assert.equal(snapshot.projects[0]?.diagnostics[0]?.code, "typescript.broken");
    assert.deepEqual(snapshot.projects[0]?.sources, ["/work/events.ts", "/work/imported.ts"]);
});

test("preserves explicit Nocuft and package template ownership", async () => {
    const project = {
        name: "arena",
        entryPath: "/work/events.ts",
        module: "examples.arena",
        build: async () => assert.fail("Not used"),
    };
    const state = createWebState([project], () => {}, { modifiedAt: async () => 100 });

    await state.observer.built(project, {
        ok: true,
        templates: [
            { ...template, name: "generated", origin: { kind: "nocuft" } },
            { ...template, name: "mathx_greet", origin: { kind: "package", alias: "mathx" } },
        ],
        sources: [],
    }, 2);

    assert.deepEqual(
        state.snapshot().projects[0]?.templates.map(({ origin }) => origin),
        [{ kind: "nocuft" }, { kind: "package", alias: "mathx" }],
    );
});

test("uses failed build watch paths when finding the newest save", async () => {
    const project = {
        name: "broken",
        entryPath: "/work/broken.ts",
        module: "examples.broken",
        build: async () => assert.fail("Not used"),
    };
    const state = createWebState([project], () => {}, {
        modifiedAt: async (path) => path === "/work/new-import.ts" ? 900 : 100,
    });

    await state.observer.built(project, {
        ok: false,
        diagnostics: [],
        watchPaths: ["/work/broken.ts", "/work/new-import.ts"],
    }, 3);

    assert.equal(state.snapshot().projects[0]?.modifiedAtMs, 900);
});
