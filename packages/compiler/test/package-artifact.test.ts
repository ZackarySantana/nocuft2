import assert from "node:assert/strict";
import test from "node:test";
import { createPackageArtifacts, linkPackageArtifacts, parsePackageExports, parsePackageIr, pruneHostModule } from "../package-artifact.js";

test("namespaces reachable package functions and emits portable exports", () => {
    const result = createPackageArtifacts("mathx", {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "helper",
                exported: false,
                parameters: [{ kind: "value", name: "message", type: "text" }],
                body: [],
            },
            {
                kind: "function",
                name: "greet",
                parameters: [
                    { kind: "value", name: "message", type: "text" },
                    { kind: "target", name: "player", target: "player" },
                ],
                body: [{
                    kind: "call_function",
                    function: "helper",
                    arguments: [{ kind: "parameter", name: "message", valueType: "text" }],
                }],
            },
            { kind: "function", name: "unused", exported: false, body: [] },
        ],
    });
    assert.deepEqual(result.artifact.module.templates.map((template) => template.name), ["mathx_helper", "mathx_greet"]);
    assert.equal(result.artifact.module.templates[1].body[0]?.kind, "call_function");
    assert.deepEqual(result.exports.functions, [{
        name: "greet",
        nativeName: "mathx_greet",
        parameters: [
            { kind: "value", name: "message", type: "text" },
            { kind: "target", name: "player", target: "player" },
        ],
    }]);
    assert.deepEqual(parsePackageIr(JSON.parse(JSON.stringify(result.artifact))), result.artifact);
    assert.deepEqual(parsePackageExports(JSON.parse(JSON.stringify(result.exports))), result.exports);
});

test("rejects invalid parameter contracts", () => {
    assert.throws(() => parsePackageExports({
        format: "nocuft-package-exports",
        version: 1,
        alias: "broken",
        language: "typescript",
        functions: [{
            name: "run",
            nativeName: "broken_run",
            parameters: [{ name: "message", type: "text" }],
        }],
    }), /Invalid function/u);
    assert.throws(() => parsePackageIr({
        format: "nocuft-package-ir",
        version: 1,
        alias: "broken",
        module: {
            kind: "module",
            templates: [{
                kind: "function",
                name: "broken_run",
                parameters: [
                    { kind: "target", name: "one", target: "player" },
                    { kind: "target", name: "two", target: "player" },
                ],
                body: [],
            }],
        },
    }), /version 1/u);
});

test("links package artifacts without changing the host", () => {
    const generated = createPackageArtifacts("tools", {
        kind: "module",
        templates: [{ kind: "function", name: "run", body: [] }],
    });
    const host = { kind: "module" as const, templates: [{ kind: "function" as const, name: "main", body: [] }] };
    assert.deepEqual(linkPackageArtifacts(host, [generated.artifact]).templates.map((template) => template.name), ["main", "tools_run"]);
});

test("retains started private processes and prunes unused ones", () => {
    const result = pruneHostModule({
        kind: "module",
        templates: [
            {
                kind: "process",
                name: "started",
                block: "process",
                action: "dynamic",
                exported: false,
                tags: [],
                body: [],
            },
            {
                kind: "process",
                name: "unused",
                block: "process",
                action: "dynamic",
                exported: false,
                tags: [],
                body: [],
            },
            {
                kind: "event",
                name: "boot",
                block: "game_event",
                action: "PlotStartup",
                body: [{
                    kind: "start_process",
                    process: "started",
                    block: "start_process",
                    action: "dynamic",
                    arguments: [],
                    tags: [],
                }],
            },
        ],
    });
    assert.deepEqual(result.templates.map((template) => template.name), [
        "started",
        "boot",
    ]);
});
