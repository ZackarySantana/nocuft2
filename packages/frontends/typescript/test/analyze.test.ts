import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { analyzeTypeScript } from "../analyze.js";

const tsconfigPath = fileURLToPath(
    new URL("./fixtures/hello/tsconfig.json", import.meta.url),
);
const entryFile = fileURLToPath(
    new URL("./fixtures/hello/plot.ts", import.meta.url),
);

function fixturePath(fixture: string, file: string): string {
    return fileURLToPath(
        new URL(`./fixtures/${fixture}/${file}`, import.meta.url),
    );
}

test("analyzes hello into DFIR-High", () => {
    const module = analyzeTypeScript({
        tsconfigPath,
        entryFile,
    });

    assert.deepEqual(module, {
        kind: "module",
        functions: [
            {
                kind: "function",
                name: "hello",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: {
                            kind: "player_selection",
                            selection: "all",
                        },
                        arguments: {
                            message_to_send: [
                                {
                                    kind: "string",
                                    value: "Hello!",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    });
});

test("preserves configured intrinsic options", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("options", "tsconfig.json"),
        entryFile: fixturePath("options", "plot.ts"),
    });

    assert.deepEqual(module.functions[0].body[0], {
        kind: "intrinsic",
        operation: "player.send_message",
        receiver: {
            kind: "player_selection",
            selection: "all",
        },
        arguments: {
            message_to_send: [{ kind: "string", value: "Hello!" }],
        },
        options: {
            alignment_mode: "centered",
            text_value_merging: "no_spaces",
            inherit_styles: "false",
        },
    });
});

test("analyzes typed literals, arrays, and SDK value constructors", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("typed", "tsconfig.json"),
        entryFile: fixturePath("typed", "plot.ts"),
    });

    const body = module.functions[0].body;
    assert.deepEqual(body[0].arguments.message_to_send, [
        { kind: "string", value: "Count:" },
        { kind: "number", value: 2 },
        { kind: "boolean", value: false },
        { kind: "location", x: 1, y: 65, z: -2 },
        { kind: "item", id: "stone" },
        { kind: "sound", value: "item.trident.thunder" },
    ]);
    assert.deepEqual(body[1].arguments.current_health, {
        kind: "number",
        value: 20,
    });
    assert.deepEqual(body[2].arguments.sounds_to_stop, [
        { kind: "sound", value: "item.trident.thunder" },
    ]);
    assert.deepEqual(body[3].arguments.new_position, {
        kind: "location",
        x: 1,
        y: 65,
        z: -2,
    });
    assert.deepEqual(body[4].arguments.items_to_give, [
        { kind: "item", id: "stone" },
        { kind: "item", id: "minecraft:dirt" },
    ]);
});

test("loads the requested tsconfig instead of the nearest config", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("custom", "requested/tsconfig.json"),
        entryFile: fixturePath("custom", "source/plot.ts"),
    });

    assert.equal(module.functions[0].name, "customProject");
});
