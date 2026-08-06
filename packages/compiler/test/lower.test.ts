import assert from "node:assert/strict";
import test from "node:test";
import type { HighModule } from "@nocuft/dfir";
import { lowerHighModule } from "../lower.js";

test("lowers hello to a native player action", () => {
    const high: HighModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "hello",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: {
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "player",
                                source: {
                                    operation: "select.AllPlayers",
                                    arguments: [],
                                },
                                filters: [],
                            },
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
                        kind: "select_object",
                        action: "AllPlayers",
                        arguments: [],
                        tags: [],
                    },
                    {
                        kind: "action",
                        block: "player_action",
                        action: "SendMessage",
                        target: "selection",
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

test("lowers processes, process starts, and control wait", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "process",
                name: "countdown",
                parameters: [{ kind: "value", name: "delay", type: "number" }],
                options: { is_hidden: "true" },
                body: [{
                    kind: "intrinsic",
                    operation: "control.wait",
                    receiver: { kind: "control" },
                    arguments: {
                        wait_duration: {
                            kind: "parameter",
                            name: "delay",
                            valueType: "number",
                        },
                    },
                    options: { time_unit: "seconds" },
                }],
            },
            {
                kind: "event",
                name: "boot",
                event: "plot.startup",
                body: [{
                    kind: "start_process",
                    process: "countdown",
                    arguments: [{ kind: "number", value: 2 }],
                    options: {
                        target_mode: "with_no_targets",
                        local_variables: "share",
                    },
                }],
            },
        ],
    });

    assert.deepEqual(low.templates[0], {
        kind: "process",
        name: "countdown",
        block: "process",
        action: "dynamic",
        parameters: [{ kind: "value", name: "delay", type: "number" }],
        tags: [{
            id: "is_hidden",
            option: "true",
            native: { name: "Is Hidden", option: "True", slot: 26 },
        }],
        body: [{
            kind: "action",
            block: "control",
            action: "Wait",
            arguments: [{
                index: 0,
                layout: "single",
                minimumLength: 1,
                values: [{ kind: "parameter", name: "delay", valueType: "number" }],
            }],
            tags: [{
                id: "time_unit",
                option: "seconds",
                native: { name: "Time Unit", option: "Seconds", slot: 26 },
            }],
        }],
    });
    assert.deepEqual(low.templates[1].body, [{
        kind: "start_process",
        process: "countdown",
        block: "start_process",
        action: "dynamic",
        arguments: [{ kind: "number", value: 2 }],
        tags: [
            {
                id: "target_mode",
                option: "with_no_targets",
                native: { name: "Target Mode", option: "With no targets", slot: 26 },
            },
            {
                id: "local_variables",
                option: "share",
                native: { name: "Local Variables", option: "Share", slot: 25 },
            },
        ],
    }]);
});

test("lowers explicit options and typed values", () => {
    const high: HighModule = {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "typed",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: {
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "player",
                                source: {
                                    operation: "select.AllPlayers",
                                    arguments: [],
                                },
                                filters: [],
                            },
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
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "player",
                                source: {
                                    operation: "select.AllPlayers",
                                    arguments: [],
                                },
                                filters: [],
                            },
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
    const [, message, , sound] = low.templates[0].body;
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
            kind: "selection" as const,
            value: {
                kind: "selection" as const,
                resultType: "player" as const,
                source: {
                    operation: "select.AllPlayers",
                    arguments: [],
                },
                filters: [],
            },
        },
        arguments: {
            message_to_send: [],
        },
    };

    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                templates: [
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
                templates: [
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

test("lowers event cancellation", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "chat",
                event: "player.chat",
                body: [
                    { kind: "event_action", operation: "cancel", arguments: {} },
                ],
            },
        ],
    });

    assert.deepEqual(low.templates[0].body, [
        {
            kind: "action",
            block: "game_action",
            action: "CancelEvent",
            arguments: [],
            tags: [],
        },
    ]);
});

test("lowers generated event mutators", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                event: "player.playerDmgPlayer",
                body: [
                    {
                        kind: "event_action",
                        operation: "game.set_event_damage",
                        arguments: {
                            new_damage_amount: { kind: "number", value: 999 },
                        },
                    },
                ],
            },
        ],
    });

    assert.deepEqual(low.templates[0].body, [
        {
            kind: "action",
            block: "game_action",
            action: "SetEventDamage",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "number", value: 999 }],
                },
            ],
            tags: [],
        },
    ]);
});

test("lowers a main-hand item condition around an event mutator", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                event: "player.playerDmgPlayer",
                body: [
                    {
                        kind: "if",
                        condition: {
                            kind: "held_item",
                            receiver: "current_player",
                            hand: "main",
                            item: { kind: "item", id: "minecraft:mace", count: 1 },
                        },
                        body: [
                            {
                                kind: "event_action",
                                operation: "game.set_event_damage",
                                arguments: {
                                    new_damage_amount: {
                                        kind: "number",
                                        value: 999,
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    });

    assert.equal(low.templates[0].body[0].kind, "if");
    if (low.templates[0].body[0].kind === "if") {
        assert.equal(low.templates[0].body[0].action, "IsHolding");
        assert.deepEqual(low.templates[0].body[0].tags[0].native, {
            name: "Hand Slot",
            option: "Main hand",
            slot: 26,
        });
        assert.equal(low.templates[0].body[0].body[0].kind, "action");
    }
});

test("rejects event actions outside their generated applicability", () => {
    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                templates: [
                    {
                        kind: "event",
                        name: "join",
                        event: "player.join",
                        body: [
                            {
                                kind: "event_action",
                                operation: "game.set_event_damage",
                                arguments: {
                                    new_damage_amount: {
                                        kind: "number",
                                        value: 999,
                                    },
                                },
                            },
                        ],
                    },
                ],
            }),
        /is not applicable to player\.join/,
    );
    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                templates: [
                    {
                        kind: "event",
                        name: "join",
                        event: "player.join",
                        body: [
                            {
                                kind: "event_action",
                                operation: "cancel",
                                arguments: {},
                            },
                        ],
                    },
                ],
            }),
        /cannot be cancelled/,
    );
});

test("selects an event victim before a player action", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                event: "player.playerDmgPlayer",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.teleport",
                        receiver: {
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "player",
                                source: {
                                    operation: "select.EventTarget",
                                    arguments: [],
                                    options: { eventTarget: "victim" },
                                },
                                filters: [],
                            },
                        },
                        arguments: {
                            new_position: {
                                kind: "location",
                                x: 0,
                                y: 65,
                                z: 0,
                            },
                        },
                    },
                ],
            },
        ],
    });

    assert.deepEqual(low.templates[0].body[0], {
        kind: "select_object",
        action: "EventTarget",
        arguments: [],
        tags: [
            {
                id: "eventTarget",
                option: "victim",
                native: {
                    name: "Event Target",
                    option: "Victim",
                    slot: 26,
                },
            },
        ],
    });
    assert.equal(low.templates[0].body[1].kind, "action");
    if (low.templates[0].body[1].kind === "action") {
        assert.equal(low.templates[0].body[1].target, "selection");
    }
});

test("lowers event fields to native game values", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                event: "player.playerDmgPlayer",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: { kind: "current_player" },
                        arguments: {
                            message_to_send: [
                                {
                                    kind: "event_field",
                                    event: "player.playerDmgPlayer",
                                    field: "damage",
                                    valueType: "number",
                                },
                                {
                                    kind: "event_field",
                                    event: "player.playerDmgPlayer",
                                    field: "damageCause",
                                    valueType: "text",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    });

    assert.equal(low.templates[0].body[0].kind, "action");
    if (low.templates[0].body[0].kind === "action") {
        assert.deepEqual(low.templates[0].body[0].arguments[0].values, [
            {
                kind: "game_value",
                name: "Event Damage",
                valueType: "number",
                target: "",
            },
            {
                kind: "game_value",
                name: "Damage Event Cause",
                valueType: "text",
                target: "",
            },
        ]);
    }
});

test("lowers the current player's main hand item", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "join",
                event: "player.join",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: { kind: "current_player" },
                        arguments: {
                            message_to_send: [
                                {
                                    kind: "game_value",
                                    value: "target.main_hand_item",
                                    valueType: "item",
                                    receiver: "current_player",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    });

    assert.equal(low.templates[0].body[0].kind, "action");
    if (low.templates[0].body[0].kind === "action") {
        assert.deepEqual(low.templates[0].body[0].arguments[0].values, [
            {
                kind: "game_value",
                name: "Main Hand Item",
                valueType: "item",
                target: "Default",
            },
        ]);
    }
});

test("rejects event fields outside their owning event", () => {
    const statement = {
        kind: "intrinsic" as const,
        operation: "player.send_message",
        receiver: { kind: "current_player" as const },
        arguments: {
            message_to_send: [
                {
                    kind: "event_field" as const,
                    event: "player.playerDmgPlayer",
                    field: "damage",
                    valueType: "number" as const,
                },
            ],
        },
    };

    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                templates: [
                    { kind: "function", name: "invalid", body: [statement] },
                ],
            }),
        /cannot be used in a function/,
    );
    assert.throws(
        () =>
            lowerHighModule({
                kind: "module",
                templates: [
                    {
                        kind: "event",
                        name: "chat",
                        event: "player.chat",
                        body: [statement],
                    },
                ],
            }),
        /cannot be used in player\.chat/,
    );
});

test("selects all entities before an entity action", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "removeEntities",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "entity.remove",
                        receiver: {
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "entity",
                                source: {
                                    operation: "select.AllEntities",
                                    arguments: [],
                                },
                                filters: [],
                            },
                        },
                        arguments: {},
                    },
                ],
            },
        ],
    });

    assert.deepEqual(low.templates[0].body, [
        {
            kind: "select_object",
            action: "AllEntities",
            arguments: [],
            tags: [],
        },
        {
            kind: "action",
            block: "entity_action",
            action: "Remove",
            target: "selection",
            arguments: [],
            tags: [],
        },
    ]);
});

test("lowers game actions without a target", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "configureGame",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "game.mob_spawning",
                        receiver: { kind: "game" },
                        arguments: {},
                        options: { mob_spawning: "disable" },
                    },
                ],
            },
        ],
    });

    assert.deepEqual(low.templates[0].body, [
        {
            kind: "action",
            block: "game_action",
            action: "MobSpawning",
            arguments: [],
            tags: [
                {
                    id: "mob_spawning",
                    option: "disable",
                    native: {
                        name: "Mob Spawning",
                        option: "Disable",
                        slot: 26,
                    },
                },
            ],
        },
    ]);
});

test("selects entity event roles before entity actions", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "entityAttack",
                event: "entity.entityDmgEntity",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "entity.remove",
                        receiver: {
                            kind: "selection",
                            value: {
                                kind: "selection",
                                resultType: "entity",
                                source: {
                                    operation: "select.EventTarget",
                                    arguments: [],
                                    options: { eventTarget: "damager" },
                                },
                                filters: [],
                            },
                        },
                        arguments: {},
                    },
                ],
            },
        ],
    });

    assert.equal(low.templates[0].kind, "event");
    if (low.templates[0].kind === "event") {
        assert.equal(low.templates[0].block, "entity_event");
        assert.equal(low.templates[0].action, "EntityDmgEntity");
    }
    assert.deepEqual(low.templates[0].body, [
        {
            kind: "select_object",
            action: "EventTarget",
            arguments: [],
            tags: [
                {
                    id: "eventTarget",
                    option: "damager",
                    native: {
                        name: "Event Target",
                        option: "Damager",
                        slot: 26,
                    },
                },
            ],
        },
        {
            kind: "action",
            block: "entity_action",
            action: "Remove",
            target: "selection",
            arguments: [],
            tags: [],
        },
    ]);
});

test("lowers ordered selection source and filters", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "filtered",
            body: [{
                kind: "intrinsic",
                operation: "entity.remove",
                receiver: {
                    kind: "selection",
                    value: {
                        kind: "selection",
                        resultType: "entity",
                        source: { operation: "select.AllEntities", arguments: [] },
                        filters: [
                            { operation: "select.FilterRandom", arguments: [{ kind: "number", value: 5 }] },
                            {
                                operation: "select.FilterDistance",
                                arguments: [
                                    { kind: "location", x: 0, y: 64, z: 0 },
                                    { kind: "number", value: 2 },
                                ],
                                options: { compareMode: "farthest", ignoreYAxis: "true" },
                            },
                        ],
                    },
                },
                arguments: {},
            }],
        }],
    });

    assert.deepEqual(low.templates[0].body.map((statement) =>
        statement.kind === "select_object" ? statement.action : statement.kind === "action" ? statement.action : statement.kind
    ), ["AllEntities", "FilterRandom", "FilterDistance", "Remove"]);
    const distance = low.templates[0].body[2];
    assert.equal(distance.kind, "select_object");
    if (distance.kind === "select_object") {
        assert.deepEqual(distance.tags.map((tag) => tag.native.option), ["True", "Farthest"]);
    }
});

test("lowers current-player location through a shifted line variable", () => {
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "event",
            name: "join",
            event: "player.join",
            body: [
                {
                    kind: "declare_line_variable",
                    name: "__nocuft_line_destination",
                    valueType: "location",
                    initializer: {
                        kind: "game_value",
                        value: "target.location",
                        valueType: "location",
                        receiver: "current_player",
                    },
                },
                {
                    kind: "shift_line_location",
                    name: "__nocuft_line_destination",
                    operation: "axes",
                    arguments: [
                        { kind: "number", value: 0 },
                        { kind: "number", value: 50 },
                        { kind: "number", value: 0 },
                    ],
                },
                {
                    kind: "intrinsic",
                    operation: "player.teleport",
                    receiver: { kind: "current_player" },
                    arguments: {
                        new_position: {
                            kind: "line_variable",
                            name: "__nocuft_line_destination",
                            valueType: "location",
                        },
                    },
                },
            ],
        }],
    });
    assert.equal(low.templates[0].body.length, 3);
    const assignment = low.templates[0].body[0];
    assert.equal(assignment.kind, "action");
    if (assignment.kind === "action") {
        assert.equal(assignment.block, "set_var");
        assert.equal(assignment.action, "=");
        assert.deepEqual(assignment.arguments[1].values[0], {
            kind: "game_value",
            name: "Location",
            valueType: "location",
            target: "Default",
        });
    }
    const shift = low.templates[0].body[1];
    assert.equal(shift.kind, "action");
    if (shift.kind === "action") assert.equal(shift.action, "ShiftAllAxes");
});

test("lowers every line location mutation with defaults and native tags", () => {
    const location = { kind: "location" as const, x: 1, y: 2, z: 3 };
    const mutation = (
        operation: "axes" | "direction" | "axis" | "toward" | "coordinate" | "face",
        arguments_: import("@nocuft/dfir").HighExpression[],
        options?: Record<string, string>,
    ): import("@nocuft/dfir").HighLineLocationShift => ({
        kind: "shift_line_location",
        name: "destination",
        operation,
        arguments: arguments_,
        ...(options ? { options } : {}),
    });
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "locations",
            body: [
                mutation("axes", [
                    { kind: "number", value: 1 },
                    { kind: "number", value: 2 },
                    { kind: "number", value: 3 },
                ]),
                mutation("direction", []),
                mutation("axis", [{ kind: "number", value: 4 }], { axis: "y" }),
                mutation("toward", [location]),
                mutation("coordinate", [{ kind: "number", value: 90 }], { coordinate: "yaw" }),
                mutation("face", [location]),
            ],
        }],
    });
    const actions = low.templates[0].body;

    assert.deepEqual(actions.map((statement) => statement.kind === "action" ? statement.action : statement.kind), [
        "ShiftAllAxes",
        "ShiftAllDirections",
        "ShiftOnAxis",
        "ShiftToward",
        "SetCoord",
        "FaceLocation",
    ]);
    assert.equal(actions[1].kind, "action");
    if (actions[1].kind === "action") {
        assert.deepEqual(
            actions[1].arguments.slice(2).map((argument) => argument.values[0]),
            [
                { kind: "number", value: 0 },
                { kind: "number", value: 0 },
                { kind: "number", value: 0 },
            ],
        );
    }
    assert.equal(actions[2].kind, "action");
    if (actions[2].kind === "action") {
        assert.deepEqual(actions[2].tags.map((tag) => tag.native), [
            { name: "Coordinate", option: "Y", slot: 26 },
        ]);
    }
    assert.equal(actions[4].kind, "action");
    if (actions[4].kind === "action") {
        assert.deepEqual(actions[4].tags.map((tag) => tag.native), [
            { name: "Coordinate Type", option: "Plot coordinate", slot: 25 },
            { name: "Coordinate", option: "Yaw", slot: 26 },
        ]);
    }
    assert.equal(actions[5].kind, "action");
    if (actions[5].kind === "action") {
        assert.deepEqual(actions[5].tags.map((tag) => tag.native), [
            { name: "Face Direction", option: "Toward location", slot: 26 },
        ]);
    }
});

test("rejects malformed line location mutation IR", () => {
    const malformed = (
        operation: import("@nocuft/dfir").HighLineLocationShift["operation"],
        arguments_: import("@nocuft/dfir").HighExpression[],
        options?: Record<string, string>,
    ) => () => lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "invalid",
            body: [{
                kind: "shift_line_location",
                name: "destination",
                operation,
                arguments: arguments_,
                ...(options ? { options } : {}),
            }],
        }],
    });
    const number = { kind: "number" as const, value: 1 };
    const location = { kind: "location" as const, x: 1, y: 2, z: 3 };

    assert.throws(malformed("axes", [number]), /argument count/);
    assert.throws(malformed("axis", [number], { axis: "pitch" }), /axis/);
    assert.throws(malformed("coordinate", [number], { coordinate: "distance" }), /coordinate/);
    assert.throws(malformed("face", [location], { direction: "sideways" }), /face direction/);
    assert.throws(malformed("toward", [location], { axis: "x" }), /Invalid option/);
});

test("lowers plot game variable reads, writes, and clears", () => {
    const phase = {
        kind: "plot_variable" as const,
        name: "phase",
        scope: "unsaved" as const,
        valueType: "text" as const,
    };
    const low = lowerHighModule({
        kind: "module",
        templates: [{
            kind: "function",
            name: "state",
            body: [
                {
                    kind: "set_variable",
                    variable: phase,
                    value: { kind: "string", value: "lobby" },
                },
                { kind: "clear_variable", variable: phase },
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: {
                        kind: "selection",
                        value: {
                            kind: "selection",
                            resultType: "player",
                            source: { operation: "select.AllPlayers", arguments: [] },
                            filters: [],
                        },
                    },
                    arguments: { message_to_send: [phase] },
                },
            ],
        }],
    });

    const set = low.templates[0].body[0];
    assert.equal(set.kind, "action");
    if (set.kind === "action") {
        assert.deepEqual(set.arguments[0].values[0], {
            kind: "variable",
            name: "phase",
            scope: "unsaved",
            owner: "plot",
            valueType: "text",
        });
        assert.deepEqual(set.arguments[1].values[0], { kind: "text", value: "lobby" });
    }
    const clear = low.templates[0].body[1];
    assert.equal(clear.kind, "action");
    if (clear.kind === "action") assert.equal(clear.arguments.length, 1);
    const message = low.templates[0].body[3];
    assert.equal(message.kind, "action");
    if (message.kind === "action") {
        assert.equal(message.arguments[0].values[0].kind, "variable");
    }
});
