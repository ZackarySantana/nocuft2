import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { createVersionedFile } from "./versioned-file.js";

export interface RegisteredProject {
    name: string;
    entryPath: string;
    module: string;
}

export interface ProjectStore {
    load(): Promise<RegisteredProject[]>;
    save(projects: readonly RegisteredProject[]): Promise<void>;
}

export class ProjectStoreError extends Error {
    override readonly name = "ProjectStoreError";

    constructor(readonly code: string, message: string) {
        super(message);
    }
}

export function validProjectName(name: string): boolean {
    return /^[a-z][a-z0-9._-]{0,63}$/u.test(name);
}

export function validModuleId(module: string): boolean {
    return module.length <= 255
        && /^[a-z][a-z0-9]*(?:[._/-][a-z0-9]+)*$/u.test(module);
}

function defaultConfigRoot(): string {
    return process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
}

export const DEFAULT_PROJECT_CONFIG_PATH = join(
    defaultConfigRoot(),
    "nocuft",
    "projects.json",
);

export function createProjectStore(
    path = DEFAULT_PROJECT_CONFIG_PATH,
): ProjectStore {
    const file = createVersionedFile<RegisteredProject[]>({
        path,
        missing: () => [],
        parse: parseProjects,
        serialize: serializeProjects,
    });
    return {
        load: file.read,
        save: async (projects) => {
            validateProjects(projects);
            await file.write([...projects]);
        },
    };
}

function parseProjects(text: string): RegisteredProject[] {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch {
        throw invalid("The Nocuft project configuration is not valid JSON.");
    }
    if (!isRecord(value)
        || value.format !== "nocuft-projects"
        || value.version !== 1
        || !isRecord(value.projects)) {
        throw invalid("The Nocuft project configuration must use format nocuft-projects version 1.");
    }
    const projects = Object.entries(value.projects).map(([name, entry]) => {
        if (!isRecord(entry)
            || typeof entry.entry !== "string"
            || typeof entry.module !== "string") {
            throw invalid(`Project ${JSON.stringify(name)} has invalid settings.`);
        }
        return { name, entryPath: entry.entry, module: entry.module };
    });
    validateProjects(projects);
    return projects.toSorted((left, right) => left.name.localeCompare(right.name));
}

function serializeProjects(projects: readonly RegisteredProject[]): string {
    validateProjects(projects);
    const entries = projects
        .toSorted((left, right) => left.name.localeCompare(right.name))
        .map((project) => [project.name, {
            entry: project.entryPath,
            module: project.module,
        }]);
    return `${JSON.stringify({
        format: "nocuft-projects",
        version: 1,
        projects: Object.fromEntries(entries),
    }, undefined, 2)}\n`;
}

function validateProjects(projects: readonly RegisteredProject[]): void {
    const names = new Set<string>();
    for (const project of projects) {
        if (!validProjectName(project.name)
            || !isAbsolute(project.entryPath)
            || !validModuleId(project.module)
            || names.has(project.name)) {
            throw invalid("Projects require unique valid names, absolute entries, and valid modules.");
        }
        names.add(project.name);
    }
}

function invalid(message: string): ProjectStoreError {
    return new ProjectStoreError("projects.invalid_config", message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const defaultProjectStore = createProjectStore();
