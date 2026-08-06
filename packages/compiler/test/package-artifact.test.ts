import assert from "node:assert/strict";
import test from "node:test";
import type { LowModule, LowValue, LowVariableValue } from "@nocuft/dfir";
import type { PackageArtifact } from "../package-artifact.js";
import { createPackageArtifact, linkPackageArtifacts, parsePackageArtifact, pruneHostModule } from "../package-artifact.js";

test("namespaces reachable package functions and emits portable exports", () => {
    const result = createPackageArtifact("mathx", {
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
    assert.deepEqual(result.module.templates.map((template) => template.name), ["mathx_helper", "mathx_greet"]);
    assert.equal(result.module.templates[1].body[0]?.kind, "call_function");
    assert.deepEqual(result.functions, [{
        name: "greet",
        nativeName: "mathx_greet",
        parameters: [
            { kind: "value", name: "message", type: "text" },
            { kind: "target", name: "player", target: "player" },
        ],
    }]);
    assert.deepEqual(parsePackageArtifact(JSON.parse(JSON.stringify(result))), result);
});

test("rejects invalid parameter contracts", () => {
    assert.throws(() => parsePackageArtifact({
        format: "nocuft-package",
        version: 2,
        alias: "broken",
        language: "typescript",
        module: { kind: "module", templates: [{ kind: "function", name: "broken_run", body: [] }] },
        functions: [{
            name: "run",
            nativeName: "broken_run",
            parameters: [{ name: "message", type: "text" }],
        }],
    }), /Invalid nocuft-package/u);
    assert.throws(() => parsePackageArtifact({
        format: "nocuft-package",
        version: 2,
        alias: "broken",
        language: "typescript",
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
        functions: [{ name: "run", nativeName: "broken_run", parameters: [] }],
    }), /version 2/u);
});

test("rejects package IR arguments that cannot be emitted safely", () => {
    const artifact = (arguments_: unknown[], tags: unknown[] = []) => ({
        format: "nocuft-package",
        version: 2,
        alias: "broken",
        language: "typescript",
        module: {
            kind: "module",
            templates: [{
                kind: "function",
                name: "broken_run",
                body: [{ kind: "action", block: "set_var", action: "=", arguments: arguments_, tags }],
            }],
        },
        functions: [{ name: "run", nativeName: "broken_run", parameters: [] }],
    });
    const number = { kind: "number", value: 1 };
    const single = (index: number) => ({ index, layout: "single", minimumLength: 1, values: [number] });
    const plural = (index: number, values: unknown[], minimumLength = 0) =>
        ({ index, layout: "plural", minimumLength, values });
    const tag = (slot: number) => ({
        id: "mode",
        option: "Default",
        native: { name: "Mode", option: "Default", slot },
    });

    for (const invalid of [
        artifact([plural(0, [], 1)]),
        artifact([single(0), single(0)]),
        artifact([plural(25, [number, number]), single(26)]),
        artifact([plural(0, [number, number])], [tag(1)]),
        artifact([single(0)], [tag(26), tag(26)]),
    ]) {
        assert.throws(() => parsePackageArtifact(invalid), /Invalid nocuft-package/u);
    }
});

test("validates package IR item counts and captured SNBT like the emitter", () => {
    const artifact = (item: unknown) => ({
        format: "nocuft-package",
        version: 2,
        alias: "broken",
        language: "typescript",
        module: {
            kind: "module",
            templates: [{
                kind: "function",
                name: "broken_run",
                body: [{
                    kind: "action",
                    block: "set_var",
                    action: "=",
                    arguments: [{ index: 0, layout: "single", minimumLength: 1, values: [item] }],
                    tags: [],
                }],
            }],
        },
        functions: [{ name: "run", nativeName: "broken_run", parameters: [] }],
    });
    for (const item of [
        { kind: "item", id: "minecraft:stone", count: 0 },
        { kind: "item", id: "minecraft:stone", count: 1.5 },
        { kind: "item", snbt: "   " },
    ]) {
        assert.throws(() => parsePackageArtifact(artifact(item)), /Invalid nocuft-package/u);
    }
    assert.doesNotThrow(() => parsePackageArtifact(artifact({ kind: "item", id: "minecraft:stone", count: 1 })));
    assert.doesNotThrow(() => parsePackageArtifact(artifact({ kind: "item", snbt: "{count:1,id:\"minecraft:stone\"}" })));
});

test("preserves recursive list parameter contracts", () => {
    const type = {
        kind: "list" as const,
        elementType: { kind: "list" as const, elementType: "number" as const },
    };
    const result = createPackageArtifact("lists", {
        kind: "module",
        templates: [{
            kind: "function",
            name: "consume",
            parameters: [
                { kind: "value", name: "matrix", type },
                { kind: "value", name: "rest", type, rest: true },
            ],
            body: [],
        }],
    });

    assert.deepEqual(parsePackageArtifact(JSON.parse(JSON.stringify(result))), result);
});

test("preserves recursive dictionary contracts in fixed and rest parameters", () => {
    const dictionary = {
        kind: "dictionary" as const,
        valueType: {
            kind: "list" as const,
            elementType: { kind: "dictionary" as const, valueType: "item" as const },
        },
    };
    const result = createPackageArtifact("dicts", {
        kind: "module",
        templates: [{
            kind: "function",
            name: "consume",
            parameters: [
                { kind: "value", name: "fixed", type: dictionary },
                {
                    kind: "value",
                    name: "rest",
                    type: { kind: "list", elementType: dictionary },
                    rest: true,
                },
            ],
            body: [],
        }],
    });

    assert.deepEqual(parsePackageArtifact(JSON.parse(JSON.stringify(result))), result);
});

test("rejects malformed nested dictionary contracts", () => {
    const invalidType = {
        kind: "list",
        elementType: { kind: "dictionary", valueType: { kind: "list", elementType: "unknown" } },
    };
    assert.throws(() => parsePackageArtifact({
        format: "nocuft-package",
        version: 2,
        alias: "dicts",
        language: "typescript",
        module: { kind: "module", templates: [{ kind: "function", name: "dicts_consume", body: [] }] },
        functions: [{
            name: "consume",
            nativeName: "dicts_consume",
            parameters: [{ kind: "value", name: "values", type: invalidType, rest: true }],
        }],
    }), /Invalid nocuft-package/u);
    assert.throws(() => parsePackageArtifact({
        format: "nocuft-package",
        version: 2,
        alias: "dicts",
        language: "typescript",
        module: {
            kind: "module",
            templates: [{
                kind: "function",
                name: "dicts_consume",
                parameters: [{ kind: "value", name: "values", type: invalidType, rest: true }],
                body: [],
            }],
        },
        functions: [{ name: "consume", nativeName: "dicts_consume", parameters: [] }],
    }), /Invalid nocuft-package/u);
});

const storedVariable = (
    name: string,
    scope: "saved" | "unsaved",
    owner: "plot" | "player" = "plot",
) => ({
    kind: "variable" as const,
    name,
    scope,
    owner,
    valueType: "number" as const,
});

const storedVariableModule = (values: readonly LowValue[]): LowModule => ({
    kind: "module",
    templates: [{
        kind: "function",
        name: "run",
        body: [{
            kind: "repeat",
            block: "repeat",
            action: "Forever",
            arguments: [],
            tags: [],
            body: [{
                kind: "action",
                block: "set_var",
                action: "=",
                arguments: [{ index: 0, layout: "plural", minimumLength: 0, values: [...values] }],
                tags: [],
            }],
        }],
    }],
});

const namespacedVariables = (artifact: PackageArtifact): LowVariableValue[] => {
    const repeat = artifact.module.templates[0].body[0];
    if (repeat.kind !== "repeat" || repeat.body[0].kind !== "action") return [];
    return repeat.body[0].arguments[0].values
        .filter((value): value is LowVariableValue => value.kind === "variable");
};

test("namespaces package stored variables recursively without player-prefix collisions", () => {
    const result = createPackageArtifact("state", storedVariableModule([
        storedVariable("shared name", "saved"),
        storedVariable("shared-name", "saved"),
        storedVariable("shared name", "unsaved"),
        storedVariable("shared name", "saved", "player"),
        storedVariable("shared name", "unsaved", "player"),
        storedVariable("%uuid shared name", "saved"),
        { ...storedVariable("nested", "saved"), valueType: { kind: "list", elementType: "number" } },
        { ...storedVariable("nested dictionary", "saved"), valueType: { kind: "dictionary", valueType: "number" } },
    ]));
    const variables = namespacedVariables(result);
    assert.deepEqual(variables.map((variable) => variable.name), [
        "__nocuft_pkg_state_s_g_shared name",
        "__nocuft_pkg_state_s_g_shared-name",
        "__nocuft_pkg_state_u_g_shared name",
        "__nocuft_pkg_state_s_p_shared name",
        "__nocuft_pkg_state_u_p_shared name",
        "__nocuft_pkg_state_s_g_%uuid shared name",
        "__nocuft_pkg_state_s_g_nested",
        "__nocuft_pkg_state_s_g_nested dictionary",
    ]);
    assert.equal(new Set(variables.map((variable) => variable.name)).size, variables.length);
    assert.deepEqual(
        variables.map((variable) => variable.scope === "line" ? "line" : variable.owner),
        ["plot", "plot", "plot", "player", "player", "plot", "plot", "plot"],
    );
});

test("keeps stored variable names distinct across packages and rejects overlong names", () => {
    const values = [storedVariable("score", "saved"), storedVariable("score", "saved", "player")];
    const first = createPackageArtifact("state", storedVariableModule(values));
    const second = createPackageArtifact("stats", storedVariableModule(values));
    assert.deepEqual(namespacedVariables(first).map((variable) => variable.name), [
        "__nocuft_pkg_state_s_g_score",
        "__nocuft_pkg_state_s_p_score",
    ]);
    assert.deepEqual(namespacedVariables(second).map((variable) => variable.name), [
        "__nocuft_pkg_stats_s_g_score",
        "__nocuft_pkg_stats_s_p_score",
    ]);
    const longest = "n".repeat(41);
    assert.equal(
        namespacedVariables(createPackageArtifact("state", storedVariableModule([
            storedVariable(longest, "saved"),
        ])))[0].name.length,
        64,
    );
    assert.throws(
        () => createPackageArtifact("state", storedVariableModule([storedVariable(`${longest}o`, "saved")])),
        /Package variable name is longer than 64 characters/u,
    );
});

test("links package artifacts without changing the host", () => {
    const generated = createPackageArtifact("tools", {
        kind: "module",
        templates: [{ kind: "function", name: "run", body: [] }],
    });
    const host = { kind: "module" as const, templates: [{ kind: "function" as const, name: "main", body: [] }] };
    assert.deepEqual(linkPackageArtifacts(host, [generated]).templates.map((template) => template.name), ["main", "tools_run"]);
});

test("rejects templates and exports outside the package namespace", () => {
    const artifact = (templates: unknown[], functions: unknown[]) => ({
        format: "nocuft-package",
        version: 2,
        alias: "tools",
        language: "typescript",
        module: { kind: "module", templates },
        functions,
    });
    assert.throws(() => parsePackageArtifact(artifact(
        [
            { kind: "function", name: "tools_run", body: [] },
            { kind: "function", name: "other_helper", body: [] },
        ],
        [{ name: "run", nativeName: "tools_run", parameters: [] }],
    )), /Package template is outside the tools namespace: other_helper/u);
    assert.throws(() => parsePackageArtifact(artifact(
        [{ kind: "function", name: "tools_helper", body: [] }],
        [{ name: "run", nativeName: "tools_helper", parameters: [] }],
    )), /Package export run must be declared by tools_run, not tools_helper/u);
});

test("rejects duplicate package templates and exports", () => {
    const artifact = (templates: unknown[], functions: unknown[]) => ({
        format: "nocuft-package",
        version: 2,
        alias: "tools",
        language: "typescript",
        module: { kind: "module", templates },
        functions,
    });
    assert.throws(() => parsePackageArtifact(artifact(
        [
            { kind: "function", name: "tools_run", body: [] },
            { kind: "function", name: "tools_run", body: [] },
        ],
        [{ name: "run", nativeName: "tools_run", parameters: [] }],
    )), /Package tools declares a duplicate template: tools_run/u);
    assert.throws(() => parsePackageArtifact(artifact(
        [{ kind: "function", name: "tools_run", body: [] }],
        [
            { name: "run", nativeName: "tools_run", parameters: [] },
            { name: "run", nativeName: "tools_run", parameters: [] },
        ],
    )), /Package tools exports a duplicate function: run/u);
    assert.throws(() => parsePackageArtifact(artifact(
        [{ kind: "function", name: "tools_run", body: [] }],
        [
            { name: "run", nativeName: "tools_run", parameters: [] },
            { name: "other", nativeName: "tools_run", parameters: [] },
        ],
    )), /Package tools exports a duplicate template: tools_run/u);
});

test("rejects package calls that do not resolve inside the package", () => {
    const artifact = (body: unknown[]) => ({
        format: "nocuft-package",
        version: 2,
        alias: "tools",
        language: "typescript",
        module: {
            kind: "module",
            templates: [{ kind: "function", name: "tools_run", body }],
        },
        functions: [{ name: "run", nativeName: "tools_run", parameters: [] }],
    });
    assert.throws(() => parsePackageArtifact(artifact([
        { kind: "call_function", function: "main", arguments: [] },
    ])), /Package tools calls a function it does not declare: main/u);
    assert.throws(() => parsePackageArtifact(artifact([{
        kind: "if",
        block: "if_var",
        action: "=",
        arguments: [],
        tags: [],
        body: [{
            kind: "repeat",
            block: "repeat",
            action: "Forever",
            arguments: [],
            tags: [],
            body: [{ kind: "call_function", function: "other_helper", arguments: [] }],
        }],
        elseBody: [{ kind: "call_function", function: "tools_run", arguments: [] }],
    }])), /Package tools calls a function it does not declare: other_helper/u);
    assert.throws(() => parsePackageArtifact(artifact([{
        kind: "start_process",
        process: "background",
        block: "start_process",
        action: "dynamic",
        arguments: [],
        tags: [],
    }])), /Package tools may not start processes: background/u);
    assert.doesNotThrow(() => parsePackageArtifact(artifact([
        { kind: "call_function", function: "tools_run", arguments: [] },
    ])));
});

test("rejects link collisions between packages and with the host", () => {
    const generated = (alias: string) => createPackageArtifact(alias, {
        kind: "module",
        templates: [{ kind: "function", name: "run", body: [] }],
    });
    const collide = { ...generated("tools"), alias: "other" };
    assert.throws(
        () => linkPackageArtifacts({ kind: "module", templates: [] }, [generated("tools"), collide]),
        /Packages tools and other both declare the template: tools_run/u,
    );
    const host = {
        kind: "module" as const,
        templates: [{ kind: "function" as const, name: "tools_run", body: [] }],
    };
    assert.throws(
        () => linkPackageArtifacts(host, [generated("tools")]),
        /Package tools declares a template the host already declares: tools_run/u,
    );
});

test("links a package function beside a host process of the same name", () => {
    const host = {
        kind: "module" as const,
        templates: [{
            kind: "process" as const,
            name: "tools_run",
            block: "process",
            action: "dynamic",
            tags: [],
            body: [],
        }],
    };
    const generated = createPackageArtifact("tools", {
        kind: "module",
        templates: [{ kind: "function", name: "run", body: [] }],
    });
    assert.deepEqual(
        linkPackageArtifacts(host, [generated]).templates.map((template) => `${template.kind}:${template.name}`),
        ["process:tools_run", "function:tools_run"],
    );
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

test("finds and namespaces calls nested in repeats and both branches", () => {
    const result = createPackageArtifact("flow", {
        kind: "module",
        templates: [
            { kind: "function", name: "left", exported: false, body: [] },
            { kind: "function", name: "right", exported: false, body: [] },
            {
                kind: "function",
                name: "run",
                body: [{
                    kind: "repeat",
                    block: "repeat",
                    action: "Forever",
                    arguments: [],
                    tags: [],
                    body: [{
                        kind: "if",
                        block: "if_var",
                        action: "=",
                        arguments: [],
                        tags: [],
                        body: [{ kind: "call_function", function: "left", arguments: [] }],
                        elseBody: [{ kind: "call_function", function: "right", arguments: [] }],
                    }],
                }],
            },
        ],
    });

    assert.equal(result.version, 2);
    assert.deepEqual(
        result.module.templates.map((template) => template.name),
        ["flow_left", "flow_right", "flow_run"],
    );
    const run = result.module.templates[2];
    assert.equal(run.kind, "function");
    if (run.kind !== "function") return;
    const repeat = run.body[0];
    assert.equal(repeat.kind, "repeat");
    if (repeat.kind !== "repeat") return;
    const branch = repeat.body[0];
    assert.equal(branch.kind, "if");
    if (branch.kind !== "if") return;
    assert.equal(branch.body[0].kind, "call_function");
    if (branch.body[0].kind === "call_function") assert.equal(branch.body[0].function, "flow_left");
    assert.equal(branch.elseBody?.[0].kind, "call_function");
    if (branch.elseBody?.[0].kind === "call_function") assert.equal(branch.elseBody[0].function, "flow_right");
});
