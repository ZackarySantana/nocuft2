import assert from "node:assert/strict";
import test from "node:test";
import type { LowModule } from "@nocuft/dfir";
import { emitTemplates } from "../emit-template.js";

test("emits a DiamondFire function template", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "hello",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "SendMessage",
                        target: "all_players",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: [
                                    {
                                        kind: "text",
                                        value: "Hello!",
                                    },
                                ],
                            },
                        ],
                        tags: [
                            {
                                id: "alignment_mode",
                                option: "regular",
                                native: {
                                    name: "Alignment Mode",
                                    option: "Regular",
                                    slot: 26,
                                },
                            },
                            {
                                id: "text_value_merging",
                                option: "add_spaces",
                                native: {
                                    name: "Text Value Merging",
                                    option: "Add spaces",
                                    slot: 25,
                                },
                            },
                            {
                                id: "inherit_styles",
                                option: "true",
                                native: {
                                    name: "Inherit Styles",
                                    option: "True",
                                    slot: 24,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const [emitted] = emitTemplates(low);
    assert.equal(emitted.name, "hello");
    assert.deepEqual(emitted.template, {
        blocks: [
            {
                id: "block",
                block: "func",
                data: "hello",
                args: {
                    items: [
                        {
                            item: {
                                id: "bl_tag",
                                data: {
                                    tag: "Is Hidden",
                                    option: "False",
                                    block: "func",
                                    action: "dynamic",
                                },
                            },
                            slot: 26,
                        },
                    ],
                },
            },
            {
                id: "block",
                block: "player_action",
                action: "SendMessage",
                target: "AllPlayers",
                args: {
                    items: [
                        {
                            item: {
                                id: "txt",
                                data: {
                                    name: "Hello!",
                                },
                            },
                            slot: 0,
                        },
                        {
                            item: {
                                id: "bl_tag",
                                data: {
                                    tag: "Inherit Styles",
                                    option: "True",
                                    block: "player_action",
                                    action: "SendMessage",
                                },
                            },
                            slot: 24,
                        },
                        {
                            item: {
                                id: "bl_tag",
                                data: {
                                    tag: "Text Value Merging",
                                    option: "Add spaces",
                                    block: "player_action",
                                    action: "SendMessage",
                                },
                            },
                            slot: 25,
                        },
                        {
                            item: {
                                id: "bl_tag",
                                data: {
                                    tag: "Alignment Mode",
                                    option: "Regular",
                                    block: "player_action",
                                    action: "SendMessage",
                                },
                            },
                            slot: 26,
                        },
                    ],
                },
            },
        ],
    });
});

test("shifts inputs after expanded plural values", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "sounds",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "PlayEntitySound",
                        target: "all_players",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 1,
                                values: [
                                    { kind: "sound", value: "SOUND.ONE" },
                                    { kind: "sound", value: "SOUND.TWO" },
                                ],
                            },
                            {
                                index: 1,
                                layout: "single",
                                minimumLength: 1,
                                values: [{ kind: "text", value: "uuid" }],
                            },
                        ],
                        tags: [],
                    },
                ],
            },
        ],
    };

    const action = emitTemplates(low)[0].template.blocks[1];
    assert.deepEqual(
        action.args.items.map((item) => item.slot),
        [0, 1, 2],
    );
    assert.deepEqual(
        action.args.items.map((item) => item.item.id),
        ["snd", "snd", "txt"],
    );
});

test("does not shift after the first optional plural value", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "replace",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "ReplaceItems",
                        target: "all_players",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: [{ kind: "item", id: "minecraft:stone" }],
                            },
                            {
                                index: 1,
                                layout: "single",
                                minimumLength: 1,
                                values: [{ kind: "item", id: "minecraft:dirt" }],
                            },
                        ],
                        tags: [],
                    },
                ],
            },
        ],
    };

    const action = emitTemplates(low)[0].template.blocks[1];
    assert.deepEqual(
        action.args.items.map((item) => item.slot),
        [0, 1],
    );
});

test("rejects values that collide with fixed tag slots", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "overflow",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "SendMessage",
                        target: "all_players",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: Array.from({ length: 25 }, (_, index) => ({
                                    kind: "text" as const,
                                    value: String(index),
                                })),
                            },
                        ],
                        tags: [
                            {
                                id: "inherit_styles",
                                option: "true",
                                native: {
                                    name: "Inherit Styles",
                                    option: "True",
                                    slot: 24,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    assert.throws(() => emitTemplates(low), /slot is occupied: 24/);
});
