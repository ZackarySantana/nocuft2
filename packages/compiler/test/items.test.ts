import assert from "node:assert/strict";
import test from "node:test";
import type { HighExpression, HighModule, HighStatement, LowActionStatement } from "@nocuft/dfir";
import { emitTemplates } from "../emit-template.js";
import { lowerHighModule } from "../lower.js";

const lineItem = (name: string): HighExpression => ({
    kind: "line_variable",
    name,
    valueType: "item",
});

function lower(body: HighStatement[]) {
    const module: HighModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "items",
            parameters: [
                { kind: "value", name: "material", type: "text" },
                { kind: "value", name: "count", type: "number" },
            ],
            body,
        }],
    };
    return lowerHighModule(module).templates[0];
}

test("emits counted literal items", () => {
    const template = lower([{
        kind: "declare_line_variable",
        name: "reward",
        valueType: "item",
        initializer: { kind: "item", id: "diamond", count: 3 },
    }]);
    const native = emitTemplates({ kind: "module", templates: [template] })[0];
    const value = native.template.blocks[1].args.items.find((entry) => entry.slot === 1)?.item;
    assert.deepEqual(value, {
        id: "item",
        data: { item: "{count:3,id:\"minecraft:diamond\"}" },
    });
});

test("preserves captured item SNBT through lowering and emission", () => {
    const snbt = '{count:1,id:"minecraft:diamond_sword",components:{"minecraft:custom_name":\'"Doom"\'}}';
    const template = lower([{
        kind: "declare_line_variable",
        name: "reward",
        valueType: "item",
        initializer: { kind: "item_snapshot", snbt },
    }]);
    const native = emitTemplates({ kind: "module", templates: [template] })[0];
    const value = native.template.blocks[1].args.items.find((entry) => entry.slot === 1)?.item;
    assert.deepEqual(value, { id: "item", data: { item: snbt } });
});

test("uses captured snapshots as item transform receivers", () => {
    const snbt = '{count:1,id:"minecraft:diamond_sword"}';
    const template = lower([{
        kind: "declare_line_variable",
        name: "reward",
        valueType: "item",
        initializer: {
            kind: "item_transform",
            operation: "item.with_count",
            receiver: { kind: "item_snapshot", snbt },
            arguments: [{ kind: "number", value: 2 }],
        },
    }]);
    const action = template.body.find((statement): statement is LowActionStatement =>
        statement.kind === "action" && statement.action === "SetItemAmount");
    assert.ok(action);
    assert.deepEqual(action.arguments.find(({ index }) => index === 1)?.values, [{ kind: "item", snbt }]);
});

test("validates literal item IDs and counts at the IR boundary", () => {
    for (const item of [
        { kind: "item" as const, id: "Not Valid", count: 1 },
        { kind: "item" as const, id: "stone", count: 0 },
        { kind: "item" as const, id: "stone", count: 1.5 },
    ]) {
        assert.throws(() => lower([{
            kind: "declare_line_variable",
            name: "invalid",
            valueType: "item",
            initializer: item,
        }]), /Invalid item/u);
    }
});

test("lowers fully dynamic construction through separate item temporaries", () => {
    const template = lower([{
        kind: "declare_line_variable",
        name: "reward",
        valueType: "item",
        initializer: {
            kind: "item_constructor",
            material: { kind: "parameter", name: "material", valueType: "text" },
            count: { kind: "parameter", name: "count", valueType: "number" },
        },
    }]);
    const actions = template.body.filter((statement): statement is LowActionStatement => statement.kind === "action");
    assert.deepEqual(actions.map((action) => action.action), ["SetItemType", "SetItemAmount"]);
    const firstOutput = actions[0].arguments.find((argument) => argument.index === 0)?.values[0];
    const secondSource = actions[1].arguments.find((argument) => argument.index === 1)?.values[0];
    assert.deepEqual(secondSource, firstOutput);
    assert.notDeepEqual(
        actions[0].arguments.find((argument) => argument.index === 1)?.values[0],
        firstOutput,
    );
});

test("does not transform a line item in place", () => {
    const template = lower([{
        kind: "set_variable",
        variable: { kind: "line_variable", name: "sword", valueType: "item" },
        value: {
            kind: "item_transform",
            operation: "item.with_count",
            receiver: lineItem("sword"),
            arguments: [{ kind: "number", value: 2 }],
        },
    }]);
    const actions = template.body.filter((statement): statement is LowActionStatement => statement.kind === "action");
    assert.deepEqual(actions.map((action) => action.action), ["SetItemAmount", "="]);
    const transformedSource = actions[0].arguments.find((argument) => argument.index === 1)?.values[0];
    const transformedOutput = actions[0].arguments.find((argument) => argument.index === 0)?.values[0];
    assert.notDeepEqual(transformedSource, transformedOutput);
});

test("uses exact indexed arguments for functional item transforms", () => {
    const operations = [
        ["item.with_material", [{ kind: "string", value: "minecraft:golden_sword" }]],
        ["item.with_count", [{ kind: "number", value: 2 }]],
        ["item.with_name", [{ kind: "string", value: "Sword" }, { kind: "string", value: "!" }]],
        ["item.with_enchantment", [{ kind: "string", value: "minecraft:sharpness" }, { kind: "number", value: 5 }]],
        ["item.without_enchantment", [{ kind: "string", value: "minecraft:sharpness" }]],
        ["item.without_enchantments", []],
        ["item.with_lore_appended", [{ kind: "string", value: "Lore" }]],
    ] as const;
    for (const [operation, arguments_] of operations) {
        const template = lower([{
            kind: "declare_line_variable",
            name: `result_${operation}`,
            valueType: "item",
            initializer: {
                kind: "item_transform",
                operation,
                receiver: { kind: "item", id: "stone", count: 1 },
                arguments: [...arguments_] as HighExpression[],
            },
        }]);
        const action = template.body.find((statement) => statement.kind === "action");
        assert.ok(action && action.kind === "action");
        assert.deepEqual(action.arguments.slice(0, 2).map((argument) => argument.index), [0, 1]);
        assert.ok(action.arguments.every((argument) => argument.values.length >= argument.minimumLength));
    }
});
