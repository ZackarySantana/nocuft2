import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { analyzeTypeScript } from "../analyze.js";

const fixture = (file: string) => fileURLToPath(
    new URL(`./fixtures/items/${file}`, import.meta.url),
);

test("analyzes counted, dynamic, and transformed item expressions", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const body = module.templates[0].body;
    assert.equal(body[0].kind, "declare_line_variable");
    if (body[0].kind === "declare_line_variable") {
        assert.equal(body[0].valueType, "item");
        assert.deepEqual(body[0].initializer, {
            kind: "item",
            id: "diamond",
            count: 3,
        });
    }
    assert.equal(body[1].kind, "declare_line_variable");
    if (body[1].kind === "declare_line_variable") {
        assert.equal(body[1].initializer.kind, "item_constructor");
    }
    const operations = body
        .filter((statement) => statement.kind === "set_variable")
        .map((statement) => statement.value.kind === "item_transform" ? statement.value.operation : undefined);
    assert.deepEqual(operations, [
        "item.with_count",
        "item.with_name",
        "item.with_enchantment",
        "item.without_enchantment",
        "item.without_enchantments",
        "item.with_lore_appended",
        "item.with_material",
    ]);
});

test("analyzes generated captured-item facade values", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("captured-plot.ts"),
    });
    const statement = module.templates[0].body[0];
    assert.equal(statement.kind, "intrinsic");
    if (statement.kind === "intrinsic") {
        assert.deepEqual(statement.arguments.items_to_give, [
            {
                kind: "item_snapshot",
                snbt: '{count:1,id:"minecraft:diamond_sword"}',
            },
            {
                kind: "item_transform",
                operation: "item.with_name",
                receiver: {
                    kind: "item_snapshot",
                    snbt: '{count:1,id:"minecraft:diamond_sword"}',
                },
                arguments: [{ kind: "string", value: "Renamed" }],
            },
        ]);
    }
});

test("rejects invalid item options and discarded transforms", () => {
    for (const [file, pattern] of [
        ["invalid-options.ts", /item expression|item count option|positive integer/],
        ["discarded-transform.ts", /assigned item transformation result/],
    ] as const) {
        assert.throws(() => analyzeTypeScript({
            tsconfigPath: fixture("tsconfig.json"),
            entryFile: fixture(file),
        }), pattern);
    }
});
