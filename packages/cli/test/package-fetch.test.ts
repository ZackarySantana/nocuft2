import assert from "node:assert/strict";
import test from "node:test";
import { fetchPackageSource } from "../package-fetch.js";

test("downloads an HTTP package source", async (t) => {
    const original = globalThis.fetch;
    t.after(() => { globalThis.fetch = original; });
    globalThis.fetch = async () => new Response("export function hello(): void {}\n", {
        status: 200,
        headers: { "content-type": "text/plain" },
    });
    const source = await fetchPackageSource("https://example.com/math.ts", process.cwd());
    assert.match(new TextDecoder().decode(source.bytes), /function hello/u);
});

test("rejects HTML with a raw GitHub URL hint", async (t) => {
    const original = globalThis.fetch;
    t.after(() => { globalThis.fetch = original; });
    globalThis.fetch = async () => new Response("<!doctype html><html></html>", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
    });
    await assert.rejects(
        fetchPackageSource("https://github.com/example/tools/blob/main/math.ts", process.cwd()),
        /raw\.githubusercontent\.com\/example\/tools\/main\/math\.ts/u,
    );
});

test("rejects unsupported source schemes", async () => {
    await assert.rejects(
        fetchPackageSource("ftp://example.com/math.ts", process.cwd()),
        /Unsupported package source scheme/u,
    );
});
