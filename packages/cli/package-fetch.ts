import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const MAX_SOURCE_BYTES = 5 * 1024 * 1024;

export interface FetchedSource {
    bytes: Uint8Array;
    resolvedSource: string;
}

export async function fetchPackageSource(specifier: string, baseDirectory: string): Promise<FetchedSource> {
    let url: URL;
    try {
        url = new URL(specifier);
    } catch {
        url = pathToFileURL(isAbsolute(specifier) ? specifier : resolve(baseDirectory, specifier));
    }
    if (url.protocol === "file:") {
        const bytes = await readFile(fileURLToPath(url));
        enforceSize(bytes.byteLength);
        return { bytes, resolvedSource: url.href };
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(`Unsupported package source scheme: ${url.protocol}`);
    }
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) {
        throw new Error(`Could not fetch ${url.href}: HTTP ${response.status}`);
    }
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength)) enforceSize(contentLength);
    if (!response.body) throw new Error(`Package source response from ${url.href} has no body`);
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_SOURCE_BYTES) {
            await reader.cancel();
            enforceSize(size);
        }
        chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }
    const contentType = response.headers.get("content-type") ?? "";
    const prefix = new TextDecoder().decode(bytes.subarray(0, 512));
    if (/^\s*text\/html(?:;|$)/iu.test(contentType) || /^\s*<!doctype html|^\s*<html/iu.test(prefix)) {
        const raw = rawSourceUrl(url);
        throw new Error(`Package source is HTML.${raw ? ` Use the raw source URL: ${raw}` : " Use a raw source URL."}`);
    }
    return { bytes, resolvedSource: response.url || url.href };
}

function enforceSize(size: number): void {
    if (size > MAX_SOURCE_BYTES) throw new Error("Package source exceeds the 5 MiB limit");
}

function rawSourceUrl(url: URL): string | undefined {
    const parts = url.pathname.split("/").filter(Boolean);
    if (url.hostname === "github.com" && parts[2] === "blob") {
        return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts.slice(3).join("/")}`;
    }
    if (url.hostname === "gitlab.com" && url.pathname.includes("/blob/")) {
        return `${url.origin}${url.pathname.replace("/blob/", "/raw/")}`;
    }
    return undefined;
}
