import assert from "node:assert/strict";
import { gunzipSync } from "node:zlib";
import test from "node:test";
import { buildBundle } from "@nocuft/deployment";
import { buildProject } from "../build-project.js";

test("builds a TypeScript example into a self-consistent deployment", async () => {
    const entryPath = new URL("../../../examples/hello/plot.ts", import.meta.url).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, true);
    if (!result.ok) {
        return;
    }
    assert.equal(result.templates.length, 1);
    assert.deepEqual(
        result.sources.map(({ path }) => path.split("/").at(-1)),
        ["plot.ts", "tsconfig.json"],
    );
    const bundle = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.hello",
        templates: result.templates,
    });
    for (const template of bundle.templates) {
        const json = gunzipSync(Buffer.from(template.data, "base64"));
        assert.equal(json.byteLength, template.uncompressedBytes);
        assert.doesNotThrow(() => JSON.parse(json.toString("utf8")));
    }
});

test("builds reachable imported functions without importing their events", async () => {
    const entryPath = new URL(
        "../../frontends/typescript/test/fixtures/imported-functions/plot.ts",
        import.meta.url,
    ).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.templates.filter((template) => template.kind === "player_event").length, 1);
    assert.equal(result.templates.filter((template) => template.kind === "game_event").length, 0);
    assert.equal(result.templates.filter((template) => template.kind === "function").length, 4);
    assert.ok(result.templates
        .filter((template) => template.kind === "function")
        .every((template) => template.origin.kind === "host"));
    assert.ok(result.sources.some(({ path }) => path.endsWith("/helpers.ts")));
    assert.ok(result.sources.some(({ path }) => path.endsWith("/state.ts")));
});

test("watches an imported function after its analysis fails", async () => {
    const entryPath = new URL(
        "../../frontends/typescript/test/fixtures/imported-functions-invalid/plot.ts",
        import.meta.url,
    ).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.watchPaths.some((path) => path.endsWith("/helper.ts")));
});

test("returns a stable diagnostic when no tsconfig exists", async () => {
    const result = await buildProject({ entryPath: "/no/such/project/plot.ts" });
    assert.equal(result.ok, false);
    if (result.ok) {
        return;
    }
    assert.equal(result.diagnostics[0]?.code, "typescript.tsconfig_not_found");
    assert.deepEqual(result.watchPaths, ["/no/such/project/plot.ts"]);
});

test("builds a named process and its start call end to end", async () => {
    const entryPath = new URL(
        "../../frontends/typescript/test/fixtures/processes/plot.ts",
        import.meta.url,
    ).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.deepEqual(result.templates.map((template) => template.kind), [
        "process",
        "game_event",
    ]);
    const processTemplate = result.templates[0];
    const eventTemplate = result.templates[1];
    assert.equal(processTemplate.template.blocks[0]?.block, "process");
    assert.equal(processTemplate.template.blocks[1]?.block, "control");
    assert.equal(processTemplate.template.blocks[1]?.action, "Wait");
    assert.equal(eventTemplate.template.blocks[1]?.block, "start_process");
    assert.equal(eventTemplate.template.blocks[2]?.block, "start_process");
});

test("builds arithmetic, logical control flow, loops, and countdown interpolation end to end", async () => {
    const entryPath = new URL(
        "../../frontends/typescript/test/fixtures/control-flow/plot.ts",
        import.meta.url,
    ).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const countdown = result.templates.find((template) => template.name === "countdown");
    assert.ok(countdown);
    const blocks = countdown.template.blocks;
    assert.ok(blocks.some((block) =>
        block.block === "repeat" && block.action === "While" && block.subAction === ">="
    ));
    assert.ok(blocks.some((block) => block.block === "set_var" && block.action === "String"));
    assert.ok(blocks.some((block) => block.block === "control" && block.action === "Wait"));
    assert.equal(
        blocks.filter((block) => block.block === "bracket" && block.direct === "open").length,
        blocks.filter((block) => block.block === "bracket" && block.direct === "close").length,
    );
    const fixedRange = result.templates.find((template) => template.name === "fixedRange");
    assert.ok(fixedRange?.template.blocks.some(
        (block) => block.block === "repeat" && block.action === "Range",
    ));
});

test("builds one stable queued bearer through a UUID snapshot", async () => {
    const entryPath = new URL(
        "../../../examples/arena/plot.ts",
        import.meta.url,
    ).pathname;
    const result = await buildProject({ entryPath });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const choose = result.templates.find((template) => template.name === "chooseBearer");
    const helper = result.templates.find((template) =>
        template.origin.kind === "nocuft" && template.name.startsWith("__nocuft_set_player_variable_"));
    assert.ok(choose);
    assert.ok(helper);
    assert.deepEqual(choose.origin, { kind: "host" });
    assert.equal(result.templates.some((template) => template.name.startsWith("__nocuft_one_")), false);
    assert.equal(choose.template.blocks.filter((block) =>
        block.block === "select_obj" &&
        block.action === "FilterCondition" &&
        block.subAction === "="
    ).length, 1);
    assert.equal(choose.template.blocks.filter((block) =>
        block.block === "select_obj" && block.action === "FilterRandom"
    ).length, 1);
    assert.ok(choose.template.blocks.some((block) =>
        block.block === "set_var" &&
        block.action === "=" &&
        block.args.items.some((entry) =>
            entry.item.id === "g_val" &&
            entry.item.data.type === "Selection Target UUIDs" &&
            entry.item.data.target === ""
        )
    ));
    assert.ok(choose.template.blocks.some((block) =>
        block.block === "set_var" &&
        block.action === "=" &&
        block.args.items.some((entry) =>
            entry.item.id === "g_val" &&
            entry.item.data.type === "Selection Size" &&
            entry.item.data.target === ""
        )
    ));
    assert.ok(choose.template.blocks.some((block) =>
        block.block === "if_var" &&
        block.action === "=" &&
        block.args.items.some((entry) =>
            entry.item.id === "var" &&
            entry.item.data.name === "__nocuft_selection_candidates_count"
        )
    ));
    assert.ok(choose.template.blocks.some((block) =>
        block.block === "call_func" &&
        block.data === helper.name &&
        block.target === "Selection"
    ));
    assert.equal(
        helper.template.blocks[0].args.items.find((entry) => entry.slot === 26)?.item.data.option,
        "True",
    );
    assert.equal(choose.template.blocks.filter((block) =>
        block.block === "select_obj" && block.action === "PlayerName"
    ).length, 1);
    assert.ok(choose.template.blocks.some((block) =>
        block.block === "set_var" &&
        block.args.items.some((entry) =>
            entry.item.id === "g_val" &&
            entry.item.data.type === "Name " &&
            entry.item.data.target === "Selection"
        )
    ));
    assert.ok(helper.template.blocks.some((block) =>
        block.block === "set_var" &&
        block.args.items.some((entry) =>
            entry.item.id === "var" && entry.item.data.name === "%uuid bearer"
        )
    ));
});
