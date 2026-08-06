import {
    normalizeOperationShape,
    type RawAction,
} from "./actiondump.js";
import type { OperationInput, OperationTag } from "./model.js";

export interface ItemTransformBinding {
    id: string;
    method: string;
    resultType: "item";
    native: {
        block: "set_var";
        action: string;
        destinationIndex: 0;
        sourceIndex: 1;
    };
    inputs: OperationInput[];
    tags: OperationTag[];
}

const policy = {
    SetItemType: { id: "item.with_material", method: "withMaterial" },
    SetItemAmount: { id: "item.with_count", method: "withCount" },
    SetItemName: { id: "item.with_name", method: "withName" },
    AddItemEnchant: { id: "item.with_enchantment", method: "withEnchantment" },
    RemItemEnchant: { id: "item.without_enchantment", method: "withoutEnchantment" },
    ClearEnchants: { id: "item.without_enchantments", method: "withoutEnchantments" },
    AddItemLore: { id: "item.with_lore_appended", method: "withLoreAppended" },
} as const;

export function normalizeItemTransformBindings(
    actions: readonly RawAction[],
): Record<string, ItemTransformBinding> {
    const bindings = Object.entries(policy).map(([name, metadata]) => {
        const matches = actions.filter(
            (action) =>
                action.codeblockName === "SET VARIABLE" &&
                action.name.trim() === name &&
                action.legacyReplacement === undefined,
        );
        if (matches.length === 0) {
            throw new Error(`Missing current SET VARIABLE / ${name}`);
        }
        if (matches.length > 1) {
            throw new Error(`Duplicate current SET VARIABLE / ${name}`);
        }

        const action = matches[0];
        const shape = normalizeOperationShape(action);
        const destination = shape.inputs.find((input) => input.native.index === 0);
        const source = shape.inputs.find((input) => input.native.index === 1);
        if (!destination?.acceptedTypes.includes("variable")) {
            throw new Error(`SET VARIABLE / ${name} is missing destination argument 0`);
        }
        if (!source?.acceptedTypes.includes("item")) {
            throw new Error(`SET VARIABLE / ${name} is missing source item argument 1`);
        }

        return [metadata.id, {
            id: metadata.id,
            method: metadata.method,
            resultType: "item",
            native: {
                block: "set_var",
                action: action.subAction.trim(),
                destinationIndex: 0,
                sourceIndex: 1,
            },
            inputs: shape.inputs.filter(
                (input) => input.native.index !== 0 && input.native.index !== 1,
            ),
            tags: shape.tags,
        } satisfies ItemTransformBinding] as const;
    });

    const normalized = Object.fromEntries(bindings);
    if (Object.keys(normalized).length !== bindings.length) {
        throw new Error("Duplicate item transform ID");
    }
    if (new Set(bindings.map(([, binding]) => binding.method)).size !== bindings.length) {
        throw new Error("Duplicate item transform method");
    }
    return normalized;
}

export function renderItemTransformBindings(
    bindings: Readonly<Record<string, ItemTransformBinding>>,
): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const itemTransformBindings = ${JSON.stringify(bindings, null, 4)} as const;`,
        "",
    ].join("\n");
}
