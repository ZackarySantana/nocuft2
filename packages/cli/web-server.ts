import { createServer, type Server, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { basename } from "node:path";
import type { WebSnapshot } from "./web-state.js";

export interface WebAssets {
    html: string;
    script: string;
    styles: string;
}

export interface WebServer {
    readonly url: string;
    readonly failed: Promise<Error>;
    publish(snapshot: WebSnapshot): void;
    close(): Promise<void>;
}

export interface StartWebServerOptions {
    port: number;
    snapshot(): WebSnapshot;
    assets?: WebAssets;
}

export async function startWebServer(options: StartWebServerOptions): Promise<WebServer> {
    const assets = options.assets ?? await loadWebAssets();
    const streams = new Set<ServerResponse>();
    let current = options.snapshot();
    const server = createServer((request, response) => {
        setSecurityHeaders(response);
        if (!allowedHost(request.headers.host)) {
            sendText(response, 403, "Forbidden\n");
            return;
        }
        if (request.method !== "GET") {
            response.setHeader("Allow", "GET");
            sendText(response, 405, "Method Not Allowed\n");
            return;
        }
        const url = new URL(request.url ?? "/", "http://127.0.0.1");
        switch (url.pathname) {
            case "/":
                send(response, 200, "text/html; charset=utf-8", assets.html);
                return;
            case "/app.js":
                send(response, 200, "text/javascript; charset=utf-8", assets.script);
                return;
            case "/styles.css":
                send(response, 200, "text/css; charset=utf-8", assets.styles);
                return;
            case "/api/state":
                send(response, 200, "application/json; charset=utf-8", JSON.stringify(current));
                return;
            case "/api/source":
                void sendSource(response, current, url.searchParams.get("path"));
                return;
            case "/api/events": {
                response.writeHead(200, {
                    "Content-Type": "text/event-stream; charset=utf-8",
                    "Cache-Control": "no-store",
                    Connection: "keep-alive",
                    "X-Accel-Buffering": "no",
                });
                streams.add(response);
                writeEvent(response, current);
                const heartbeat = setInterval(() => response.write(": keepalive\n\n"), 15_000);
                heartbeat.unref();
                response.on("close", () => {
                    clearInterval(heartbeat);
                    streams.delete(response);
                });
                return;
            }
            default:
                sendText(response, 404, "Not Found\n");
        }
    });

    await listen(server, options.port);
    const address = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${address.port}/`;
    let markFailed!: (error: Error) => void;
    const failed = new Promise<Error>((resolve) => {
        markFailed = resolve;
    });
    server.on("error", markFailed);

    let closed = false;
    return {
        url,
        failed,
        publish: (snapshot) => {
            current = snapshot;
            for (const stream of streams) {
                writeEvent(stream, current);
            }
        },
        close: async () => {
            if (closed) {
                return;
            }
            closed = true;
            for (const stream of streams) {
                stream.end();
            }
            streams.clear();
            await new Promise<void>((resolve, reject) => server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }));
        },
    };
}

async function sendSource(
    response: ServerResponse,
    snapshot: WebSnapshot,
    path: string | null,
): Promise<void> {
    const allowed = path !== null && snapshot.projects.some((project) =>
        project.sources.includes(path));
    if (!allowed || path === null) {
        sendText(response, 404, "Source file not found\n");
        return;
    }
    try {
        const contents = await readFile(path);
        response.setHeader("Content-Disposition", attachmentHeader(basename(path)));
        send(response, 200, "application/octet-stream", contents);
    } catch {
        sendText(response, 404, "Source file not found\n");
    }
}

function attachmentHeader(filename: string): string {
    const fallback = filename.replace(/[^A-Za-z0-9._-]/gu, "_") || "source";
    const encoded = encodeURIComponent(filename).replace(/[!'()*]/gu, (character) =>
        `%${character.codePointAt(0)?.toString(16).toUpperCase()}`);
    return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

async function loadWebAssets(): Promise<WebAssets> {
    const [html, script, styles] = await Promise.all([
        readFile(new URL("./web/index.html", import.meta.url), "utf8"),
        readFile(new URL("./web/app.js", import.meta.url), "utf8"),
        readFile(new URL("./web/styles.css", import.meta.url), "utf8"),
    ]);
    return { html, script, styles };
}

function listen(server: Server, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const onError = (error: Error): void => {
            server.off("listening", onListening);
            reject(error);
        };
        const onListening = (): void => {
            server.off("error", onError);
            resolve();
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, "127.0.0.1");
    });
}

function allowedHost(host: string | undefined): boolean {
    if (host === undefined) {
        return false;
    }
    const hostname = host.replace(/:\d+$/u, "").toLowerCase();
    return hostname === "127.0.0.1" || hostname === "localhost";
}

function setSecurityHeaders(response: ServerResponse): void {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    );
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
}

function sendText(response: ServerResponse, status: number, body: string): void {
    send(response, status, "text/plain; charset=utf-8", body);
}

function send(
    response: ServerResponse,
    status: number,
    contentType: string,
    body: string | Buffer,
): void {
    response.statusCode = status;
    response.setHeader("Content-Type", contentType);
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
}

function writeEvent(response: ServerResponse, snapshot: WebSnapshot): void {
    response.write(
        `id: ${snapshot.revision}\nevent: state\ndata: ${JSON.stringify(snapshot)}\n\n`,
    );
}
