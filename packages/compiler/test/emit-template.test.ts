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

test("emits DiamondFire process and start-process blocks", () => {
    const emitted = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "process",
                name: "countdown",
                block: "process",
                action: "dynamic",
                parameters: [{ kind: "value", name: "delay", type: "number" }],
                tags: [{
                    id: "is_hidden",
                    option: "false",
                    native: { name: "Is Hidden", option: "False", slot: 26 },
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
            },
            {
                kind: "event",
                name: "boot",
                block: "game_event",
                action: "PlotStartup",
                body: [{
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
                            option: "copy",
                            native: { name: "Local Variables", option: "Copy", slot: 25 },
                        },
                    ],
                }],
            },
        ],
    });

    assert.equal(emitted[0].kind, "process");
    assert.deepEqual(emitted[0].template.blocks[0], {
        id: "block",
        block: "process",
        data: "countdown",
        args: { items: [
            {
                item: {
                    id: "pn_el",
                    data: { name: "delay", optional: false, plural: false, type: "num" },
                },
                slot: 0,
            },
            {
                item: {
                    id: "bl_tag",
                    data: {
                        tag: "Is Hidden",
                        option: "False",
                        block: "process",
                        action: "dynamic",
                    },
                },
                slot: 26,
            },
        ] },
    });
    assert.deepEqual(emitted[1].template.blocks[1], {
        id: "block",
        block: "start_process",
        data: "countdown",
        args: { items: [
            { item: { id: "num", data: { name: "2" } }, slot: 0 },
            {
                item: {
                    id: "bl_tag",
                    data: {
                        tag: "Local Variables",
                        option: "Copy",
                        block: "start_process",
                        action: "dynamic",
                    },
                },
                slot: 25,
            },
            {
                item: {
                    id: "bl_tag",
                    data: {
                        tag: "Target Mode",
                        option: "With no targets",
                        block: "start_process",
                        action: "dynamic",
                    },
                },
                slot: 26,
            },
        ] },
    });
});

test("emits every value parameter type and omits the ordered player target", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [{
            kind: "function",
            name: "completeContract",
            parameters: [
                { kind: "value", name: "message", type: "text" },
                { kind: "value", name: "amount", type: "number" },
                { kind: "target", name: "player", target: "player" },
                { kind: "value", name: "enabled", type: "boolean" },
                { kind: "value", name: "component", type: "component" },
                { kind: "value", name: "destination", type: "location" },
                { kind: "value", name: "held", type: "item" },
                { kind: "value", name: "cue", type: "sound" },
                { kind: "value", name: "payload", type: "any" },
            ],
            body: [],
        }],
    });

    const parameters = emitted.template.blocks[0].args.items.slice(0, 8);
    assert.deepEqual(parameters.map((entry) => entry.slot), [0, 1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual(parameters.map((entry) => entry.item.data.name), [
        "message", "amount", "enabled", "component", "destination", "held", "cue", "payload",
    ]);
    assert.deepEqual(parameters.map((entry) => entry.item.data.type), [
        "txt", "num", "num", "comp", "loc", "item", "snd", "any",
    ]);
});

test("emits DiamondFire game and player event templates", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "boot",
                block: "game_event",
                action: "PlotStartup",
                body: [],
            },
            {
                kind: "event",
                name: "join",
                block: "event",
                action: "Join",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "Teleport",
                        target: "current_player",
                        arguments: [],
                        tags: [],
                    },
                ],
            },
        ],
    };

    const emitted = emitTemplates(low);
    assert.equal(emitted[0].name, "boot");
    assert.deepEqual(emitted[0].template.blocks, [
        {
            id: "block",
            block: "game_event",
            action: "PlotStartup",
            args: { items: [] },
        },
    ]);
    assert.equal(emitted[1].name, "join");
    assert.deepEqual(emitted[1].template.blocks, [
        {
            id: "block",
            block: "event",
            action: "Join",
            args: { items: [] },
        },
        {
            id: "block",
            block: "player_action",
            action: "Teleport",
            args: { items: [] },
        },
    ]);
});

test("emits event victim selection", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                block: "event",
                action: "PlayerDmgPlayer",
                body: [
                    {
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
                    },
                    {
                        kind: "action",
                        block: "player_action",
                        action: "Teleport",
                        target: "selection",
                        arguments: [],
                        tags: [],
                    },
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks.slice(1), [
        {
            id: "block",
            block: "select_obj",
            action: "EventTarget",
            args: {
                items: [
                    {
                        item: {
                            id: "bl_tag",
                            data: {
                                tag: "Event Target",
                                option: "Victim",
                                block: "select_obj",
                                action: "EventTarget",
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
            action: "Teleport",
            args: { items: [] },
            target: "Selection",
        },
    ]);
});

test("emits native event game values", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                block: "event",
                action: "PlayerDmgPlayer",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "SendMessage",
                        target: "current_player",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: [
                                    { kind: "text", value: "Damage:" },
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
                                ],
                            },
                        ],
                        tags: [],
                    },
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks[1].args.items, [
        {
            item: { id: "txt", data: { name: "Damage:" } },
            slot: 0,
        },
        {
            item: {
                id: "g_val",
                data: { type: "Event Damage", target: "" },
            },
            slot: 1,
        },
        {
            item: {
                id: "g_val",
                data: { type: "Damage Event Cause", target: "" },
            },
            slot: 2,
        },
    ]);
});

test("emits a targeted main hand item game value", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "join",
                block: "event",
                action: "Join",
                body: [
                    {
                        kind: "action",
                        block: "player_action",
                        action: "SendMessage",
                        target: "current_player",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: [
                                    {
                                        kind: "game_value",
                                        name: "Main Hand Item",
                                        valueType: "item",
                                        target: "Default",
                                    },
                                ],
                            },
                        ],
                        tags: [],
                    },
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks[1].args.items, [
        {
            item: {
                id: "g_val",
                data: { type: "Main Hand Item", target: "Default" },
            },
            slot: 0,
        },
    ]);
});

test("emits an event mutator as a targetless game action", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                block: "event",
                action: "PlayerDmgPlayer",
                body: [
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
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks[1], {
        id: "block",
        block: "game_action",
        action: "SetEventDamage",
        args: {
            items: [
                {
                    item: { id: "num", data: { name: "999" } },
                    slot: 0,
                },
            ],
        },
    });
});

test("emits a bracketed main-hand item condition", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "attack",
                block: "event",
                action: "PlayerDmgPlayer",
                body: [
                    {
                        kind: "if",
                        block: "if_player",
                        action: "IsHolding",
                        target: "current_player",
                        arguments: [
                            {
                                index: 0,
                                layout: "plural",
                                minimumLength: 0,
                                values: [
                                    { kind: "item", id: "minecraft:mace" },
                                ],
                            },
                        ],
                        tags: [
                            {
                                id: "hand_slot",
                                option: "main_hand",
                                native: {
                                    name: "Hand Slot",
                                    option: "Main hand",
                                    slot: 26,
                                },
                            },
                        ],
                        body: [
                            {
                                kind: "action",
                                block: "game_action",
                                action: "SetEventDamage",
                                arguments: [],
                                tags: [],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    assert.deepEqual(
        emitted.template.blocks.slice(1).map((block) => ({
            block: block.block,
            action: block.action,
            direct: block.direct,
        })),
        [
            { block: "if_player", action: "IsHolding", direct: undefined },
            { block: "bracket", action: undefined, direct: "open" },
            {
                block: "game_action",
                action: "SetEventDamage",
                direct: undefined,
            },
            { block: "bracket", action: undefined, direct: "close" },
        ],
    );
});

test("emits all-entity selection", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "removeEntities",
                body: [
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
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks.slice(1), [
        {
            id: "block",
            block: "select_obj",
            action: "AllEntities",
            args: { items: [] },
        },
        {
            id: "block",
            block: "entity_action",
            action: "Remove",
            args: { items: [] },
            target: "Selection",
        },
    ]);
});

test("emits a targetless game action", () => {
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "configureGame",
                body: [
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
                ],
            },
        ],
    });

    assert.deepEqual(emitted.template.blocks[1], {
        id: "block",
        block: "game_action",
        action: "MobSpawning",
        args: {
            items: [
                {
                    item: {
                        id: "bl_tag",
                        data: {
                            tag: "Mob Spawning",
                            option: "Disable",
                            block: "game_action",
                            action: "MobSpawning",
                        },
                    },
                    slot: 26,
                },
            ],
        },
    });
});

test("emits every DiamondFire event entity role", () => {
    const roles = [
        ["default", "Default"],
        ["victim", "Victim"],
        ["damager", "Damager"],
        ["killer", "Killer"],
        ["shooter", "Shooter"],
        ["projectile", "Projectile"],
    ] as const;
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [
            {
                kind: "event",
                name: "roles",
                block: "entity_event",
                action: "EntityDmgEntity",
                body: roles.map(([role, option]) => ({
                    kind: "select_object" as const,
                    action: "EventTarget",
                    arguments: [],
                    tags: [
                        {
                            id: "eventTarget",
                            option: role,
                            native: {
                                name: "Event Target",
                                option,
                                slot: 26,
                            },
                        },
                    ],
                })),
            },
        ],
    });

    assert.deepEqual(
        emitted.template.blocks.slice(1).map((block) => ({
            block: block.block,
            action: block.action,
            option: block.args.items[0]?.item.data.option,
        })),
        roles.map(([, option]) => ({
            block: "select_obj",
            action: "EventTarget",
            option,
        })),
    );
});

test("emits line location assignment and upward shift", () => {
    const variable = {
        kind: "variable" as const,
        name: "__nocuft_line_destination",
        scope: "line" as const,
        valueType: "location" as const,
    };
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [{
            kind: "event",
            name: "join",
            block: "event",
            action: "Join",
            body: [
                {
                    kind: "action",
                    block: "set_var",
                    action: "=",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        {
                            index: 1,
                            layout: "single",
                            minimumLength: 1,
                            values: [{ kind: "game_value", name: "Location", valueType: "location", target: "Default" }],
                        },
                    ],
                    tags: [],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "ShiftAllDirections",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 2, layout: "single", minimumLength: 1, values: [{ kind: "number", value: 0 }] },
                        { index: 3, layout: "single", minimumLength: 1, values: [{ kind: "number", value: 50 }] },
                        { index: 4, layout: "single", minimumLength: 1, values: [{ kind: "number", value: 0 }] },
                    ],
                    tags: [],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "ShiftAllAxes",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "ShiftOnAxis",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [{
                        id: "axis",
                        option: "y",
                        native: { name: "Coordinate", option: "Y", slot: 26 },
                    }],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "ShiftToward",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "SetCoord",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [
                        {
                            id: "coordinate_type",
                            option: "plot",
                            native: { name: "Coordinate Type", option: "Plot coordinate", slot: 25 },
                        },
                        {
                            id: "coordinate",
                            option: "yaw",
                            native: { name: "Coordinate", option: "Yaw", slot: 26 },
                        },
                    ],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "FaceLocation",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [{
                        id: "direction",
                        option: "toward",
                        native: { name: "Face Direction", option: "Toward location", slot: 26 },
                    }],
                },
            ],
        }],
    });
    assert.deepEqual(emitted.template.blocks[1].args.items.map((item) => item.item), [
        { id: "var", data: { name: "__nocuft_line_destination", scope: "line" } },
        { id: "g_val", data: { type: "Location", target: "Default" } },
    ]);
    assert.equal(emitted.template.blocks[2].action, "ShiftAllDirections");
    assert.deepEqual(
        emitted.template.blocks.slice(2).map((block) => block.action),
        [
            "ShiftAllDirections",
            "ShiftAllAxes",
            "ShiftOnAxis",
            "ShiftToward",
            "SetCoord",
            "FaceLocation",
        ],
    );
    assert.deepEqual(
        emitted.template.blocks[4].args.items.find((item) => item.slot === 26)?.item.data,
        { tag: "Coordinate", option: "Y", block: "set_var", action: "ShiftOnAxis" },
    );
    assert.deepEqual(
        emitted.template.blocks[6].args.items.slice(-2).map((item) => item.item.data.option),
        ["Plot coordinate", "Yaw"],
    );
});

test("emits explicit plot variable scopes and a single-input clear", () => {
    const variable = {
        kind: "variable" as const,
        name: "phase",
        scope: "unsaved" as const,
        valueType: "text" as const,
    };
    const [emitted] = emitTemplates({
        kind: "module",
        templates: [{
            kind: "function",
            name: "state",
            body: [
                {
                    kind: "action",
                    block: "set_var",
                    action: "=",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                        {
                            index: 1,
                            layout: "single",
                            minimumLength: 1,
                            values: [{ kind: "text", value: "lobby" }],
                        },
                    ],
                    tags: [],
                },
                {
                    kind: "action",
                    block: "set_var",
                    action: "=",
                    arguments: [
                        { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                    ],
                    tags: [],
                },
            ],
        }],
    });

    assert.deepEqual(emitted.template.blocks[1].args.items, [
        { item: { id: "var", data: { name: "phase", scope: "unsaved" } }, slot: 0 },
        { item: { id: "txt", data: { name: "lobby" } }, slot: 1 },
    ]);
    assert.deepEqual(emitted.template.blocks[2].args.items, [
        { item: { id: "var", data: { name: "phase", scope: "unsaved" } }, slot: 0 },
    ]);
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
