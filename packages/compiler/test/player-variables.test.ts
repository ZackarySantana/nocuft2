import assert from "node:assert/strict";
import test from "node:test";
import type { HighModule } from "@nocuft/dfir";
import { emitTemplates } from "../emit-template.js";
import { lowerHighModule } from "../lower.js";

const queued = {
    kind: "player_variable" as const,
    name: "queued",
    scope: "unsaved" as const,
    valueType: "boolean" as const,
    receiver: "current_player" as const,
};

function playerVariableModule(): HighModule {
    return {
        kind: "module",
        templates: [{
            kind: "event",
            name: "join",
            event: "player.join",
            body: [
                {
                    kind: "set_variable",
                    variable: queued,
                    value: { kind: "boolean", value: true },
                },
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: {
                        kind: "selection",
                        value: {
                            kind: "selection",
                            resultType: "player",
                            source: { operation: "select.AllPlayers", arguments: [] },
                            filters: [{
                                operation: "select.FilterCondition",
                                arguments: [
                                    { ...queued, receiver: "selection" },
                                    { kind: "boolean", value: true },
                                ],
                            }],
                        },
                    },
                    arguments: { message_to_send: [{ kind: "string", value: "Queued" }] },
                },
                {
                    kind: "intrinsic",
                    operation: "player.send_message",
                    receiver: { kind: "current_player" },
                    arguments: {
                        message_to_send: [
                            queued,
                            {
                                kind: "game_value",
                                value: "target.name",
                                valueType: "component",
                                receiver: "current_player",
                            },
                            {
                                kind: "game_value",
                                value: "target.uuid",
                                valueType: "text",
                                receiver: "current_player",
                            },
                        ],
                    },
                },
                { kind: "clear_variable", variable: queued },
            ],
        }],
    };
}

test("lowers player variables and FilterCondition through generated metadata", () => {
    const low = lowerHighModule(playerVariableModule());
    const body = low.templates[0].body;

    assert.equal(body[0].kind, "action");
    if (body[0].kind === "action") {
        assert.deepEqual(body[0].arguments[0].values[0], {
            kind: "variable",
            name: "queued",
            scope: "unsaved",
            owner: "player",
            valueType: "boolean",
        });
    }
    assert.equal(body[2].kind, "select_object");
    if (body[2].kind === "select_object") {
        assert.equal(body[2].action, "FilterCondition");
        assert.equal(body[2].subAction, "=");
        assert.deepEqual(body[2].arguments.map((argument) => argument.values[0]), [
            {
                kind: "variable",
                name: "queued",
                scope: "unsaved",
                owner: "player",
                valueType: "boolean",
            },
            { kind: "number", value: 1 },
        ]);
    }
    assert.equal(body[4].kind, "action");
    if (body[4].kind === "action") {
        assert.equal(body[4].block, "set_var");
        assert.equal(body[4].arguments[1].values[0].kind, "variable");
    }
    assert.equal(body[5].kind, "action");
    if (body[5].kind === "action") {
        const values = body[5].arguments[0].values;
        assert.deepEqual(values.slice(1), [
            { kind: "game_value", name: "Name ", valueType: "component", target: "Default" },
            { kind: "game_value", name: "UUID", valueType: "text", target: "Default" },
        ]);
    }
    assert.equal(body[6].kind, "action");
    if (body[6].kind === "action") assert.equal(body[6].arguments.length, 1);
});

test("emits one native conditional-selection block with a player variable", () => {
    const [emitted] = emitTemplates(lowerHighModule(playerVariableModule()));
    const condition = emitted.template.blocks.find(
        (block) => block.block === "select_obj" && block.action === "FilterCondition",
    );

    assert.ok(condition);
    assert.equal(condition.subAction, "=");
    assert.deepEqual(condition.args.items.slice(0, 2), [
        {
            item: { id: "var", data: { name: "%uuid queued", scope: "unsaved" } },
            slot: 0,
        },
        { item: { id: "num", data: { name: "1" } }, slot: 1 },
    ]);
    assert.equal(
        emitted.template.blocks.some((block) => block.block === "if_var"),
        false,
    );
});
