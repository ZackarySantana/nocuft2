import assert from "node:assert/strict";
import test from "node:test";
import type {
    HighExpression,
    HighModule,
    HighSelectionExpression,
    HighSelectionSnapshotExpression,
    HighStatement,
    LowStatement,
} from "@nocuft/dfir";
import { lowerHighModule } from "../lower.js";

const textList = { kind: "list" as const, elementType: "text" as const };

const snapshot = (name: string, cardinality: "many" | "at_most_one" = "many"): HighSelectionSnapshotExpression => ({
    kind: "selection_snapshot",
    name,
    sizeName: `${name}_count`,
    resultType: "player",
    cardinality,
});

const allPlayers = (): HighSelectionExpression => ({
    kind: "selection",
    resultType: "player",
    source: { operation: "select.AllPlayers", arguments: [] },
    filters: [],
});

const fromSnapshot = (name: string): HighSelectionExpression => ({
    kind: "selection",
    resultType: "player",
    source: snapshot(name),
    filters: [],
});

const declare = (name: string, cardinality: "many" | "at_most_one" = "many"): HighStatement => ({
    kind: "declare_selection_snapshot",
    name,
    sizeName: `${name}_count`,
    resultType: "player",
    cardinality,
    initializer: allPlayers(),
});

const message = (receiver: HighSelectionExpression, values: HighExpression[] = [{ kind: "string", value: "hi" }]): HighStatement => ({
    kind: "intrinsic",
    operation: "player.send_message",
    receiver: { kind: "selection", value: receiver },
    arguments: { message_to_send: values },
});

function lower(body: HighStatement[]): LowStatement[] {
    const module: HighModule = {
        kind: "module",
        templates: [{ kind: "event", name: "flow", event: "player.join", body }],
    };
    return lowerHighModule(module).templates[0].body;
}

function selections(statements: readonly LowStatement[]): string[] {
    return statements.flatMap((statement) => {
        const own = statement.kind === "select_object" ? [statement.action] : [];
        if (statement.kind === "if") {
            return [...own, ...selections(statement.body), ...selections(statement.elseBody ?? [])];
        }
        if (statement.kind === "repeat") return [...own, ...selections(statement.body)];
        return own;
    });
}

test("stores selection snapshot UUIDs in a line list", () => {
    const body = lower([declare("team")]);
    assert.equal(body[0].kind, "select_object");
    assert.equal(body[0].kind === "select_object" && body[0].action, "AllPlayers");
    assert.equal(body[1].kind, "action");
    if (body[1].kind !== "action") return;
    assert.deepEqual(body[1].arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "team", scope: "line", valueType: textList },
        { kind: "game_value", name: "Selection Target UUIDs", valueType: textList, target: "" },
    ]);
    assert.equal(body[2].kind, "action");
    if (body[2].kind !== "action") return;
    assert.deepEqual(body[2].arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "team_count", scope: "line", valueType: "number" },
        { kind: "game_value", name: "Selection Size", valueType: "number", target: "" },
    ]);
});

test("reads named snapshot count from its sidecar without selecting", () => {
    const count: HighExpression = { kind: "selection_count", selection: fromSnapshot("team") };
    const body = lower([
        declare("team"),
        message(allPlayers()),
        message(allPlayers(), [count]),
    ]);
    assert.equal(selections(body).includes("PlayerName"), false);
    const action = body.at(-1);
    assert.equal(action?.kind, "action");
    if (action?.kind !== "action") return;
    assert.deepEqual(action.arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "team_count", scope: "line", valueType: "number" },
    ]);
});

test("materializes inline count before restoring the final receiver", () => {
    const count: HighExpression = { kind: "selection_count", selection: allPlayers() };
    const body = lower([
        declare("targets"),
        message(fromSnapshot("targets"), [count]),
    ]);
    const final = body.slice(-4);
    assert.deepEqual(final.map((statement) =>
        statement.kind === "select_object" ? statement.action :
            statement.kind === "action" ? statement.action : statement.kind
    ), ["AllPlayers", "=", "PlayerName", "SendMessage"]);
    const assignment = final[1];
    assert.equal(assignment.kind, "action");
    if (assignment.kind !== "action") return;
    assert.deepEqual(assignment.arguments.flatMap((argument) => argument.values)[1], {
        kind: "game_value",
        name: "Selection Size",
        valueType: "number",
        target: "",
    });
});

test("counts a derived snapshot without rerunning its original query", () => {
    const derived: HighSelectionExpression = {
        ...fromSnapshot("team"),
        filters: [{
            operation: "select.FilterRandom",
            arguments: [{ kind: "number", value: 1 }],
        }],
    };
    const count: HighExpression = { kind: "selection_count", selection: derived };
    const body = lower([
        declare("team"),
        message(fromSnapshot("team"), [count]),
    ]);
    assert.deepEqual(selections(body), ["AllPlayers", "FilterRandom", "PlayerName"]);
    assert.equal(selections(body).filter((action) => action === "AllPlayers").length, 1);
    const sizeReads = body.filter((statement) =>
        statement.kind === "action" && statement.arguments.some((argument) =>
            argument.values.some((value) => value.kind === "game_value" && value.name === "Selection Size")
        )
    );
    assert.equal(sizeReads.length, 2);
});

test("reuses a snapshot for consecutive actions and reapplies it after an inline selector", () => {
    const body = lower([
        declare("team"),
        message(fromSnapshot("team")),
        message(fromSnapshot("team")),
        message(allPlayers()),
        message(fromSnapshot("team")),
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(body), ["AllPlayers", "AllPlayers", "PlayerName"]);
});

test("rehydrates snapshots directly because an empty UUID list clears selection", () => {
    const body = lower([
        declare("team"),
        message(allPlayers()),
        message(fromSnapshot("team")),
    ]);
    const restore = body.find((statement) =>
        statement.kind === "select_object" && statement.action === "PlayerName"
    );
    assert.ok(restore && restore.kind === "select_object");
    assert.deepEqual(restore.arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "team", scope: "line", valueType: textList },
    ]);
    assert.equal(body.some((statement) => statement.kind === "if"), false);
});

test("rehydrates a named snapshot after a function may replace the selection", () => {
    const body = lower([
        declare("team"),
        message(fromSnapshot("team")),
        { kind: "call_function", function: "helper", arguments: [] },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(body), ["AllPlayers", "PlayerName"]);
    const call = body.findIndex((statement) => statement.kind === "call_function");
    const restore = body.findIndex((statement) =>
        statement.kind === "select_object" && statement.action === "PlayerName");
    assert.ok(call >= 0 && restore > call);
});

test("joins identical snapshots and invalidates differing reachable branches", () => {
    const condition = { kind: "boolean_condition" as const, value: { kind: "boolean" as const, value: true } };
    const same = lower([
        declare("team"),
        { kind: "if", condition, body: [message(fromSnapshot("team"))], elseBody: [message(fromSnapshot("team"))] },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(same), ["AllPlayers"]);

    const differing = lower([
        declare("team"),
        { kind: "if", condition, body: [message(allPlayers())], elseBody: [message(fromSnapshot("team"))] },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(differing), ["AllPlayers", "AllPlayers", "PlayerName"]);

    const noElse = lower([
        declare("team"),
        { kind: "if", condition, body: [message(allPlayers())] },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(noElse), ["AllPlayers", "AllPlayers", "PlayerName"]);

    const abrupt = lower([
        declare("team"),
        {
            kind: "if",
            condition,
            body: [{ kind: "return", context: "event" }, message(allPlayers())],
            elseBody: [message(fromSnapshot("team"))],
        },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(abrupt), ["AllPlayers"]);
});

test("reuses a snapshot inside a loop and invalidates it at loop exit", () => {
    const body = lower([
        declare("team"),
        {
            kind: "loop",
            form: "while",
            condition: { kind: "boolean_condition", value: { kind: "boolean", value: true } },
            body: [message(fromSnapshot("team")), message(fromSnapshot("team"))],
        },
        message(fromSnapshot("team")),
    ]);
    assert.deepEqual(selections(body), ["AllPlayers", "PlayerName", "PlayerName"]);
});

test("materializes snapshot arguments before establishing the final receiver", () => {
    const name: HighExpression = {
        kind: "game_value",
        value: "target.name",
        valueType: "component",
        receiver: snapshot("argumentTargets"),
    };
    const body = lower([
        declare("argumentTargets"),
        declare("actionTargets"),
        message(allPlayers()),
        message(fromSnapshot("actionTargets"), [name]),
    ]);
    const final = body.slice(-4);
    assert.deepEqual(final.map((statement) => statement.kind === "select_object" ? statement.action : statement.kind === "action" ? statement.action : statement.kind), [
        "PlayerName",
        "=",
        "PlayerName",
        "SendMessage",
    ]);
});

test("preserves list element prelude order and selection state across chunks", () => {
    const textList = { kind: "list" as const, elementType: "text" as const };
    const selectedUuid = (name: string): HighExpression => ({
        kind: "game_value",
        value: "target.uuid",
        valueType: "text",
        receiver: snapshot(name),
    });
    const elements: HighExpression[] = [
        selectedUuid("team"),
        ...Array.from({ length: 25 }, (_, index) => ({ kind: "string" as const, value: String(index) })),
        selectedUuid("other"),
    ];
    const body = lower([
        declare("team"),
        declare("other"),
        message(allPlayers()),
        {
            kind: "declare_line_variable",
            name: "values",
            valueType: textList,
            initializer: { kind: "list", valueType: textList, elements },
        },
        message(fromSnapshot("team")),
    ]);

    assert.deepEqual(body.slice(-8).map((statement) =>
        statement.kind === "select_object" ? statement.action :
            statement.kind === "action" ? statement.action : statement.kind
    ), ["PlayerName", "=", "PlayerName", "=", "CreateList", "AppendValue", "PlayerName", "SendMessage"]);
});

test("materializes selected Name and UUID into typed temporaries", () => {
    const values: HighExpression[] = [
        { kind: "game_value", value: "target.name", valueType: "component", receiver: snapshot("team") },
        { kind: "game_value", value: "target.uuid", valueType: "text", receiver: snapshot("team") },
    ];
    const body = lower([declare("team"), message(allPlayers()), message(fromSnapshot("team"), values)]);
    const assignments = body.filter((statement) => statement.kind === "action" && statement.block === "set_var");
    const reads = assignments.slice(-2).map((statement) => {
        assert.equal(statement.kind, "action");
        return statement.arguments.flatMap((argument) => argument.values);
    });
    assert.deepEqual(reads.map((read) => [read[0].kind === "variable" && read[0].valueType, read[1]]), [
        ["component", { kind: "game_value", name: "Name ", valueType: "component", target: "Selection" }],
        ["text", { kind: "game_value", name: "UUID", valueType: "text", target: "Selection" }],
    ]);
    assert.equal(selections(body).filter((action) => action === "PlayerName").length, 1);
});

test("materializes selected recursive inventory menu items structurally", () => {
    const items = { kind: "list" as const, elementType: "item" as const };
    const value: HighExpression = {
        kind: "game_value",
        value: "target.inventory_menu_items",
        valueType: items,
        receiver: snapshot("chosen", "at_most_one"),
    };
    const body = lower([declare("chosen", "at_most_one"), message(allPlayers(), [value])]);
    const assignment = body.find((statement) => statement.kind === "action" &&
        statement.block === "set_var" && statement.arguments.some((argument) =>
            argument.values.some((candidate) => candidate.kind === "game_value" && candidate.name === "Inventory Menu Items")));
    assert.ok(assignment);
    if (assignment.kind !== "action") return;
    assert.deepEqual(assignment.arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: items },
        { kind: "game_value", name: "Inventory Menu Items", valueType: items, target: "Selection" },
    ]);
});

test("materializes a selected item before changing the action selection", () => {
    const held: HighExpression = {
        kind: "game_value",
        value: "target.main_hand_item",
        valueType: "item",
        receiver: snapshot("team"),
    };
    const body = lower([
        declare("team"),
        message(allPlayers()),
        message(allPlayers(), [held]),
    ]);
    const final = body.slice(-4);
    assert.deepEqual(final.map((statement) =>
        statement.kind === "select_object"
            ? statement.action
            : statement.kind === "action"
              ? statement.action
              : statement.kind
    ), ["PlayerName", "=", "AllPlayers", "SendMessage"]);
    const assignment = final[1];
    assert.equal(assignment.kind, "action");
    if (assignment.kind !== "action") return;
    assert.deepEqual(assignment.arguments.flatMap((argument) => argument.values), [
        { kind: "variable", name: "__nocuft_tmp_1", scope: "line", valueType: "item" },
        { kind: "game_value", name: "Main Hand Item", valueType: "item", target: "Selection" },
    ]);
});
