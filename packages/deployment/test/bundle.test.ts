import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type { EmittedTemplate } from "@nocuft/compiler";
import { buildBundle, bundleDigest, canonicalJson } from "../bundle.js";

const functionTemplate: EmittedTemplate = {
    name: "hello",
    nativeName: "hello",
    kind: "function",
    template: {
        blocks: [{
            id: "block",
            block: "func",
            data: "hello",
            args: { items: [] },
        }],
    },
    json: "unused",
};

test("builds a deterministic client bundle", () => {
    const first = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.hello",
        templates: [functionTemplate],
    });
    const second = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.hello",
        templates: [functionTemplate],
    });

    assert.deepEqual(second, first);
    assert.equal(first.templates[0]?.id, "app.hello/hello");
    assert.equal(first.templates[0]?.name, "hello");
    const json = gunzipSync(Buffer.from(first.templates[0]?.data ?? "", "base64"))
        .toString("utf8");
    assert.equal(json, canonicalJson(functionTemplate.template));
    assert.equal(
        first.templates[0]?.sha256,
        createHash("sha256").update(json).digest("hex"),
    );
    assert.match(bundleDigest(first), /^[a-f0-9]{64}$/u);
    assert.equal("registry" in first, false);
});

test("uses the native event name and module-qualified source name", () => {
    const event: EmittedTemplate = {
        name: "joined",
        nativeName: "Join",
        kind: "player_event",
        template: {
            blocks: [{
                id: "block",
                block: "event",
                action: "Join",
                args: { items: [] },
            }],
        },
        json: "unused",
    };
    const bundle = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.arena",
        templates: [event],
    });
    assert.equal(bundle.templates[0]?.id, "app.arena/joined");
    assert.equal(bundle.templates[0]?.name, "Join");
    assert.equal(bundle.templates[0]?.kind, "player_event");
});

test("preserves process template kinds", () => {
    const processTemplate: EmittedTemplate = {
        name: "countdown",
        nativeName: "countdown",
        kind: "process",
        template: {
            blocks: [{
                id: "block",
                block: "process",
                data: "countdown",
                args: { items: [] },
            }],
        },
        json: "unused",
    };
    const bundle = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.arena",
        templates: [processTemplate],
    });
    assert.equal(bundle.templates[0]?.kind, "process");
    assert.equal(bundle.templates[0]?.name, "countdown");
});

test("keeps the Java client fixture aligned with the TypeScript bundle", async () => {
    const expected = JSON.parse(await readFile(
        new URL("./fixtures/function-bundle.json", import.meta.url),
        "utf8",
    )) as unknown;
    const actual = buildBundle({
        projectId: "4c026963-a287-4e18-a86c-747d86e3a917",
        module: "app.hello",
        templates: [functionTemplate],
    });
    assert.deepEqual(actual, expected);
});
