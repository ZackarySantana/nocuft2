import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { createVersionedFile } from "./versioned-file.js";
import { readProjectManifest, resolveProjectEntry, UUID } from "./project-identity.js";

export interface RegisteredProject {
    id: string;
    name: string;
    entryPath: string;
    module: string;
    root: string;
    manifestPath: string;
    available?: boolean;
}

export interface ProjectStore {
    load(): Promise<RegisteredProject[]>;
    save(projects: readonly RegisteredProject[]): Promise<void>;
}

interface StoredProject {
    id: string;
    name: string;
    root: string;
    manifestPath: string;
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

export const DEFAULT_PROJECT_CONFIG_PATH = join(defaultConfigRoot(), "nocuft", "projects.json");

export function createProjectStore(path = DEFAULT_PROJECT_CONFIG_PATH): ProjectStore {
    const file = createVersionedFile<StoredProject[]>({
        path,
        missing: () => [],
        parse: parseProjects,
        serialize: serializeProjects,
    });
    return {
        load: async () => resolveProjects(await file.read()),
        save: async (projects) => {
            validateResolvedProjects(projects);
            await file.write(projects.map(({ id, name, root, manifestPath }) => ({
                id, name, root, manifestPath,
            })));
        },
    };
}

function parseProjects(text: string): StoredProject[] {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch {
        throw invalid("The Nocuft project configuration is not valid JSON.");
    }
    if (!isRecord(value) || value.format !== "nocuft-projects" || value.version !== 1
        || !isRecord(value.projects)) {
        throw invalid("The Nocuft project configuration must use format nocuft-projects version 1.");
    }
    const projects = Object.entries(value.projects).map(([name, entry]) => {
        if (!isRecord(entry) || typeof entry.id !== "string" || !UUID.test(entry.id)
            || typeof entry.root !== "string" || !isAbsolute(entry.root)
            || typeof entry.manifest !== "string" || !isAbsolute(entry.manifest)) {
            throw invalid(`Project ${JSON.stringify(name)} has invalid local tracking settings.`);
        }
        return {
            id: entry.id,
            name,
            root: resolve(entry.root),
            manifestPath: resolve(entry.manifest),
        };
    });
    validateStoredProjects(projects);
    return projects;
}

async function resolveProjects(projects: readonly StoredProject[]): Promise<RegisteredProject[]> {
    const resolved = await Promise.all(projects.map(async (stored): Promise<RegisteredProject> => {
        try {
            const manifest = await readProjectManifest(stored.manifestPath);
            if (manifest.id !== stored.id) return unavailable(stored);
            return {
                ...stored,
                name: manifest.name,
                entryPath: resolveProjectEntry(stored.root, manifest.entry),
                module: manifest.module,
                available: true,
            };
        } catch {
            return unavailable(stored);
        }
    }));
    validateResolvedProjects(resolved);
    return resolved.toSorted((left, right) => left.name.localeCompare(right.name));
}

function unavailable(stored: StoredProject): RegisteredProject {
    return { ...stored, entryPath: stored.manifestPath, module: "", available: false };
}

function serializeProjects(projects: readonly StoredProject[]): string {
    validateStoredProjects(projects);
    const entries = projects
        .toSorted((left, right) => left.name.localeCompare(right.name))
        .map((project) => [project.name, {
            id: project.id,
            root: project.root,
            manifest: project.manifestPath,
        }]);
    return `${JSON.stringify({
        format: "nocuft-projects",
        version: 1,
        projects: Object.fromEntries(entries),
    }, undefined, 2)}\n`;
}

function validateResolvedProjects(projects: readonly RegisteredProject[]): void {
    const names = new Set<string>();
    const ids = new Set<string>();
    for (const project of projects) {
        if (!validProjectName(project.name) || !UUID.test(project.id)
            || !isAbsolute(project.entryPath) || !isAbsolute(project.root)
            || !isAbsolute(project.manifestPath)
            || (project.available !== false && !validModuleId(project.module))
            || names.has(project.name) || ids.has(project.id)) {
            throw invalid("Projects require unique valid names and UUIDs, absolute roots, and valid manifests.");
        }
        names.add(project.name);
        ids.add(project.id);
    }
}

function validateStoredProjects(projects: readonly StoredProject[]): void {
    const names = new Set<string>();
    const ids = new Set<string>();
    for (const project of projects) {
        if (!validProjectName(project.name) || !UUID.test(project.id)
            || !isAbsolute(project.root) || !isAbsolute(project.manifestPath)
            || dirname(project.manifestPath) !== project.root
            || names.has(project.name) || ids.has(project.id)) {
            throw invalid("Tracked projects require unique valid names and UUIDs, plus absolute roots and manifests.");
        }
        names.add(project.name);
        ids.add(project.id);
    }
}

function invalid(message: string): ProjectStoreError {
    return new ProjectStoreError("projects.invalid_config", message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const defaultProjectStore = createProjectStore();
