import assert from "node:assert/strict";
import test from "node:test";
import { analyzeTypeScript } from "../index.js";

const fixture = (file: string) =>
    new URL(`./fixtures/dictionaries/${file}`, import.meta.url).pathname;
const analyze = (file: string) => analyzeTypeScript({
    tsconfigPath: fixture("tsconfig.json"),
    entryFile: fixture(file),
});

const numberList = { kind: "list" as const, elementType: "number" as const };
const rowDictionary = { kind: "dictionary" as const, valueType: numberList };
const rowList = { kind: "list" as const, elementType: numberList };
const keyList = { kind: "list" as const, elementType: "text" as const };
const line = (name: string, valueType: unknown) => ({
    kind: "line_variable" as const,
    name: `__nocuft_line_${name}`,
    valueType,
});
const string = (value: string) => ({ kind: "string" as const, value });
const number = (value: number) => ({ kind: "number" as const, value });

test("analyzes runtime dictionaries into exact High IR", () => {
    const rows = line("rows", rowDictionary);
    const empty = line("empty", rowDictionary);
    const first = line("first", numberList);
    const fromPlot = line("fromPlot", rowDictionary);
    const fromPlayer = line("fromPlayer", rowDictionary);
    const key = line("key", "text");
    const value = line("value", numberList);
    const plotRows = { kind: "plot_variable" as const, name: "rows", scope: "unsaved" as const, valueType: rowDictionary };
    const playerRows = {
        kind: "player_variable" as const,
        name: "rows",
        scope: "saved" as const,
        valueType: rowDictionary,
        receiver: "current_player" as const,
    };

    assert.deepEqual(analyze("plot.ts"), {
        kind: "module",
        templates: [{
            kind: "function",
            name: "dictionaries",
            parameters: [
                { kind: "value", name: "input", type: rowDictionary },
                { kind: "target", name: "player", target: "player" },
            ],
            body: [
                {
                    kind: "declare_line_variable",
                    name: rows.name,
                    valueType: rowDictionary,
                    initializer: {
                        kind: "dictionary",
                        entries: [
                            { key: string("first"), value: {
                                kind: "list", elements: [number(1)], valueType: numberList,
                            } },
                            { key: string("second"), value: {
                                kind: "list", elements: [number(2)], valueType: numberList,
                            } },
                        ],
                        valueType: rowDictionary,
                    },
                },
                {
                    kind: "declare_line_variable",
                    name: empty.name,
                    valueType: rowDictionary,
                    initializer: { kind: "dictionary", entries: [], valueType: rowDictionary },
                },
                {
                    kind: "declare_dictionary_get",
                    valueVariable: first,
                    foundVariable: line("foundFirst", "boolean"),
                    dictionary: rows,
                    key: string("first"),
                },
                {
                    kind: "declare_line_variable",
                    name: "__nocuft_line_size",
                    valueType: "number",
                    initializer: { kind: "dictionary_size", dictionary: rows },
                },
                {
                    kind: "declare_line_variable",
                    name: "__nocuft_line_keys",
                    valueType: keyList,
                    initializer: { kind: "dictionary_keys", dictionary: rows },
                },
                {
                    kind: "declare_line_variable",
                    name: "__nocuft_line_values",
                    valueType: rowList,
                    initializer: { kind: "dictionary_values", dictionary: rows, valueType: rowList },
                },
                { kind: "set_variable", variable: rows, value: {
                    kind: "dictionary_with",
                    dictionary: rows,
                    key: string("first"),
                    value: first,
                    valueType: rowDictionary,
                } },
                { kind: "set_variable", variable: rows, value: {
                    kind: "dictionary_without",
                    dictionary: rows,
                    key: string("second"),
                    valueType: rowDictionary,
                } },
                { kind: "set_variable", variable: rows, value: {
                    kind: "dictionary_merged",
                    dictionary: rows,
                    dictionaries: [{ kind: "parameter", name: "input", valueType: rowDictionary }],
                    valueType: rowDictionary,
                } },
                { kind: "set_variable", variable: plotRows, value: rows },
                {
                    kind: "declare_line_variable",
                    name: fromPlot.name,
                    valueType: rowDictionary,
                    initializer: plotRows,
                },
                { kind: "set_variable", variable: playerRows, value: rows },
                {
                    kind: "declare_line_variable",
                    name: fromPlayer.name,
                    valueType: rowDictionary,
                    initializer: playerRows,
                },
                {
                    kind: "if",
                    condition: { kind: "dictionary_has_key", dictionary: rows, key: string("first") },
                    body: [{ kind: "set_variable", variable: empty, value: rows }],
                },
                {
                    kind: "for_each_dictionary",
                    keyVariable: key,
                    valueVariable: value,
                    dictionary: fromPlayer,
                    body: [{ kind: "set_variable", variable: fromPlot, value: {
                        kind: "dictionary_with",
                        dictionary: fromPlot,
                        key,
                        value,
                        valueType: rowDictionary,
                    } }],
                },
            ],
        }],
    });
});

test("analyzes recursive dictionary function, rest, and loop contexts", () => {
    const module = analyze("rest.ts");
    const nestedDictionary = { kind: "dictionary" as const, valueType: rowDictionary };
    const dictionaryRestList = { kind: "list" as const, elementType: rowDictionary };
    assert.deepEqual(module.templates[0], {
        kind: "function",
        name: "dictionaryRest",
        parameters: [
            { kind: "value", name: "nested", type: nestedDictionary },
            { kind: "value", name: "others", type: dictionaryRestList, rest: true },
        ],
        body: [
            {
                kind: "for_each_dictionary",
                keyVariable: line("outerKey", "text"),
                valueVariable: line("inner", rowDictionary),
                dictionary: { kind: "parameter", name: "nested", valueType: nestedDictionary },
                body: [{
                    kind: "for_each_dictionary",
                    keyVariable: line("innerKey", "text"),
                    valueVariable: line("values", numberList),
                    dictionary: line("inner", rowDictionary),
                    body: [{
                        kind: "for_each",
                        variable: line("value", "number"),
                        iterable: line("values", numberList),
                        body: [],
                    }],
                }],
            },
            {
                kind: "for_each_dictionary",
                keyVariable: line("key", "text"),
                valueVariable: line("values_2", numberList),
                dictionary: {
                    kind: "list_index",
                    list: { kind: "parameter", name: "others", valueType: dictionaryRestList },
                    index: number(0),
                    valueType: rowDictionary,
                },
                body: [],
            },
        ],
    });
});

test("allows heterogeneous dictionary values only through any", () => {
    assert.doesNotThrow(() => analyze("any.ts"));
});

test("rejects invalid dictionary forms with actionable diagnostics", () => {
    const cases: ReadonlyArray<readonly [string, RegExp]> = [
        ["discarded-transform.ts", /assigned dictionary transformation result/u],
        ["invalid-spread.ts", /no spreads, computed names, methods, or accessors/u],
        ["invalid-computed.ts", /no spreads, computed names, methods, or accessors/u],
        ["invalid-method.ts", /no spreads, computed names, methods, or accessors/u],
        ["invalid-accessor.ts", /no spreads, computed names, methods, or accessors/u],
        ["invalid-argument.ts", /inline dictionary object constructor/u],
        ["invalid-object.ts", /arbitrary objects are not runtime values/u],
        ["invalid-union.ts", /one recursive value type \(use any for unions\)/u],
        ["invalid-get-binding.ts", /dictionary \[value, found\] binding/u],
        ["invalid-key.ts", /not assignable to parameter of type/u],
        ["invalid-value.ts", /not assignable/u],
    ];
    for (const [file, diagnostic] of cases) {
        assert.throws(() => analyze(file), diagnostic, file);
    }
});
