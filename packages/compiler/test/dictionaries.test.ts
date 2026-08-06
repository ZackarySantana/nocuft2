import assert from "node:assert/strict";
import test from "node:test";
import type { HighExpression, HighModule, LowStatement, ValueType } from "@nocuft/dfir";
import { emitTemplate } from "../emit-template.js";
import { lowerHighModule } from "../lower.js";
import { createPackageArtifact, parsePackageArtifact } from "../package-artifact.js";

const numbers = { kind: "list" as const, elementType: "number" as const };
const textList = { kind: "list" as const, elementType: "text" as const };
const numberDictionary = { kind: "dictionary" as const, valueType: "number" as const };
const listDictionary = { kind: "dictionary" as const, valueType: numbers };

function actionSummary(body: readonly LowStatement[]) {
    return body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected action");
        return [statement.action, statement.arguments.map(({ index, values }) => [index, values])] as const;
    });
}

test("lowers nested list and dictionary literals through materialized key/value lists", () => {
    const dictionaries = { kind: "list" as const, elementType: numberDictionary };
    const nested = { kind: "dictionary" as const, valueType: dictionaries };
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "nested",
            body: [{
                kind: "declare_line_variable",
                name: "result",
                valueType: nested,
                initializer: {
                    kind: "dictionary",
                    valueType: nested,
                    entries: [{
                        key: { kind: "string", value: "nested" },
                        value: {
                            kind: "list",
                            valueType: dictionaries,
                            elements: [{
                                kind: "dictionary",
                                valueType: numberDictionary,
                                entries: [{
                                    key: { kind: "string", value: "x" },
                                    value: { kind: "number", value: 1 },
                                }],
                            }],
                        },
                    }],
                },
            }],
        }],
    };

    const variable = (name: string, valueType: ValueType) =>
        ({ kind: "variable" as const, name, scope: "line" as const, valueType });
    assert.deepEqual(actionSummary(lowerHighModule(high).templates[0].body), [
        ["CreateList", [[0, [variable("__nocuft_tmp_1", textList)]], [1, [{ kind: "text", value: "x" }]]]],
        ["CreateList", [[0, [variable("__nocuft_tmp_2", numbers)]], [1, [{ kind: "number", value: 1 }]]]],
        ["CreateDict", [[0, [variable("__nocuft_tmp_3", numberDictionary)]], [1, [variable("__nocuft_tmp_1", textList)]], [2, [variable("__nocuft_tmp_2", numbers)]]]],
        ["CreateList", [[0, [variable("__nocuft_tmp_4", dictionaries)]], [1, [variable("__nocuft_tmp_3", numberDictionary)]]]],
        ["CreateList", [[0, [variable("__nocuft_tmp_5", textList)]], [1, [{ kind: "text", value: "nested" }]]]],
        ["CreateList", [[0, [variable("__nocuft_tmp_6", { kind: "list", elementType: dictionaries })]], [1, [variable("__nocuft_tmp_4", dictionaries)]]]],
        ["CreateDict", [[0, [variable("result", nested)]], [1, [variable("__nocuft_tmp_5", textList)]], [2, [variable("__nocuft_tmp_6", { kind: "list", elementType: dictionaries })]]]],
    ]);
});

test("lowers dictionary reads and functional stored transforms with alias-safe copies", () => {
    const stored = { kind: "plot_variable" as const, name: "scores", scope: "saved" as const, valueType: numberDictionary };
    const overlay = { kind: "parameter" as const, name: "overlay", valueType: numberDictionary };
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "dictionaryOps",
            parameters: [{ kind: "value", name: "overlay", type: numberDictionary }],
            body: [
                { kind: "declare_line_variable", name: "picked", valueType: "number", initializer: {
                    kind: "dictionary_get", dictionary: stored, key: { kind: "string", value: "a" }, valueType: "number",
                } },
                { kind: "declare_line_variable", name: "size", valueType: "number", initializer: {
                    kind: "dictionary_size", dictionary: stored,
                } },
                { kind: "declare_line_variable", name: "keys", valueType: textList, initializer: {
                    kind: "dictionary_keys", dictionary: stored,
                } },
                { kind: "declare_line_variable", name: "values", valueType: numbers, initializer: {
                    kind: "dictionary_values", dictionary: stored, valueType: numbers,
                } },
                { kind: "set_variable", variable: stored, value: {
                    kind: "dictionary_with", dictionary: stored, key: { kind: "string", value: "b" },
                    value: { kind: "number", value: 2 }, valueType: numberDictionary,
                } },
                { kind: "set_variable", variable: stored, value: {
                    kind: "dictionary_without", dictionary: stored, key: { kind: "string", value: "a" },
                    valueType: numberDictionary,
                } },
                { kind: "set_variable", variable: stored, value: {
                    kind: "dictionary_merged", dictionary: overlay, dictionaries: [stored], valueType: numberDictionary,
                } },
            ],
        }],
    };

    const body = lowerHighModule(high).templates[0].body;
    assert.deepEqual(body.map((statement) => statement.kind === "action" ? statement.action : statement.kind), [
        "GetDictValue", "GetDictSize", "GetDictKeys", "GetDictValues",
        "CreateDict", "AppendDict", "SetDictValue", "=",
        "CreateDict", "AppendDict", "RemoveDictEntry", "=",
        "CreateDict", "AppendDict", "AppendDict", "=",
    ]);
    const actions = body.filter((statement): statement is Extract<LowStatement, { kind: "action" }> => statement.kind === "action");
    assert.deepEqual(actions.slice(0, 4).map((action) => action.arguments.map(({ index, values }) => [index, values])), [
        [[0, [{ kind: "variable", name: "picked", scope: "line", valueType: "number" }]], [1, [{ kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary }]], [2, [{ kind: "text", value: "a" }]]],
        [[0, [{ kind: "variable", name: "size", scope: "line", valueType: "number" }]], [1, [{ kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary }]]],
        [[0, [{ kind: "variable", name: "keys", scope: "line", valueType: textList }]], [1, [{ kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary }]]],
        [[0, [{ kind: "variable", name: "values", scope: "line", valueType: numbers }]], [1, [{ kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary }]]],
    ]);
    for (const [offset, mutation] of [[4, "SetDictValue"], [8, "RemoveDictEntry"], [12, "AppendDict"]] as const) {
        const temporary = actions[offset].arguments[0].values[0];
        assert.deepEqual(actions.slice(offset, offset + 2).map((action) => action.arguments[0].values[0]), [temporary, temporary]);
        assert.equal(actions[offset + 2].action, mutation);
        assert.deepEqual(actions[offset + 3].arguments.flatMap((argument) => argument.values), [
            { kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary },
            temporary,
        ]);
    }
});

test("lowers dictionary key conditions and entry iteration with exact native layouts", () => {
    const source = { kind: "parameter" as const, name: "source", valueType: listDictionary };
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "inspect",
            parameters: [{ kind: "value", name: "source", type: listDictionary }],
            body: [
                { kind: "if", condition: {
                    kind: "dictionary_has_key", dictionary: source, key: { kind: "string", value: "ready" },
                }, body: [] },
                { kind: "for_each_dictionary",
                    keyVariable: { kind: "line_variable", name: "key", valueType: "text" },
                    valueVariable: { kind: "line_variable", name: "value", valueType: numbers },
                    dictionary: source, body: [] },
            ],
        }],
    });

    assert.deepEqual(low.templates[0].body, [
        {
            kind: "if", block: "if_var", action: "DictHasKey",
            arguments: [
                { index: 0, layout: "single", minimumLength: 1, values: [source] },
                { index: 1, layout: "single", minimumLength: 1, values: [{ kind: "text", value: "ready" }] },
            ], tags: [], body: [],
        },
        {
            kind: "repeat", block: "repeat", action: "ForEachEntry",
            arguments: [
                { index: 0, layout: "single", minimumLength: 1, values: [{ kind: "variable", name: "key", scope: "line", valueType: "text" }] },
                { index: 1, layout: "single", minimumLength: 1, values: [{ kind: "variable", name: "value", scope: "line", valueType: numbers }] },
                { index: 2, layout: "single", minimumLength: 1, values: [source] },
            ], tags: [], body: [],
        },
    ]);

    const native = emitTemplate(low.templates[0]);
    assert.deepEqual(native.blocks[0].args.items[0], {
        item: { id: "pn_el", data: { name: "source", optional: false, plural: false, type: "dict" } }, slot: 0,
    });
    assert.deepEqual(native.blocks[1].args.items.map(({ item, slot }) => [item.id, item.data.name, slot]), [
        ["var", "source", 0], ["txt", "ready", 1],
    ]);
    assert.deepEqual(native.blocks[4].args.items.map(({ item, slot }) => [item.id, item.data.name, slot]), [
        ["var", "key", 0], ["var", "value", 1], ["var", "source", 2],
    ]);
});

test("lowers dictionary lookups into a found branch and a typed empty default", () => {
    const nestedDictionary = { kind: "dictionary" as const, valueType: numberDictionary };
    const source = { kind: "parameter" as const, name: "source", valueType: listDictionary };
    const nested = { kind: "parameter" as const, name: "nested", valueType: nestedDictionary };
    const stored = { kind: "plot_variable" as const, name: "scores", scope: "saved" as const, valueType: numberDictionary };
    const line = (name: string, valueType: ValueType) =>
        ({ kind: "variable" as const, name, scope: "line" as const, valueType });
    const text = (value: string) => ({ kind: "text" as const, value });
    const single = (index: number, value: unknown) =>
        ({ index, layout: "single" as const, minimumLength: 1, values: [value] });
    const action = (name: string, values: readonly unknown[]) => ({
        kind: "action" as const,
        block: "set_var",
        action: name,
        arguments: values.map((value, index) => single(index, value)),
        tags: [],
    });
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "lookup",
            parameters: [
                { kind: "value", name: "source", type: listDictionary },
                { kind: "value", name: "nested", type: nestedDictionary },
            ],
            body: [
                {
                    kind: "declare_dictionary_get",
                    valueVariable: { kind: "line_variable", name: "rows", valueType: numbers },
                    foundVariable: { kind: "line_variable", name: "found", valueType: "boolean" },
                    dictionary: source,
                    key: { kind: "string", value: "a" },
                },
                {
                    kind: "declare_dictionary_get",
                    valueVariable: { kind: "line_variable", name: "score", valueType: "number" },
                    foundVariable: { kind: "line_variable", name: "scored", valueType: "boolean" },
                    dictionary: stored,
                    key: { kind: "string", value: "b" },
                },
                {
                    kind: "declare_dictionary_get",
                    valueVariable: { kind: "line_variable", name: "inner", valueType: numberDictionary },
                    foundVariable: { kind: "line_variable", name: "hasInner", valueType: "boolean" },
                    dictionary: nested,
                    key: { kind: "string", value: "c" },
                },
            ],
        }],
    });

    const lookup = (
        dictionary: unknown,
        key: string,
        value: unknown,
        found: unknown,
        empty: LowStatement,
    ) => ({
        kind: "if" as const,
        block: "if_var",
        action: "DictHasKey",
        arguments: [single(0, dictionary), single(1, text(key))],
        tags: [],
        body: [
            action("GetDictValue", [value, dictionary, text(key)]),
            action("=", [found, { kind: "number", value: 1 }]),
        ],
        elseBody: [empty, action("=", [found, { kind: "number", value: 0 }])],
    });
    assert.deepEqual(low.templates[0].body, [
        lookup(source, "a", line("rows", numbers), line("found", "boolean"),
            action("CreateList", [line("rows", numbers)])),
        lookup({ kind: "variable", name: "scores", scope: "saved", owner: "plot", valueType: numberDictionary }, "b",
            line("score", "number"), line("scored", "boolean"),
            action("=", [line("score", "number"), { kind: "number", value: 0 }])),
        lookup(nested, "c", line("inner", numberDictionary), line("hasInner", "boolean"),
            action("CreateDict", [line("inner", numberDictionary)])),
    ]);
});

test("preserves dictionary expression preludes and resulting selection state", () => {
    const snapshot = { kind: "selection_snapshot" as const, name: "team", sizeName: "team_count",
        resultType: "player" as const, cardinality: "many" as const };
    const allPlayers = { kind: "selection" as const, resultType: "player" as const,
        source: { operation: "select.AllPlayers", arguments: [] }, filters: [] };
    const selectedUuid: HighExpression = {
        kind: "game_value", value: "target.uuid", valueType: "text", receiver: snapshot,
    };
    const high: HighModule = {
        kind: "module",
        templates: [{ kind: "event", name: "flow", event: "player.join", body: [
            { kind: "declare_selection_snapshot", name: "team", sizeName: "team_count", resultType: "player",
                cardinality: "many", initializer: allPlayers },
            { kind: "intrinsic", operation: "player.send_message", receiver: { kind: "selection", value: allPlayers },
                arguments: { message_to_send: [{ kind: "string", value: "reset" }] } },
            { kind: "declare_line_variable", name: "lookup", valueType: { kind: "dictionary", valueType: "text" },
                initializer: { kind: "dictionary", valueType: { kind: "dictionary", valueType: "text" },
                    entries: [{ key: { kind: "string", value: "id" }, value: selectedUuid }] } },
            { kind: "intrinsic", operation: "player.send_message", receiver: { kind: "selection", value: {
                kind: "selection", resultType: "player", source: snapshot, filters: [],
            } }, arguments: { message_to_send: [{ kind: "string", value: "done" }] } },
        ] }],
    };

    const body = lowerHighModule(high).templates[0].body;
    assert.deepEqual(body.slice(-6).map((statement) =>
        statement.kind === "select_object" ? statement.action : statement.kind === "action" ? statement.action : statement.kind),
    ["PlayerName", "=", "CreateList", "CreateList", "CreateDict", "SendMessage"]);
});

test("validates recursive dictionary package contracts", () => {
    const type = { kind: "dictionary" as const, valueType: { kind: "list" as const, elementType: numberDictionary } };
    const result = createPackageArtifact("dicts", {
        kind: "module",
        templates: [{ kind: "function", name: "consume", parameters: [{ kind: "value", name: "values", type }], body: [] }],
    });
    assert.equal(result.version, 2);
    assert.deepEqual(parsePackageArtifact(JSON.parse(JSON.stringify(result))), result);
});
