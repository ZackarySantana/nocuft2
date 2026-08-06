import {
    buildBundle,
    NocuftClientError,
    NOCUFT_CLIENT_ENDPOINT,
    openNocuftSession,
    type NocuftSession,
    type NocuftSessionOptions,
    type NocuftInboundRequest,
    type NocuftStatus,
} from "@nocuft/deployment";
import type { ProjectIdentity } from "./project-identity.js";
import {
    startLiveProjects,
    type FileWatcher,
    type LiveProject,
    type LiveProjectDependencies,
} from "./live-projects.js";

export interface GuiIo {
    stdout(text: string): void;
    stderr(text: string): void;
}

export interface GuiProject extends LiveProject {
    identify(): Promise<ProjectIdentity>;
}

export interface GuiOptions {
    debounceMs: number;
    open: boolean;
    concurrency?: number;
    onRequest?: (request: NocuftInboundRequest) => Promise<Record<string, unknown>>;
}

export interface GuiDependencies extends LiveProjectDependencies {
    openSession(options: NocuftSessionOptions): Promise<NocuftSession>;
    waitForStop(
        clientGone: Promise<void>,
        watcherFailed: Promise<Error>,
    ): Promise<"signal" | "client" | Error>;
}

export type { FileWatcher };

export async function runGui(
    projects: readonly GuiProject[],
    options: GuiOptions,
    io: GuiIo,
    dependencies: Partial<GuiDependencies> = {},
): Promise<number> {
    if (projects.length === 0) {
        io.stderr("error[gui.no_projects]: No projects are tracked locally.\n");
        return 1;
    }

    let clientClosedReason = "went away";
    let markClientGone!: () => void;
    const clientGone = new Promise<void>((resolve) => {
        markClientGone = resolve;
    });

    let session: NocuftSession;
    try {
        session = await (dependencies.openSession ?? openNocuftSession)({
            onStatus: (status) => reportStatus(status, io),
            onClosed: (reason) => {
                clientClosedReason = reason;
                markClientGone();
            },
            ...(options.onRequest === undefined ? {} : { onRequest: options.onRequest }),
        });
    } catch (error: unknown) {
        io.stderr(`error[${errorCode(error)}]: ${messageOf(error)}\n`);
        return 1;
    }

    io.stdout(`Connected to ${session.modName} ${session.modVersion}.\n`);
    const projectByName = new Map(projects.map((project) => [project.name, project]));
    const sent = new Map<string, string>();
    let live;
    try {
        live = await startLiveProjects(
            projects,
            { debounceMs: options.debounceMs, concurrency: options.concurrency },
            {
                building: (project) => {
                    io.stdout(`${project.name}  TypeScript  ${project.module}\n`);
                },
                built: async (project, result, durationMs) => {
                    if (!result.ok) {
                        io.stdout(`  compile   failed  ${took(durationMs)}\n`);
                        for (const diagnostic of result.diagnostics) {
                            io.stderr(
                                `${diagnostic.severity}[${diagnostic.code}]: ${diagnostic.message}\n`,
                            );
                        }
                        return;
                    }
                    io.stdout(
                        `  compile   ${result.templates.length} ${result.templates.length === 1 ? "line" : "lines"}`
                        + ` from ${result.sources.length} ${result.sources.length === 1 ? "file" : "files"}`
                        + `  ${took(durationMs)}\n`,
                    );
                    try {
                        const guiProject = projectByName.get(project.name);
                        if (guiProject === undefined) {
                            throw new Error(`Unknown registered project: ${project.name}`);
                        }
                        const identity = await guiProject.identify();
                        const pushed = await session.push(buildBundle({
                            projectId: identity.id,
                            module: project.module,
                            templates: result.templates,
                        }));
                        const repeated = sent.get(pushed.project) === pushed.digest;
                        sent.set(pushed.project, pushed.digest);
                        io.stdout(
                            `  ${repeated ? "unchanged" : "send"}      ${pushed.digest.slice(0, 7)}\n`,
                        );
                    } catch (error: unknown) {
                        io.stderr(`error[${errorCode(error)}]: ${messageOf(error)}\n`);
                    }
                },
            },
            {
                ...(dependencies.digestOf ? { digestOf: dependencies.digestOf } : {}),
                ...(dependencies.startWatcher ? { startWatcher: dependencies.startWatcher } : {}),
            },
        );
    } catch (error: unknown) {
        session.close();
        io.stderr(`error[gui.internal]: ${messageOf(error)}\n`);
        return 1;
    }

    io.stdout(
        `Watching ${live.watcherCount()} ${live.watcherCount() === 1 ? "file" : "files"} for changes.\n`,
    );
    if (options.open) {
        try {
            await session.openScreen();
        } catch (error: unknown) {
            io.stderr(`warning[${errorCode(error)}]: ${messageOf(error)}\n`);
        }
    }

    const stopped = await (dependencies.waitForStop ?? waitForProcessStop)(
        clientGone,
        live.failed,
    );
    await live.stop();
    session.close();

    if (stopped === "client") {
        io.stderr(`error[client.closed]: The Nocuft client ${clientClosedReason}, so this stopped.\n`);
        return 1;
    }
    if (stopped instanceof Error) {
        io.stderr(`error[gui.watch_failed]: ${stopped.message}\n`);
        return 1;
    }
    io.stdout("Stopped. The screen has nothing to show until this runs again.\n");
    return 0;
}

function reportStatus(_status: NocuftStatus, io: GuiIo): void {
    io.stdout(`Connected to the Nocuft client at ${NOCUFT_CLIENT_ENDPOINT}.\n`);
}

async function waitForProcessStop(
    clientGone: Promise<void>,
    watcherFailed: Promise<Error>,
): Promise<"signal" | "client" | Error> {
    let stop!: () => void;
    const signal = new Promise<void>((resolve) => {
        stop = resolve;
    });
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    try {
        return await Promise.race([
            signal.then(() => "signal" as const),
            clientGone.then(() => "client" as const),
            watcherFailed,
        ]);
    } finally {
        process.off("SIGINT", stop);
        process.off("SIGTERM", stop);
    }
}

function took(milliseconds: number): string {
    return milliseconds < 1000
        ? `${milliseconds}ms`
        : `${(milliseconds / 1000).toFixed(1)}s`;
}

function errorCode(error: unknown): string {
    return error instanceof NocuftClientError ? error.code : "gui.internal";
}

function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
