import type { LowModule, LowParameter, LowStatement, LowTemplate, LowValue } from "@nocuft/dfir";
import { isValueType } from "@nocuft/dfir";

export const PACKAGE_ARTIFACT_FORMAT = "nocuft-package";
export const PACKAGE_ARTIFACT_VERSION = 2;
export const NATIVE_NAME_LIMIT = 64;

export type PackageExportParameter = LowParameter;

export interface PackageFunctionExport {
    name: string;
    nativeName: string;
    parameters: PackageExportParameter[];
}

export interface PackageArtifact {
    format: typeof PACKAGE_ARTIFACT_FORMAT;
    version: typeof PACKAGE_ARTIFACT_VERSION;
    alias: string;
    language: "typescript";
    module: LowModule;
    functions: PackageFunctionExport[];
}

export function createPackageArtifact(alias: string, module: LowModule): PackageArtifact {
    if (module.templates.some((template) => template.kind !== "function")) {
        throw new Error("Packages may export functions only");
    }
    for (const template of module.templates) {
        if (!portableIdentifier(template.name) || `${alias}_${template.name}`.length > NATIVE_NAME_LIMIT) {
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
        visitStatements(template?.body ?? [], (statement) => {
            if (statement.kind !== "call_function") return;
            if (names.has(statement.function) && !reachable.has(statement.function)) {
                reachable.add(statement.function);
                pending.push(statement.function);
            }
        });
    }
    const functions = module.templates
        .filter((template): template is Extract<LowTemplate, { kind: "function" }> =>
            template.kind === "function" && reachable.has(template.name),
        );
    const rename = new Map(functions.map((template) => [template.name, `${alias}_${template.name}`]));
    const renameBody = (body: readonly LowStatement[]): LowStatement[] => body.map((statement) => {
        if (statement.kind === "call_function") {
            return { ...statement, function: rename.get(statement.function) ?? statement.function };
        }
        if (statement.kind === "if") {
            return {
                ...statement,
                body: renameBody(statement.body),
                ...(statement.elseBody ? { elseBody: renameBody(statement.elseBody) } : {}),
            };
        }
        if (statement.kind === "repeat") {
            return { ...statement, body: renameBody(statement.body) };
        }
        return statement;
    });
    const namespaceValue = (value: LowValue): LowValue => {
        if (value.kind !== "variable" || value.scope === "line") return value;
        const nativeName = packageVariableName(alias, value.scope, value.owner, value.name);
        if (nativeName.length > NATIVE_NAME_LIMIT) {
            throw new Error(
                `Package variable name is longer than ${NATIVE_NAME_LIMIT} characters: ${nativeName}`,
            );
        }
        return { ...value, name: nativeName };
    };
    const namespaceBody = (body: readonly LowStatement[]): LowStatement[] => body.map((statement) => {
        const namespaced = statement.kind === "call_function" || statement.kind === "start_process"
            ? { ...statement, arguments: statement.arguments.map(namespaceValue) }
            : "arguments" in statement
              ? { ...statement, arguments: statement.arguments.map((argument) => ({
                  ...argument,
                  values: argument.values.map(namespaceValue),
              })) }
              : statement;
        if (namespaced.kind === "if") {
            return {
                ...namespaced,
                body: namespaceBody(namespaced.body),
                ...(namespaced.elseBody ? { elseBody: namespaceBody(namespaced.elseBody) } : {}),
            };
        }
        if (namespaced.kind === "repeat") {
            return { ...namespaced, body: namespaceBody(namespaced.body) };
        }
        return namespaced;
    });
    const namespaced: LowModule = {
        kind: "module",
        templates: functions.map((template) => ({
            ...template,
            name: rename.get(template.name) as string,
            body: namespaceBody(renameBody(template.body)),
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
    const artifact: PackageArtifact = {
        format: PACKAGE_ARTIFACT_FORMAT,
        version: PACKAGE_ARTIFACT_VERSION,
        alias,
        language: "typescript",
        module: namespaced,
        functions: exportedFunctions,
    };
    assertPackageNamespace(artifact);
    return artifact;
}

export function linkPackageArtifacts(host: LowModule, packages: readonly PackageArtifact[]): LowModule {
    const hostTemplates = new Set(host.templates.map((template) => templateKey(template.kind, template.name)));
    const owners = new Map<string, string>();
    for (const pkg of packages) {
        for (const template of pkg.module.templates) {
            const key = templateKey(template.kind, template.name);
            if (hostTemplates.has(key)) {
                throw new Error(
                    `Package ${pkg.alias} declares a template the host already declares: ${template.name}`,
                );
            }
            const owner = owners.get(key);
            if (owner !== undefined) {
                throw new Error(
                    `Packages ${owner} and ${pkg.alias} both declare the template: ${template.name}`,
                );
            }
            owners.set(key, pkg.alias);
        }
    }
    return {
        kind: "module",
        templates: [
            ...host.templates,
            ...packages.flatMap((pkg) => pkg.module.templates),
        ],
    };
}

export function pruneHostModule(module: LowModule): LowModule {
    const runnable = new Map(
        module.templates.flatMap((template) =>
            template.kind === "function" || template.kind === "process"
                ? [[templateKey(template.kind, template.name), template] as const]
                : [],
        ),
    );
    const reachable = new Set<string>();
    const pending: string[] = [];
    const visitBody = (body: readonly LowStatement[]): void => {
        for (const statement of body) {
            const referenced = statement.kind === "call_function"
                ? templateKey("function", statement.function)
                : statement.kind === "start_process"
                  ? templateKey("process", statement.process)
                  : undefined;
            if (referenced && runnable.has(referenced) && !reachable.has(referenced)) {
                pending.push(referenced);
            }
            if (statement.kind === "if") {
                visitBody(statement.body);
                if (statement.elseBody) visitBody(statement.elseBody);
            }
            if (statement.kind === "repeat") visitBody(statement.body);
        }
    };
    for (const template of runnable.values()) {
        if (template.exported !== false) pending.push(templateKey(template.kind, template.name));
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
            template.kind === "event" || reachable.has(templateKey(template.kind, template.name)),
        ),
    };
}

export function parsePackageArtifact(value: unknown): PackageArtifact {
    if (!isRecord(value) || value.format !== PACKAGE_ARTIFACT_FORMAT || value.version !== PACKAGE_ARTIFACT_VERSION
        || typeof value.alias !== "string" || !validPackageAlias(value.alias)
        || value.language !== "typescript" || !isLowModule(value.module)
        || !Array.isArray(value.functions) || value.functions.length === 0) {
        throw new Error(`Invalid ${PACKAGE_ARTIFACT_FORMAT} version ${PACKAGE_ARTIFACT_VERSION} artifact`);
    }
    const templates = (value.module as LowModule).templates;
    for (const entry of value.functions) {
        if (!isRecord(entry) || typeof entry.name !== "string" || !portableIdentifier(entry.name)
            || typeof entry.nativeName !== "string" || !portableIdentifier(entry.nativeName)
            || !validParameters(entry.parameters)
            || !declaredBy(templates, entry.nativeName, entry.parameters)) {
            throw new Error(`Invalid ${PACKAGE_ARTIFACT_FORMAT} version ${PACKAGE_ARTIFACT_VERSION} artifact`);
        }
    }
    const artifact = value as unknown as PackageArtifact;
    assertPackageNamespace(artifact);
    return artifact;
}

function assertPackageNamespace(artifact: PackageArtifact): void {
    const prefix = `${artifact.alias}_`;
    const declared = new Set<string>();
    for (const template of artifact.module.templates) {
        if (!template.name.startsWith(prefix)) {
            throw new Error(`Package template is outside the ${artifact.alias} namespace: ${template.name}`);
        }
        if (declared.has(template.name)) {
            throw new Error(`Package ${artifact.alias} declares a duplicate template: ${template.name}`);
        }
        declared.add(template.name);
    }
    const names = new Set<string>();
    const nativeNames = new Set<string>();
    for (const entry of artifact.functions) {
        if (names.has(entry.name)) {
            throw new Error(`Package ${artifact.alias} exports a duplicate function: ${entry.name}`);
        }
        if (nativeNames.has(entry.nativeName)) {
            throw new Error(`Package ${artifact.alias} exports a duplicate template: ${entry.nativeName}`);
        }
        if (entry.nativeName !== `${prefix}${entry.name}`) {
            throw new Error(
                `Package export ${entry.name} must be declared by ${prefix}${entry.name}, not ${entry.nativeName}`,
            );
        }
        names.add(entry.name);
        nativeNames.add(entry.nativeName);
    }
    for (const template of artifact.module.templates) {
        visitStatements(template.body, (statement) => {
            if (statement.kind === "start_process") {
                throw new Error(`Package ${artifact.alias} may not start processes: ${statement.process}`);
            }
            if (statement.kind === "call_function" && !declared.has(statement.function)) {
                throw new Error(
                    `Package ${artifact.alias} calls a function it does not declare: ${statement.function}`,
                );
            }
        });
    }
}

function visitStatements(
    body: readonly LowStatement[],
    visit: (statement: LowStatement) => void,
): void {
    for (const statement of body) {
        visit(statement);
        if (statement.kind === "if") {
            visitStatements(statement.body, visit);
            if (statement.elseBody) visitStatements(statement.elseBody, visit);
        }
        if (statement.kind === "repeat") visitStatements(statement.body, visit);
    }
}

function templateKey(kind: LowTemplate["kind"], name: string): string {
    return `${kind}\0${name}`;
}

function declaredBy(
    templates: readonly LowTemplate[],
    nativeName: string,
    parameters: readonly LowParameter[],
): boolean {
    const template = templates.find((candidate) =>
        candidate.kind === "function" && candidate.name === nativeName);
    return template !== undefined && template.kind === "function"
        && JSON.stringify(template.parameters ?? []) === JSON.stringify(parameters);
}

function validParameters(value: unknown): value is LowParameter[] {
    return Array.isArray(value)
        && value.every((parameter) => validExportParameter(parameter))
        && value.filter((parameter) => parameter.kind === "target").length <= 1
        && value.filter((parameter) => parameter.kind === "value").length <= 26
        && value.filter((parameter) => parameter.kind === "value" && parameter.rest === true).length <= 1
        && value.every((parameter, index) => parameter.rest !== true || index === value.length - 1);
}

function validExportParameter(value: unknown): boolean {
    if (!isRecord(value) || typeof value.name !== "string" || !portableIdentifier(value.name)) return false;
    if (value.kind === "target") return value.target === "player";
    return value.kind === "value"
        && isValueType(value.type)
        && (value.rest === undefined || value.rest === false ||
            (value.rest === true && isRecord(value.type) && value.type.kind === "list"));
}

function isLowModule(value: unknown): boolean {
    return isRecord(value) && value.kind === "module" && Array.isArray(value.templates)
        && value.templates.every((template) => isRecord(template)
            && template.kind === "function"
            && typeof template.name === "string" && portableIdentifier(template.name)
            && validBody(template.body)
            && (template.parameters === undefined || validParameters(template.parameters)));
}

function validBody(value: unknown): boolean {
    return Array.isArray(value) && value.every((statement) => {
        if (!isRecord(statement) || typeof statement.kind !== "string") return false;
        if (statement.kind === "call_function") {
            return typeof statement.function === "string" && portableIdentifier(statement.function)
                && validValues(statement.arguments)
                && (statement.target === undefined || validTarget(statement.target));
        }
        if (statement.kind === "start_process") {
            return typeof statement.process === "string" && typeof statement.block === "string"
                && typeof statement.action === "string" && validValues(statement.arguments)
                && validTags(statement.tags) && validSequentialSlots(statement.arguments, statement.tags);
        }
        if (statement.kind === "select_object" || statement.kind === "action") {
            return typeof statement.action === "string"
                && (statement.kind !== "action" || typeof statement.block === "string")
                && validArguments(statement.arguments, statement.tags) && validTags(statement.tags)
                && (statement.target === undefined || validTarget(statement.target));
        }
        if (statement.kind === "if") {
            return typeof statement.block === "string" && typeof statement.action === "string"
                && validArguments(statement.arguments, statement.tags) && validTags(statement.tags)
                && validBody(statement.body)
                && (statement.elseBody === undefined || validBody(statement.elseBody))
                && (statement.target === undefined || validTarget(statement.target));
        }
        if (statement.kind === "repeat") {
            return typeof statement.block === "string" && typeof statement.action === "string"
                && validArguments(statement.arguments, statement.tags) && validTags(statement.tags) && validBody(statement.body);
        }
        return false;
    });
}

function validArguments(value: unknown, tags: unknown): boolean {
    if (!Array.isArray(value) || !Array.isArray(tags)) return false;
    const arguments_ = value.toSorted((left, right) =>
        isRecord(left) && isRecord(right) ? Number(left.index) - Number(right.index) : 0);
    const nativeIndexes = new Set<number>();
    const occupied = new Set<number>();
    let expansion = 0;
    for (const argument of arguments_) {
        if (!isRecord(argument) || !Number.isInteger(argument.index)
            || Number(argument.index) < 0 || Number(argument.index) > 26
            || nativeIndexes.has(Number(argument.index))
            || (argument.layout !== "single" && argument.layout !== "plural")
            || !Number.isInteger(argument.minimumLength) || Number(argument.minimumLength) < 0
            || !validValues(argument.values)) return false;
        nativeIndexes.add(Number(argument.index));
        const values = argument.values as unknown[];
        if ((argument.layout === "single" && (argument.minimumLength !== 1 || values.length !== 1))
            || (argument.layout === "plural" && values.length < Number(argument.minimumLength))) return false;
        const start = Number(argument.index) + expansion;
        for (let offset = 0; offset < values.length; offset++) {
            const slot = start + offset;
            if (slot > 26 || occupied.has(slot)) return false;
            occupied.add(slot);
        }
        if (argument.layout === "plural") expansion += Math.max(0, values.length - 1);
    }
    return validTagSlots(tags, occupied);
}

function validSequentialSlots(values: unknown, tags: unknown): boolean {
    if (!Array.isArray(values) || values.length > 27 || !Array.isArray(tags)) return false;
    return validTagSlots(tags, new Set(values.map((_, slot) => slot)));
}

function validTagSlots(tags: unknown[], occupied: Set<number>): boolean {
    for (const tag of tags) {
        if (!isRecord(tag) || !isRecord(tag.native) || !Number.isInteger(tag.native.slot)) return false;
        const slot = Number(tag.native.slot);
        if (slot < 0 || slot > 26 || occupied.has(slot)) return false;
        occupied.add(slot);
    }
    return true;
}

function validValues(value: unknown): boolean {
    return Array.isArray(value) && value.length <= 27 && value.every(validLowValue);
}

function validLowValue(value: unknown): boolean {
    if (!isRecord(value) || typeof value.kind !== "string") return false;
    if (value.kind === "text" || value.kind === "component" || value.kind === "sound") return typeof value.value === "string";
    if (value.kind === "number") return typeof value.value === "number" && Number.isFinite(value.value);
    if (value.kind === "location") return [value.x, value.y, value.z].every((part) => typeof part === "number" && Number.isFinite(part));
    if (value.kind === "item") return (typeof value.snbt === "string" && value.snbt.trim().length > 0)
        || (typeof value.id === "string" && typeof value.count === "number" && Number.isFinite(value.count)
            && Number.isInteger(value.count) && value.count >= 1);
    if (value.kind === "parameter") return typeof value.name === "string" && isValueType(value.valueType);
    if (value.kind === "variable") return typeof value.name === "string"
        && ["line", "unsaved", "saved"].includes(String(value.scope))
        && (value.scope === "line"
            ? value.owner === undefined
            : value.owner === "plot" || value.owner === "player")
        && isValueType(value.valueType);
    if (value.kind === "game_value") return typeof value.name === "string" && typeof value.target === "string"
        && (value.valueType === "list" || value.valueType === "vector" || isValueType(value.valueType));
    return false;
}

function validTags(value: unknown): boolean {
    return Array.isArray(value) && value.every((tag) => isRecord(tag)
        && typeof tag.id === "string" && typeof tag.option === "string" && isRecord(tag.native)
        && typeof tag.native.name === "string" && typeof tag.native.option === "string"
        && Number.isInteger(tag.native.slot) && Number(tag.native.slot) >= 0 && Number(tag.native.slot) <= 26);
}

function validTarget(value: unknown): boolean {
    return value === "all_players" || value === "current_player" || value === "selection";
}

function validPackageAlias(value: string): boolean {
    return /^[a-z][a-z0-9]{0,15}$/u.test(value);
}

function packageVariableName(
    alias: string,
    scope: "unsaved" | "saved",
    owner: "plot" | "player",
    name: string,
): string {
    return `__nocuft_pkg_${alias}_${scope[0]}_${owner === "player" ? "p" : "g"}_${name}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function portableIdentifier(value: string): boolean {
    return /^[A-Za-z_][A-Za-z0-9_]*$/u.test(value);
}
