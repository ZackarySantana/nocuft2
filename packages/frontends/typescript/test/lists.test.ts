import assert from "node:assert/strict";
import test from "node:test";
import { analyzeTypeScript } from "../index.js";

const fixture = (file: string) =>
    new URL(`./fixtures/lists/${file}`, import.meta.url).pathname;

const numberList = { kind: "list" as const, elementType: "number" as const };
const itemList = { kind: "list" as const, elementType: "item" as const };
const rowList = { kind: "list" as const, elementType: numberList };
const line = (name: string, valueType: unknown) => ({
    kind: "line_variable" as const,
    name: `__nocuft_line_${name}`,
    valueType,
});
const number = (value: number) => ({ kind: "number" as const, value });

test("analyzes functional lists into exact High IR", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });

    const values = line("values", numberList);
    const empty = line("empty", numberList);
    const nested = line("nested", rowList);
    const second = line("second", "number");
    const size = line("size", "number");
    const fromPlot = line("fromPlot", numberList);
    const fromPlayer = line("fromPlayer", rowList);
    const row = line("row", numberList);
    const value = line("value", "number");

    assert.deepEqual(module, {
        kind: "module",
        templates: [{
            kind: "function",
            name: "lists",
            parameters: [
                { kind: "value", name: "rows", type: rowList },
                { kind: "target", name: "player", target: "player" },
            ],
            body: [
                { kind: "declare_line_variable", name: values.name, valueType: numberList, initializer: {
                    kind: "list", elements: [number(1), number(2)], valueType: numberList,
                } },
                { kind: "declare_line_variable", name: empty.name, valueType: numberList, initializer: {
                    kind: "list", elements: [], valueType: numberList,
                } },
                { kind: "declare_line_variable", name: nested.name, valueType: rowList, initializer: {
                    kind: "list",
                    elements: [
                        { kind: "list", elements: [number(3)], valueType: numberList },
                        { kind: "list", elements: [number(4)], valueType: numberList },
                    ],
                    valueType: rowList,
                } },
                { kind: "declare_line_variable", name: second.name, valueType: "number", initializer: {
                    kind: "list_index", list: values, index: number(1), valueType: "number",
                } },
                { kind: "declare_line_variable", name: size.name, valueType: "number", initializer: {
                    kind: "list_length", list: values,
                } },
                { kind: "set_variable", variable: values, value: {
                    kind: "list_with", list: values, index: number(0), value: second, valueType: numberList,
                } },
                { kind: "set_variable", variable: values, value: {
                    kind: "list_append", list: values, values: [size, number(5)], valueType: numberList,
                } },
                { kind: "set_variable", variable: values, value: {
                    kind: "list_concat", list: values, lists: [empty], valueType: numberList,
                } },
                { kind: "set_variable", variable: values, value: {
                    kind: "list_slice", list: values, start: number(1), end: number(3), valueType: numberList,
                } },
                { kind: "set_variable", variable: values, value: {
                    kind: "list_slice", list: values, start: undefined, end: size, valueType: numberList,
                } },
                { kind: "set_variable", variable: nested, value: {
                    kind: "list_append", list: nested, values: [empty], valueType: rowList,
                } },
                { kind: "set_variable", variable: {
                    kind: "plot_variable", name: "numbers", scope: "unsaved", valueType: numberList,
                }, value: values },
                { kind: "declare_line_variable", name: fromPlot.name, valueType: numberList, initializer: {
                    kind: "plot_variable", name: "numbers", scope: "unsaved", valueType: numberList,
                } },
                { kind: "set_variable", variable: {
                    kind: "player_variable", name: "rows", scope: "saved", valueType: rowList,
                    receiver: "current_player",
                }, value: nested },
                { kind: "declare_line_variable", name: fromPlayer.name, valueType: rowList, initializer: {
                    kind: "player_variable", name: "rows", scope: "saved", valueType: rowList,
                    receiver: "current_player",
                } },
                { kind: "for_each", variable: row, iterable: {
                    kind: "parameter", name: "rows", valueType: rowList,
                }, body: [{ kind: "for_each", variable: value, iterable: row, body: [{
                    kind: "set_variable", variable: fromPlot, value: {
                        kind: "list_append", list: fromPlot, values: [value], valueType: numberList,
                    },
                }] }] },
                { kind: "set_variable", variable: empty, value: {
                    kind: "list_index", list: fromPlayer, index: number(0), valueType: numberList,
                } },
            ],
        }],
    });
});

test("rejects discarded list transforms and invalid element types", () => {
    assert.throws(() => analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("discarded-transform.ts"),
    }), /assigned list transformation result/);
    assert.throws(() => analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("invalid-element.ts"),
    }), /not assignable/);
});

test("analyzes recursive rest parameters and flattens explicit arguments", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("rest.ts"),
    });
    const consume = module.templates.find((template) => template.name === "consume");
    assert.ok(consume && consume.kind === "function");
    assert.deepEqual(consume.parameters, [
        { kind: "value", name: "matrix", type: rowList },
        { kind: "value", name: "rows", type: rowList, rest: true },
    ]);
    assert.equal(consume.body[0]?.kind, "for_each");
    if (consume.body[0]?.kind === "for_each") {
        assert.deepEqual(consume.body[0].iterable, {
            kind: "parameter",
            name: "rows",
            valueType: rowList,
        });
    }
    const consumeArrays = module.templates.find((template) => template.name === "consumeArrays");
    assert.ok(consumeArrays && consumeArrays.kind === "function");
    assert.deepEqual(consumeArrays.parameters, [
        { kind: "value", name: "rows", type: rowList, rest: true },
    ]);
    const caller = module.templates.find((template) => template.name === "callRest");
    assert.ok(caller && caller.kind === "function");
    assert.equal(caller.body[0]?.kind, "call_function");
    if (caller.body[0]?.kind === "call_function") {
        assert.equal(caller.body[0].arguments.length, 3);
        assert.deepEqual(caller.body[0].arguments.map((argument) =>
            argument.kind === "list" ? argument.valueType : undefined), [rowList, numberList, numberList]);
    }
});

test("rejects dynamic List spreads in user function calls", () => {
    assert.throws(() => analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("invalid-rest-spread.ts"),
    }), /dynamic List spread.*pass rest arguments explicitly/u);
});

test("analyzes runtime list spreads into exact native plural IR", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("menu.ts"),
    });

    assert.deepEqual(module, {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "showMenu",
                parameters: [
                    { kind: "target", name: "player", target: "player" },
                    { kind: "value", name: "items", type: itemList },
                ],
                body: [{
                    kind: "intrinsic",
                    operation: "player.show_inv",
                    receiver: { kind: "current_player" },
                    arguments: { items_to_display: [{
                        kind: "parameter",
                        name: "items",
                        valueType: itemList,
                    }] },
                }],
            },
            {
                kind: "function",
                name: "extendMenu",
                parameters: [
                    { kind: "target", name: "player", target: "player" },
                    { kind: "value", name: "items", type: itemList, rest: true },
                ],
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.add_inv_row",
                        receiver: { kind: "current_player" },
                        arguments: { items_to_display: [{
                            kind: "parameter", name: "items", valueType: itemList,
                        }] },
                    },
                    {
                        kind: "intrinsic",
                        operation: "player.expand_inv",
                        receiver: { kind: "current_player" },
                        arguments: { items_to_display: [{
                            kind: "parameter", name: "items", valueType: itemList,
                        }] },
                    },
                ],
            },
            {
                kind: "event",
                name: "reopenMenu",
                event: "player.clickMenuSlot",
                body: [{
                    kind: "intrinsic",
                    operation: "player.show_inv",
                    receiver: { kind: "current_player" },
                    arguments: { items_to_display: [{
                        kind: "game_value",
                        value: "target.inventory_menu_items",
                        valueType: itemList,
                        receiver: "current_player",
                    }] },
                }],
            },
        ],
    });
});

test("rejects runtime List spreads when a nonempty native input is required", () => {
    for (const file of ["invalid-nonempty-spread.ts", "invalid-nonempty-item-spread.ts"]) {
        assert.throws(() => analyzeTypeScript({
            tsconfigPath: fixture("tsconfig.json"),
            entryFile: fixture(file),
        }), /runtime List spread.*requiring at least 1 value.*cannot be proven/u);
    }
});

test("assigns concrete recursive list elements to any and allows dynamic indices", () => {
    assert.doesNotThrow(() => analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("any.ts"),
    }));
});

test("rejects negative and fractional literal list indices and slice bounds", () => {
    for (const file of [
        "invalid-negative-index.ts",
        "invalid-fractional-index.ts",
        "invalid-negative-slice.ts",
        "invalid-fractional-slice.ts",
    ]) {
        assert.throws(() => analyzeTypeScript({
            tsconfigPath: fixture("tsconfig.json"),
            entryFile: fixture(file),
        }), /non-negative integer literal list (?:index|slice bound)/u);
    }
});
