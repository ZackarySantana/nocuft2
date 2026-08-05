import assert from "node:assert/strict";
import test from "node:test";
import { startLiveProjects, type FileWatcher } from "../live-projects.js";

test("watches successful and failed builds, skips unchanged sources, and replaces paths", async () => {
    let builds = 0;
    const digests = new Map([["/work/a.ts", "one"], ["/work/b.ts", "three"]]);
    const changes = new Map<string, () => void>();
    const closed: string[] = [];
    const results: boolean[] = [];

    const live = await startLiveProjects([{
        name: "arena",
        entryPath: "/work/a.ts",
        module: "app.arena",
        build: async () => {
            builds += 1;
            if (builds === 1) {
                return {
                    ok: true as const,
                    templates: [],
                    sources: [{ path: "/work/a.ts", sha256: "one" }],
                };
            }
            if (builds === 2) {
                return {
                    ok: false as const,
                    diagnostics: [{ severity: "error" as const, code: "broken", message: "Broken" }],
                    watchPaths: ["/work/a.ts", "/work/b.ts"],
                };
            }
            return {
                ok: true as const,
                templates: [],
                sources: [{ path: "/work/b.ts", sha256: "three" }],
            };
        },
    }], { debounceMs: 0 }, {
        building: () => {},
        built: (_project, result) => results.push(result.ok),
    }, {
        digestOf: async (path) => digests.get(path),
        startWatcher: (path, onChange) => {
            changes.set(path, onChange);
            return { close: () => closed.push(path) } satisfies FileWatcher;
        },
    });

    assert.equal(builds, 1);
    assert.equal(live.watcherCount(), 1);
    changes.get("/work/a.ts")?.();
    await delay(10);
    assert.equal(builds, 1);

    digests.set("/work/a.ts", "two");
    changes.get("/work/a.ts")?.();
    await eventually(() => builds === 2 && live.watcherCount() === 2);
    assert.deepEqual(results, [true, false]);

    digests.set("/work/a.ts", "one");
    changes.get("/work/b.ts")?.();
    await eventually(() => builds === 3 && live.watcherCount() === 1);
    assert.deepEqual(closed, ["/work/a.ts"]);

    await live.stop();
    assert.deepEqual(closed, ["/work/a.ts", "/work/b.ts"]);
});

test("queues a fresh pass when a file changes during compilation", async () => {
    let builds = 0;
    let digest = "one";
    let change = (): void => {};
    let releaseSecond!: () => void;
    const secondStarted = new Promise<void>((resolve) => {
        releaseSecond = resolve;
    });
    let unblockSecond!: () => void;
    const secondBlocked = new Promise<void>((resolve) => {
        unblockSecond = resolve;
    });

    const live = await startLiveProjects([{
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        build: async () => {
            builds += 1;
            if (builds === 2) {
                releaseSecond();
                await secondBlocked;
            }
            return {
                ok: true as const,
                templates: [],
                sources: [{
                    path: "/work/plot.ts",
                    sha256: builds === 1 ? "one" : builds === 2 ? "two" : "three",
                }],
            };
        },
    }], { debounceMs: 0 }, { building: () => {}, built: () => {} }, {
        digestOf: async () => digest,
        startWatcher: (_path, onChange) => {
            change = onChange;
            return { close: () => {} };
        },
    });

    digest = "two";
    change();
    await secondStarted;
    digest = "three";
    change();
    unblockSecond();
    await eventually(() => builds === 3);
    await live.stop();
});

test("reports an unexpected rebuild error and still stops cleanly", async () => {
    let builds = 0;
    let digest = "one";
    let change = (): void => {};
    let closed = false;
    const live = await startLiveProjects([{
        name: "hello",
        entryPath: "/work/plot.ts",
        module: "app.hello",
        build: async () => {
            builds += 1;
            if (builds > 1) {
                throw new Error("Unexpected compiler crash");
            }
            return {
                ok: true,
                templates: [],
                sources: [{ path: "/work/plot.ts", sha256: "one" }],
            };
        },
    }], { debounceMs: 0 }, { building: () => {}, built: () => {} }, {
        digestOf: async () => digest,
        startWatcher: (_path, onChange) => {
            change = onChange;
            return { close: () => { closed = true; } };
        },
    });

    digest = "two";
    change();
    assert.match((await live.failed).message, /Unexpected compiler crash/u);
    await live.stop();
    assert.equal(closed, true);
});

async function eventually(predicate: () => boolean): Promise<void> {
    for (let attempt = 0; attempt < 100; attempt += 1) {
        if (predicate()) {
            return;
        }
        await delay(5);
    }
    assert.fail("Condition was not reached");
}

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
