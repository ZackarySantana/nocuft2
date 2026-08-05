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
