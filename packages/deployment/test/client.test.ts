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
            id: string;
            method: string;
            params: Record<string, unknown>;
        };
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
