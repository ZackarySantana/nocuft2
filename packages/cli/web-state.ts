import type { EmittedTemplate, NativeCodeBlock } from "@nocuft/compiler";
import { stat } from "node:fs/promises";
import type { BuildDiagnostic, ProjectBuildResult } from "./build-project.js";
import type { LiveProject, LiveProjectObserver } from "./live-projects.js";

export type WebProjectStatus = "compiling" | "ready" | "failed";

export interface WebTemplateState {
    id: string;
    name: string;
    nativeName: string;
    kind: EmittedTemplate["kind"];
    blocks: NativeCodeBlock[];
}

export interface WebProjectState {
    name: string;
    module: string;
    sources: string[];
    modifiedAtMs: number | null;
    status: WebProjectStatus;
    stale: boolean;
    durationMs: number | null;
    diagnostics: BuildDiagnostic[];
    templates: WebTemplateState[];
}

export interface WebSnapshot {
    revision: number;
    projects: WebProjectState[];
}

export interface WebStateStore {
    readonly observer: LiveProjectObserver;
    snapshot(): WebSnapshot;
}

export interface WebStateDependencies {
    modifiedAt(path: string): Promise<number | undefined>;
}

const defaultDependencies: WebStateDependencies = {
    modifiedAt: async (path) => {
        try {
            return (await stat(path)).mtimeMs;
        } catch {
            return undefined;
        }
    },
};

export function createWebState(
    projects: readonly LiveProject[],
    publish: (snapshot: WebSnapshot) => void,
    dependencies: Partial<WebStateDependencies> = {},
): WebStateStore {
    const stateDependencies = { ...defaultDependencies, ...dependencies };
    let revision = 0;
    const states = new Map<string, WebProjectState>(projects.map((project) => [project.name, {
        name: project.name,
        module: project.module,
        sources: [project.entryPath],
        modifiedAtMs: null,
        status: "compiling",
        stale: false,
        durationMs: null,
        diagnostics: [],
        templates: [],
    }]));

    const snapshot = (): WebSnapshot => ({
        revision,
        projects: projects.map((project) => states.get(project.name) as WebProjectState),
    });

    const update = (
        project: LiveProject,
        change: (current: WebProjectState) => WebProjectState,
    ): void => {
        const current = states.get(project.name);
        if (current === undefined) {
            throw new Error(`Unknown registered project: ${project.name}`);
        }
        states.set(project.name, change(current));
        revision += 1;
        publish(snapshot());
    };

    return {
        snapshot,
        observer: {
            building: (project) => update(project, (current) => ({
                ...current,
                status: "compiling",
                stale: current.templates.length > 0,
                durationMs: null,
                diagnostics: [],
            })),
            built: async (project, result, durationMs) => {
                const current = states.get(project.name);
                if (current === undefined) {
                    throw new Error(`Unknown registered project: ${project.name}`);
                }
                const paths = result.ok
                    ? [...new Set([project.entryPath, ...result.sources.map(({ path }) => path)])]
                    : [...new Set([...current.sources, ...result.watchPaths])];
                const modifiedAtMs = await newestModification(paths, stateDependencies.modifiedAt);
                update(
                    project,
                    (latest) => stateAfterBuild(
                        project,
                        latest,
                        result,
                        durationMs,
                        modifiedAtMs,
                    ),
                );
            },
        },
    };
}

function stateAfterBuild(
    project: LiveProject,
    current: WebProjectState,
    result: ProjectBuildResult,
    durationMs: number,
    modifiedAtMs: number | null,
): WebProjectState {
    if (!result.ok) {
        return {
            ...current,
            status: "failed",
            stale: current.templates.length > 0,
            durationMs,
            modifiedAtMs: newestKnownModification(current.modifiedAtMs, modifiedAtMs),
            diagnostics: [...result.diagnostics],
        };
    }
    return {
        ...current,
        status: "ready",
        stale: false,
        durationMs,
        modifiedAtMs: newestKnownModification(current.modifiedAtMs, modifiedAtMs),
        diagnostics: [],
        sources: sourceFiles(project.entryPath, result.sources.map(({ path }) => path)),
        templates: result.templates.map((template) => ({
            id: `${project.name}/${template.name}`,
            name: template.name,
            nativeName: template.nativeName,
            kind: template.kind,
            blocks: template.template.blocks,
        })),
    };
}

async function newestModification(
    paths: readonly string[],
    modifiedAt: WebStateDependencies["modifiedAt"],
): Promise<number | null> {
    const timestamps = (await Promise.all(paths.map(modifiedAt)))
        .filter((value): value is number => value !== undefined && Number.isFinite(value));
    return timestamps.length === 0 ? null : Math.max(...timestamps);
}

function newestKnownModification(current: number | null, candidate: number | null): number | null {
    if (current === null) {
        return candidate;
    }
    if (candidate === null) {
        return current;
    }
    return Math.max(current, candidate);
}

function sourceFiles(entryPath: string, paths: readonly string[]): string[] {
    return [...new Set([entryPath, ...paths].filter((path) =>
        path === entryPath || /\.[cm]?[jt]sx?$/iu.test(path)))];
}
