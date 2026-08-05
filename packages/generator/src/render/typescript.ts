import type {
    Operation,
    OperationInput,
    OperationTag,
    UnsupportedOperation,
    OperationReceiver,
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
    const names = input.acceptedTypes.map((type) => {
        const policy = typescriptTypes[type];
        if (!policy) {
            throw new UnsupportedTypeError(`Unsupported input type: ${type}`);
        }
        return policy.name;
    });
    const uniqueNames = [...new Set(names)];
    if (uniqueNames.length === 0) {
        throw new UnsupportedTypeError(`Input ${input.id} has no types`);
    }
    const type = uniqueNames.join(" | ");
    const elementType = uniqueNames.length > 1 ? `(${type})` : type;

    if (input.cardinality === "plural") {
        const required = Array.from(
            { length: input.minimumLength },
            () => type,
        );
        const pluralType =
            required.length === 0
                ? `${elementType}[]`
                : `[${[...required, `...${elementType}[]`].join(", ")}]`;

        if (isLast) {
            return `...${name}: ${pluralType}`;
        }

        if (input.minimumLength > 0) {
            return `${name}: ${pluralType}`;
        }

        return hasRequiredAfter
            ? `${name}: ${pluralType} | undefined`
            : `${name}?: ${pluralType}`;
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
    bindings: Record<string, TypeScriptIntrinsicBinding>;
}

export interface TypeScriptParameterBinding {
    sourceIndex: number;
    input: string;
    types: string[];
    kind: "value" | "array" | "rest";
    optional: boolean;
    minimumLength: number;
}

interface TypeScriptOptionBinding {
    tag: string;
    kind: "boolean" | "string";
    values: Record<string, string>;
}

interface TypeScriptIntrinsicBinding {
    operation: string;
    receiver: OperationReceiver;
    parameters: TypeScriptParameterBinding[];
    optionsIndex?: number;
    optionTags?: Record<string, TypeScriptOptionBinding>;
}

function renderOperationDocumentation(
    operation: Operation,
    summary = operation.description,
    indentation = "    ",
): string {
    if (!summary) {
        return "";
    }

    const safeSummary = summary.replaceAll("*/", "*\\/");
    return `${indentation}/** ${safeSummary} */`;
}

export interface RenderPlayerActionsResult {
    source: string;
    intrinsicSource: string;
    unsupported: UnsupportedOperation[];
}

export function createParameterBindings(
    operation: Pick<Operation, "inputs">,
    sourceOffset = 0,
): TypeScriptParameterBinding[] {
    return operation.inputs.map((input, index) => ({
        sourceIndex: index + sourceOffset,
        input: input.id,
        types: input.acceptedTypes,
        kind:
            input.cardinality === "plural" &&
            index === operation.inputs.length - 1
                ? ("rest" as const)
                : input.cardinality === "plural"
                  ? ("array" as const)
                  : ("value" as const),
        optional: isOptionalInput(input),
        minimumLength:
            input.cardinality === "plural" ? input.minimumLength : 1,
    }));
}

export function renderOperationParameters(
    operation: Pick<Operation, "inputs">,
): string {
    return operation.inputs
        .map((input, index) =>
            renderInput(
                input,
                index === operation.inputs.length - 1,
                hasRequiredInputAfter(operation.inputs, index),
            ),
        )
        .join(", ");
}

function createIntrinsicBinding(
    operation: Operation,
    configured: boolean,
): TypeScriptIntrinsicBinding {
    const sourceOffset = configured ? 1 : 0;
    const parameters = createParameterBindings(operation, sourceOffset);

    if (!configured) {
        return {
            operation: operation.id,
            receiver: operation.receiver,
            parameters,
        };
    }

    return {
        operation: operation.id,
        receiver: operation.receiver,
        optionsIndex: 0,
        parameters,
        optionTags: Object.fromEntries(
            operation.tags.map((tag) => {
                const isBoolean =
                    tag.options.length === 2 &&
                    tag.options.includes("true") &&
                    tag.options.includes("false");

                return [
                    typescriptTagNames[tag.id] ?? camelCase(tag.id),
                    {
                        tag: tag.id,
                        kind: isBoolean ? "boolean" : "string",
                        values: Object.fromEntries(
                            tag.options.map((option) => [
                                isBoolean ? option : camelCase(option),
                                option,
                            ]),
                        ),
                    },
                ];
            }),
        ),
    };
}

function renderOperation(operation: Operation): RenderedOperation {
    const renderedInputs = operation.inputs.map((input, index) =>
        renderInput(input, index === operation.inputs.length - 1, hasRequiredInputAfter(operation.inputs, index)),
    );
    const parameters = renderOperationParameters(operation);
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
            bindings: {
                [operation.method]: createIntrinsicBinding(operation, false),
            },
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
        bindings: {
            [operation.method]: createIntrinsicBinding(operation, false),
            [`${operation.method}With`]: createIntrinsicBinding(
                operation,
                true,
            ),
        },
    };
}

type TypeImports = Map<string, Set<string>>;

function collectTypeImports(operation: Operation, imports: TypeImports): void {
    for (const input of operation.inputs) {
        for (const type of input.acceptedTypes) {
            const policy = typescriptTypes[type];

            if (!policy?.importFrom) continue;

            const names = imports.get(policy.importFrom) ?? new Set<string>();

            names.add(policy.name);
            imports.set(policy.importFrom, names);
        }
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
    return renderActions(operations, "player");
}

export function renderEntityActions(
    operations: Operation[],
): RenderPlayerActionsResult {
    return renderActions(operations, "entity");
}

export function renderGameActions(
    operations: Operation[],
): RenderPlayerActionsResult {
    return renderActions(operations, "game");
}

export function renderControlActions(
    operations: Operation[],
): RenderPlayerActionsResult {
    return renderActions(operations, "control");
}

function renderActions(
    operations: Operation[],
    receiver: OperationReceiver,
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
                `Duplicate generated ${receiver} method: ${operation.method}`,
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
    const actionDefinitions = rendered
        .map((op) => op.methods)
        .join("\n\n");
    const importLines = renderTypeImports(imports);
    const bindings = Object.assign(
        {},
        ...rendered.map((operation) => operation.bindings),
    );

    return {
        source: [
            "// This file is generated. Do not edit manually.",
            "",
            ...importLines,
            ...(importLines.length > 0 ? [""] : []),
            `${topLevel}`,
            "",
            `export interface ${capitalize(receiver)}Actions {`,
            `${actionDefinitions}`,
            "}",
            "",
        ].join("\n"),
        intrinsicSource: [
            "// This file is generated. Do not edit manually.",
            "",
            `export const ${receiver}Intrinsics = ${JSON.stringify(
                bindings,
                null,
                4,
            )} as const;`,
            "",
        ].join("\n"),
        unsupported,
    };
}

export function renderUnsupportedActions(
    operations: UnsupportedOperation[],
    receiver: OperationReceiver = "player",
): string {
    const actions = operations
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
        `export interface Unsupported${capitalize(receiver)}Actions {`,
        ...actions,
        "}",
        "",
    ].join("\n");
}
