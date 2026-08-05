import assert from "node:assert/strict";
import test from "node:test";
import type { HighModule } from "@nocuft/dfir";
import { lowerHighModule } from "../lower.js";

test("lowers hello to a native player action", () => {
    const high: HighModule = {
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
    };

    assert.deepEqual(lowerHighModule(high), {
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
    });
});

test("lowers explicit options and typed values", () => {
    const high: HighModule = {
        kind: "module",
        functions: [
            {
                kind: "function",
                name: "typed",
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
                                { kind: "string", value: "Count:" },
                                { kind: "number", value: 2 },
                                { kind: "boolean", value: false },
                            ],
                        },
                        options: {
                            alignment_mode: "centered",
                            text_value_merging: "no_spaces",
                            inherit_styles: "false",
                        },
                    },
                    {
                        kind: "intrinsic",
                        operation: "player.stop_sound",
                        receiver: {
                            kind: "player_selection",
                            selection: "all",
                        },
                        arguments: {
                            sounds_to_stop: [
                                {
                                    kind: "sound",
                                    value: "item.trident.thunder",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const low = lowerHighModule(high);
    const [message, sound] = low.templates[0].body;
    assert.deepEqual(message.arguments[0].values, [
        { kind: "text", value: "Count:" },
        { kind: "number", value: 2 },
        { kind: "component", value: "false" },
    ]);
    assert.deepEqual(
        message.tags.map((tag) => [tag.id, tag.option, tag.native.option]),
        [
            ["alignment_mode", "centered", "Centered"],
            ["text_value_merging", "no_spaces", "No spaces"],
            ["inherit_styles", "false", "False"],
        ],
    );
    assert.deepEqual(sound.arguments[0].values, [
        {
            kind: "sound",
            value: "ITEM_TRIDENT_THUNDER",
        },
    ]);
});

test("validates required inputs, cardinality, and options", () => {
    const intrinsic = {
        kind: "intrinsic" as const,
        operation: "player.action_bar",
        receiver: {
            kind: "player_selection" as const,
            selection: "all" as const,
        },
        arguments: {
            message_to_send: [],
        },
    };

    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                functions: [
                    {
                        kind: "function",
                        name: "invalid",
                        body: [intrinsic],
                    },
                ],
            }),
        /Expected at least 1 values/,
    );

    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                functions: [
                    {
                        kind: "function",
                        name: "invalid",
                        body: [
                            {
                                ...intrinsic,
                                arguments: {
                                    message_to_send: [
                                        { kind: "string", value: "Hi" },
                                    ],
                                },
                                options: {
                                    text_value_merging: "invalid",
                                },
                            },
                        ],
                    },
                ],
            }),
        /Invalid option invalid/,
    );
});
