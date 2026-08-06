import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { analyzeTypeScript, analyzeTypeScriptProject } from "../analyze.js";

const fixture = (file: string) => fileURLToPath(
    new URL(`./fixtures/selection-snapshots/${file}`, import.meta.url),
);

test("analyzes eager snapshots, aliases, cardinality, and selected values", () => {
    const analysis = analyzeTypeScriptProject({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const module = analysis.module;
    assert.equal(module.templates.some((template) => template.name.startsWith("__nocuft_one_")), false);
    assert.deepEqual(
        analysis.synthesizedTemplateNames,
        module.templates
            .filter((template) => template.name.startsWith("__nocuft_set_player_variable_")
                || template.name.startsWith("__nocuft_clear_player_variable_"))
            .map(({ name }) => name),
    );

    const choose = module.templates.find((template) => template.name === "choose");
    assert.ok(choose);
    const declarations = choose.body.filter((statement) => statement.kind === "declare_selection_snapshot");
    assert.deepEqual(declarations.map((statement) => [statement.name, statement.cardinality]), [
        ["__nocuft_selection_selected", "many"],
        ["__nocuft_selection_chosen", "at_most_one"],
        ["__nocuft_selection_second", "at_most_one"],
    ]);
    assert.equal(declarations[1].initializer.source.kind, "selection_snapshot");
    assert.deepEqual(declarations[1].initializer.filters.map((filter) => filter.operation), [
        "select.FilterRandom",
    ]);

    const calls = choose.body.filter((statement) => statement.kind === "call_function");
    assert.ok(calls.some((statement) => statement.function.startsWith("__nocuft_set_player_variable_")));
    assert.ok(calls.some((statement) => statement.function.startsWith("__nocuft_clear_player_variable_")));
    const broadcast = calls.find((statement) => statement.function === "broadcast");
    assert.ok(broadcast && broadcast.arguments[0].kind === "string_template");
    if (!broadcast || broadcast.arguments[0].kind !== "string_template") return;
    const selectedValues = broadcast.arguments[0].parts.filter((part) => part.kind === "game_value");
    assert.deepEqual(selectedValues.map((value) => [value.value, typeof value.receiver === "string" ? value.receiver : value.receiver.name]), [
        ["target.name", "__nocuft_selection_chosen"],
        ["target.uuid", "__nocuft_selection_chosen"],
    ]);
});

test("supports snapshots in branches, loops, events, and processes", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const scoped = module.templates.find((template) => template.name === "scoped");
    assert.ok(scoped);
    assert.equal(scoped.body[0].kind, "declare_selection_snapshot");
    assert.equal(scoped.body[1].kind, "if");
    assert.equal(scoped.body[2].kind, "loop");
    if (scoped.body[1].kind === "if") {
        assert.equal(scoped.body[1].body[0].kind, "declare_selection_snapshot");
        assert.equal(scoped.body[1].elseBody?.[0].kind, "declare_selection_snapshot");
    }
    if (scoped.body[2].kind === "loop") {
        assert.equal(scoped.body[2].body[0].kind, "declare_selection_snapshot");
    }
    const event = module.templates.find((template) => template.kind === "event" && template.name === "join");
    const process = module.templates.find((template) => template.kind === "process" && template.name === "worker");
    assert.equal(event?.body[0].kind, "declare_selection_snapshot");
    assert.equal(process?.body[0].kind, "declare_selection_snapshot");
});

test("keeps statements after a potentially empty one-player snapshot", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const template = module.templates.find((candidate) => candidate.name === "emptyOneStillContinues");
    assert.ok(template);
    assert.deepEqual(template.body.map((statement) => statement.kind), [
        "declare_selection_snapshot",
        "intrinsic",
        "intrinsic",
    ]);
    assert.equal(module.templates.some((candidate) => candidate.name.startsWith("__nocuft_one_")), false);
});

test("analyzes named, aliased, inline, and derived selection counts", () => {
    const module = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("plot.ts"),
    });
    const template = module.templates.find((candidate) => candidate.name === "countSelections");
    assert.ok(template);
    assert.equal(template.body[0].kind, "declare_selection_snapshot");
    if (template.body[0].kind !== "declare_selection_snapshot") return;
    assert.equal(template.body[0].sizeName, "__nocuft_selection_selected_count");
    assert.equal(template.body[1].kind, "if");
    if (template.body[1].kind !== "if" || template.body[1].condition.kind !== "comparison") return;
    assert.equal(template.body[1].condition.left.kind, "selection_count");
    if (template.body[1].condition.left.kind !== "selection_count") return;
    assert.equal(template.body[1].condition.left.selection.source.kind, "selection_snapshot");

    const action = template.body[1].body[0];
    assert.equal(action.kind, "intrinsic");
    if (action.kind !== "intrinsic") return;
    const messages = action.arguments.message_to_send;
    assert.ok(Array.isArray(messages) && messages[0].kind === "string_template");
    if (!Array.isArray(messages) || messages[0].kind !== "string_template") return;
    const counts = messages[0].parts.filter((part) => part.kind === "selection_count");
    assert.equal(counts.length, 3);
    assert.equal(counts[0].selection.source.kind, "selection_snapshot");
    assert.equal("kind" in counts[1].selection.source, false);
    assert.equal(counts[2].selection.source.kind, "selection_snapshot");
    assert.equal(counts[2].selection.filters[0].operation, "select.FilterCondition");
});

test("rejects mutable, destructured, and plural scalar snapshot use", () => {
    for (const [file, pattern] of [
        ["invalid-let.ts", /const player selection snapshot declaration/],
        ["invalid-destructure.ts", /initialized mutable scalar line variable/],
        ["invalid-plural-value.ts", /any expression|at-most-one/],
        ["invalid-entity-count.ts", /initialized mutable scalar line variable/],
    ] as const) {
        assert.throws(() => analyzeTypeScript({
            tsconfigPath: fixture("tsconfig.json"),
            entryFile: fixture(file),
        }), pattern);
    }
});
