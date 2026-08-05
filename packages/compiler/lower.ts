import type {
    HighExpression,
    HighIntrinsicStatement,
    HighModule,
    LowActionStatement,
    LowModule,
    LowValue,
} from "@nocuft/dfir";
import { playerOperations } from "./generated/player-operations.js";
import { sounds } from "./generated/sounds.js";

interface CompilerOperation {
    native: {
        block: string;
        action: string;
    };
    inputs: readonly {
        id: string;
        acceptedTypes: readonly string[];
        cardinality: "single" | "plural";
        optional?: boolean;
        minimumLength?: number;
        native: {
            index: number;
        };
    }[];
    tags: readonly {
        id: string;
        defaultOption: string;
        options: readonly string[];
        native: {
            name: string;
            slot: number;
            options: Readonly<Record<string, string>>;
        };
    }[];
}

const operations: Readonly<Record<string, CompilerOperation>> =
    playerOperations;
const soundCatalog: Readonly<Record<string, string>> = sounds;

export function lowerHighModule(module: HighModule): LowModule {
    return {
        kind: "module",
        templates: module.functions.map((func) => ({
            kind: "function",
            name: func.name,
            body: func.body.map(lowerIntrinsic),
        })),
    };
}

function lowerIntrinsic(statement: HighIntrinsicStatement): LowActionStatement {
    const operation = operations[statement.operation];
    if (!operation) {
        throw new Error(`Unknown intrinsic operation: ${statement.operation}`);
    }
    if (
        statement.receiver.kind !== "player_selection" ||
        statement.receiver.selection !== "all"
    ) {
        throw new Error(`Unsupported receiver for ${statement.operation}`);
    }

    const inputsById = new Map(
        operation.inputs.map((input) => [input.id, input]),
    );
    for (const argumentName of Object.keys(statement.arguments)) {
        if (!inputsById.has(argumentName)) {
            throw new Error(
                `Unknown argument ${argumentName} for ${statement.operation}`,
            );
        }
    }

    const args = operation.inputs.flatMap((input) => {
        const argument = statement.arguments[input.id];
        if (argument === undefined) {
            const required =
                input.cardinality === "single"
                    ? !input.optional
                    : (input.minimumLength ?? 0) > 0;
            if (required) {
                throw new Error(
                    `Missing required argument ${input.id} for ${statement.operation}`,
                );
            }
            return [];
        }

        const plural = Array.isArray(argument);
        if (plural !== (input.cardinality === "plural")) {
            throw new Error(
                `Invalid cardinality for ${input.id} in ${statement.operation}`,
            );
        }

        const expressions = plural ? argument : [argument];
        const minimumLength = input.minimumLength ?? 1;
        if (expressions.length < minimumLength) {
            throw new Error(
                `Expected at least ${minimumLength} values for ${input.id} in ${statement.operation}`,
            );
        }

        return [
            {
                index: input.native.index,
                layout: input.cardinality,
                minimumLength,
                values: expressions.map((expression) =>
                    lowerExpression(expression, input.acceptedTypes),
                ),
            },
        ];
    });

    const selectedOptions = statement.options ?? {};
    const tagsById = new Map(operation.tags.map((tag) => [tag.id, tag]));
    for (const optionName of Object.keys(selectedOptions)) {
        if (!tagsById.has(optionName)) {
            throw new Error(
                `Unknown option ${optionName} for ${statement.operation}`,
            );
        }
    }

    return {
        kind: "action",
        block: operation.native.block,
        action: operation.native.action,
        target: "all_players",
        arguments: args.toSorted((left, right) => left.index - right.index),
        tags: operation.tags.map((tag) => {
            const option = selectedOptions[tag.id] ?? tag.defaultOption;
            if (!tag.options.includes(option)) {
                throw new Error(
                    `Invalid option ${option} for ${tag.id} in ${statement.operation}`,
                );
            }
            const nativeOption = tag.native.options[option];
            if (!nativeOption) {
                throw new Error(
                    `Missing native option ${option} for ${tag.id} in ${statement.operation}`,
                );
            }

            return {
                id: tag.id,
                option,
                native: {
                    name: tag.native.name,
                    option: nativeOption,
                    slot: tag.native.slot,
                },
            };
        }),
    };
}

function lowerExpression(
    expression: HighExpression,
    acceptedTypes: readonly string[],
): LowValue {
    if (
        expression.kind === "string" &&
        (acceptedTypes.includes("text") || acceptedTypes.includes("any"))
    ) {
        return {
            kind: "text",
            value: expression.value,
        };
    }
    if (
        expression.kind === "number" &&
        Number.isFinite(expression.value) &&
        (acceptedTypes.includes("number") ||
            acceptedTypes.includes("component") ||
            acceptedTypes.includes("any"))
    ) {
        return {
            kind: "number",
            value: expression.value,
        };
    }
    if (
        acceptedTypes.includes("component") ||
        acceptedTypes.includes("any")
    ) {
        if (expression.kind === "string") {
            return {
                kind: "text",
                value: expression.value,
            };
        }
        if (expression.kind === "boolean") {
            return {
                kind: "component",
                value: String(expression.value),
            };
        }
    }
    if (
        expression.kind === "sound" &&
        (acceptedTypes.includes("sound") || acceptedTypes.includes("any"))
    ) {
        return {
            kind: "sound",
            value: soundCatalog[expression.value] ?? expression.value,
        };
    }
    if (
        expression.kind === "location" &&
        (acceptedTypes.includes("location") || acceptedTypes.includes("any")) &&
        [expression.x, expression.y, expression.z].every(Number.isFinite)
    ) {
        return expression;
    }
    if (
        expression.kind === "item" &&
        (acceptedTypes.includes("item") || acceptedTypes.includes("any"))
    ) {
        return {
            kind: "item",
            id: normalizeItemId(expression.id),
        };
    }

    throw new Error(
        `Cannot lower ${expression.kind} expression as ${acceptedTypes.join(" or ")}`,
    );
}

function normalizeItemId(id: string): string {
    if (!/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(id)) {
        throw new Error(`Invalid item ID: ${id}`);
    }
    return id.includes(":") ? id : `minecraft:${id}`;
}
