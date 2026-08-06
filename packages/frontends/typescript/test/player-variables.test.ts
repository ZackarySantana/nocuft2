import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { analyzeTypeScript } from "../analyze.js";

const fixture = (file: string) => fileURLToPath(
    new URL(`./fixtures/player-variables/${file}`, import.meta.url),
);

test("analyzes player variables, saved scope, filtering, and target values", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const body = module.templates[0].body;

    assert.equal(body[0].kind, "set_variable");
    if (body[0].kind === "set_variable") {
        assert.deepEqual(body[0].variable, {
            kind: "player_variable",
            name: "queued",
            scope: "unsaved",
            valueType: "boolean",
            receiver: "current_player",
        });
    }
    assert.equal(body[2].kind, "set_variable");
    if (body[2].kind === "set_variable") {
        assert.equal(body[2].variable.kind, "player_variable");
        assert.equal(body[2].variable.scope, "saved");
        assert.equal(body[2].value.kind, "arithmetic");
    }
    assert.equal(body[3].kind, "intrinsic");
    if (body[3].kind === "intrinsic" && body[3].receiver.kind === "selection") {
        assert.deepEqual(body[3].receiver.value.filters[0], {
            operation: "select.FilterCondition",
            arguments: [
                {
                    kind: "player_variable",
                    name: "queued",
                    scope: "unsaved",
                    valueType: "boolean",
                    receiver: "selection",
                },
                { kind: "boolean", value: true },
            ],
        });
    }
    assert.equal(body[4].kind, "intrinsic");
    if (body[4].kind === "intrinsic") {
        const values = body[4].arguments.message_to_send;
        assert.ok(Array.isArray(values));
        assert.deepEqual(values.slice(1), [
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
        ]);
    }
    assert.equal(body[6].kind, "set_variable");
    if (body[6].kind === "set_variable") {
        assert.equal(body[6].variable.kind, "plot_variable");
        assert.equal(body[6].variable.scope, "saved");
    }
});

test("rejects player variable clearAll until purge semantics are verified", () => {
    assert.throws(
        () => analyzeTypeScript({
            tsconfigPath: fixture("tsconfig.json"),
            entryFile: fixture("invalid-clear-all.ts"),
        }),
        /clearAll until native purge semantics are verified/,
    );
});
