import type {
    Operation,
    OperationInput,
    OperationTag,
    UnsupportedOperation,
} from "../model.js";
import {
    typescriptInputNames,
    typescriptTagNames,
    typescriptTypeNames,
} from "../policy.js";
import { camelCase, capitalize } from "../util/strings.js";

function getTagDefinition(tag: OperationTag): string {
    if (
        tag.options.length === 2 &&
        tag.options.includes("true") &&
        tag.options.includes("false")
    ) {
        return "boolean";
    }

    return tag.options
        .map((option) => JSON.stringify(camelCase(option)))
        .join(" | ");
}

function getTagDefault(tag: OperationTag): string {
    if (
        tag.options.length === 2 &&
        tag.options.includes("true") &&
        tag.options.includes("false")
    ) {
        return tag.defaultOption;
    }

    return JSON.stringify(camelCase(tag.defaultOption));
}

class UnsupportedTypeError extends Error {}

function renderInput(input: OperationInput, isLast: boolean): string {
    const name = typescriptInputNames[input.id] ?? camelCase(input.id);
    const type = typescriptTypeNames[input.type];
    if (!type) {
        throw new UnsupportedTypeError(`Unsupported input type: ${input.type}`);
    }

    if (input.cardinality === "plural") {
        return isLast ? `...${name}: ${type}[]` : `${name}: ${type}[]`;
    }

    return `${name}${input.optional ? "?" : ""}: ${type}`;
}

interface RenderedOperation {
    topLevel: string;
    methods: string;
}

export interface RenderPlayerActionsResult {
    source: string;
    unsupported: UnsupportedOperation[];
}

function renderOperation(operation: Operation): RenderedOperation {
    if (operation.receiver !== "player") {
        throw new Error(
            `Expected player operation, received ${operation.receiver}`,
        );
    }

    const renderedInputs = operation.inputs.map((input, index) =>
        renderInput(input, index === operation.inputs.length - 1),
    );
    const parameters = renderedInputs.join(", ");

    if (operation.tags.length === 0) {
        return {
            topLevel: "",
            methods: `    ${operation.method}(${parameters}): void;`,
        };
    }

    const optionsName = `${capitalize(operation.method)}Options`;

    const options = operation.tags.map((tag) => {
        const name = typescriptTagNames[tag.id] ?? camelCase(tag.id);

        return [
            `    /** Default: ${getTagDefault(tag)} */`,
            `    readonly ${name}?: ${getTagDefinition(tag)};`,
        ].join("\n");
    });

    const configuredParameters = [
        `options: ${optionsName}`,
        ...renderedInputs,
    ].join(", ");

    return {
        topLevel: [`export interface ${optionsName} {`, ...options, "}"].join(
            "\n",
        ),

        methods: [
            `    ${operation.method}(${parameters}): void;`,
            `    ${operation.method}With(${configuredParameters}): void;`,
        ].join("\n"),
    };
}

export function renderPlayerActions(
    operations: Operation[],
): RenderPlayerActionsResult {
    const rendered: RenderedOperation[] = [];
    const unsupported: UnsupportedOperation[] = [];
    const seenMethods = new Set<string>();

    for (const operation of operations.toSorted((left, right) =>
        left.id.localeCompare(right.id),
    )) {
        if (seenMethods.has(operation.method)) {
            throw new Error(
                `Duplicate generated player method: ${operation.method}`,
            );
        }
        seenMethods.add(operation.method);

        try {
            rendered.push(renderOperation(operation));
        } catch (cause) {
            if (!(cause instanceof UnsupportedTypeError)) {
                throw cause;
            }

            unsupported.push({
                id: operation.id,
                receiver: operation.receiver,
                method: operation.method,
                native: operation.native,
                reason: "unsupported_type",
                detail: cause instanceof Error ? cause.message : String(cause),
            });
        }
    }

    const topLevel = rendered
        .map((op) => op.topLevel)
        .filter(Boolean)
        .join("\n\n");
    const playerActionDefinitions = rendered
        .map((op) => op.methods)
        .join("\n\n");

    return {
        source: [
            "// This file is generated. Do not edit manually.",
            "",
            "export type MessagePart = string | number | boolean;",
            "",
            `${topLevel}`,
            "",
            "export interface PlayerActions {",
            `${playerActionDefinitions}`,
            "}",
            "",
        ].join("\n"),
        unsupported,
    };
}

export function renderUnsupportedActions(
    operations: UnsupportedOperation[],
): string {
    const playerActions = operations
        .toSorted((left, right) => left.id.localeCompare(right.id))
        .map((operation) =>
            [
                "    /**",
                `     * DiamondFire ${operation.native.block}/${operation.native.action}.`,
                `     * Unsupported: ${operation.reason}.`,
                `     * ${operation.detail}`,
                "     */",
                `    readonly ${operation.method}: UnsupportedAction<`,
                `        ${JSON.stringify(operation.native.action)},`,
                `        ${JSON.stringify(operation.reason)},`,
                `        ${JSON.stringify(operation.detail)}`,
                "    >;",
            ].join("\n"),
        );

    return [
        "// This file is generated. Do not edit manually.",
        "",
        "export interface UnsupportedAction<",
        "    NativeName extends string,",
        "    Reason extends string,",
        "    Detail extends string,",
        "> {",
        "    readonly nativeName: NativeName;",
        "    readonly reason: Reason;",
        "    readonly detail: Detail;",
        "}",
        "",
        "export interface UnsupportedPlayerActions {",
        ...playerActions,
        "}",
        "",
    ].join("\n");
}
