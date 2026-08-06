import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type { RawActionDump } from "../src/actiondump.js";
import {
    normalizeItemTransformBindings,
    renderItemTransformBindings,
} from "../src/item-transforms.js";

const source = await readFile(
    new URL("../src/actiondump.json", import.meta.url),
    "utf8",
);
const actionDump: RawActionDump = JSON.parse(source);

test("normalizes the exact curated item transform catalog", () => {
    const bindings = normalizeItemTransformBindings(actionDump.actions);

    assert.deepEqual(bindings, {
        "item.with_material": binding("item.with_material", "withMaterial", "SetItemType", [
            input("material", "text", 2),
        ]),
        "item.with_count": binding("item.with_count", "withCount", "SetItemAmount", [
            input("stack_size", "number", 2),
        ]),
        "item.with_name": binding("item.with_name", "withName", "SetItemName", [
            pluralInput("name", "component", 2),
        ]),
        "item.with_enchantment": binding(
            "item.with_enchantment",
            "withEnchantment",
            "AddItemEnchant",
            [
                input("enchantment_name", "text", 2),
                input("enchantment_level", "number", 3),
            ],
        ),
        "item.without_enchantment": binding(
            "item.without_enchantment",
            "withoutEnchantment",
            "RemItemEnchant",
            [input("enchantment_name", "text", 2)],
        ),
        "item.without_enchantments": binding(
            "item.without_enchantments",
            "withoutEnchantments",
            "ClearEnchants",
            [],
        ),
        "item.with_lore_appended": binding(
            "item.with_lore_appended",
            "withLoreAppended",
            "AddItemLore",
            [pluralInput("lore_to_add", "component", 2)],
        ),
    });
});

test("trims current item transform names and native subactions", () => {
    const binding = normalizeItemTransformBindings(actionDump.actions)["item.with_name"];

    assert.equal(binding.native.action, "SetItemName");
    assert.equal(binding.inputs.some((input) => input.native.index < 2), false);
});

test("rejects missing and duplicate current item transforms", () => {
    const currentType = actionDump.actions.find(
        (action) =>
            action.codeblockName === "SET VARIABLE" &&
            action.name.trim() === "SetItemType" &&
            action.legacyReplacement === undefined,
    );
    assert.ok(currentType);

    assert.throws(
        () => normalizeItemTransformBindings(
            actionDump.actions.filter((action) => action !== currentType),
        ),
        /Missing current SET VARIABLE \/ SetItemType/,
    );
    assert.throws(
        () => normalizeItemTransformBindings([...actionDump.actions, { ...currentType }]),
        /Duplicate current SET VARIABLE \/ SetItemType/,
    );
});

test("renders the item transform catalog as a standalone generated module", () => {
    const bindings = normalizeItemTransformBindings(actionDump.actions);

    assert.equal(
        renderItemTransformBindings(bindings),
        [
            "// This file is generated. Do not edit manually.",
            "",
            `export const itemTransformBindings = ${JSON.stringify(bindings, null, 4)} as const;`,
            "",
        ].join("\n"),
    );
});

function binding(
    id: string,
    method: string,
    action: string,
    inputs: Array<ReturnType<typeof input> | ReturnType<typeof pluralInput>>,
) {
    return {
        id,
        method,
        resultType: "item",
        native: {
            block: "set_var",
            action,
            destinationIndex: 0,
            sourceIndex: 1,
        },
        inputs,
        tags: [],
    };
}

function input(id: string, type: string, index: number) {
    return {
        id,
        acceptedTypes: [type],
        native: { index },
        cardinality: "single",
        optional: false,
    };
}

function pluralInput(id: string, type: string, index: number) {
    return {
        id,
        acceptedTypes: [type],
        native: { index },
        cardinality: "plural",
        minimumLength: 1,
    };
}
