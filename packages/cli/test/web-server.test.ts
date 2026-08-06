import assert from "node:assert/strict";
import { request } from "node:http";
import test from "node:test";
import { startWebServer, type WebAssets } from "../web-server.js";
import type { WebSnapshot } from "../web-state.js";

const assets: WebAssets = {
    html: "<!doctype html><title>Test</title>",
    script: "console.log('test')",
    styles: "body {}",
};

test("serves local assets and state with restrictive HTTP behavior", async () => {
    const snapshot: WebSnapshot = { revision: 0, projects: [] };
    const server = await startWebServer({ port: 0, snapshot: () => snapshot, assets });
    try {
        const state = await fetch(`${server.url}api/state`);
        assert.equal(state.status, 200);
        assert.deepEqual(await state.json(), snapshot);
        assert.equal(state.headers.get("access-control-allow-origin"), null);
        assert.match(state.headers.get("content-security-policy") ?? "", /default-src 'self'/u);

        const script = await fetch(`${server.url}app.js`);
        assert.equal(script.headers.get("content-type"), "text/javascript; charset=utf-8");
        assert.equal(await script.text(), assets.script);

        assert.equal((await fetch(`${server.url}missing`)).status, 404);
        assert.equal((await fetch(`${server.url}api/state`, { method: "POST" })).status, 405);
        assert.equal((await requestWithHost(server.url, "example.test")).status, 403);
    } finally {
        await server.close();
    }
});

test("streams an immediate full snapshot and later revisions", async () => {
    const initial: WebSnapshot = { revision: 2, projects: [] };
    const server = await startWebServer({ port: 0, snapshot: () => initial, assets });
    try {
        const response = await fetch(`${server.url}api/events`);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("content-type"), "text/event-stream; charset=utf-8");
        const reader = response.body?.getReader();
        assert.ok(reader);
        const first = await reader.read();
        assert.match(new TextDecoder().decode(first.value), /id: 2\nevent: state/u);

        server.publish({ revision: 3, projects: [] });
        const second = await reader.read();
        assert.match(new TextDecoder().decode(second.value), /id: 3\nevent: state/u);
        await reader.cancel();
    } finally {
        await server.close();
    }
});

test("fails when the requested fixed port is already occupied", async () => {
    const snapshot: WebSnapshot = { revision: 0, projects: [] };
    const first = await startWebServer({ port: 0, snapshot: () => snapshot, assets });
    const port = Number(new URL(first.url).port);
    try {
        await assert.rejects(
            startWebServer({ port, snapshot: () => snapshot, assets }),
            (error: Error & { code?: string }) => error.code === "EADDRINUSE",
        );
    } finally {
        await first.close();
    }
});

function requestWithHost(url: string, host: string): Promise<{ status: number; body: string }> {
    const parsed = new URL(url);
    return new Promise((resolve, reject) => {
        const outgoing = request({
            hostname: parsed.hostname,
            port: parsed.port,
            path: "/api/state",
            headers: { Host: host },
        }, (response) => {
            const chunks: Buffer[] = [];
            response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            response.on("end", () => resolve({
                status: response.statusCode ?? 0,
                body: Buffer.concat(chunks).toString("utf8"),
            }));
        });
        outgoing.on("error", reject);
        outgoing.end();
    });
}
