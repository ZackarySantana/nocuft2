import assert from "node:assert/strict";
import test from "node:test";
import type { HighModule, LowModule } from "@nocuft/dfir";
import { emitTemplate } from "../emit-template.js";
import { lowerHighModule } from "../lower.js";

const numbers = { kind: "list" as const, elementType: "number" as const };
const matrix = { kind: "list" as const, elementType: numbers };

test("assigns concrete list element types to recursive any descriptors", () => {
    assert.doesNotThrow(() => lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "acceptAny",
            parameters: [{ kind: "value", name: "source", type: numbers }],
            body: [{
                kind: "declare_line_variable",
                name: "output",
                valueType: { kind: "list", elementType: { kind: "list", elementType: "any" } },
                initializer: {
                    kind: "list",
                    elements: [{ kind: "parameter", name: "source", valueType: numbers }],
                    valueType: matrix,
                },
            }],
        }],
    }));
});

test("lowers nested list creation and indexed reads to native list actions", () => {
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "lists",
            body: [
                {
                    kind: "declare_line_variable",
                    name: "matrix",
                    valueType: matrix,
                    initializer: {
                        kind: "list",
                        valueType: matrix,
                        elements: [{
                            kind: "list",
                            valueType: numbers,
                            elements: [{ kind: "number", value: 3 }],
                        }],
                    },
                },
                {
                    kind: "set_variable",
                    variable: {
                        kind: "plot_variable",
                        name: "row",
                        scope: "saved",
                        valueType: numbers,
                    },
                    value: {
                        kind: "list_index",
                        list: { kind: "line_variable", name: "matrix", valueType: matrix },
                        index: { kind: "number", value: 1 },
                        valueType: numbers,
                    },
                },
            ],
        }],
    };

    assert.deepEqual(lowerHighModule(high).templates[0].body, [
        {
            kind: "action",
            block: "set_var",
            action: "CreateList",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: numbers }],
                },
                {
                    index: 1,
                    layout: "plural",
                    minimumLength: 0,
                    values: [{ kind: "number", value: 3 }],
                },
            ],
            tags: [],
        },
        {
            kind: "action",
            block: "set_var",
            action: "CreateList",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "variable", name: "matrix", scope: "line", valueType: matrix }],
                },
                {
                    index: 1,
                    layout: "plural",
                    minimumLength: 0,
                    values: [{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: numbers }],
                },
            ],
            tags: [],
        },
        {
            kind: "action",
            block: "set_var",
            action: "GetListValue",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "variable", name: "row", scope: "saved", owner: "plot", valueType: numbers }],
                },
                {
                    index: 1,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "variable", name: "matrix", scope: "line", valueType: matrix }],
                },
                {
                    index: 2,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "number", value: 2 }],
                },
            ],
            tags: [],
        },
    ]);
});

test("lowers every functional list operation with exact native indices and copies", () => {
    const source = { kind: "parameter" as const, name: "source", valueType: numbers };
    const index = { kind: "parameter" as const, name: "index", valueType: "number" as const };
    const variable = (name: string, valueType: typeof numbers | "number") => ({
        kind: "line_variable" as const,
        name,
        valueType,
    });
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "transforms",
            parameters: [
                { kind: "value", name: "source", type: numbers },
                { kind: "value", name: "index", type: "number" },
            ],
            body: [
                { kind: "declare_line_variable", name: "length", valueType: "number", initializer: {
                    kind: "list_length", list: source,
                } },
                { kind: "declare_line_variable", name: "selected", valueType: "number", initializer: {
                    kind: "list_index", list: source, index, valueType: "number",
                } },
                { kind: "declare_line_variable", name: "changed", valueType: numbers, initializer: {
                    kind: "list_with", list: source, index, value: { kind: "number", value: 9 }, valueType: numbers,
                } },
                { kind: "set_variable", variable: variable("changed", numbers), value: {
                    kind: "list_append", list: variable("changed", numbers),
                    values: [{ kind: "number", value: 4 }], valueType: numbers,
                } },
                { kind: "set_variable", variable: variable("changed", numbers), value: {
                    kind: "list_concat", list: variable("changed", numbers), lists: [source], valueType: numbers,
                } },
                { kind: "set_variable", variable: variable("changed", numbers), value: {
                    kind: "list_slice", list: variable("changed", numbers),
                    start: { kind: "number", value: 1 }, end: { kind: "number", value: 3 }, valueType: numbers,
                } },
            ],
        }],
    };

    const body = lowerHighModule(high).templates[0].body;
    assert.deepEqual(body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected list action");
        return {
            action: statement.action,
            arguments: statement.arguments.map((argument) => ({
                index: argument.index,
                values: argument.values,
            })),
        };
    }), [
        { action: "ListLength", arguments: [
            { index: 0, values: [{ kind: "variable", name: "length", scope: "line", valueType: "number" }] },
            { index: 1, values: [source] },
        ] },
        { action: "+", arguments: [
            { index: 0, values: [{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: "number" }] },
            { index: 1, values: [index, { kind: "number", value: 1 }] },
        ] },
        { action: "GetListValue", arguments: [
            { index: 0, values: [{ kind: "variable", name: "selected", scope: "line", valueType: "number" }] },
            { index: 1, values: [source] },
            { index: 2, values: [{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: "number" }] },
        ] },
        { action: "CreateList", arguments: [
            { index: 0, values: [{ kind: "variable", name: "changed", scope: "line", valueType: numbers }] },
        ] },
        { action: "AppendList", arguments: [
            { index: 0, values: [{ kind: "variable", name: "changed", scope: "line", valueType: numbers }] },
            { index: 1, values: [source] },
        ] },
        { action: "+", arguments: [
            { index: 0, values: [{ kind: "variable", name: "__nocuft_tmp_2", scope: "line", valueType: "number" }] },
            { index: 1, values: [index, { kind: "number", value: 1 }] },
        ] },
        { action: "SetListValue", arguments: [
            { index: 0, values: [{ kind: "variable", name: "changed", scope: "line", valueType: numbers }] },
            { index: 1, values: [{ kind: "variable", name: "__nocuft_tmp_2", scope: "line", valueType: "number" }] },
            { index: 2, values: [{ kind: "number", value: 9 }] },
        ] },
        ...["AppendValue", "AppendList"].flatMap((action, offset) => {
            const temporary = { kind: "variable" as const, name: `__nocuft_tmp_${offset + 3}`, scope: "line" as const, valueType: numbers };
            const changed = { kind: "variable" as const, name: "changed", scope: "line" as const, valueType: numbers };
            return [
                { action: "CreateList", arguments: [{ index: 0, values: [temporary] }] },
                { action: "AppendList", arguments: [
                    { index: 0, values: [temporary] }, { index: 1, values: [changed] },
                ] },
                { action, arguments: [
                    { index: 0, values: [temporary] },
                    { index: 1, values: action === "AppendValue" ? [{ kind: "number" as const, value: 4 }] : [source] },
                ] },
                { action: "=", arguments: [
                    { index: 0, values: [changed] }, { index: 1, values: [temporary] },
                ] },
            ];
        }),
        { action: "TrimList", arguments: [
            { index: 0, values: [{ kind: "variable", name: "__nocuft_tmp_5", scope: "line", valueType: numbers }] },
            { index: 1, values: [{ kind: "variable", name: "changed", scope: "line", valueType: numbers }] },
            { index: 2, values: [{ kind: "number", value: 2 }] },
            { index: 3, values: [{ kind: "number", value: 3 }] },
        ] },
        { action: "=", arguments: [
            { index: 0, values: [{ kind: "variable", name: "changed", scope: "line", valueType: numbers }] },
            { index: 1, values: [{ kind: "variable", name: "__nocuft_tmp_5", scope: "line", valueType: numbers }] },
        ] },
    ]);
});

test("preserves exact nested list types while appending rows", () => {
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "nested",
            parameters: [{ kind: "value", name: "matrix", type: matrix }],
            body: [{
                kind: "declare_line_variable",
                name: "result",
                valueType: matrix,
                initializer: {
                    kind: "list_append",
                    list: { kind: "parameter", name: "matrix", valueType: matrix },
                    values: [{
                        kind: "list",
                        valueType: numbers,
                        elements: [{ kind: "number", value: 7 }],
                    }],
                    valueType: matrix,
                },
            }],
        }],
    };

    const body = lowerHighModule(high).templates[0].body;
    assert.deepEqual(body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected list action");
        return [statement.action, statement.arguments.map((argument) => argument.values)];
    }), [
        ["CreateList", [[{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: numbers }], [{ kind: "number", value: 7 }]]],
        ["CreateList", [[{ kind: "variable", name: "result", scope: "line", valueType: matrix }]]],
        ["AppendList", [
            [{ kind: "variable", name: "result", scope: "line", valueType: matrix }],
            [{ kind: "parameter", name: "matrix", valueType: matrix }],
        ]],
        ["AppendValue", [
            [{ kind: "variable", name: "result", scope: "line", valueType: matrix }],
            [{ kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: numbers }],
        ]],
    ]);
});

test("chunks large list construction after 26 element values", () => {
    const elements = Array.from({ length: 53 }, (_, value) => ({ kind: "number" as const, value }));
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "largeList",
            body: [{
                kind: "declare_line_variable",
                name: "result",
                valueType: numbers,
                initializer: { kind: "list", valueType: numbers, elements },
            }],
        }],
    };

    const destination = { kind: "variable" as const, name: "result", scope: "line" as const, valueType: numbers };
    assert.deepEqual(lowerHighModule(high).templates[0].body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected list action");
        return [statement.action, statement.arguments.map((argument) => argument.values)];
    }), [
        ["CreateList", [[destination], elements.slice(0, 26)]],
        ["AppendValue", [[destination], elements.slice(26, 52)]],
        ["AppendValue", [[destination], elements.slice(52)]],
    ]);
});

test("chunks large list append and concat operands", () => {
    const source = { kind: "parameter" as const, name: "source", valueType: numbers };
    const values = Array.from({ length: 27 }, (_, value) => ({ kind: "number" as const, value }));
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "largeTransforms",
            parameters: [{ kind: "value", name: "source", type: numbers }],
            body: [
                {
                    kind: "declare_line_variable",
                    name: "appended",
                    valueType: numbers,
                    initializer: { kind: "list_append", list: source, values, valueType: numbers },
                },
                {
                    kind: "declare_line_variable",
                    name: "concatenated",
                    valueType: numbers,
                    initializer: {
                        kind: "list_concat",
                        list: source,
                        lists: Array.from({ length: 27 }, () => source),
                        valueType: numbers,
                    },
                },
            ],
        }],
    };

    const actions = lowerHighModule(high).templates[0].body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected list action");
        return [statement.action, statement.arguments.map((argument) => argument.values)] as const;
    });
    const appended = { kind: "variable" as const, name: "appended", scope: "line" as const, valueType: numbers };
    const concatenated = { kind: "variable" as const, name: "concatenated", scope: "line" as const, valueType: numbers };
    assert.deepEqual(actions, [
        ["CreateList", [[appended]]],
        ["AppendList", [[appended], [source]]],
        ["AppendValue", [[appended], values.slice(0, 26)]],
        ["AppendValue", [[appended], values.slice(26)]],
        ["CreateList", [[concatenated]]],
        ["AppendList", [[concatenated], [source]]],
        ["AppendList", [[concatenated], Array.from({ length: 26 }, () => source)]],
        ["AppendList", [[concatenated], [source]]],
    ]);
});

test("materializes nested list elements before chunking the outer list", () => {
    const rows = Array.from({ length: 27 }, (_, value) => ({
        kind: "list" as const,
        valueType: numbers,
        elements: [{ kind: "number" as const, value }],
    }));
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "largeMatrix",
            body: [{
                kind: "declare_line_variable",
                name: "result",
                valueType: matrix,
                initializer: { kind: "list", valueType: matrix, elements: rows },
            }],
        }],
    };

    const temporaries = rows.map((_, index) => ({
        kind: "variable" as const,
        name: `__nocuft_tmp_${index + 1}`,
        scope: "line" as const,
        valueType: numbers,
    }));
    const result = { kind: "variable" as const, name: "result", scope: "line" as const, valueType: matrix };
    assert.deepEqual(lowerHighModule(high).templates[0].body.map((statement) => {
        assert.equal(statement.kind, "action");
        if (statement.kind !== "action") throw new Error("Expected list action");
        return [statement.action, statement.arguments.map((argument) => argument.values)];
    }), [
        ...temporaries.map((temporary, index) => [
            "CreateList",
            [[temporary], [{ kind: "number", value: index }]],
        ]),
        ["CreateList", [[result], temporaries.slice(0, 26)]],
        ["AppendValue", [[result], temporaries.slice(26)]],
    ]);
});

test("lowers for-each to the generated native repeat binding", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "each",
            parameters: [{ kind: "value", name: "values", type: numbers }],
            body: [{
                kind: "for_each",
                variable: { kind: "line_variable", name: "value", valueType: "number" },
                iterable: { kind: "parameter", name: "values", valueType: numbers },
                body: [],
            }],
        }],
    });

    assert.deepEqual(low.templates[0].body, [{
        kind: "repeat",
        block: "repeat",
        action: "ForEach",
        arguments: [
            {
                index: 0,
                layout: "single",
                minimumLength: 1,
                values: [{ kind: "variable", name: "value", scope: "line", valueType: "number" }],
            },
            {
                index: 1,
                layout: "single",
                minimumLength: 1,
                values: [{ kind: "parameter", name: "values", valueType: numbers }],
            },
        ],
        tags: [{
            id: "allow_list_changes",
            option: "true",
            native: { name: "Allow List Changes", option: "True", slot: 26 },
        }],
        body: [],
    }]);
});

test("emits native list parameters and materializes list arguments", () => {
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "caller",
            parameters: [
                { kind: "value", name: "values", type: numbers },
                { kind: "value", name: "rest", type: numbers, rest: true },
            ],
            body: [{
                kind: "call_function",
                function: "consume",
                arguments: [{
                    kind: "list",
                    elements: [{ kind: "number", value: 8 }],
                    valueType: numbers,
                }],
            }],
        }],
    };

    const emitted = emitTemplate(lowerHighModule(high).templates[0]);
    assert.deepEqual(emitted.blocks[0].args.items.slice(0, 2), [
        {
            item: { id: "pn_el", data: { name: "values", optional: false, plural: false, type: "list" } },
            slot: 0,
        },
        {
            item: { id: "pn_el", data: { name: "rest", optional: false, plural: true, type: "num" } },
            slot: 1,
        },
    ]);
    assert.deepEqual(emitted.blocks.slice(1), [
        {
            id: "block",
            block: "set_var",
            action: "CreateList",
            args: { items: [
                { item: { id: "var", data: { name: "__nocuft_tmp_1", scope: "line" } }, slot: 0 },
                { item: { id: "num", data: { name: "8" } }, slot: 1 },
            ] },
        },
        {
            id: "block",
            block: "call_func",
            data: "consume",
            args: { items: [
                { item: { id: "var", data: { name: "__nocuft_tmp_1", scope: "line" } }, slot: 0 },
            ] },
        },
    ]);
});

test("chunks materialized list arguments without overflowing native slots", () => {
    const values = Array.from({ length: 53 }, (_, value) => ({ kind: "number" as const, value }));
    const high: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "caller",
            body: [{
                kind: "call_function",
                function: "consume",
                arguments: [{ kind: "list", elements: values, valueType: numbers }],
            }],
        }],
    };

    const emitted = emitTemplate(lowerHighModule(high).templates[0]);
    assert.deepEqual(emitted.blocks.slice(1).map((block) => [
        block.action ?? block.block,
        block.args.items.map(({ item, slot }) => [item.id, item.data.name, slot]),
    ]), [
        ["CreateList", [
            ["var", "__nocuft_tmp_1", 0],
            ...values.slice(0, 26).map(({ value }, index) => ["num", String(value), index + 1]),
        ]],
        ["AppendValue", [
            ["var", "__nocuft_tmp_1", 0],
            ...values.slice(26, 52).map(({ value }, index) => ["num", String(value), index + 1]),
        ]],
        ["AppendValue", [
            ["var", "__nocuft_tmp_1", 0],
            ["num", "52", 1],
        ]],
        ["call_func", [["var", "__nocuft_tmp_1", 0]]],
    ]);
    assert.ok(emitted.blocks.every((block) => block.args.items.every((item) => item.slot <= 26)));
});

test("rejects list element and index result type mismatches", () => {
    assert.throws(() => lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "bad",
            body: [{
                kind: "declare_line_variable",
                name: "values",
                valueType: numbers,
                initializer: {
                    kind: "list",
                    valueType: numbers,
                    elements: [{ kind: "string", value: "wrong" }],
                },
            }],
        }],
    }), /Cannot lower string expression as number/);
});

test("rejects calls beyond the native physical argument slots", () => {
    const low: LowModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "caller",
            body: [{
                kind: "call_function",
                function: "consume",
                arguments: Array.from({ length: 28 }, (_, value) => ({ kind: "number", value })),
            }],
        }],
    };
    assert.throws(() => emitTemplate(low.templates[0]), /28 physical arguments.*at most 27/u);
});
