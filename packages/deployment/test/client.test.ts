import assert from "node:assert/strict";
import test from "node:test";
import {
    openNocuftSession,
    type NocuftConnection,
    type NocuftStatus,
} from "../client.js";

class FakeConnection implements NocuftConnection {
    private openListener: () => void = () => {};
    private messageListener: (message: string) => void = () => {};
    private closeListener: (event: { code: number; reason: string }) => void = () => {};
    readonly methods: string[] = [];
    readonly responses: Record<string, unknown>[] = [];
    closed = false;

    onOpen(listener: () => void): void {
        this.openListener = listener;
        queueMicrotask(listener);
    }

    onMessage(listener: (message: string) => void): void {
        this.messageListener = listener;
    }

    onError(): void {}

    onClose(listener: (event: { code: number; reason: string }) => void): void {
        this.closeListener = listener;
    }

    send(message: string): void {
        const request = JSON.parse(message) as {
            kind: string;
            id: string;
            method: string;
            params: Record<string, unknown>;
        };
        if (request.kind === "response") {
            this.responses.push(request as unknown as Record<string, unknown>);
            return;
        }
        this.methods.push(request.method);
        let result: Record<string, unknown> = {};
        if (request.method === "hello") {
            result = { mod: { name: "test-mod", version: "1.2.3" } };
        } else if (request.method === "bundle.push") {
            result = { project: "project-id", digest: "abcdef0", units: 1 };
        }
        queueMicrotask(() => this.messageListener(JSON.stringify({
            kind: "response",
            id: request.id,
            ok: true,
            result,
        })));
    }

    close(): void {
        this.closed = true;
    }

    disconnect(): void {
        this.closeListener({ code: 1006, reason: "lost" });
    }

    requestFromMod(method: string, params: Record<string, unknown>): void {
        this.messageListener(JSON.stringify({ kind: "request", id: "mod-1", method, params }));
    }
}

test("connects, pushes, opens, and closes through correlated requests", async () => {
    const connection = new FakeConnection();
    const statuses: NocuftStatus[] = [];
    const session = await openNocuftSession({
        connectionFactory: () => connection,
        onStatus: (status) => statuses.push(status),
    });

    assert.equal(session.modName, "test-mod");
    assert.equal(session.modVersion, "1.2.3");
    assert.deepEqual(statuses, ["connected"]);

    const pushed = await session.push({
        format: "diamondfire-deployment",
        version: 0,
        protocolVersion: 0,
        compiler: { name: "nocuft", version: "0.1.0" },
        project: { id: "project-id", module: "app.test" },
        capabilities: [],
        templates: [],
    });
    assert.deepEqual(pushed, { project: "project-id", digest: "abcdef0", units: 1 });
    await session.openScreen();
    session.close();
    assert.equal(connection.closed, true);
    assert.deepEqual(connection.methods, ["hello", "bundle.push", "open"]);
});

test("answers correlated requests initiated by the mod", async () => {
    const connection = new FakeConnection();
    const session = await openNocuftSession({
        connectionFactory: () => connection,
        onRequest: async ({ method, params }) => ({ method, name: params.name }),
    });
    connection.requestFromMod("item.capture", { name: "token" });
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(connection.responses, [{
        kind: "response",
        id: "mod-1",
        method: "item.capture",
        ok: true,
        result: { method: "item.capture", name: "token" },
    }]);
    session.close();
});
