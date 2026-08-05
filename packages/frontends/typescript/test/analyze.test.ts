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

function selection(
    resultType: "player" | "entity",
    operation: string,
    eventTarget?: string,
) {
    return {
        kind: "selection",
        value: {
            kind: "selection",
            resultType,
            source: {
                operation,
                arguments: [],
                ...(eventTarget ? { options: { eventTarget } } : {}),
            },
            filters: [],
        },
    };
}

test("analyzes hello into DFIR-High", () => {
    const module = analyzeTypeScript({
        tsconfigPath,
        entryFile,
    });

    assert.deepEqual(module, {
        kind: "module",
        templates: [
            {
                kind: "function",
                name: "hello",
                body: [
                    {
                        kind: "intrinsic",
                        operation: "player.send_message",
                        receiver: selection("player", "select.AllPlayers"),
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

    assert.deepEqual(module.templates[0].body[0], {
        kind: "intrinsic",
        operation: "player.send_message",
        receiver: selection("player", "select.AllPlayers"),
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

    const body = module.templates[0].body;
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

    assert.equal(module.templates[0].name, "customProject");
});

test("analyzes event registrations and the current event player", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("events", "tsconfig.json"),
        entryFile: fixturePath("events", "plot.ts"),
    });

    assert.deepEqual(module.templates, [
        {
            kind: "event",
            name: "boot",
            event: "plot.startup",
            body: [
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: selection("player", "select.AllPlayers"),
                    arguments: {
                        message_to_send: [
                            { kind: "string", value: "Arena initialized." },
                        ],
                    },
                },
            ],
        },
        {
            kind: "event",
            name: "join",
            event: "player.join",
            body: [
                {
                    kind: "intrinsic",
                    operation: "player.teleport",
                    receiver: { kind: "current_player" },
                    arguments: {
                        new_position: { kind: "location", x: 0, y: 65, z: 0 },
                    },
                },
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
        {
            kind: "event",
            name: "chat",
            event: "player.chat",
            body: [{ kind: "event_action", operation: "cancel", arguments: {} }],
        },
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
                        item: { kind: "item", id: "minecraft:mace" },
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
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: selection("player", "select.EventTarget", "victim"),
                    arguments: {
                        message_to_send: [
                            { kind: "string", value: "Damage:" },
                            {
                                kind: "event_field",
                                event: "player.playerDmgPlayer",
                                field: "damage",
                                valueType: "number",
                            },
                            { kind: "string", value: "Cause:" },
                            {
                                kind: "event_field",
                                event: "player.playerDmgPlayer",
                                field: "damageCause",
                                valueType: "text",
                            },
                            { kind: "string", value: "Raw:" },
                            {
                                kind: "event_field",
                                event: "player.playerDmgPlayer",
                                field: "rawDamage",
                                valueType: "number",
                            },
                        ],
                    },
                },
                {
                    kind: "intrinsic",
                    operation: "player.teleport",
                    receiver: selection("player", "select.EventTarget", "victim"),
                    arguments: {
                        new_position: { kind: "location", x: 0, y: 65, z: 0 },
                    },
                },
            ],
        },
        {
            kind: "event",
            name: "entityAttack",
            event: "entity.entityDmgEntity",
            body: [
                {
                    kind: "intrinsic",
                    operation: "entity.set_glowing",
                    receiver: selection("entity", "select.EventTarget", "default"),
                    arguments: {},
                },
                {
                    kind: "intrinsic",
                    operation: "entity.remove",
                    receiver: selection("entity", "select.EventTarget", "victim"),
                    arguments: {},
                },
                {
                    kind: "intrinsic",
                    operation: "entity.send_animation",
                    receiver: selection("entity", "select.EventTarget", "damager"),
                    arguments: {},
                },
            ],
        },
    ]);
});

test("analyzes an all-entity action", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("entities", "tsconfig.json"),
        entryFile: fixturePath("entities", "plot.ts"),
    });

    assert.deepEqual(module.templates, [
        {
            kind: "function",
            name: "removeEntities",
            body: [
                {
                    kind: "intrinsic",
                    operation: "entity.remove",
                    receiver: selection("entity", "select.AllEntities"),
                    arguments: {},
                },
            ],
        },
    ]);
});

test("analyzes ordinary game actions separately from player actions", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("game", "tsconfig.json"),
        entryFile: fixturePath("game", "plot.ts"),
    });
    const body = module.templates[0].body;

    assert.deepEqual(body[0], {
        kind: "intrinsic",
        operation: "game.mob_spawning",
        receiver: { kind: "game" },
        arguments: {},
        options: { mob_spawning: "disable" },
    });
    assert.equal(body[1].kind, "intrinsic");
    if (body[1].kind === "intrinsic") {
        assert.equal(body[1].operation, "player.set_allow_pvp");
        assert.deepEqual(body[1].options, { pvp: "disable" });
    }
});

test("analyzes named processes, starts, and control actions", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("processes", "tsconfig.json"),
        entryFile: fixturePath("processes", "plot.ts"),
    });

    assert.deepEqual(module.templates, [
        {
            kind: "process",
            name: "countdown",
            parameters: [
                { kind: "value", name: "message", type: "text" },
                { kind: "value", name: "delay", type: "number" },
            ],
            options: { is_hidden: "true" },
            body: [
                {
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
                },
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: selection("player", "select.AllPlayers"),
                    arguments: {
                        message_to_send: [{
                            kind: "parameter",
                            name: "message",
                            valueType: "text",
                        }],
                    },
                },
            ],
        },
        {
            kind: "event",
            name: "boot",
            event: "plot.startup",
            body: [
                {
                    kind: "start_process",
                    process: "countdown",
                    arguments: [
                        { kind: "string", value: "Ready" },
                        { kind: "number", value: 1 },
                    ],
                },
                {
                    kind: "start_process",
                    process: "countdown",
                    arguments: [
                        { kind: "string", value: "Begin" },
                        { kind: "number", value: 2 },
                    ],
                    options: {
                        target_mode: "with_no_targets",
                        local_variables: "dont_copy",
                    },
                },
            ],
        },
    ]);
});

test("analyzes selection sources and ordered filters", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("selectors", "tsconfig.json"),
        entryFile: fixturePath("selectors", "plot.ts"),
    });
    const body = module.templates[0].body;
    assert.equal(body.length, 8);
    assert.deepEqual(body.slice(0, 7).map((statement) => statement.receiver.value.source), [
        {
            operation: "select.RandomPlayer",
            arguments: [{ kind: "number", value: 2 }],
        },
        {
            operation: "select.PlayerName",
            arguments: [{ kind: "string", value: "Alice" }],
        },
        { operation: "select.LastEntity", arguments: [] },
        {
            operation: "select.EntityUUID",
            arguments: [
                { kind: "string", value: "uuid-1" },
                { kind: "string", value: "uuid-2" },
            ],
        },
        {
            operation: "select.EntityName",
            arguments: [{ kind: "string", value: "Display Name" }],
        },
        {
            operation: "select.EntityName",
            arguments: [{ kind: "string", value: "Styled Name" }],
            options: { ignoreFormatting: "false" },
        },
        { operation: "select.AllEntities", arguments: [] },
    ]);
    assert.deepEqual(body[6].receiver, {
        kind: "selection",
        value: {
            kind: "selection",
            resultType: "entity",
            source: { operation: "select.AllEntities", arguments: [] },
            filters: [
                {
                    operation: "select.FilterRandom",
                    arguments: [{ kind: "number", value: 5 }],
                },
                {
                    operation: "select.FilterDistance",
                    arguments: [
                        { kind: "location", x: 0, y: 64, z: 0 },
                        { kind: "number", value: 2 },
                    ],
                },
            ],
        },
    });
    assert.deepEqual(body[7].receiver.value.filters, [
        {
            operation: "select.FilterDistance",
            arguments: [{ kind: "location", x: 0, y: 64, z: 0 }],
            options: {
                ignoreYAxis: "true",
                compareMode: "farthest",
            },
        },
    ]);
});

test("analyzes current-player location and line location variables", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("line-location", "tsconfig.json"),
        entryFile: fixturePath("line-location", "plot.ts"),
    });
    const body = module.templates[0].body;
    assert.equal(body.length, 16);
    assert.deepEqual(body[1], {
        kind: "declare_line_variable",
        name: "__nocuft_line_destination",
        valueType: "location",
        initializer: {
            kind: "game_value",
            value: "target.location",
            valueType: "location",
            receiver: "current_player",
        },
    });
    assert.deepEqual(body[2], {
        kind: "shift_line_location",
        name: "__nocuft_line_destination",
        operation: "axes",
        arguments: [
            { kind: "number", value: 0 },
            { kind: "number", value: 50 },
            { kind: "number", value: 0 },
        ],
    });
    assert.deepEqual(
        body.slice(2, 11).map((statement) =>
            statement.kind === "shift_line_location"
                ? {
                      operation: statement.operation,
                      argumentCount: statement.arguments.length,
                      options: statement.options,
                  }
                : statement.kind,
        ),
        [
            { operation: "axes", argumentCount: 3, options: undefined },
            { operation: "direction", argumentCount: 3, options: undefined },
            { operation: "direction", argumentCount: 0, options: undefined },
            { operation: "axis", argumentCount: 1, options: { axis: "y" } },
            { operation: "toward", argumentCount: 2, options: undefined },
            { operation: "toward", argumentCount: 1, options: undefined },
            {
                operation: "coordinate",
                argumentCount: 1,
                options: { coordinate: "yaw" },
            },
            { operation: "face", argumentCount: 1, options: { direction: "away" } },
            { operation: "face", argumentCount: 1, options: undefined },
        ],
    );
    assert.deepEqual(body[13], {
        kind: "declare_line_variable",
        name: "__nocuft_line_enabled",
        valueType: "boolean",
        initializer: { kind: "boolean", value: true },
    });
    assert.deepEqual(body[14].arguments.message_to_send, [
        {
            kind: "line_variable",
            name: "__nocuft_line_message",
            valueType: "text",
        },
        {
            kind: "line_variable",
            name: "__nocuft_line_amount",
            valueType: "number",
        },
        {
            kind: "line_variable",
            name: "__nocuft_line_enabled",
            valueType: "boolean",
        },
    ]);
    assert.deepEqual(body[15].arguments.new_position, {
        kind: "line_variable",
        name: "__nocuft_line_destination",
        valueType: "location",
    });

    const attack = module.templates[1].body;
    assert.equal(attack[0].kind, "declare_line_variable");
    assert.equal(attack[0].name, "__nocuft_line_value");
    assert.equal(attack[1].kind, "if");
    if (attack[1].kind === "if") {
        assert.equal(attack[1].body[0].kind, "declare_line_variable");
        assert.equal(attack[1].body[0].name, "__nocuft_line_value_2");
    }
});

test("analyzes explicitly named plot game variables", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("plot-variables", "tsconfig.json"),
        entryFile: fixturePath("plot-variables", "plot.ts"),
    });
    const body = module.templates[0].body;

    assert.deepEqual(
        body.slice(0, 5).map((statement) => ({
            kind: statement.kind,
            variable:
                statement.kind === "set_variable" || statement.kind === "clear_variable"
                    ? statement.variable
                    : undefined,
        })),
        [
            {
                kind: "set_variable",
                variable: { kind: "plot_variable", name: "phase", scope: "unsaved", valueType: "text" },
            },
            {
                kind: "set_variable",
                variable: { kind: "plot_variable", name: "alive", scope: "unsaved", valueType: "number" },
            },
            {
                kind: "set_variable",
                variable: { kind: "plot_variable", name: "title", scope: "unsaved", valueType: "text" },
            },
            {
                kind: "set_variable",
                variable: { kind: "plot_variable", name: "enabled", scope: "unsaved", valueType: "boolean" },
            },
            {
                kind: "clear_variable",
                variable: { kind: "plot_variable", name: "alive", scope: "unsaved", valueType: "number" },
            },
        ],
    );
    assert.deepEqual(body[5].arguments.message_to_send, [
        { kind: "plot_variable", name: "phase", scope: "unsaved", valueType: "text" },
        { kind: "plot_variable", name: "alive", scope: "unsaved", valueType: "number" },
        { kind: "plot_variable", name: "title", scope: "unsaved", valueType: "text" },
        { kind: "plot_variable", name: "enabled", scope: "unsaved", valueType: "boolean" },
    ]);
});

test("rejects invalid line location mutations", () => {
    for (const [file, message] of [
        ["invalid-axis.ts", /line location axis/],
        ["invalid-coordinate.ts", /line location coordinate/],
        ["invalid-direction.ts", /face direction/],
        ["invalid-count.ts", /line location mutation/],
        ["invalid-type.ts", /number expression/],
    ] as const) {
        assert.throws(
            () => analyzeTypeScript({
                tsconfigPath: fixturePath("line-location", "tsconfig.json"),
                entryFile: fixturePath("line-location", file),
            }),
            message,
        );
    }
});

test("rejects invalid plot game variables", () => {
    for (const [file, message] of [
        ["invalid-enum.ts", /declared enum value/],
        ["invalid-name.ts", /non-empty plot variable name/],
    ] as const) {
        assert.throws(
            () => analyzeTypeScript({
                tsconfigPath: fixturePath("plot-variables", "tsconfig.json"),
                entryFile: fixturePath("plot-variables", file),
            }),
            message,
        );
    }
});

test("uses one ordered contract for local functions and every supported value type", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixturePath("functions", "tsconfig.json"),
        entryFile: fixturePath("functions", "plot.ts"),
    });

    assert.deepEqual(module.templates[0].parameters, [
        { kind: "value", name: "message", type: "text" },
        { kind: "value", name: "component", type: "component" },
        { kind: "target", name: "player", target: "player" },
        { kind: "value", name: "amount", type: "number" },
        { kind: "value", name: "enabled", type: "boolean" },
        { kind: "value", name: "destination", type: "location" },
        { kind: "value", name: "held", type: "item" },
        { kind: "value", name: "cue", type: "sound" },
        { kind: "value", name: "payload", type: "any" },
    ]);
    assert.equal(module.templates[1].body[0].kind, "call_function");
    if (module.templates[1].body[0].kind === "call_function") {
        assert.equal(module.templates[1].body[0].arguments.length, 8);
        assert.deepEqual(module.templates[1].body[0].receiver, selection("player", "select.AllPlayers"));
    }
});
