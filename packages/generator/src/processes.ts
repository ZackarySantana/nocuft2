import type { OperationTag } from "./model.js";
import type { RawAction } from "./actiondump.js";
import { camelCase, normalizeName } from "./util/strings.js";

export interface ProcessBindings {
    declaration: ProcessBinding;
    start: ProcessBinding;
}

export interface ProcessBinding {
    native: {
        block: "process" | "start_process";
        action: string;
    };
    tags: OperationTag[];
}

export function normalizeProcessBindings(
    actions: readonly RawAction[],
): ProcessBindings {
    return {
        declaration: normalizeBinding(actions, "PROCESS", "process"),
        start: normalizeBinding(actions, "START PROCESS", "start_process"),
    };
}

function normalizeBinding(
    actions: readonly RawAction[],
    codeblockName: "PROCESS" | "START PROCESS",
    block: "process" | "start_process",
): ProcessBinding {
    const action = actions.find((candidate) =>
        candidate.codeblockName === codeblockName &&
        candidate.name === "dynamic" &&
        candidate.legacyReplacement === undefined
    );
    if (!action) {
        throw new Error(`Missing ${codeblockName} / dynamic`);
    }
    return {
        native: { block, action: action.subAction.trim() },
        tags: action.tags.map((tag) => ({
            id: normalizeName(tag.name),
            defaultOption: normalizeName(tag.defaultOption),
            options: tag.options.map((option) => normalizeName(option.name)),
            native: {
                name: tag.name,
                slot: tag.slot,
                options: Object.fromEntries(tag.options.map((option) => [
                    normalizeName(option.name),
                    option.name,
                ])),
            },
        })),
    };
}

export function renderProcessSdk(bindings: ProcessBindings): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        renderOptions("CreateProcessOptions", bindings.declaration.tags),
        "",
        renderOptions("StartProcessOptions", bindings.start.tags),
        "",
    ].join("\n");
}

function renderOptions(name: string, tags: readonly OperationTag[]): string {
    return [
        `export interface ${name} {`,
        ...tags.flatMap((tag) => [
            `    /** Default: ${renderDefault(tag)} */`,
            `    readonly ${camelCase(tag.id)}?: ${renderTagType(tag)};`,
        ]),
        "}",
    ].join("\n");
}

function renderTagType(tag: OperationTag): string {
    if (isBooleanTag(tag)) return "boolean";
    return tag.options.map((option) => JSON.stringify(camelCase(option))).join(" | ");
}

function renderDefault(tag: OperationTag): string {
    return isBooleanTag(tag)
        ? tag.defaultOption
        : JSON.stringify(camelCase(tag.defaultOption));
}

function isBooleanTag(tag: OperationTag): boolean {
    return tag.options.length === 2 &&
        tag.options.includes("true") &&
        tag.options.includes("false");
}

export function renderFrontendProcessBindings(bindings: ProcessBindings): string {
    return renderBindings("processBindings", bindings, true);
}

export function renderCompilerProcessBindings(bindings: ProcessBindings): string {
    return renderBindings("processBindings", bindings, false);
}

function renderBindings(
    name: string,
    bindings: ProcessBindings,
    frontend: boolean,
): string {
    const rendered = frontend
        ? {
              declaration: frontendBinding(bindings.declaration),
              start: frontendBinding(bindings.start),
          }
        : bindings;
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const ${name} = ${JSON.stringify(rendered, null, 4)} as const;`,
        "",
    ].join("\n");
}

function frontendBinding(binding: ProcessBinding) {
    return {
        optionTags: Object.fromEntries(binding.tags.map((tag) => [
            camelCase(tag.id),
            {
                tag: tag.id,
                kind: isBooleanTag(tag) ? "boolean" : "string",
                values: Object.fromEntries(tag.options.map((option) => [
                    isBooleanTag(tag) ? option : camelCase(option),
                    option,
                ])),
            },
        ])),
    };
}
