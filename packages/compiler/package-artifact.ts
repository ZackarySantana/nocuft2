import type { LowModule, LowParameter, LowTemplate } from "@nocuft/dfir";

export const PACKAGE_IR_FORMAT = "nocuft-package-ir";
export const PACKAGE_IR_VERSION = 1;
export const PACKAGE_EXPORTS_FORMAT = "nocuft-package-exports";
export const PACKAGE_EXPORTS_VERSION = 1;

export type PackageExportParameter = LowParameter;

export interface PackageFunctionExport {
    name: string;
    nativeName: string;
    parameters: PackageExportParameter[];
}

export interface PackageExportsManifest {
    format: typeof PACKAGE_EXPORTS_FORMAT;
    version: typeof PACKAGE_EXPORTS_VERSION;
    alias: string;
    language: "typescript";
    functions: PackageFunctionExport[];
}

export interface PackageIrArtifact {
    format: typeof PACKAGE_IR_FORMAT;
    version: typeof PACKAGE_IR_VERSION;
    alias: string;
    module: LowModule;
}

export function createPackageArtifacts(alias: string, module: LowModule): {
    artifact: PackageIrArtifact;
    exports: PackageExportsManifest;
} {
    if (module.templates.some((template) => template.kind !== "function")) {
        throw new Error("Packages may export functions only");
    }
    for (const template of module.templates) {
        if (!portableIdentifier(template.name) || `${alias}_${template.name}`.length > 64) {
            throw new Error(`Package function name is not portable: ${template.name}`);
        }
        for (const parameter of template.kind === "function" ? template.parameters ?? [] : []) {
            if (!portableIdentifier(parameter.name)) {
                throw new Error(`Package parameter name is not portable: ${parameter.name}`);
            }
        }
        if (template.kind === "function" && !validParameters(template.parameters ?? [])) {
            throw new Error(`Package function signature is not portable: ${template.name}`);
        }
    }
    const names = new Set(module.templates.map((template) => template.name));
    const roots = module.templates
        .filter((template) => template.kind === "function" && template.exported !== false)
        .map((template) => template.name);
    const reachable = new Set<string>(roots);
    const pending = [...roots];
    while (pending.length > 0) {
        const name = pending.pop() as string;
        const template = module.templates.find((candidate) => candidate.name === name);
        for (const statement of template?.body ?? []) {
            if (statement.kind === "call_function" && names.has(statement.function) && !reachable.has(statement.function)) {
                reachable.add(statement.function);
                pending.push(statement.function);
            }
        }
    }
    const functions = module.templates
        .filter((template): template is Extract<LowTemplate, { kind: "function" }> =>
            template.kind === "function" && reachable.has(template.name),
        );
    const rename = new Map(functions.map((template) => [template.name, `${alias}_${template.name}`]));
    const namespaced: LowModule = {
        kind: "module",
        templates: functions.map((template) => ({
            ...template,
            name: rename.get(template.name) as string,
            body: template.body.map((statement) => statement.kind === "call_function"
                ? { ...statement, function: rename.get(statement.function) ?? statement.function }
                : statement),
        })),
    };
    const exportedFunctions: PackageFunctionExport[] = functions
        .filter((template) => template.exported !== false)
        .map((template) => ({
            name: template.name,
            nativeName: rename.get(template.name) as string,
            parameters: [...(template.parameters ?? [])],
        }));
    if (exportedFunctions.length === 0) {
        throw new Error("Package source must export at least one function");
    }
    return {
        artifact: {
            format: PACKAGE_IR_FORMAT,
            version: PACKAGE_IR_VERSION,
            alias,
            module: namespaced,
        },
        exports: {
            format: PACKAGE_EXPORTS_FORMAT,
            version: PACKAGE_EXPORTS_VERSION,
            alias,
            language: "typescript",
            functions: exportedFunctions,
        },
    };
}

export function linkPackageArtifacts(host: LowModule, packages: readonly PackageIrArtifact[]): LowModule {
    return {
        kind: "module",
        templates: [
            ...host.templates,
            ...packages.flatMap((pkg) => pkg.module.templates),
        ],
    };
}

export function pruneHostModule(module: LowModule): LowModule {
    type RunnableTemplate = Extract<LowTemplate, { kind: "function" | "process" }>;
    const key = (kind: RunnableTemplate["kind"], name: string) => `${kind}\0${name}`;
    const runnable = new Map(
        module.templates.flatMap((template) =>
            template.kind === "function" || template.kind === "process"
                ? [[key(template.kind, template.name), template] as const]
                : [],
        ),
    );
    const reachable = new Set<string>();
    const pending: string[] = [];
    const visitBody = (body: readonly import("@nocuft/dfir").LowStatement[]): void => {
        for (const statement of body) {
            const referenced = statement.kind === "call_function"
                ? key("function", statement.function)
                : statement.kind === "start_process"
                  ? key("process", statement.process)
                  : undefined;
            if (referenced && runnable.has(referenced) && !reachable.has(referenced)) {
                pending.push(referenced);
            }
            if (statement.kind === "if") visitBody(statement.body);
        }
    };
    for (const template of runnable.values()) {
        if (template.exported !== false) pending.push(key(template.kind, template.name));
    }
    for (const event of module.templates.filter((template) => template.kind === "event")) {
        visitBody(event.body);
    }
    while (pending.length > 0) {
        const current = pending.pop() as string;
        if (reachable.has(current)) continue;
        reachable.add(current);
        const template = runnable.get(current);
        if (template) visitBody(template.body);
    }
    return {
        kind: "module",
        templates: module.templates.filter((template) =>
            template.kind === "event" || reachable.has(key(template.kind, template.name)),
        ),
    };
}

export function parsePackageIr(value: unknown): PackageIrArtifact {
    if (!isRecord(value) || value.format !== PACKAGE_IR_FORMAT || value.version !== PACKAGE_IR_VERSION
        || typeof value.alias !== "string" || !isLowModule(value.module)) {
        throw new Error("Invalid nocuft-package-ir version 1 artifact");
    }
    return value as unknown as PackageIrArtifact;
}

export function parsePackageExports(value: unknown): PackageExportsManifest {
    if (!isRecord(value) || value.format !== PACKAGE_EXPORTS_FORMAT || value.version !== PACKAGE_EXPORTS_VERSION
        || typeof value.alias !== "string" || value.language !== "typescript" || !Array.isArray(value.functions)) {
        throw new Error("Invalid nocuft-package-exports version 1 manifest");
    }
    for (const entry of value.functions) {
        if (!isRecord(entry) || typeof entry.name !== "string" || typeof entry.nativeName !== "string"
            || !validParameters(entry.parameters)) {
            throw new Error("Invalid function in nocuft-package-exports manifest");
        }
    }
    return value as unknown as PackageExportsManifest;
}

function validParameters(value: unknown): value is LowParameter[] {
    return Array.isArray(value)
        && value.every((parameter) => validExportParameter(parameter))
        && value.filter((parameter) => parameter.kind === "target").length <= 1
        && value.filter((parameter) => parameter.kind === "value").length <= 26;
}

function validExportParameter(value: unknown): boolean {
    if (!isRecord(value) || typeof value.name !== "string") return false;
    if (value.kind === "target") return value.target === "player";
    return value.kind === "value"
        && ["text", "number", "boolean", "component", "location", "item", "sound", "any"].includes(String(value.type));
}

function isLowModule(value: unknown): boolean {
    return isRecord(value) && value.kind === "module" && Array.isArray(value.templates)
        && value.templates.every((template) => isRecord(template)
            && template.kind === "function"
            && typeof template.name === "string"
            && Array.isArray(template.body)
            && (template.parameters === undefined || validParameters(template.parameters)));
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function portableIdentifier(value: string): boolean {
    return /^[A-Za-z_][A-Za-z0-9_]*$/u.test(value);
}
