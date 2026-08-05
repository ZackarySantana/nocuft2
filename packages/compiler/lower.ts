import type {
    HighExpression,
    HighIntrinsicStatement,
    HighModule,
    LowActionStatement,
    LowModule,
    LowStatement,
    LowValue,
} from "@nocuft/dfir";
import { playerOperations } from "./generated/player-operations.js";
import { entityOperations } from "./generated/entity-operations.js";
import { gameOperations } from "./generated/game-operations.js";
import { controlOperations } from "./generated/control-operations.js";
import { processBindings } from "./generated/process-bindings.js";
import { sounds } from "./generated/sounds.js";
import { eventBindings } from "./generated/event-bindings.js";
import { selectorBindings } from "./generated/selector-bindings.js";
import { targetGameValues } from "./generated/game-value-bindings.js";

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

const operations: Readonly<Record<string, CompilerOperation>> = {
    ...playerOperations,
    ...entityOperations,
    ...gameOperations,
    ...controlOperations,
};
const soundCatalog: Readonly<Record<string, string>> = sounds;

export function lowerHighModule(module: HighModule): LowModule {
    return {
        kind: "module",
        templates: module.templates.map((template) => {
            if (template.kind === "function") {
                return {
                    kind: "function" as const,
                    name: template.name,
                    ...(template.exported === undefined ? {} : { exported: template.exported }),
                    ...(template.parameters === undefined ? {} : { parameters: template.parameters }),
                    body: template.body.flatMap((statement) =>
                        lowerStatement(statement),
                    ),
                };
            }
            if (template.kind === "process") {
                return {
                    kind: "process" as const,
                    name: template.name,
                    block: processBindings.declaration.native.block,
                    action: processBindings.declaration.native.action,
                    ...(template.exported === undefined ? {} : { exported: template.exported }),
                    ...(template.parameters === undefined ? {} : { parameters: template.parameters }),
                    tags: lowerTags(
                        processBindings.declaration,
                        template.options,
                        template.name,
                    ),
                    body: template.body.flatMap((statement) =>
                        lowerStatement(statement),
                    ),
                };
            }
            const binding =
                eventBindings[template.event as keyof typeof eventBindings];
            if (!binding) {
                throw new Error(`Unknown event: ${template.event}`);
            }
            return {
                kind: "event" as const,
                name: template.name,
                block: binding.native.block,
                action: binding.native.action,
                body: template.body.flatMap((statement) =>
                    lowerStatement(statement, template.event),
                ),
            };
        }),
    };
}

function lowerStatement(
    statement: import("@nocuft/dfir").HighStatement,
    eventId?: string,
): LowStatement[] {
    if (statement.kind === "intrinsic") {
        const action = lowerIntrinsic(statement, eventId);
        return statement.receiver.kind === "selection"
            ? [...lowerSelection(statement.receiver.value, eventId), { ...action, target: "selection" }]
            : [action];
    }
    if (statement.kind === "call_function") {
        if (statement.receiver?.kind === "event_entity") {
            throw new Error(
                "Event entity receivers must be represented as selections",
            );
        }
        const call: LowStatement = {
            kind: "call_function",
            function: statement.function,
            arguments: statement.arguments.map((argument) =>
                lowerExpression(argument, [portableType(argument)], eventId),
            ),
            ...(statement.receiver === undefined || statement.receiver.kind === "current_player"
                ? {}
                : { target: "selection" as const }),
        };
        if (statement.receiver?.kind === "selection") {
            return [...lowerSelection(statement.receiver.value, eventId), call];
        }
        return [call];
    }
    if (statement.kind === "start_process") {
        return [{
            kind: "start_process",
            process: statement.process,
            block: processBindings.start.native.block,
            action: processBindings.start.native.action,
            arguments: statement.arguments.map((argument) =>
                lowerExpression(argument, [portableType(argument)], eventId),
            ),
            tags: lowerTags(
                processBindings.start,
                statement.options,
                statement.process,
            ),
        }];
    }
    if (statement.kind === "if") {
        if (statement.condition.kind !== "held_item") {
            throw new Error("Unsupported if condition");
        }
        return [
            {
                kind: "if",
                block: "if_player",
                action: "IsHolding",
                target: "current_player",
                arguments: [
                    {
                        index: 0,
                        layout: "plural",
                        minimumLength: 0,
                        values: [
                            lowerExpression(
                                statement.condition.item,
                                ["item"],
                                eventId,
                            ),
                        ],
                    },
                ],
                tags: [
                    {
                        id: "hand_slot",
                        option: "main_hand",
                        native: {
                            name: "Hand Slot",
                            option: "Main hand",
                            slot: 26,
                        },
                    },
                ],
                body: statement.body.flatMap((nested) =>
                    lowerStatement(nested, eventId),
                ),
            },
        ];
    }
    if (statement.kind === "declare_line_variable") {
        return [{
            kind: "action",
            block: "set_var",
            action: "=",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [{ kind: "variable", name: statement.name, scope: "line", valueType: statement.valueType }],
                },
                {
                    index: 1,
                    layout: "single",
                    minimumLength: 1,
                    values: [lowerExpression(statement.initializer, [statement.valueType], eventId)],
                },
            ],
            tags: [],
        }];
    }
    if (statement.kind === "shift_line_location") {
        validateLineLocationShift(statement);
        const variable = { kind: "variable" as const, name: statement.name, scope: "line" as const, valueType: "location" as const };
        const number = (index: number, fallback?: number) =>
            statement.arguments[index]
                ? lowerExpression(statement.arguments[index], ["number"], eventId)
                : fallback === undefined
                  ? undefined
                  : { kind: "number" as const, value: fallback };
        const location = (index: number) =>
            lowerExpression(statement.arguments[index], ["location"], eventId);
        const definition = (() => {
            switch (statement.operation) {
            case "axes": return {
                action: "ShiftAllAxes",
                values: [number(0), number(1), number(2)],
                tags: [],
            };
            case "direction": return {
                action: "ShiftAllDirections",
                values: [number(0, 0), number(1, 0), number(2, 0)],
                tags: [],
            };
            case "axis": return {
                action: "ShiftOnAxis",
                values: [number(0)],
                tags: [{ name: "Coordinate", option: (statement.options?.axis ?? "x").toUpperCase(), slot: 26 }],
            };
            case "toward": return {
                action: "ShiftToward",
                values: [location(0), number(1)],
                tags: [],
            };
            case "coordinate": return {
                action: "SetCoord",
                values: [number(0)],
                tags: [
                    { name: "Coordinate Type", option: "Plot coordinate", slot: 25 },
                    { name: "Coordinate", option: capitalizeCoordinate(statement.options?.coordinate ?? "x"), slot: 26 },
                ],
            };
            case "face": return {
                action: "FaceLocation",
                values: [location(0)],
                tags: [{
                    name: "Face Direction",
                    option: statement.options?.direction === "away" ? "Away from location" : "Toward location",
                    slot: 26,
                }],
            };
            }
        })();
        return [{
            kind: "action",
            block: "set_var",
            action: definition.action,
            arguments: [
                { index: 0, layout: "single", minimumLength: 1, values: [variable] },
                { index: 1, layout: "single", minimumLength: 1, values: [variable] },
                ...definition.values.flatMap((value, offset) => value ? [{
                    index: offset + 2,
                    layout: "single" as const,
                    minimumLength: 1,
                    values: [value],
                }] : []),
            ],
            tags: definition.tags.map((tag) => ({
                id: tag.name,
                option: tag.option,
                native: tag,
            })),
        }];
    }
    if (statement.kind === "set_variable") {
        return [{
            kind: "action",
            block: "set_var",
            action: "=",
            arguments: [
                {
                    index: 0,
                    layout: "single",
                    minimumLength: 1,
                    values: [lowerPlotVariable(statement.variable)],
                },
                {
                    index: 1,
                    layout: "single",
                    minimumLength: 1,
                    values: [lowerExpression(statement.value, [statement.variable.valueType], eventId)],
                },
            ],
            tags: [],
        }];
    }
    if (statement.kind === "clear_variable") {
        return [{
            kind: "action",
            block: "set_var",
            action: "=",
            arguments: [{
                index: 0,
                layout: "single",
                minimumLength: 1,
                values: [lowerPlotVariable(statement.variable)],
            }],
            tags: [],
        }];
    }
    if (!eventId) {
        throw new Error(`Event action ${statement.operation} cannot be used in a function`);
    }
    const eventBinding = eventBindings[eventId as keyof typeof eventBindings];
    switch (statement.operation) {
        case "cancel":
            if (!eventBinding?.cancellable) {
                throw new Error(`Event ${eventId} cannot be cancelled`);
            }
            return [{
                kind: "action",
                block: "game_action",
                action: "CancelEvent",
                arguments: [],
                tags: [],
            }];
    }
    const mutator = eventBinding?.mutators[
        statement.operation as keyof typeof eventBinding.mutators
    ] as CompilerOperation | undefined;
    if (!mutator) {
        throw new Error(`Event mutator ${statement.operation} is not applicable to ${eventId}`);
    }
    return [lowerOperation(mutator, statement.arguments, statement.options, eventId)];
}

function lowerIntrinsic(
    statement: HighIntrinsicStatement,
    eventId?: string,
): LowActionStatement {
    const operation = operations[statement.operation];
    if (!operation) {
        throw new Error(`Unknown intrinsic operation: ${statement.operation}`);
    }
    if (statement.receiver.kind === "event_entity") {
        throw new Error(
            "Event entity receivers must be represented as selections",
        );
    }
    if (
        operation.native.block === "player_action" &&
        statement.receiver.kind === "selection" &&
        statement.receiver.value.resultType !== "player"
    ) {
        throw new Error(`Player operation cannot target entities: ${statement.operation}`);
    }
    if (
        operation.native.block === "entity_action" &&
        (statement.receiver.kind !== "selection" ||
            statement.receiver.value.resultType !== "entity")
    ) {
        throw new Error(`Entity operation requires entities: ${statement.operation}`);
    }
    if (
        operation.native.block === "game_action" &&
        statement.receiver.kind !== "game"
    ) {
        throw new Error(`Game operation requires game: ${statement.operation}`);
    }
    if (
        operation.native.block !== "game_action" &&
        statement.receiver.kind === "game"
    ) {
        throw new Error(`Non-game operation cannot target game: ${statement.operation}`);
    }
    if (
        operation.native.block === "control" &&
        statement.receiver.kind !== "control"
    ) {
        throw new Error(`Control operation requires control: ${statement.operation}`);
    }
    if (
        operation.native.block !== "control" &&
        statement.receiver.kind === "control"
    ) {
        throw new Error(`Non-control operation cannot target control: ${statement.operation}`);
    }

    return lowerOperation(
        operation,
        statement.arguments,
        statement.options,
        eventId,
        statement.receiver,
    );
}

function lowerOperation(
    operation: CompilerOperation,
    statementArguments: Record<string, import("@nocuft/dfir").HighArgument>,
    statementOptions: Record<string, string> | undefined,
    eventId?: string,
    receiver?: HighIntrinsicStatement["receiver"],
): LowActionStatement {
    const operationName = operation.native.action;
    const inputsById = new Map(
        operation.inputs.map((input) => [input.id, input]),
    );
    for (const argumentName of Object.keys(statementArguments)) {
        if (!inputsById.has(argumentName)) {
            throw new Error(
                `Unknown argument ${argumentName} for ${operationName}`,
            );
        }
    }

    const args = operation.inputs.flatMap((input) => {
        const argument = statementArguments[input.id];
        if (argument === undefined) {
            const required =
                input.cardinality === "single"
                    ? !input.optional
                    : (input.minimumLength ?? 0) > 0;
            if (required) {
                throw new Error(
                    `Missing required argument ${input.id} for ${operationName}`,
                );
            }
            return [];
        }

        const plural = Array.isArray(argument);
        if (plural !== (input.cardinality === "plural")) {
            throw new Error(
                `Invalid cardinality for ${input.id} in ${operationName}`,
            );
        }

        const expressions = plural ? argument : [argument];
        const minimumLength = input.minimumLength ?? 1;
        if (expressions.length < minimumLength) {
            throw new Error(
                `Expected at least ${minimumLength} values for ${input.id} in ${operationName}`,
            );
        }

        return [
            {
                index: input.native.index,
                layout: input.cardinality,
                minimumLength,
                values: expressions.map((expression) =>
                    lowerExpression(expression, input.acceptedTypes, eventId),
                ),
            },
        ];
    });

    return {
        kind: "action",
        block: operation.native.block,
        action: operation.native.action,
        ...(receiver === undefined || receiver.kind === "game" || receiver.kind === "control"
            ? {}
            : {
                  target: receiver.kind === "current_player"
                      ? ("current_player" as const)
                      : ("selection" as const),
              }),
        arguments: args.toSorted((left, right) => left.index - right.index),
        tags: lowerTags(operation, statementOptions, operationName),
    };
}

function lowerTags(
    operation: Pick<CompilerOperation, "tags">,
    statementOptions: Record<string, string> | undefined,
    operationName: string,
): LowActionStatement["tags"] {
    const selectedOptions = statementOptions ?? {};
    const tagsById = new Map(operation.tags.map((tag) => [tag.id, tag]));
    for (const optionName of Object.keys(selectedOptions)) {
        if (!tagsById.has(optionName)) {
            throw new Error(
                `Unknown option ${optionName} for ${operationName}`,
            );
        }
    }
    return operation.tags.map((tag) => {
            const option = selectedOptions[tag.id] ?? tag.defaultOption;
            if (!tag.options.includes(option)) {
                throw new Error(
                    `Invalid option ${option} for ${tag.id} in ${operationName}`,
                );
            }
            const nativeOption = tag.native.options[option];
            if (!nativeOption) {
                throw new Error(
                    `Missing native option ${option} for ${tag.id} in ${operationName}`,
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
        });
}

function lowerSelection(
    selection: import("@nocuft/dfir").HighSelectionExpression,
    eventId?: string,
): LowStatement[] {
    return [selection.source, ...selection.filters].map((selector) => {
        const binding = selectorBindings[selector.operation as keyof typeof selectorBindings];
        if (!binding) throw new Error(`Unknown selector: ${selector.operation}`);
        const grouped = binding.native.arguments.map((argument, index) => ({
            index: argument.index,
            layout: argument.cardinality,
            minimumLength: argument.optional ? 0 : 1,
            values: selector.arguments.slice(index, argument.cardinality === "plural" ? undefined : index + 1)
                .map((value) => lowerExpression(value, [argument.type], eventId)),
        })).filter((argument) => argument.values.length > 0);
        const selected = selector.options ?? {};
        const tags = binding.native.tags.map((tag) => {
            const id = tag.name === "Event Target" ? "eventTarget" : tag.name === "Compare Mode" ? "compareMode" : tag.name === "Ignore Y-Axis" ? "ignoreYAxis" : "ignoreFormatting";
            const value = selected[id] ?? tag.defaultOption;
            const native = value === "true" ? "True" : value === "false" ? "False" : value[0].toUpperCase() + value.slice(1);
            return { id, option: value, native: { name: tag.name, option: native, slot: tag.slot } };
        });
        return { kind: "select_object" as const, action: binding.native.action, arguments: grouped, tags };
    });
}

function lowerExpression(
    expression: HighExpression,
    acceptedTypes: readonly string[],
    eventId?: string,
): LowValue {
    if (expression.kind === "line_variable") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Line variable ${expression.name} is not accepted as ${acceptedTypes.join(" or ")}`);
        }
        return { kind: "variable", name: expression.name, scope: "line", valueType: expression.valueType };
    }
    if (expression.kind === "plot_variable") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Plot variable ${expression.name} is not accepted as ${acceptedTypes.join(" or ")}`);
        }
        return lowerPlotVariable(expression);
    }
    if (expression.kind === "game_value") {
        const binding = Object.values(targetGameValues).find(
            (candidate) => candidate.id === expression.value,
        );
        if (!binding || binding.valueType !== expression.valueType) {
            throw new Error(`Unknown target game value: ${expression.value}`);
        }
        if (!acceptedTypes.includes(binding.valueType) && !acceptedTypes.includes("any")) {
            throw new Error(`Game value ${expression.value} is not accepted as ${acceptedTypes.join(" or ")}`);
        }
        return {
            kind: "game_value",
            name: binding.native.name,
            valueType: binding.valueType,
            target:
                expression.receiver === "current_player" ? "Default" : "",
        };
    }
    if (expression.kind === "parameter") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(
                `Parameter ${expression.name} has type ${expression.valueType}; expected ${acceptedTypes.join(" or ")}`,
            );
        }
        return expression;
    }
    if (expression.kind === "event_field") {
        if (!eventId || expression.event !== eventId) {
            throw new Error(
                `Event field ${expression.event}.${expression.field} cannot be used in ${eventId ?? "a function"}`,
            );
        }
        const binding = eventBindings[eventId as keyof typeof eventBindings];
        const field = binding?.fields.find(
            (candidate) => candidate.name === expression.field,
        );
        if (!field) {
            throw new Error(
                `Unknown field ${expression.field} for event ${eventId}`,
            );
        }
        if (field.type !== expression.valueType) {
            throw new Error(
                `Generated metadata mismatch for ${eventId}.${expression.field}: IR says ${expression.valueType}, catalog says ${field.type}`,
            );
        }
        if (!isEventFieldTypeAccepted(field.type, acceptedTypes)) {
            throw new Error(
                `Event field ${expression.field} has native type ${field.type}; expected ${acceptedTypes.join(" or ")}`,
            );
        }
        return {
            kind: "game_value",
            name: field.native,
            valueType: field.type,
            target: "",
        };
    }
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
    if (expression.kind === "boolean" && acceptedTypes.includes("boolean")) {
        return { kind: "number", value: expression.value ? 1 : 0 };
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

function portableType(expression: HighExpression): string {
    switch (expression.kind) {
        case "parameter": return expression.valueType;
        case "string": return "text";
        case "number": return "number";
        case "boolean": return "boolean";
        case "sound": return "sound";
        case "location": return "location";
        case "item": return "item";
        case "event_field": return expression.valueType;
        case "game_value": return expression.valueType;
        case "line_variable": return expression.valueType;
        case "plot_variable": return expression.valueType;
        default: return "any";
    }
}

function lowerPlotVariable(
    variable: import("@nocuft/dfir").HighPlotVariableExpression,
): import("@nocuft/dfir").LowVariableValue {
    if (
        !variable.name.trim() ||
        !["unsaved", "saved"].includes(variable.scope) ||
        !["number", "text", "boolean"].includes(variable.valueType)
    ) {
        throw new Error(`Invalid plot variable ${variable.name}`);
    }
    return {
        kind: "variable",
        name: variable.name,
        scope: variable.scope,
        valueType: variable.valueType,
    };
}

function validateLineLocationShift(
    statement: import("@nocuft/dfir").HighLineLocationShift,
): void {
    const counts = {
        axes: [3, 3],
        direction: [0, 3],
        axis: [1, 1],
        toward: [1, 2],
        coordinate: [1, 1],
        face: [1, 1],
    } as const;
    const [minimum, maximum] = counts[statement.operation];
    if (statement.arguments.length < minimum || statement.arguments.length > maximum) {
        throw new Error(`Invalid argument count for line location ${statement.operation}`);
    }
    const options = statement.options ?? {};
    const expectedKeys = statement.operation === "axis"
        ? ["axis"]
        : statement.operation === "coordinate"
          ? ["coordinate"]
          : statement.operation === "face"
            ? ["direction"]
            : [];
    if (Object.keys(options).some((key) => !expectedKeys.includes(key))) {
        throw new Error(`Invalid option for line location ${statement.operation}`);
    }
    if (statement.operation === "axis" && !["x", "y", "z"].includes(options.axis ?? "")) {
        throw new Error(`Invalid line location axis: ${options.axis ?? ""}`);
    }
    if (
        statement.operation === "coordinate" &&
        !["x", "y", "z", "pitch", "yaw"].includes(options.coordinate ?? "")
    ) {
        throw new Error(`Invalid line location coordinate: ${options.coordinate ?? ""}`);
    }
    if (
        statement.operation === "face" &&
        options.direction !== undefined &&
        !["toward", "away"].includes(options.direction)
    ) {
        throw new Error(`Invalid line location face direction: ${options.direction}`);
    }
}

function isPortableTypeAccepted(type: string, acceptedTypes: readonly string[]): boolean {
    return acceptedTypes.includes("any")
        || acceptedTypes.includes(type)
        || (acceptedTypes.includes("component") && ["text", "number", "boolean"].includes(type));
}

function isEventFieldTypeAccepted(
    fieldType: string,
    acceptedTypes: readonly string[],
): boolean {
    return (
        acceptedTypes.includes("any") ||
        acceptedTypes.includes(fieldType) ||
        (acceptedTypes.includes("component") &&
            (fieldType === "text" || fieldType === "number"))
    );
}

function normalizeItemId(id: string): string {
    if (!/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(id)) {
        throw new Error(`Invalid item ID: ${id}`);
    }
    return id.includes(":") ? id : `minecraft:${id}`;
}

function capitalizeCoordinate(value: string): string {
    return value === "pitch" ? "Pitch" : value === "yaw" ? "Yaw" : value.toUpperCase();
}
