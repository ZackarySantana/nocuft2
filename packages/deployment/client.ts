import type { DeploymentBundle } from "./bundle.js";

export const NOCUFT_CLIENT_ENDPOINT = "ws://127.0.0.1:31380";
export const NOCUFT_PROTOCOL_VERSION = 0;

export type NocuftStatus = "connected";

export interface NocuftConnection {
    onOpen(listener: () => void): void;
    onMessage(listener: (message: string) => void): void;
    onError(listener: () => void): void;
    onClose(listener: (event: { code: number; reason: string }) => void): void;
    send(message: string): void;
    close(): void;
}

export type NocuftConnectionFactory = (endpoint: string) => NocuftConnection;

export interface NocuftSessionOptions {
    endpoint?: string;
    connectionFactory?: NocuftConnectionFactory;
    timeoutMs?: number;
    onStatus?: (status: NocuftStatus) => void;
    onClosed?: (reason: string) => void;
    onRequest?: (request: NocuftInboundRequest) => Promise<Record<string, unknown>>;
}

export interface NocuftInboundRequest {
    method: string;
    params: Record<string, unknown>;
}

export interface PushResult {
    project: string;
    digest: string;
    units: number;
}

export interface NocuftSession {
    readonly modName: string;
    readonly modVersion: string;
    push(bundle: DeploymentBundle): Promise<PushResult>;
    openScreen(): Promise<void>;
    close(): void;
}

export class NocuftClientError extends Error {
    override readonly name = "NocuftClientError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

interface PendingRequest {
    resolve(result: Record<string, unknown>): void;
    reject(error: NocuftClientError): void;
    timer: NodeJS.Timeout;
}

export async function openNocuftSession(
    options: NocuftSessionOptions = {},
): Promise<NocuftSession> {
    const endpoint = options.endpoint ?? NOCUFT_CLIENT_ENDPOINT;
    const timeoutMs = options.timeoutMs ?? 30_000;
    const factory = options.connectionFactory ?? createWebSocketConnection;
    let connection: NocuftConnection;
    try {
        connection = factory(endpoint);
    } catch (error: unknown) {
        throw connectionError(endpoint, error);
    }

    const pending = new Map<string, PendingRequest>();
    let nextId = 0;
    let closed = false;
    let closedReason = "";

    const failAll = (error: NocuftClientError): void => {
        for (const request of pending.values()) {
            clearTimeout(request.timer);
            request.reject(error);
        }
        pending.clear();
    };

    const opened = new Promise<void>((resolve, reject) => {
        connection.onOpen(resolve);
        connection.onError(() => reject(new NocuftClientError(
            "client.unreachable",
            `No Nocuft client is listening at ${endpoint}. Start Minecraft with the Nocuft mod.`,
        )));
    });

    connection.onMessage((message) => {
        let frame: Record<string, unknown>;
        try {
            frame = JSON.parse(message) as Record<string, unknown>;
        } catch {
            return;
        }
        if (frame.kind === "request") {
            const id = String(frame.id);
            const method = String(frame.method);
            if (options.onRequest === undefined) {
                connection.send(JSON.stringify({
                    kind: "response",
                    id,
                    method,
                    ok: false,
                    error: { code: "protocol.unknown_method", message: "This Nocuft command does not accept client requests." },
                }));
                return;
            }
            void options.onRequest({
                method,
                params: (frame.params ?? {}) as Record<string, unknown>,
            }).then((result) => connection.send(JSON.stringify({
                kind: "response", id, method, ok: true, result,
            })), (error: unknown) => connection.send(JSON.stringify({
                kind: "response",
                id,
                method,
                ok: false,
                error: {
                    code: "item.capture_failed",
                    message: error instanceof Error ? error.message : String(error),
                },
            })));
            return;
        }
        if (frame.kind === "event") {
            return;
        }
        const request = pending.get(String(frame.id));
        if (request === undefined) {
            return;
        }
        pending.delete(String(frame.id));
        clearTimeout(request.timer);
        if (frame.ok === true) {
            request.resolve((frame.result ?? {}) as Record<string, unknown>);
            return;
        }
        const error = (frame.error ?? {}) as Record<string, unknown>;
        request.reject(new NocuftClientError(
            String(error.code ?? "client.internal"),
            String(error.message ?? "The Nocuft client refused the request."),
        ));
    });

    connection.onClose(({ code, reason }) => {
        if (closed) {
            return;
        }
        closed = true;
        closedReason = reason || `closed (${code})`;
        failAll(new NocuftClientError(
            "client.closed",
            `The Nocuft client ${closedReason}.`,
        ));
        options.onClosed?.(closedReason);
    });

    await opened;
    options.onStatus?.("connected");

    const ask = (
        method: string,
        params: Record<string, unknown>,
        deadline = timeoutMs,
    ): Promise<Record<string, unknown>> => {
        if (closed) {
            return Promise.reject(new NocuftClientError(
                "client.closed",
                `The Nocuft client ${closedReason}.`,
            ));
        }
        const id = String(++nextId);
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new NocuftClientError(
                    "client.timeout",
                    `The Nocuft client did not answer ${method} within ${deadline}ms.`,
                ));
            }, deadline);
            pending.set(id, { resolve, reject, timer });
            try {
                connection.send(JSON.stringify({
                    kind: "request",
                    id,
                    method,
                    params,
                }));
            } catch (error: unknown) {
                pending.delete(id);
                clearTimeout(timer);
                reject(connectionError(endpoint, error));
            }
        });
    };

    const hello = await ask("hello", {
        protocolVersion: NOCUFT_PROTOCOL_VERSION,
        client: { name: "nocuft", version: "0.1.0" },
    });
    const mod = (hello.mod ?? {}) as Record<string, unknown>;

    return {
        modName: String(mod.name ?? "nocuft-client"),
        modVersion: String(mod.version ?? "unknown"),
        push: async (bundle) => {
            const result = await ask("bundle.push", { bundle });
            return {
                project: String(result.project),
                digest: String(result.digest),
                units: Number(result.units),
            };
        },
        openScreen: async () => {
            await ask("open", {});
        },
        close: () => {
            if (closed) {
                return;
            }
            closed = true;
            closedReason = "session closed";
            failAll(new NocuftClientError(
                "client.closed",
                "The Nocuft session was closed.",
            ));
            connection.close();
        },
    };
}

function createWebSocketConnection(endpoint: string): NocuftConnection {
    const socket = new WebSocket(endpoint);
    return {
        onOpen: (listener) => socket.addEventListener("open", listener),
        onMessage: (listener) => socket.addEventListener("message", (event) => {
            if (typeof event.data === "string") {
                listener(event.data);
            }
        }),
        onError: (listener) => socket.addEventListener("error", listener),
        onClose: (listener) => socket.addEventListener("close", (event) =>
            listener({ code: event.code, reason: event.reason })),
        send: (message) => socket.send(message),
        close: () => socket.close(1000, "Nocuft session finished"),
    };
}

function connectionError(endpoint: string, error: unknown): NocuftClientError {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    return new NocuftClientError(
        "client.unreachable",
        `Unable to reach the Nocuft client at ${endpoint}.${detail}`,
    );
}
