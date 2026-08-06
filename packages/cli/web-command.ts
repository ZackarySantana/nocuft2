import type { LiveProject, LiveProjectDependencies } from "./live-projects.js";
import { startLiveProjects } from "./live-projects.js";
import {
    startWebServer,
    type StartWebServerOptions,
    type WebServer,
} from "./web-server.js";
import { createWebState, type WebSnapshot } from "./web-state.js";

export interface WebIo {
    stdout(text: string): void;
    stderr(text: string): void;
}

export interface WebOptions {
    port: number;
    debounceMs: number;
    concurrency?: number;
}

export interface WebDependencies extends LiveProjectDependencies {
    startServer(options: StartWebServerOptions): Promise<WebServer>;
    waitForStop(
        watcherFailed: Promise<Error>,
        serverFailed: Promise<Error>,
    ): Promise<"signal" | Error>;
}

export async function runWeb(
    projects: readonly LiveProject[],
    options: WebOptions,
    io: WebIo,
    dependencies: Partial<WebDependencies> = {},
): Promise<number> {
    if (projects.length === 0) {
        io.stderr("error[web.no_projects]: No projects are tracked locally.\n");
        return 1;
    }

    let publish: (snapshot: WebSnapshot) => void = () => {};
    const state = createWebState(projects, (snapshot) => publish(snapshot));
    let server;
    try {
        server = await (dependencies.startServer ?? startWebServer)({
            port: options.port,
            snapshot: state.snapshot,
        });
    } catch (error: unknown) {
        const code = isAddressInUse(error) ? "web.port_in_use" : "web.server_failed";
        const hint = isAddressInUse(error)
            ? ` Port ${options.port} is already in use. Choose another with --port.`
            : "";
        io.stderr(`error[${code}]: ${messageOf(error)}${hint}\n`);
        return 1;
    }
    publish = server.publish;
    io.stdout(`Nocuft web viewer: ${server.url}\n`);

    let live;
    try {
        live = await startLiveProjects(
            projects,
            { debounceMs: options.debounceMs, concurrency: options.concurrency },
            state.observer,
            {
                ...(dependencies.digestOf ? { digestOf: dependencies.digestOf } : {}),
                ...(dependencies.startWatcher ? { startWatcher: dependencies.startWatcher } : {}),
            },
        );
    } catch (error: unknown) {
        await server.close();
        io.stderr(`error[web.internal]: ${messageOf(error)}\n`);
        return 1;
    }

    io.stdout(
        `Watching ${live.watcherCount()} ${live.watcherCount() === 1 ? "file" : "files"} for changes.\n`,
    );
    const stopped = await (dependencies.waitForStop ?? waitForProcessStop)(
        live.failed,
        server.failed,
    );
    await live.stop();
    await server.close();

    if (stopped instanceof Error) {
        io.stderr(`error[web.stopped]: ${stopped.message}\n`);
        return 1;
    }
    io.stdout("Stopped the Nocuft web viewer.\n");
    return 0;
}

async function waitForProcessStop(
    watcherFailed: Promise<Error>,
    serverFailed: Promise<Error>,
): Promise<"signal" | Error> {
    let stop!: () => void;
    const signal = new Promise<void>((resolve) => {
        stop = resolve;
    });
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    try {
        return await Promise.race([
            signal.then(() => "signal" as const),
            watcherFailed,
            serverFailed,
        ]);
    } finally {
        process.off("SIGINT", stop);
        process.off("SIGTERM", stop);
    }
}

function isAddressInUse(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "EADDRINUSE";
}

function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
