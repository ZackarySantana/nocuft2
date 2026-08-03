import type {
    Operation,
    OperationInput,
    OperationTag,
    UnsupportedOperation,
} from "../model.js";
import {
    typescriptInputNames,
    typescriptTagNames,
    typescriptTypes,
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

function isOptionalInput(input: OperationInput): boolean {
    return input.cardinality === "single"
        ? input.optional
        : input.minimumLength === 0;
}

function hasRequiredInputAfter(
    inputs: readonly OperationInput[],
    index: number,
): boolean {
    return inputs.slice(index + 1).some((input) => !isOptionalInput(input));
}

function renderInput(
    input: OperationInput,
    isLast: boolean,
    hasRequiredAfter: boolean,
): string {
    const name = typescriptInputNames[input.id] ?? camelCase(input.id);
    const policy = typescriptTypes[input.type];
    if (!policy) {
        throw new UnsupportedTypeError(`Unsupported input type: ${input.type}`);
    }
    const type = policy.name;

    if (input.cardinality === "plural") {
        if (isLast) {
            return `...${name}: ${type}[]`;
        }

        return input.minimumLength === 0 && hasRequiredAfter
            ? `${name}: ${type}[] | undefined`
            : `${name}: ${type}[]`;
    }

    if (!input.optional) {
        return `${name}: ${type}`;
    }

    return hasRequiredAfter
        ? `${name}: ${type} | undefined`
        : `${name}?: ${type}`;
}

interface RenderedOperation {
    topLevel: string;
    methods: string;
}

function renderOperationDocumentation(
    operation: Operation,
    summary = operation.description,
    indentation = "    ",
): string {
    if (!summary && operation.omittedInputs.length === 0) {
        return "";
    }

    const safeSummary = summary.replaceAll("*/", "*\\/");

    if (operation.omittedInputs.length === 0) {
        return `${indentation}/** ${safeSummary} */`;
    }

    const remarks = operation.omittedInputs.map(
        (input) =>
            `${indentation} * DiamondFire native input index ${input.native.index} ` +
            `(slot ID ${input.native.slotId}) is omitted because its public ` +
            "metadata is unavailable. DiamondFire's default behavior will be used.",
    );

    return [
        `${indentation}/**`,
        ...(safeSummary
            ? [`${indentation} * ${safeSummary}`, `${indentation} *`]
            : []),
        `${indentation} * @remarks`,
        ...remarks,
        `${indentation} */`,
    ].join("\n");
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
        renderInput(
            input,
            index === operation.inputs.length - 1,
            hasRequiredInputAfter(operation.inputs, index),
        ),
    );
    const parameters = renderedInputs.join(", ");
    const documentation = renderOperationDocumentation(operation);

    if (operation.tags.length === 0) {
        return {
            topLevel: "",
            methods: [
                documentation,
                `    ${operation.method}(${parameters}): void;`,
            ]
                .filter(Boolean)
                .join("\n"),
        };
    }

    const optionsName = `${capitalize(operation.method)}Options`;
    const optionsDocumentation = renderOperationDocumentation(
        operation,
        `Options for ${operation.method}.`,
        "",
    );

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
    const method = [
        documentation,
        `    ${operation.method}(${parameters}): void;`,
    ]
        .filter(Boolean)
        .join("\n");
    const configuredMethod = [
        documentation,
        `    ${operation.method}With(${configuredParameters}): void;`,
    ]
        .filter(Boolean)
        .join("\n");

    return {
        topLevel: [
            optionsDocumentation,
            `export interface ${optionsName} {`,
            ...options,
            "}",
        ]
            .filter(Boolean)
            .join("\n"),

        methods: [method, configuredMethod].join("\n\n"),
    };
}

type TypeImports = Map<string, Set<string>>;

function collectTypeImports(operation: Operation, imports: TypeImports): void {
    for (const input of operation.inputs) {
        const policy = typescriptTypes[input.type];

        if (!policy?.importFrom) continue;

        const names = imports.get(policy.importFrom) ?? new Set<string>();

        names.add(policy.name);
        imports.set(policy.importFrom, names);
    }
}

function renderTypeImports(imports: TypeImports): string[] {
    return [...imports.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([path, names]) => {
            const importedNames = [...names].sort().join(", ");

            return (
                `import type { ${importedNames} } ` +
                `from ${JSON.stringify(path)};`
            );
        });
}

export function renderPlayerActions(
    operations: Operation[],
): RenderPlayerActionsResult {
    const rendered: RenderedOperation[] = [];
    const unsupported: UnsupportedOperation[] = [];
    const seenMethods = new Set<string>();
    const imports: TypeImports = new Map();

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
            const renderedOperation = renderOperation(operation);
            rendered.push(renderedOperation);
            collectTypeImports(operation, imports);
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
    const importLines = renderTypeImports(imports);

    return {
        source: [
            "// This file is generated. Do not edit manually.",
            "",
            ...importLines,
            ...(importLines.length > 0 ? [""] : []),
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
