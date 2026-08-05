import { createHash } from "node:crypto";
import { watch, type FSWatcher } from "node:fs";
import { readFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { basename, dirname } from "node:path";
import type { ProjectBuildResult } from "./build-project.js";

export interface LiveProject {
    name: string;
    entryPath: string;
    module: string;
    build(): Promise<ProjectBuildResult>;
}

export interface LiveProjectOptions {
    debounceMs: number;
    concurrency?: number;
}

export interface LiveProjectObserver {
    building(project: LiveProject): void | Promise<void>;
    built(
        project: LiveProject,
        result: ProjectBuildResult,
        durationMs: number,
    ): void | Promise<void>;
}

export interface FileWatcher {
    close(): void;
}

export interface LiveProjectDependencies {
    digestOf(path: string): Promise<string | undefined>;
    startWatcher(
        path: string,
        onChange: () => void,
        onError: (error: Error) => void,
    ): FileWatcher;
}

export interface LiveProjectController {
    readonly failed: Promise<Error>;
    watcherCount(): number;
    stop(): Promise<void>;
}

const defaultDependencies: LiveProjectDependencies = {
    digestOf: async (path) => {
        try {
            return createHash("sha256").update(await readFile(path)).digest("hex");
        } catch {
            return undefined;
        }
    },
    startWatcher: startProcessWatcher,
};

export async function startLiveProjects(
    projects: readonly LiveProject[],
    options: LiveProjectOptions,
    observer: LiveProjectObserver,
    dependencies: Partial<LiveProjectDependencies> = {},
): Promise<LiveProjectController> {
    const liveDependencies: LiveProjectDependencies = {
        ...defaultDependencies,
        ...dependencies,
    };
    const sources = new Map<string, readonly { path: string; sha256: string }[]>();
    const failedProjects = new Set<string>();
    const watchPaths = new Map<string, Set<string>>();
    const watchers = new Map<string, FileWatcher>();
    let timer: NodeJS.Timeout | undefined;
    let buildAgain = false;
    let stopped = false;
    let failed = false;
    let markFailed!: (error: Error) => void;
    const failure = new Promise<Error>((resolve) => {
        markFailed = resolve;
    });

    const fail = (error: unknown): void => {
        if (failed || stopped) {
            return;
        }
        failed = true;
        markFailed(error instanceof Error ? error : new Error(String(error)));
    };

    const unchanged = async (project: LiveProject): Promise<boolean> => {
        if (failedProjects.has(project.name)) {
            return false;
        }
        const previous = sources.get(project.name);
        if (previous === undefined || previous.length === 0) {
            return false;
        }
        for (const source of previous) {
            if (await liveDependencies.digestOf(source.path) !== source.sha256) {
                return false;
            }
        }
        return true;
    };

    const buildProject = async (project: LiveProject): Promise<void> => {
        if (await unchanged(project)) {
            return;
        }
        await observer.building(project);
        const started = Date.now();
        const result = await project.build();
        if (result.ok) {
            failedProjects.delete(project.name);
            sources.set(project.name, result.sources);
            watchPaths.set(
                project.name,
                new Set(result.watchPaths ?? result.sources.map(({ path }) => path)),
            );
        } else {
            failedProjects.add(project.name);
            watchPaths.set(project.name, new Set([
                ...(watchPaths.get(project.name) ?? []),
                ...result.watchPaths,
            ]));
        }
        await observer.built(project, result, Date.now() - started);
    };

    const syncWatchers = (): void => {
        const wanted = new Set([...watchPaths.values()].flatMap((paths) => [...paths]));
        for (const [path, watcher] of watchers) {
            if (!wanted.has(path)) {
                watcher.close();
                watchers.delete(path);
            }
        }
        for (const path of wanted) {
            if (!watchers.has(path)) {
                watchers.set(path, liveDependencies.startWatcher(path, schedule, fail));
            }
        }
    };

    let activeBuild: Promise<void> | undefined;

    const rebuild = async (): Promise<void> => {
        if (stopped || failed) {
            return;
        }
        if (activeBuild !== undefined) {
            buildAgain = true;
            return activeBuild;
        }
        activeBuild = (async () => {
            do {
                buildAgain = false;
                await mapConcurrent(
                    projects,
                    options.concurrency ?? Math.max(1, availableParallelism()),
                    buildProject,
                );
                syncWatchers();
            } while (buildAgain && !stopped && !failed);
        })();
        try {
            await activeBuild;
        } finally {
            activeBuild = undefined;
        }
    };

    function schedule(): void {
        if (stopped || failed) {
            return;
        }
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = undefined;
            void rebuild().catch(fail);
        }, options.debounceMs);
    }

    await rebuild();

    return {
        failed: failure,
        watcherCount: () => watchers.size,
        stop: async () => {
            if (stopped) {
                return;
            }
            stopped = true;
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            for (const watcher of watchers.values()) {
                watcher.close();
            }
            watchers.clear();
            try {
                await activeBuild;
            } catch {
                // The same error is delivered through failed.
            }
        },
    };
}

function startProcessWatcher(
    path: string,
    onChange: () => void,
    onError: (error: Error) => void,
): FileWatcher {
    const fileName = basename(path);
    const watcher: FSWatcher = watch(dirname(path), (_event, changed) => {
        if (changed === null || String(changed) === fileName) {
            onChange();
        }
    });
    watcher.on("error", onError);
    return { close: () => watcher.close() };
}

async function mapConcurrent<T>(
    values: readonly T[],
    limit: number,
    operation: (value: T) => Promise<void>,
): Promise<void> {
    let next = 0;
    const worker = async (): Promise<void> => {
        for (;;) {
            const index = next++;
            const value = values[index];
            if (value === undefined) {
                return;
            }
            await operation(value);
        }
    };
    await Promise.all(Array.from(
        { length: Math.min(values.length, Math.max(1, limit)) },
        worker,
    ));
}
