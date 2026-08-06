import type {
    HighExpression,
    HighIntrinsicStatement,
    HighModule,
    HighPlayerVariableExpression,
    HighPlotVariableExpression,
    LowActionStatement,
    LowModule,
    LowStatement,
    LowStoredVariableValue,
    LowValue,
    ValueType,
} from "@nocuft/dfir";
import { isValueType, valueTypeAssignable, valueTypesEqual } from "@nocuft/dfir";
import { playerOperations } from "./generated/player-operations.js";
import { entityOperations } from "./generated/entity-operations.js";
import { gameOperations } from "./generated/game-operations.js";
import { controlOperations } from "./generated/control-operations.js";
import { processBindings } from "./generated/process-bindings.js";
import { sounds } from "./generated/sounds.js";
import { eventBindings } from "./generated/event-bindings.js";
import { selectorBindings } from "./generated/selector-bindings.js";
import { internalGameValues, targetGameValues } from "./generated/game-value-bindings.js";
import { structuralBindings } from "./generated/structural-bindings.js";
import { itemTransformBindings } from "./generated/item-transform-bindings.js";

interface LowerContext {
    eventId?: string;
    nextTemporary: number;
    loopStack: LoopFrame[];
    usedVariableNames: Set<string>;
}

interface LoopFrame {
    continueFooter: (state: SelectionState) => LoweredStatements;
}

type SelectionState =
    | { kind: "unreachable" }
    | { kind: "default" }
    | { kind: "snapshot"; id: string }
    | { kind: "anonymous" }
    | { kind: "unknown" };

interface LoweredStatements {
    statements: LowStatement[];
    normal: SelectionState;
}

const defaultSelection: SelectionState = { kind: "default" };
const unreachableSelection: SelectionState = { kind: "unreachable" };
const listChunkSize = 26;

function joinSelection(left: SelectionState, right: SelectionState): SelectionState {
    if (left.kind === "unreachable") return right;
    if (right.kind === "unreachable") return left;
    if (left.kind === "default" && right.kind === "default") return left;
    if (left.kind === "snapshot" && right.kind === "snapshot" && left.id === right.id) return left;
    return { kind: "unknown" };
}

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
            const context: LowerContext = {
                ...(template.kind === "event" ? { eventId: template.event } : {}),
                nextTemporary: 1,
                loopStack: [],
                usedVariableNames: collectVariableNames(
                    template.body,
                    template.kind === "event" ? undefined : template.parameters,
                ),
            };
            if (template.kind === "function") {
                return {
                    kind: "function" as const,
                    name: template.name,
                    ...(template.exported === undefined ? {} : { exported: template.exported }),
                    ...(template.parameters === undefined ? {} : { parameters: template.parameters }),
                    body: lowerStatements(template.body, context, defaultSelection).statements,
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
                    body: lowerStatements(template.body, context, defaultSelection).statements,
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
                body: lowerStatements(template.body, context, defaultSelection).statements,
            };
        }),
    };
}

function lowerStatements(
    statements: readonly import("@nocuft/dfir").HighStatement[],
    context: LowerContext,
    initial: SelectionState,
): LoweredStatements {
    const output: LowStatement[] = [];
    let normal = initial;
    for (const statement of statements) {
        if (normal.kind === "unreachable") break;
        const lowered = lowerStatement(statement, context, normal);
        output.push(...lowered.statements);
        normal = lowered.normal;
    }
    return { statements: output, normal };
}

function lowerStatement(
    statement: import("@nocuft/dfir").HighStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    if (statement.kind === "if") return lowerIfStatement(statement, context, state);
    if (statement.kind === "loop") return lowerLoopStatement(statement, context, state);
    if (statement.kind === "for_each") return lowerForEachStatement(statement, context, state);
    if (statement.kind === "for_each_dictionary") return lowerForEachDictionaryStatement(statement, context, state);
    if (statement.kind === "loop_control") {
        if (statement.control === "break") return { statements: [controlAction("control.stop_repeat")], normal: unreachableSelection };
        const frame = context.loopStack.at(-1);
        if (!frame) throw new Error("Continue outside a repeat");
        const footer = frame.continueFooter(state);
        return { statements: [...footer.statements, controlAction("control.skip")], normal: unreachableSelection };
    }
    if (statement.kind === "return") {
        return { statements: [controlAction(statement.context === "function" ? "control.return" : "control.end")], normal: unreachableSelection };
    }
    if (statement.kind === "declare_selection_snapshot") {
        const selected = lowerSelection(statement.initializer, context, state);
        const variable = snapshotVariable(statement.name);
        const uuids = internalGameValues.selection_target_uuids;
        const size = internalGameValues.selection_size;
        return {
            statements: [
                ...selected.statements,
                structuralAction(structuralBindings.setVariable["="], [variable, {
                    kind: "game_value",
                    name: uuids.native.name,
                    valueType: uuids.valueType,
                    target: "",
                }]),
                structuralAction(structuralBindings.setVariable["="], [snapshotSizeVariable(statement.sizeName), {
                    kind: "game_value",
                    name: size.native.name,
                    valueType: size.valueType,
                    target: "",
                }]),
            ],
            normal: { kind: "snapshot", id: statement.name },
        };
    }
    if (statement.kind === "declare_line_variable") {
        const variable: LowValue = {
            kind: "variable",
            name: statement.name,
            scope: "line",
            valueType: statement.valueType,
        };
        const lowered = lowerValueExpression(
            statement.initializer,
            [statement.valueType],
            context,
            state,
            variable,
        );
        return { statements: lowered.wroteDestination
            ? lowered.statements
            : [
                  ...lowered.statements,
                  structuralAction(structuralBindings.setVariable["="], [variable, lowered.value]),
              ], normal: lowered.normal };
    }
    if (statement.kind === "declare_dictionary_get") {
        const value: LowValue = {
            kind: "variable",
            name: statement.valueVariable.name,
            scope: "line",
            valueType: statement.valueVariable.valueType,
        };
        const found: LowValue = {
            kind: "variable",
            name: statement.foundVariable.name,
            scope: "line",
            valueType: "boolean",
        };
        const lowered = lowerExpressionList([
            [statement.dictionary, ["dict"]],
            [statement.key, ["text"]],
        ], context, state);
        const native = structuralAction(structuralBindings.ifVariable.DictHasKey, lowered.values);
        const flag = (present: boolean): LowActionStatement => structuralAction(
            structuralBindings.setVariable["="],
            [found, { kind: "number", value: present ? 1 : 0 }],
        );
        return {
            statements: [
                ...lowered.statements,
                {
                    kind: "if",
                    block: native.block,
                    action: native.action,
                    arguments: native.arguments,
                    tags: native.tags,
                    body: [
                        structuralAction(structuralBindings.setVariable.GetDictValue, [value, ...lowered.values]),
                        flag(true),
                    ],
                    elseBody: [
                        emptyValueStatement(value, statement.valueVariable.valueType),
                        flag(false),
                    ],
                },
            ],
            normal: lowered.normal,
        };
    }
    if (statement.kind === "set_variable") {
        if (statement.variable.kind === "player_variable" && statement.variable.receiver !== "current_player") {
            throw new Error("Player variable assignment requires a current-player context");
        }
        const variable = lowerMutableVariable(statement.variable);
        if (statement.operation && statement.operation !== "=") {
            const lowered = lowerValueExpression(
                statement.value,
                [statement.variable.valueType],
                context,
                state,
            );
            const binding = structuralBindings.setVariable[statement.operation as keyof typeof structuralBindings.setVariable];
            if (!binding) throw new Error(`Unknown Set Variable action ${statement.operation}`);
            return { statements: [...lowered.statements, structuralAction(binding, [variable, lowered.value])], normal: lowered.normal };
        }
        const lowered = lowerValueExpression(
            statement.value,
            [statement.variable.valueType],
            context,
            state,
            variable,
        );
        return { statements: lowered.wroteDestination
            ? lowered.statements
            : [
                  ...lowered.statements,
                  structuralAction(structuralBindings.setVariable["="], [variable, lowered.value]),
              ], normal: lowered.normal };
    }
    if (statement.kind === "clear_variable") {
        if (statement.variable.kind === "player_variable" && statement.variable.receiver !== "current_player") {
            throw new Error("Player variable clearing requires a current-player context");
        }
        return { statements: [structuralAction(structuralBindings.setVariable["="], [
            lowerMutableVariable(statement.variable),
        ])], normal: state };
    }
    if (statement.kind === "call_function") {
        if (statement.receiver?.kind === "event_entity") {
            throw new Error("Event entity receivers must be represented as selections");
        }
        const lowered = lowerExpressionList(
            statement.arguments.map((argument) => [argument, [portableType(argument)] as readonly string[]] as const),
            context,
            state,
        );
        const call: LowStatement = {
            kind: "call_function",
            function: statement.function,
            arguments: lowered.values,
            ...(statement.receiver === undefined || statement.receiver.kind === "current_player"
                ? {}
                : { target: "selection" as const }),
        };
        const selection = statement.receiver?.kind === "selection"
            ? lowerSelection(statement.receiver.value, context, lowered.normal)
            : { statements: [], normal: lowered.normal };
        // A callee may replace or narrow the native selection. Forget it here
        // so later named snapshots are rehydrated from their captured UUIDs.
        return { statements: [...lowered.statements, ...selection.statements, call], normal: { kind: "unknown" } };
    }
    if (statement.kind === "start_process") {
        const lowered = lowerExpressionList(
            statement.arguments.map((argument) => [argument, [portableType(argument)] as readonly string[]] as const),
            context,
            state,
        );
        const targetMode = statement.options?.target_mode;
        const normal = targetMode === "with_current_selection" || targetMode === "for_each_in_selection"
            ? { kind: "unknown" } as SelectionState
            : lowered.normal;
        return { statements: [...lowered.statements, {
            kind: "start_process",
            process: statement.process,
            block: processBindings.start.native.block,
            action: processBindings.start.native.action,
            arguments: lowered.values,
            tags: lowerTags(processBindings.start, statement.options, statement.process),
        }], normal };
    }
    if (statement.kind === "intrinsic") {
        const lowered = lowerIntrinsicWithPrelude(statement, context, state);
        if (statement.receiver.kind !== "selection") return lowered;
        const action = lowered.statements.at(-1);
        if (!action) throw new Error("Intrinsic did not lower to an action");
        const selection = lowerSelection(statement.receiver.value, context, lowered.normal);
        return { statements: [
            ...lowered.statements.slice(0, -1),
            ...selection.statements,
            action,
        ], normal: selection.normal };
    }
    if (statement.kind === "event_action" && statement.operation !== "cancel") {
        if (!context.eventId) {
            throw new Error(`Event action ${statement.operation} cannot be used in a function`);
        }
        const binding = eventBindings[context.eventId as keyof typeof eventBindings];
        const mutator = binding?.mutators[
            statement.operation as keyof typeof binding.mutators
        ] as CompilerOperation | undefined;
        if (!mutator) {
            throw new Error(`Event mutator ${statement.operation} is not applicable to ${context.eventId}`);
        }
        return lowerOperationWithPrelude(
            mutator,
            statement.arguments,
            statement.options,
            context,
            state,
        );
    }
    if (statement.kind === "shift_line_location") {
        return lowerLineLocationShiftWithPrelude(statement, context, state);
    }
    return { statements: lowerLegacyStatement(statement, context.eventId), normal: state };
}

function lowerLineLocationShiftWithPrelude(
    statement: import("@nocuft/dfir").HighLineLocationShift,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    validateLineLocationShift(statement);
    const variable: LowValue = {
        kind: "variable",
        name: statement.name,
        scope: "line",
        valueType: "location",
    };
    const definitions = (() => {
        switch (statement.operation) {
            case "axes": return {
                action: "ShiftAllAxes",
                specs: [[0, "number"], [1, "number"], [2, "number"]] as const,
                tags: [] as const,
            };
            case "direction": return {
                action: "ShiftAllDirections",
                specs: [[0, "number", 0], [1, "number", 0], [2, "number", 0]] as const,
                tags: [] as const,
            };
            case "axis": return {
                action: "ShiftOnAxis",
                specs: [[0, "number"]] as const,
                tags: [{ name: "Coordinate", option: (statement.options?.axis ?? "x").toUpperCase(), slot: 26 }] as const,
            };
            case "toward": return {
                action: "ShiftToward",
                specs: [[0, "location"], [1, "number"]] as const,
                tags: [] as const,
            };
            case "coordinate": return {
                action: "SetCoord",
                specs: [[0, "number"]] as const,
                tags: [
                    { name: "Coordinate Type", option: "Plot coordinate", slot: 25 },
                    { name: "Coordinate", option: capitalizeCoordinate(statement.options?.coordinate ?? "x"), slot: 26 },
                ] as const,
            };
            case "face": return {
                action: "FaceLocation",
                specs: [[0, "location"]] as const,
                tags: [{
                    name: "Face Direction",
                    option: statement.options?.direction === "away" ? "Away from location" : "Toward location",
                    slot: 26,
                }] as const,
            };
        }
    })();
    const statements: LowStatement[] = [];
    const values: LowValue[] = [];
    let normal = state;
    for (const spec of definitions.specs) {
        const source = statement.arguments[spec[0]];
        if (!source) {
            const fallback = spec.length === 3 ? spec[2] : undefined;
            if (fallback !== undefined) values.push({ kind: "number", value: fallback });
            continue;
        }
        const lowered = lowerValueExpression(source, [spec[1]], context, normal);
        statements.push(...lowered.statements);
        values.push(lowered.value);
        normal = lowered.normal;
    }
    return { statements: [...statements, {
        kind: "action",
        block: "set_var",
        action: definitions.action,
        arguments: [
            { index: 0, layout: "single", minimumLength: 1, values: [variable] },
            { index: 1, layout: "single", minimumLength: 1, values: [variable] },
            ...values.map((value, index) => ({
                index: index + 2,
                layout: "single" as const,
                minimumLength: 1,
                values: [value],
            })),
        ],
        tags: definitions.tags.map((tag) => ({
            id: tag.name,
            option: tag.option,
            native: tag,
        })),
    }], normal };
}

function lowerLegacyStatement(
    statement: import("@nocuft/dfir").HighStatement,
    eventId?: string,
): LowStatement[] {
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
                    lowerLegacyStatement(nested, eventId),
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
                    values: [lowerMutableVariable(statement.variable)],
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
                values: [lowerMutableVariable(statement.variable)],
            }],
            tags: [],
        }];
    }
    if (
        statement.kind === "loop" ||
        statement.kind === "loop_control" ||
        statement.kind === "return" ||
        statement.kind === "for_each" ||
        statement.kind === "for_each_dictionary" ||
        statement.kind === "declare_dictionary_get" ||
        statement.kind === "declare_selection_snapshot" ||
        statement.kind === "intrinsic" ||
        statement.kind === "call_function" ||
        statement.kind === "start_process"
    ) {
        throw new Error(`Structural statement ${statement.kind} reached legacy lowering`);
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

type StructuralBinding = {
    readonly native: { readonly block: string; readonly action: string };
    readonly inputs: readonly {
        readonly id: string;
        readonly acceptedTypes: readonly string[];
        readonly cardinality: "single" | "plural";
        readonly optional?: boolean;
        readonly minimumLength?: number;
        readonly native: { readonly index: number };
    }[];
    readonly tags: readonly {
        readonly id: string;
        readonly defaultOption: string;
        readonly options: readonly string[];
        readonly native: {
            readonly name: string;
            readonly slot: number;
            readonly options: Readonly<Record<string, string>>;
        };
    }[];
};

function structuralAction(
    binding: StructuralBinding,
    values: readonly LowValue[],
): LowActionStatement {
    let cursor = 0;
    const arguments_: import("@nocuft/dfir").LowArgument[] = [];
    for (const input of binding.inputs) {
        const remainingInputs = binding.inputs.length - arguments_.length - 1;
        const count = input.cardinality === "plural"
            ? values.length - cursor - remainingInputs
            : 1;
        const selected = values.slice(cursor, cursor + Math.max(0, count));
        cursor += selected.length;
        if (selected.length === 0 && (input.optional || (input.minimumLength ?? 0) === 0)) continue;
        arguments_.push({
            index: input.native.index,
            layout: input.cardinality,
            minimumLength: input.cardinality === "plural" ? input.minimumLength ?? 0 : 1,
            values: [...selected],
        });
    }
    if (cursor !== values.length) {
        throw new Error(`Too many values for structural action ${binding.native.action}`);
    }
    return {
        kind: "action",
        block: binding.native.block,
        action: binding.native.action,
        arguments: arguments_,
        tags: lowerTags(binding, undefined, binding.native.action),
    };
}

function emptyValueStatement(destination: LowValue, valueType: ValueType): LowActionStatement {
    if (typeof valueType !== "string") {
        return structuralAction(valueType.kind === "list"
            ? structuralBindings.setVariable.CreateList
            : structuralBindings.setVariable.CreateDict, [destination]);
    }
    return structuralAction(structuralBindings.setVariable["="], [destination, emptyScalarValue(valueType)]);
}

function emptyScalarValue(valueType: import("@nocuft/dfir").ScalarValueType): LowValue {
    switch (valueType) {
        case "text": return { kind: "text", value: "" };
        case "number":
        case "boolean":
        case "any": return { kind: "number", value: 0 };
        case "component": return { kind: "component", value: "" };
        case "location": return { kind: "location", x: 0, y: 0, z: 0 };
        case "item": return { kind: "item", id: "minecraft:air", count: 1 };
    }
    throw new Error(`Values of type ${valueType} have no empty default`);
}

function lowerMutableVariable(
    variable: import("@nocuft/dfir").HighMutableVariableExpression,
): LowValue {
    return variable.kind === "plot_variable" || variable.kind === "player_variable"
        ? lowerStoredVariable(variable)
        : {
              kind: "variable",
              name: variable.name,
              scope: "line",
              valueType: variable.valueType,
          };
}

interface LoweredValue {
    statements: LowStatement[];
    value: LowValue;
    wroteDestination: boolean;
    normal: SelectionState;
}

function temporaryVariable(
    valueType: Extract<LowValue, { kind: "variable" }>["valueType"],
    context: LowerContext,
): Extract<LowValue, { kind: "variable" }> {
    let name: string;
    do {
        name = `__nocuft_tmp_${context.nextTemporary++}`;
    } while (context.usedVariableNames.has(name));
    context.usedVariableNames.add(name);
    return {
        kind: "variable",
        name,
        scope: "line",
        valueType,
    };
}

function collectVariableNames(
    body: readonly import("@nocuft/dfir").HighStatement[],
    parameters?: readonly import("@nocuft/dfir").HighParameter[],
): Set<string> {
    const result = new Set<string>(
        parameters?.filter((parameter) => parameter.kind === "value").map((parameter) => parameter.name),
    );
    const expression = (value: HighExpression): void => {
        if (
            value.kind === "line_variable" ||
            value.kind === "plot_variable" ||
            value.kind === "player_variable"
        ) result.add(value.name);
        if (value.kind === "arithmetic") value.operands.forEach(expression);
        if (value.kind === "string_template") value.parts.forEach(expression);
        if (value.kind === "list") value.elements.forEach(expression);
        if (value.kind === "list_index") {
            expression(value.list);
            expression(value.index);
        }
        if (value.kind === "list_length") expression(value.list);
        if (value.kind === "list_with") {
            expression(value.list);
            expression(value.index);
            expression(value.value);
        }
        if (value.kind === "list_append") {
            expression(value.list);
            value.values.forEach(expression);
        }
        if (value.kind === "list_concat") {
            expression(value.list);
            value.lists.forEach(expression);
        }
        if (value.kind === "list_slice") {
            expression(value.list);
            if (value.start) expression(value.start);
            if (value.end) expression(value.end);
        }
        if (value.kind === "dictionary") {
            value.entries.forEach((entry) => {
                expression(entry.key);
                expression(entry.value);
            });
        }
        if (value.kind === "dictionary_get") {
            expression(value.dictionary);
            expression(value.key);
        }
        if (value.kind === "dictionary_size" || value.kind === "dictionary_keys" || value.kind === "dictionary_values") {
            expression(value.dictionary);
        }
        if (value.kind === "dictionary_with") {
            expression(value.dictionary);
            expression(value.key);
            expression(value.value);
        }
        if (value.kind === "dictionary_without") {
            expression(value.dictionary);
            expression(value.key);
        }
        if (value.kind === "dictionary_merged") {
            expression(value.dictionary);
            value.dictionaries.forEach(expression);
        }
        if (value.kind === "item_constructor") {
            expression(value.material);
            expression(value.count);
        }
        if (value.kind === "item_transform") {
            expression(value.receiver);
            value.arguments.forEach(expression);
        }
        if (value.kind === "game_value" && value.receiver !== "current_player") result.add(value.receiver.name);
        if (value.kind === "player_variable" && typeof value.receiver !== "string") result.add(value.receiver.name);
        if (value.kind === "selection_count") selection(value.selection);
    };
    const selection = (value: import("@nocuft/dfir").HighSelectionExpression): void => {
        if ("kind" in value.source) {
            result.add(value.source.name);
            result.add(value.source.sizeName);
        }
        else value.source.arguments.forEach(expression);
        value.filters.forEach((filter) => filter.arguments.forEach(expression));
    };
    const condition = (value: import("@nocuft/dfir").HighCondition): void => {
        if (value.kind === "comparison") {
            expression(value.left);
            expression(value.right);
        } else if (value.kind === "boolean_condition") {
            expression(value.value);
        } else if (value.kind === "logical") {
            value.operands.forEach(condition);
        } else if (value.kind === "dictionary_has_key") {
            expression(value.dictionary);
            expression(value.key);
        } else {
            expression(value.item);
        }
    };
    const statements = (values: readonly import("@nocuft/dfir").HighStatement[]): void => {
        for (const statement of values) {
            if (statement.kind === "declare_line_variable") {
                result.add(statement.name);
                expression(statement.initializer);
            } else if (statement.kind === "declare_dictionary_get") {
                result.add(statement.valueVariable.name);
                result.add(statement.foundVariable.name);
                expression(statement.dictionary);
                expression(statement.key);
            } else if (statement.kind === "declare_selection_snapshot") {
                result.add(statement.name);
                result.add(statement.sizeName);
                selection(statement.initializer);
            } else if (statement.kind === "set_variable") {
                result.add(statement.variable.name);
                expression(statement.value);
            } else if (statement.kind === "clear_variable") {
                result.add(statement.variable.name);
            } else if (statement.kind === "if") {
                condition(statement.condition);
                statements(statement.body);
                if (statement.elseBody) statements(statement.elseBody);
            } else if (statement.kind === "loop") {
                condition(statement.condition);
                if (statement.initializer) statements([statement.initializer]);
                if (statement.update) statements([statement.update]);
                statements(statement.body);
            } else if (statement.kind === "for_each") {
                result.add(statement.variable.name);
                expression(statement.iterable);
                statements(statement.body);
            } else if (statement.kind === "for_each_dictionary") {
                result.add(statement.keyVariable.name);
                result.add(statement.valueVariable.name);
                expression(statement.dictionary);
                statements(statement.body);
            } else if (statement.kind === "call_function" || statement.kind === "start_process") {
                statement.arguments.forEach(expression);
                if (statement.kind === "call_function" && statement.receiver?.kind === "selection") selection(statement.receiver.value);
            } else if (statement.kind === "intrinsic" || statement.kind === "event_action") {
                Object.values(statement.arguments).flat().forEach(expression);
                if (statement.kind === "intrinsic" && statement.receiver.kind === "selection") selection(statement.receiver.value);
            } else if (statement.kind === "shift_line_location") {
                result.add(statement.name);
                statement.arguments.forEach(expression);
            }
        }
    };
    statements(body);
    return result;
}

function lowerValueExpression(
    expression: HighExpression,
    acceptedTypes: readonly AcceptedType[],
    context: LowerContext,
    state: SelectionState,
    destination?: LowValue,
): LoweredValue {
    if (expression.kind === "dictionary") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Dictionary is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerExpressionList(expression.entries.flatMap((entry) => [
            [entry.key, ["text"]] as const,
            [entry.value, [expression.valueType.valueType]] as const,
        ]), context, state);
        const keys = temporaryVariable({ kind: "list", elementType: "text" }, context);
        const values = temporaryVariable({ kind: "list", elementType: expression.valueType.valueType }, context);
        const output = destination ?? temporaryVariable(expression.valueType, context);
        if (output.kind !== "variable") throw new Error("Dictionary construction requires a variable destination");
        return {
            statements: [
                ...lowered.statements,
                ...createListStatements(keys, lowered.values.filter((_, index) => index % 2 === 0)),
                ...createListStatements(values, lowered.values.filter((_, index) => index % 2 === 1)),
                structuralAction(structuralBindings.setVariable.CreateDict, [output, keys, values]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "dictionary_get") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Dictionary value is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerExpressionList([
            [expression.dictionary, [{ kind: "dictionary", valueType: expression.valueType }]],
            [expression.key, ["text"]],
        ], context, state);
        const output = destination ?? temporaryVariable(expression.valueType, context);
        if (output.kind !== "variable") throw new Error("Dictionary lookup requires a variable destination");
        return {
            statements: [
                ...lowered.statements,
                structuralAction(structuralBindings.setVariable.GetDictValue, [output, ...lowered.values]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "dictionary_size") {
        if (!isPortableTypeAccepted("number", acceptedTypes)) {
            throw new Error(`Dictionary size is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerValueExpression(expression.dictionary, ["dict"], context, state);
        const output = destination ?? temporaryVariable("number", context);
        if (output.kind !== "variable") throw new Error("Dictionary size requires a variable destination");
        return {
            statements: [
                ...lowered.statements,
                structuralAction(structuralBindings.setVariable.GetDictSize, [output, lowered.value]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "dictionary_keys" || expression.kind === "dictionary_values") {
        const valueType = expression.kind === "dictionary_keys"
            ? { kind: "list" as const, elementType: "text" as const }
            : expression.valueType;
        if (!isPortableTypeAccepted(valueType, acceptedTypes)) {
            throw new Error(`Dictionary projection is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerValueExpression(expression.dictionary, ["dict"], context, state);
        const output = destination ?? temporaryVariable(valueType, context);
        if (output.kind !== "variable") throw new Error("Dictionary projection requires a variable destination");
        const binding = expression.kind === "dictionary_keys"
            ? structuralBindings.setVariable.GetDictKeys
            : structuralBindings.setVariable.GetDictValues;
        return {
            statements: [...lowered.statements, structuralAction(binding, [output, lowered.value])],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "dictionary_with" || expression.kind === "dictionary_without" || expression.kind === "dictionary_merged") {
        return lowerDictionaryTransform(expression, acceptedTypes, context, state, destination);
    }
    if (expression.kind === "list") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`List is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerExpressionList(
            expression.elements.map((element) => [element, [expression.valueType.elementType]] as const),
            context,
            state,
        );
        const output = destination ?? temporaryVariable(expression.valueType, context);
        if (output.kind !== "variable") throw new Error("List construction requires a variable destination");
        const [initial, ...remaining] = chunks(lowered.values, listChunkSize);
        return {
            statements: [
                ...lowered.statements,
                structuralAction(structuralBindings.setVariable.CreateList, [output, ...(initial ?? [])]),
                ...remaining.map((values) => structuralAction(
                    structuralBindings.setVariable.AppendValue,
                    [output, ...values],
                )),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "list_index") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`List value is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerExpressionList([
            [expression.list, [{ kind: "list", elementType: expression.valueType }]],
            [expression.index, ["number"]],
        ], context, state);
        const index = oneBasedIndex(lowered.values[1], context);
        const output = destination ?? temporaryVariable(expression.valueType, context);
        if (output.kind !== "variable") throw new Error("List indexing requires a variable destination");
        return {
            statements: [
                ...lowered.statements,
                ...index.statements,
                structuralAction(structuralBindings.setVariable.GetListValue, [output, lowered.values[0], index.value]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "list_length") {
        if (!isPortableTypeAccepted("number", acceptedTypes)) {
            throw new Error(`List length is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const lowered = lowerValueExpression(expression.list, ["list"], context, state);
        const output = destination ?? temporaryVariable("number", context);
        if (output.kind !== "variable") throw new Error("List length requires a variable destination");
        return {
            statements: [
                ...lowered.statements,
                structuralAction(structuralBindings.setVariable.ListLength, [output, lowered.value]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (
        expression.kind === "list_with" ||
        expression.kind === "list_append" ||
        expression.kind === "list_concat" ||
        expression.kind === "list_slice"
    ) {
        return lowerListTransform(expression, acceptedTypes, context, state, destination);
    }
    if (expression.kind === "item_constructor") {
        return lowerItemConstructor(expression, acceptedTypes, context, state, destination);
    }
    if (expression.kind === "item_transform") {
        return lowerItemTransform(expression, acceptedTypes, context, state, destination);
    }
    if (expression.kind === "selection_count") {
        if (!isPortableTypeAccepted("number", acceptedTypes)) {
            throw new Error(`Selection count is not accepted as ${acceptedTypes.join(" or ")}`);
        }
        const direct = expression.selection.filters.length === 0 &&
            "kind" in expression.selection.source
            ? expression.selection.source
            : undefined;
        if (direct) {
            return {
                statements: [],
                value: snapshotSizeVariable(direct.sizeName),
                wroteDestination: false,
                normal: state,
            };
        }
        const selected = lowerSelection(expression.selection, context, state);
        const output = destination ?? temporaryVariable("number", context);
        const binding = internalGameValues.selection_size;
        return {
            statements: [
                ...selected.statements,
                structuralAction(structuralBindings.setVariable["="], [output, {
                    kind: "game_value",
                    name: binding.native.name,
                    valueType: binding.valueType,
                    target: "",
                }]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: selected.normal,
        };
    }
    if (expression.kind === "player_variable") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Player variable ${expression.name} is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
        }
        const value = lowerStoredVariable(expression);
        if (expression.receiver === "selection") {
            return { statements: [], value, wroteDestination: false, normal: state };
        }
        const output = destination ?? temporaryVariable(expression.valueType, context);
        const selected = expression.receiver === "current_player"
            ? { statements: [], normal: state }
            : ensureSnapshot(expression.receiver, context, state);
        return {
            statements: [...selected.statements, structuralAction(structuralBindings.setVariable["="], [output, value])],
            value: output,
            wroteDestination: destination !== undefined,
            normal: selected.normal,
        };
    }
    if (expression.kind === "game_value" && expression.receiver !== "current_player") {
        const selected = ensureSnapshot(expression.receiver, context, state);
        const binding = Object.values(targetGameValues).find((candidate) => candidate.id === expression.value);
        if (!binding || !valueTypesEqual(binding.valueType, expression.valueType) || !isPortableTypeAccepted(binding.valueType, acceptedTypes)) {
            throw new Error(`Unknown or incompatible target game value: ${expression.value}`);
        }
        const output = destination ?? temporaryVariable(expression.valueType, context);
        return {
            statements: [...selected.statements, structuralAction(structuralBindings.setVariable["="], [output, {
                kind: "game_value",
                name: binding.native.name,
                valueType: binding.valueType,
                target: "Selection",
            }])],
            value: output,
            wroteDestination: destination !== undefined,
            normal: selected.normal,
        };
    }
    if (expression.kind === "arithmetic") {
        if (expression.operation === "+" && expression.operands.length === 1) {
            return lowerValueExpression(expression.operands[0], acceptedTypes, context, state, destination);
        }
        const lowered = lowerExpressionList(
            expression.operands.map((operand) => [operand, ["number"] as readonly string[]] as const),
            context,
            state,
        );
        const output = destination ?? temporaryVariable("number", context);
        const binding = structuralBindings.setVariable[
            expression.operation as keyof typeof structuralBindings.setVariable
        ];
        if (!binding) throw new Error(`Unknown arithmetic action ${expression.operation}`);
        return {
            statements: [...lowered.statements, structuralAction(binding, [output, ...lowered.values])],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    if (expression.kind === "string_template") {
        const lowered = lowerExpressionList(
            expression.parts.map((part) => [part, ["any"] as readonly string[]] as const),
            context,
            state,
        );
        const output = destination ?? temporaryVariable("text", context);
        return {
            statements: [
                ...lowered.statements,
                structuralAction(structuralBindings.setVariable.String, [output, ...lowered.values]),
            ],
            value: output,
            wroteDestination: destination !== undefined,
            normal: lowered.normal,
        };
    }
    return {
        statements: [],
        value: lowerExpression(expression, acceptedTypes, context.eventId),
        wroteDestination: false,
        normal: state,
    };
}

type HighDictionaryTransformExpression =
    | import("@nocuft/dfir").HighDictionaryWithExpression
    | import("@nocuft/dfir").HighDictionaryWithoutExpression
    | import("@nocuft/dfir").HighDictionaryMergedExpression;

function lowerDictionaryTransform(
    expression: HighDictionaryTransformExpression,
    acceptedTypes: readonly AcceptedType[],
    context: LowerContext,
    state: SelectionState,
    destination?: LowValue,
): LoweredValue {
    if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
        throw new Error(`Dictionary transform is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
    }
    const expected: (readonly [HighExpression, readonly AcceptedType[]])[] = [
        [expression.dictionary, [expression.valueType]],
    ];
    if (expression.kind === "dictionary_with") {
        expected.push([expression.key, ["text"]], [expression.value, [expression.valueType.valueType]]);
    } else if (expression.kind === "dictionary_without") {
        expected.push([expression.key, ["text"]]);
    } else {
        expected.push(...expression.dictionaries.map((dictionary) =>
            [dictionary, [expression.valueType]] as const));
    }
    const lowered = lowerExpressionList(expected, context, state);
    const source = lowered.values[0];
    const requestedOutput = destination ?? temporaryVariable(expression.valueType, context);
    if (requestedOutput.kind !== "variable") throw new Error("Dictionary transform requires a variable destination");
    const aliasesInput = lowered.values.some((value) => value.kind === "variable" &&
        value.name === requestedOutput.name && value.scope === requestedOutput.scope);
    const output = aliasesInput ? temporaryVariable(expression.valueType, context) : requestedOutput;
    const statements: LowStatement[] = [
        ...lowered.statements,
        structuralAction(structuralBindings.setVariable.CreateDict, [output]),
        structuralAction(structuralBindings.setVariable.AppendDict, [output, source]),
    ];
    if (expression.kind === "dictionary_with") {
        statements.push(structuralAction(structuralBindings.setVariable.SetDictValue, [
            output,
            lowered.values[1],
            lowered.values[2],
        ]));
    } else if (expression.kind === "dictionary_without") {
        statements.push(structuralAction(structuralBindings.setVariable.RemoveDictEntry, [output, lowered.values[1]]));
    } else {
        statements.push(...lowered.values.slice(1).map((dictionary) =>
            structuralAction(structuralBindings.setVariable.AppendDict, [output, dictionary])));
    }
    if (aliasesInput) {
        statements.push(structuralAction(structuralBindings.setVariable["="], [requestedOutput, output]));
    }
    return {
        statements,
        value: requestedOutput,
        wroteDestination: destination !== undefined,
        normal: lowered.normal,
    };
}

type HighListTransformExpression =
    | import("@nocuft/dfir").HighListWithExpression
    | import("@nocuft/dfir").HighListAppendExpression
    | import("@nocuft/dfir").HighListConcatExpression
    | import("@nocuft/dfir").HighListSliceExpression;

function lowerListTransform(
    expression: HighListTransformExpression,
    acceptedTypes: readonly AcceptedType[],
    context: LowerContext,
    state: SelectionState,
    destination?: LowValue,
): LoweredValue {
    if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
        throw new Error(`List transform is not accepted as ${formatAcceptedTypes(acceptedTypes)}`);
    }
    const expected: (readonly [HighExpression, readonly AcceptedType[]])[] = [
        [expression.list, [expression.valueType]],
    ];
    if (expression.kind === "list_with") {
        expected.push(
            [expression.index, ["number"]],
            [expression.value, [expression.valueType.elementType]],
        );
    } else if (expression.kind === "list_append") {
        expected.push(...expression.values.map((value) =>
            [value, [expression.valueType.elementType]] as const));
    } else if (expression.kind === "list_concat") {
        expected.push(...expression.lists.map((list) =>
            [list, [expression.valueType]] as const));
    } else {
        if (expression.start) expected.push([expression.start, ["number"]]);
        if (expression.end) expected.push([expression.end, ["number"]]);
    }

    const lowered = lowerExpressionList(expected, context, state);
    const source = lowered.values[0];
    const requestedOutput = destination ?? temporaryVariable(expression.valueType, context);
    if (requestedOutput.kind !== "variable") throw new Error("List transform requires a variable destination");
    const aliasesSource = source.kind === "variable" &&
        source.name === requestedOutput.name && source.scope === requestedOutput.scope;
    const output = aliasesSource ? temporaryVariable(expression.valueType, context) : requestedOutput;
    const statements: LowStatement[] = [...lowered.statements];

    if (expression.kind === "list_slice") {
        const startOffset = expression.start ? 1 : 0;
        const start = oneBasedIndex(
            expression.start ? lowered.values[1] : { kind: "number", value: 0 },
            context,
        );
        statements.push(
            ...start.statements,
            structuralAction(structuralBindings.setVariable.TrimList, [
                output,
                source,
                start.value,
                ...(expression.end ? [lowered.values[1 + startOffset]] : []),
            ]),
        );
    } else {
        // Native list mutation is in-place, so first build an independent result list.
        statements.push(
            structuralAction(structuralBindings.setVariable.CreateList, [output]),
            structuralAction(structuralBindings.setVariable.AppendList, [output, source]),
        );
        if (expression.kind === "list_with") {
            const index = oneBasedIndex(lowered.values[1], context);
            statements.push(
                ...index.statements,
                structuralAction(structuralBindings.setVariable.SetListValue, [
                    output,
                    index.value,
                    lowered.values[2],
                ]),
            );
        } else if (expression.kind === "list_append" && lowered.values.length > 1) {
            statements.push(...chunks(lowered.values.slice(1), listChunkSize).map((values) =>
                structuralAction(structuralBindings.setVariable.AppendValue, [output, ...values])));
        } else if (expression.kind === "list_concat" && lowered.values.length > 1) {
            statements.push(...chunks(lowered.values.slice(1), listChunkSize).map((values) =>
                structuralAction(structuralBindings.setVariable.AppendList, [output, ...values])));
        }
    }
    if (aliasesSource) {
        statements.push(structuralAction(structuralBindings.setVariable["="], [requestedOutput, output]));
    }
    return {
        statements,
        value: requestedOutput,
        wroteDestination: destination !== undefined,
        normal: lowered.normal,
    };
}

function chunks<T>(values: readonly T[], size: number): T[][] {
    const result: T[][] = [];
    for (let index = 0; index < values.length; index += size) {
        result.push(values.slice(index, index + size));
    }
    return result;
}

function createListStatements(
    output: Extract<LowValue, { kind: "variable" }>,
    values: readonly LowValue[],
): LowStatement[] {
    const [initial, ...remaining] = chunks(values, listChunkSize);
    return [
        structuralAction(structuralBindings.setVariable.CreateList, [output, ...(initial ?? [])]),
        ...remaining.map((chunk) =>
            structuralAction(structuralBindings.setVariable.AppendValue, [output, ...chunk])),
    ];
}

function oneBasedIndex(
    index: LowValue,
    context: LowerContext,
): { statements: LowStatement[]; value: LowValue } {
    if (index.kind === "number") {
        return { statements: [], value: { kind: "number", value: index.value + 1 } };
    }
    const value = temporaryVariable("number", context);
    return {
        statements: [structuralAction(structuralBindings.setVariable["+"], [
            value,
            index,
            { kind: "number", value: 1 },
        ])],
        value,
    };
}

function lowerItemConstructor(
    expression: import("@nocuft/dfir").HighItemConstructorExpression,
    acceptedTypes: readonly AcceptedType[],
    context: LowerContext,
    state: SelectionState,
    destination?: LowValue,
): LoweredValue {
    if (!isPortableTypeAccepted("item", acceptedTypes)) {
        throw new Error(`Item constructor is not accepted as ${acceptedTypes.join(" or ")}`);
    }
    const staticMaterial = expression.material.kind === "string" ? expression.material.value : undefined;
    const staticCount = expression.count.kind === "number" ? expression.count.value : undefined;
    if (staticMaterial !== undefined && staticCount !== undefined) {
        return {
            statements: [],
            value: {
                kind: "item",
                id: normalizeItemId(staticMaterial),
                count: normalizeItemCount(staticCount),
            },
            wroteDestination: false,
            normal: state,
        };
    }

    const lowered = lowerExpressionList([
        ...(staticMaterial === undefined ? [[expression.material, ["text"] as readonly string[]] as const] : []),
        ...(staticCount === undefined ? [[expression.count, ["number"] as readonly string[]] as const] : []),
    ], context, state);
    let index = 0;
    const material = staticMaterial !== undefined ? undefined : lowered.values[index++];
    const count = staticCount !== undefined ? undefined : lowered.values[index++];
    const finalOutput = destination ?? temporaryVariable("item", context);
    const statements = [...lowered.statements];
    let source: LowValue = {
        kind: "item",
        id: normalizeItemId(staticMaterial ?? "minecraft:stone"),
        count: normalizeItemCount(staticCount ?? 1),
    };
    if (material) {
        const output = count ? temporaryVariable("item", context) : finalOutput;
        statements.push(itemTransformAction(
            itemTransformBindings["item.with_material"],
            output,
            source,
            [material],
        ));
        source = output;
    }
    if (count) {
        statements.push(itemTransformAction(
            itemTransformBindings["item.with_count"],
            finalOutput,
            source,
            [count],
        ));
    }
    return {
        statements,
        value: finalOutput,
        wroteDestination: destination !== undefined,
        normal: lowered.normal,
    };
}

function lowerItemTransform(
    expression: import("@nocuft/dfir").HighItemTransformExpression,
    acceptedTypes: readonly AcceptedType[],
    context: LowerContext,
    state: SelectionState,
    destination?: LowValue,
): LoweredValue {
    if (!isPortableTypeAccepted("item", acceptedTypes)) {
        throw new Error(`Item transform is not accepted as ${acceptedTypes.join(" or ")}`);
    }
    const binding = itemTransformBindings[
        expression.operation as keyof typeof itemTransformBindings
    ];
    if (!binding) throw new Error(`Unknown item transform ${expression.operation}`);
    const expected: (readonly [HighExpression, readonly string[]])[] = [
        [expression.receiver, ["item"]],
    ];
    let argumentIndex = 0;
    for (const input of binding.inputs) {
        const count = input.cardinality === "plural"
            ? expression.arguments.length - argumentIndex
            : 1;
        if (count < (input.cardinality === "plural" ? input.minimumLength : 1)) {
            throw new Error(`Missing input ${input.id} for ${expression.operation}`);
        }
        for (let offset = 0; offset < count; offset++) {
            const argument = expression.arguments[argumentIndex++];
            if (!argument) throw new Error(`Missing input ${input.id} for ${expression.operation}`);
            expected.push([argument, input.acceptedTypes]);
        }
    }
    if (argumentIndex !== expression.arguments.length) {
        throw new Error(`Too many arguments for ${expression.operation}`);
    }
    const lowered = lowerExpressionList(expected, context, state);
    const source = lowered.values[0];
    const requestedOutput = destination ?? temporaryVariable("item", context);
    const aliasesSource = source.kind === "variable" && requestedOutput.kind === "variable" &&
        source.name === requestedOutput.name && source.scope === requestedOutput.scope;
    const operationOutput = aliasesSource ? temporaryVariable("item", context) : requestedOutput;
    const statements: LowStatement[] = [
        ...lowered.statements,
        itemTransformAction(binding, operationOutput, source, lowered.values.slice(1)),
    ];
    if (aliasesSource) {
        statements.push(structuralAction(
            structuralBindings.setVariable["="],
            [requestedOutput, operationOutput],
        ));
    }
    return {
        statements,
        value: requestedOutput,
        wroteDestination: destination !== undefined,
        normal: lowered.normal,
    };
}

type ItemTransformBinding = (typeof itemTransformBindings)[keyof typeof itemTransformBindings];

function itemTransformAction(
    binding: ItemTransformBinding,
    destination: LowValue,
    source: LowValue,
    values: readonly LowValue[],
): LowActionStatement {
    const arguments_: import("@nocuft/dfir").LowArgument[] = [
        {
            index: binding.native.destinationIndex,
            layout: "single",
            minimumLength: 1,
            values: [destination],
        },
        {
            index: binding.native.sourceIndex,
            layout: "single",
            minimumLength: 1,
            values: [source],
        },
    ];
    let cursor = 0;
    for (const input of binding.inputs) {
        const selected = input.cardinality === "plural"
            ? values.slice(cursor)
            : values.slice(cursor, cursor + 1);
        cursor += selected.length;
        arguments_.push({
            index: input.native.index,
            layout: input.cardinality,
            minimumLength: input.cardinality === "plural" ? input.minimumLength : 1,
            values: [...selected],
        });
    }
    if (cursor !== values.length) throw new Error(`Too many values for ${binding.id}`);
    return {
        kind: "action",
        block: binding.native.block,
        action: binding.native.action,
        arguments: arguments_,
        tags: lowerTags(binding, undefined, binding.native.action),
    };
}

function lowerExpressionList(
    expressions: readonly (readonly [HighExpression, readonly AcceptedType[]])[],
    context: LowerContext,
    state: SelectionState,
): { statements: LowStatement[]; values: LowValue[]; normal: SelectionState } {
    const statements: LowStatement[] = [];
    const values: LowValue[] = [];
    let normal = state;
    for (const [expression, acceptedTypes] of expressions) {
        const lowered = lowerValueExpression(expression, acceptedTypes, context, normal);
        statements.push(...lowered.statements);
        values.push(lowered.value);
        normal = lowered.normal;
    }
    return { statements, values, normal };
}

function controlAction(operationId: string): LowActionStatement {
    const operation = operations[operationId];
    if (!operation) throw new Error(`Unknown control operation ${operationId}`);
    return {
        kind: "action",
        block: operation.native.block,
        action: operation.native.action,
        arguments: [],
        tags: lowerTags(operation, undefined, operation.native.action),
    };
}

interface LoweredCondition {
    statements: LowStatement[];
    condition: Omit<import("@nocuft/dfir").LowIfStatement, "kind" | "body" | "elseBody">;
    normal: SelectionState;
}

function lowerAtomicCondition(
    condition: Exclude<import("@nocuft/dfir").HighCondition, { kind: "logical" }>,
    context: LowerContext,
    state: SelectionState,
): LoweredCondition {
    if (condition.kind === "held_item") {
        return {
            statements: [],
            normal: state,
            condition: {
                block: "if_player",
                action: "IsHolding",
                target: "current_player",
                arguments: [{
                    index: 0,
                    layout: "plural",
                    minimumLength: 0,
                    values: [lowerExpression(condition.item, ["item"], context.eventId)],
                }],
                tags: [{
                    id: "hand_slot",
                    option: "main_hand",
                    native: { name: "Hand Slot", option: "Main hand", slot: 26 },
                }],
            },
        };
    }
    if (condition.kind === "dictionary_has_key") {
        const binding = structuralBindings.ifVariable.DictHasKey;
        const lowered = lowerExpressionList([
            [condition.dictionary, ["dict"]],
            [condition.key, ["text"]],
        ], context, state);
        const native = structuralAction(binding, lowered.values);
        return {
            statements: lowered.statements,
            normal: lowered.normal,
            condition: {
                block: native.block,
                action: native.action,
                arguments: native.arguments,
                tags: native.tags,
            },
        };
    }
    const action = condition.kind === "comparison" ? condition.action : "=";
    const expressions = condition.kind === "comparison"
        ? [condition.left, condition.right]
        : [condition.value, { kind: "boolean" as const, value: true }];
    const binding = structuralBindings.ifVariable[action as keyof typeof structuralBindings.ifVariable];
    if (!binding) throw new Error(`Unknown If Variable action ${action}`);
    const lowered = lowerExpressionList(
        expressions.map((expression, index) => [
            expression,
            binding.inputs[Math.min(index, binding.inputs.length - 1)].acceptedTypes,
        ] as const),
        context,
        state,
    );
    const native = structuralAction(binding, lowered.values);
    return {
        statements: lowered.statements,
        normal: lowered.normal,
        condition: {
            block: native.block,
            action: native.action,
            arguments: native.arguments,
            tags: native.tags,
        },
    };
}

function flagCondition(
    flag: LowValue,
    action: "=" | "!=",
): Omit<import("@nocuft/dfir").LowIfStatement, "kind" | "body" | "elseBody"> {
    const native = structuralAction(structuralBindings.ifVariable[action], [
        flag,
        { kind: "number", value: 1 },
    ]);
    return {
        block: native.block,
        action: native.action,
        arguments: native.arguments,
        tags: native.tags,
    };
}

function materializeCondition(
    condition: import("@nocuft/dfir").HighCondition,
    destination: LowValue,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    const set = (value: number): LowActionStatement =>
        structuralAction(structuralBindings.setVariable["="], [destination, { kind: "number", value }]);
    if (condition.kind !== "logical") {
        const atom = lowerAtomicCondition(condition, context, state);
        return { statements: [
            set(0),
            ...atom.statements,
            { kind: "if", ...atom.condition, body: [set(1)] },
        ], normal: atom.normal };
    }
    const [left, right] = condition.operands;
    if (condition.operator === "not") {
        const child = temporaryVariable("boolean", context);
        const lowered = materializeCondition(left, child, context, state);
        return { statements: [
            ...lowered.statements,
            set(0),
            { kind: "if", ...flagCondition(child, "!="), body: [set(1)] },
        ], normal: lowered.normal };
    }
    const leftFlag = temporaryVariable("boolean", context);
    if (condition.operator === "and") {
        const loweredLeft = materializeCondition(left, leftFlag, context, state);
        const loweredRight = materializeCondition(right, destination, context, loweredLeft.normal);
        return { statements: [
            set(0),
            ...loweredLeft.statements,
            {
                kind: "if",
                ...flagCondition(leftFlag, "="),
                body: loweredRight.statements,
            },
        ], normal: joinSelection(loweredLeft.normal, loweredRight.normal) };
    }
    const loweredLeft = materializeCondition(left, leftFlag, context, state);
    const loweredRight = materializeCondition(right, destination, context, loweredLeft.normal);
    return { statements: [
        set(0),
        ...loweredLeft.statements,
        {
            kind: "if",
            ...flagCondition(leftFlag, "="),
            body: [set(1)],
            elseBody: loweredRight.statements,
        },
    ], normal: joinSelection(loweredLeft.normal, loweredRight.normal) };
}

function lowerIfStatement(
    statement: import("@nocuft/dfir").HighIfStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    let conditionStatements: LowStatement[];
    let conditionEnd: SelectionState;
    let condition: LoweredCondition["condition"];
    if (statement.condition.kind !== "logical") {
        const atom = lowerAtomicCondition(statement.condition, context, state);
        conditionStatements = atom.statements;
        conditionEnd = atom.normal;
        condition = atom.condition;
    } else {
        const flag = temporaryVariable("boolean", context);
        const materialized = materializeCondition(statement.condition, flag, context, state);
        conditionStatements = materialized.statements;
        conditionEnd = materialized.normal;
        condition = flagCondition(flag, "=");
    }
    const body = lowerStatements(statement.body, context, conditionEnd);
    const elseBody = statement.elseBody
        ? lowerStatements(statement.elseBody, context, conditionEnd)
        : undefined;
    return {
        statements: [
            ...conditionStatements,
            { kind: "if", ...condition, body: body.statements, ...(elseBody ? { elseBody: elseBody.statements } : {}) },
        ],
        normal: joinSelection(body.normal, elseBody?.normal ?? conditionEnd),
    };
}

function lowerLoopBody(
    body: readonly import("@nocuft/dfir").HighStatement[],
    frame: LoopFrame,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    context.loopStack.push(frame);
    try {
        return lowerStatements(body, context, state);
    } finally {
        context.loopStack.pop();
    }
}

function repeatStatement(
    action: keyof typeof structuralBindings.repeat,
    values: readonly LowValue[],
    body: LowStatement[],
    condition?: LoweredCondition["condition"],
): import("@nocuft/dfir").LowRepeatStatement {
    const native = structuralAction(structuralBindings.repeat[action], values);
    return {
        kind: "repeat",
        block: native.block,
        action: native.action,
        ...(condition ? { subAction: condition.action } : {}),
        arguments: condition?.arguments ?? native.arguments,
        tags: condition?.tags ?? native.tags,
        body,
    };
}

function conditionGuard(
    condition: import("@nocuft/dfir").HighCondition,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    if (condition.kind !== "logical") {
        const atom = lowerAtomicCondition(condition, context, state);
        return { statements: [
            ...atom.statements,
            {
                kind: "if",
                ...atom.condition,
                body: [],
                elseBody: [controlAction("control.stop_repeat")],
            },
        ], normal: atom.normal };
    }
    const flag = temporaryVariable("boolean", context);
    const materialized = materializeCondition(condition, flag, context, state);
    return { statements: [
        ...materialized.statements,
        {
            kind: "if",
            ...flagCondition(flag, "="),
            body: [],
            elseBody: [controlAction("control.stop_repeat")],
        },
    ], normal: materialized.normal };
}

function lowerLoopStatement(
    statement: import("@nocuft/dfir").HighLoopStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    if (statement.form === "for" && statement.initializer && statement.update &&
        statement.condition.kind === "comparison" &&
        (statement.condition.action === "<=" || statement.condition.action === ">=") &&
        (statement.update.operation === "+=" || statement.update.operation === "-=") &&
        statement.update.value.kind === "number" && statement.update.value.value > 0 &&
        (statement.condition.right.kind === "number" || statement.condition.right.kind === "parameter") &&
        !mutatesLineVariable(statement.body, statement.initializer.name)) {
        const start = lowerValueExpression(statement.initializer.initializer, ["number"], context, state);
        const end = lowerValueExpression(statement.condition.right, ["number"], context, start.normal);
        const interval = statement.update.operation === "+="
            ? statement.update.value.value
            : -statement.update.value.value;
        const directionMatches = interval > 0
            ? statement.condition.action === "<="
            : statement.condition.action === ">=";
        if (directionMatches) {
            const output: LowValue = {
                kind: "variable",
                name: statement.initializer.name,
                scope: "line",
                valueType: "number",
            };
            const body = lowerLoopBody(statement.body, { continueFooter: (normal) => ({ statements: [], normal }) }, context, { kind: "unknown" });
            return { statements: [
                ...start.statements,
                ...end.statements,
                repeatStatement("Range", [output, start.value, end.value, { kind: "number", value: interval }], body.statements),
            ], normal: { kind: "unknown" } };
        }
    }

    const atomic = statement.condition.kind === "logical"
        ? undefined
        : lowerAtomicCondition(statement.condition, context, state);
    const direct = atomic && atomic.statements.length === 0;
    if (statement.form === "while" && direct) {
        const body = lowerLoopBody(statement.body, { continueFooter: (normal) => ({ statements: [], normal }) }, context, { kind: "unknown" });
        return { statements: [repeatStatement("While", [], body.statements, atomic.condition)], normal: { kind: "unknown" } };
    }
    if (statement.form === "do_while" && direct) {
        const body = lowerLoopBody(statement.body, { continueFooter: (normal) => ({ statements: [], normal }) }, context, { kind: "unknown" });
        return { statements: [repeatStatement("DoWhile", [], body.statements, atomic.condition)], normal: { kind: "unknown" } };
    }
    if (statement.form === "for" && statement.initializer && statement.update && direct) {
        const initializer = lowerStatement(statement.initializer, context, state);
        const footer = (normal: SelectionState) => lowerStatement(statement.update!, context, normal);
        const body = lowerLoopBody(statement.body, { continueFooter: footer }, context, { kind: "unknown" });
        const update = footer(body.normal);
        return { statements: [
            ...initializer.statements,
            repeatStatement("While", [], [...body.statements, ...update.statements], atomic.condition),
        ], normal: { kind: "unknown" } };
    }

    const guardAt = (normal: SelectionState) => conditionGuard(statement.condition, context, normal);
    const guard = guardAt({ kind: "unknown" });
    if (statement.form === "do_while") {
        const body = lowerLoopBody(statement.body, { continueFooter: guardAt }, context, { kind: "unknown" });
        const footer = guardAt(body.normal);
        return { statements: [repeatStatement("Forever", [], [...body.statements, ...footer.statements])], normal: { kind: "unknown" } };
    }
    if (statement.form === "for" && statement.initializer && statement.update) {
        const initializer = lowerStatement(statement.initializer, context, state);
        const updateAt = (normal: SelectionState) => lowerStatement(statement.update!, context, normal);
        const body = lowerLoopBody(statement.body, { continueFooter: updateAt }, context, { kind: "unknown" });
        const update = updateAt(body.normal);
        return { statements: [...initializer.statements, repeatStatement("Forever", [], [...guard.statements, ...body.statements, ...update.statements])], normal: { kind: "unknown" } };
    }
    const body = lowerLoopBody(statement.body, { continueFooter: (normal) => ({ statements: [], normal }) }, context, { kind: "unknown" });
    return { statements: [repeatStatement("Forever", [], [...guard.statements, ...body.statements])], normal: { kind: "unknown" } };
}

function lowerForEachStatement(
    statement: import("@nocuft/dfir").HighForEachStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    const iterable = lowerValueExpression(
        statement.iterable,
        [{ kind: "list", elementType: statement.variable.valueType }],
        context,
        state,
    );
    const variable: LowValue = {
        kind: "variable",
        name: statement.variable.name,
        scope: "line",
        valueType: statement.variable.valueType,
    };
    const body = lowerLoopBody(
        statement.body,
        { continueFooter: (normal) => ({ statements: [], normal }) },
        context,
        { kind: "unknown" },
    );
    return {
        statements: [
            ...iterable.statements,
            repeatStatement("ForEach", [variable, iterable.value], body.statements),
        ],
        normal: { kind: "unknown" },
    };
}

function lowerForEachDictionaryStatement(
    statement: import("@nocuft/dfir").HighForEachDictionaryStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    const dictionary = lowerValueExpression(
        statement.dictionary,
        [{ kind: "dictionary", valueType: statement.valueVariable.valueType }],
        context,
        state,
    );
    const keyVariable: LowValue = {
        kind: "variable",
        name: statement.keyVariable.name,
        scope: "line",
        valueType: "text",
    };
    const valueVariable: LowValue = {
        kind: "variable",
        name: statement.valueVariable.name,
        scope: "line",
        valueType: statement.valueVariable.valueType,
    };
    const body = lowerLoopBody(
        statement.body,
        { continueFooter: (normal) => ({ statements: [], normal }) },
        context,
        { kind: "unknown" },
    );
    return {
        statements: [
            ...dictionary.statements,
            repeatStatement("ForEachEntry", [keyVariable, valueVariable, dictionary.value], body.statements),
        ],
        normal: { kind: "unknown" },
    };
}

function mutatesLineVariable(
    body: readonly import("@nocuft/dfir").HighStatement[],
    name: string,
): boolean {
    return body.some((statement) => {
        if (statement.kind === "set_variable" &&
            statement.variable.kind === "line_variable" &&
            statement.variable.name === name) return true;
        if (statement.kind === "if") {
            return mutatesLineVariable(statement.body, name) ||
                (statement.elseBody ? mutatesLineVariable(statement.elseBody, name) : false);
        }
        if (statement.kind === "loop") return mutatesLineVariable(statement.body, name);
        if (statement.kind === "for_each") {
            return statement.variable.name === name || mutatesLineVariable(statement.body, name);
        }
        if (statement.kind === "for_each_dictionary") {
            return statement.keyVariable.name === name || statement.valueVariable.name === name ||
                mutatesLineVariable(statement.body, name);
        }
        if (statement.kind === "declare_dictionary_get") {
            return statement.valueVariable.name === name || statement.foundVariable.name === name;
        }
        return false;
    });
}

function lowerIntrinsicWithPrelude(
    statement: HighIntrinsicStatement,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    const operation = operations[statement.operation];
    if (!operation) throw new Error(`Unknown intrinsic operation: ${statement.operation}`);
    const lowered = lowerOperationWithPrelude(
        operation,
        statement.arguments,
        statement.options,
        context,
        state,
        statement.receiver,
    );
    if (statement.receiver.kind !== "selection") return lowered;
    const action = lowered.statements.at(-1);
    if (!action || action.kind !== "action") throw new Error("Intrinsic did not lower to an action");
    return { statements: [...lowered.statements.slice(0, -1), { ...action, target: "selection" }], normal: lowered.normal };
}

function lowerOperationWithPrelude(
    operation: CompilerOperation,
    statementArguments: Record<string, import("@nocuft/dfir").HighArgument>,
    statementOptions: Record<string, string> | undefined,
    context: LowerContext,
    state: SelectionState,
    receiver?: HighIntrinsicStatement["receiver"],
): LoweredStatements {
    if (receiver?.kind === "event_entity") {
        throw new Error("Event entity receivers must be represented as selections");
    }
    if (operation.native.block === "player_action" && receiver?.kind === "selection" &&
        receiver.value.resultType !== "player") {
        throw new Error(`Player operation cannot target entities: ${operation.native.action}`);
    }
    if (operation.native.block === "entity_action" &&
        (receiver?.kind !== "selection" || receiver.value.resultType !== "entity")) {
        throw new Error(`Entity operation requires entities: ${operation.native.action}`);
    }
    if (receiver !== undefined && operation.native.block === "game_action" && receiver.kind !== "game") {
        throw new Error(`Game operation requires game: ${operation.native.action}`);
    }
    if (operation.native.block !== "game_action" && receiver?.kind === "game") {
        throw new Error(`Non-game operation cannot target game: ${operation.native.action}`);
    }
    if (receiver !== undefined && operation.native.block === "control" && receiver.kind !== "control") {
        throw new Error(`Control operation requires control: ${operation.native.action}`);
    }
    if (operation.native.block !== "control" && receiver?.kind === "control") {
        throw new Error(`Non-control operation cannot target control: ${operation.native.action}`);
    }

    const inputsById = new Map(operation.inputs.map((input) => [input.id, input]));
    for (const name of Object.keys(statementArguments)) {
        if (!inputsById.has(name)) throw new Error(`Unknown argument ${name} for ${operation.native.action}`);
    }
    const statements: LowStatement[] = [];
    const arguments_: import("@nocuft/dfir").LowArgument[] = [];
    let normal = state;
    for (const input of operation.inputs) {
        const argument = statementArguments[input.id];
        if (argument === undefined) {
            const required = input.cardinality === "single" ? !input.optional : (input.minimumLength ?? 0) > 0;
            if (required) throw new Error(`Missing required argument ${input.id} for ${operation.native.action}`);
            continue;
        }
        const plural = Array.isArray(argument);
        if (plural !== (input.cardinality === "plural")) {
            throw new Error(`Invalid cardinality for ${input.id} in ${operation.native.action}`);
        }
        const expressions = plural ? argument : [argument];
        const minimumLength = input.minimumLength ?? 1;
        if (expressions.length < minimumLength) {
            throw new Error(`Expected at least ${minimumLength} values for ${input.id} in ${operation.native.action}`);
        }
        const lowered = lowerExpressionList(
            expressions.map((expression) => [
                expression,
                plural ? pluralAcceptedTypes(expression, input.acceptedTypes) : input.acceptedTypes,
            ] as const),
            context,
            normal,
        );
        statements.push(...lowered.statements);
        normal = lowered.normal;
        arguments_.push({
            index: input.native.index,
            layout: input.cardinality,
            minimumLength,
            values: lowered.values,
        });
    }
    statements.push({
        kind: "action",
        block: operation.native.block,
        action: operation.native.action,
        ...(receiver === undefined || receiver.kind === "game" || receiver.kind === "control"
            ? {}
            : { target: receiver.kind === "current_player" ? "current_player" as const : "selection" as const }),
        arguments: arguments_.toSorted((left, right) => left.index - right.index),
        tags: lowerTags(operation, statementOptions, operation.native.action),
    });
    return { statements, normal };
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
                    lowerExpression(
                        expression,
                        plural ? pluralAcceptedTypes(expression, input.acceptedTypes) : input.acceptedTypes,
                        eventId,
                    ),
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

function snapshotVariable(name: string): Extract<LowValue, { kind: "variable" }> {
    return { kind: "variable", name, scope: "line", valueType: { kind: "list", elementType: "text" } };
}

function snapshotSizeVariable(name: string): Extract<LowValue, { kind: "variable" }> {
    return { kind: "variable", name, scope: "line", valueType: "number" };
}

function ensureSnapshot(
    snapshot: import("@nocuft/dfir").HighSelectionSnapshotExpression,
    _context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    if (state.kind === "snapshot" && state.id === snapshot.name) {
        return { statements: [], normal: state };
    }
    return {
        statements: [{
            kind: "select_object",
            action: selectorBindings["select.PlayerName"].native.action,
            arguments: [{
                index: selectorBindings["select.PlayerName"].native.arguments[0].index,
                layout: "plural",
                minimumLength: 1,
                values: [snapshotVariable(snapshot.name)],
            }],
            tags: [],
        }],
        normal: { kind: "snapshot", id: snapshot.name },
    };
}

function lowerSelection(
    selection: import("@nocuft/dfir").HighSelectionExpression,
    context: LowerContext,
    state: SelectionState,
): LoweredStatements {
    const selectors: import("@nocuft/dfir").HighSelector[] = "kind" in selection.source
        ? selection.filters
        : [selection.source, ...selection.filters];
    const preludes: LowStatement[] = [];
    const actions: LowStatement[] = [];
    let normal = state;
    for (const selector of selectors) {
        const binding = selectorBindings[selector.operation as keyof typeof selectorBindings];
        if (!binding) throw new Error(`Unknown selector: ${selector.operation}`);
        const grouped = binding.native.arguments.map((argument, index) => {
            const expressions = selector.arguments.slice(
                index,
                argument.cardinality === "plural" ? undefined : index + 1,
            );
            const values = lowerExpressionList(
                  expressions.map((value) => [
                      value,
                      [
                          selector.operation === "select.FilterCondition" &&
                          index === 1 &&
                          selector.arguments[0]?.kind === "player_variable"
                              ? selector.arguments[0].valueType
                              : argument.type,
                      ],
                  ] as const),
                  context,
                  normal,
              );
            preludes.push(...values.statements);
            normal = values.normal;
            return {
                index: argument.index,
                layout: argument.cardinality,
                minimumLength: argument.optional ? 0 : 1,
                values: values.values,
            };
        }).filter((argument) => argument.values.length > 0);
        const selected = selector.options ?? {};
        const tags = binding.native.tags.map((tag) => {
            const id = tag.name === "Event Target" ? "eventTarget" : tag.name === "Compare Mode" ? "compareMode" : tag.name === "Ignore Y-Axis" ? "ignoreYAxis" : "ignoreFormatting";
            const value = selected[id] ?? tag.defaultOption;
            const native = value === "true" ? "True" : value === "false" ? "False" : value[0].toUpperCase() + value.slice(1);
            return { id, option: value, native: { name: tag.name, option: native, slot: tag.slot } };
        });
        actions.push({
            kind: "select_object" as const,
            action: binding.native.action,
            ...("subAction" in binding.native ? { subAction: binding.native.subAction } : {}),
            arguments: grouped,
            tags,
        });
    }
    const source = "kind" in selection.source
        ? ensureSnapshot(selection.source, context, normal)
        : { statements: [], normal };
    const executed = actions.length > 0;
    return {
        statements: [...preludes, ...source.statements, ...actions],
        normal: executed ? { kind: "anonymous" } : source.normal,
    };
}

function lowerExpression(
    expression: HighExpression,
    acceptedTypes: readonly AcceptedType[],
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
        return lowerStoredVariable(expression);
    }
    if (expression.kind === "player_variable") {
        if (!isPortableTypeAccepted(expression.valueType, acceptedTypes)) {
            throw new Error(`Player variable ${expression.name} is not accepted as ${acceptedTypes.join(" or ")}`);
        }
        return lowerStoredVariable(expression);
    }
    if (expression.kind === "game_value") {
        const binding = Object.values(targetGameValues).find(
            (candidate) => candidate.id === expression.value,
        );
        if (!binding || !valueTypesEqual(binding.valueType, expression.valueType)) {
            throw new Error(`Unknown target game value: ${expression.value}`);
        }
        if (!isPortableTypeAccepted(binding.valueType, acceptedTypes)) {
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
            count: normalizeItemCount(expression.count),
        };
    }
    if (
        expression.kind === "item_snapshot" &&
        (acceptedTypes.includes("item") || acceptedTypes.includes("any"))
    ) {
        if (expression.snbt.trim().length === 0) throw new Error("Captured item SNBT cannot be empty");
        return { kind: "item", snbt: expression.snbt };
    }

    throw new Error(
        `Cannot lower ${expression.kind} expression as ${acceptedTypes.join(" or ")}`,
    );
}

function portableType(expression: HighExpression): ValueType | string {
    switch (expression.kind) {
        case "parameter": return expression.valueType;
        case "string": return "text";
        case "number": return "number";
        case "boolean": return "boolean";
        case "sound": return "sound";
        case "location": return "location";
        case "item": return "item";
        case "item_snapshot": return "item";
        case "item_constructor": return "item";
        case "item_transform": return "item";
        case "event_field": return expression.valueType;
        case "game_value": return expression.valueType;
        case "line_variable": return expression.valueType;
        case "plot_variable": return expression.valueType;
        case "player_variable": return expression.valueType;
        case "list": return expression.valueType;
        case "list_index": return expression.valueType;
        case "list_length": return "number";
        case "list_with": return expression.valueType;
        case "list_append": return expression.valueType;
        case "list_concat": return expression.valueType;
        case "list_slice": return expression.valueType;
        case "dictionary": return expression.valueType;
        case "dictionary_get": return expression.valueType;
        case "dictionary_size": return "number";
        case "dictionary_keys": return { kind: "list", elementType: "text" };
        case "dictionary_values": return expression.valueType;
        case "dictionary_with": return expression.valueType;
        case "dictionary_without": return expression.valueType;
        case "dictionary_merged": return expression.valueType;
        case "selection_count": return "number";
        default: return "any";
    }
}

function lowerStoredVariable(
    variable: HighPlotVariableExpression | HighPlayerVariableExpression,
): LowStoredVariableValue {
    if (
        !variable.name.trim() ||
        !["unsaved", "saved"].includes(variable.scope) ||
        !(typeof variable.valueType === "string"
            ? ["number", "text", "boolean"].includes(variable.valueType)
            : isValueType(variable.valueType))
    ) {
        throw new Error(`Invalid stored variable ${variable.name}`);
    }
    return {
        kind: "variable",
        name: variable.name,
        scope: variable.scope,
        owner: variable.kind === "player_variable" ? "player" : "plot",
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

type AcceptedType = ValueType | string;

function pluralAcceptedTypes(
    expression: HighExpression,
    elementTypes: readonly AcceptedType[],
): readonly AcceptedType[] {
    const type = portableType(expression);
    return typeof type !== "string" && type.kind === "list" &&
        isPortableTypeAccepted(type.elementType, elementTypes)
        ? [type]
        : elementTypes;
}

function isPortableTypeAccepted(type: AcceptedType, acceptedTypes: readonly AcceptedType[]): boolean {
    return acceptedTypes.some((accepted) => {
        if (accepted === "any") return true;
        if (accepted === "list") return (typeof type === "object" && type.kind === "list") || type === "list";
        if (accepted === "dict") return (typeof type === "object" && type.kind === "dictionary") || type === "dict";
        if (typeof accepted === "object") {
            return type === accepted.kind || (typeof type === "object" && valueTypeAssignable(type, accepted));
        }
        if (accepted === type) return true;
        return accepted === "component" && typeof type === "string" &&
            ["text", "number", "boolean"].includes(type);
    });
}

function formatAcceptedTypes(types: readonly AcceptedType[]): string {
    return types.map((type) => typeof type === "string"
        ? type
        : type.kind === "list"
          ? `list<${formatAcceptedTypes([type.elementType])}>`
          : `dictionary<${formatAcceptedTypes([type.valueType])}>`).join(" or ");
}

function isEventFieldTypeAccepted(
    fieldType: string,
    acceptedTypes: readonly AcceptedType[],
): boolean {
    return (
        acceptedTypes.some((type) => type === "any") ||
        acceptedTypes.some((type) => type === fieldType) ||
        (acceptedTypes.some((type) => type === "component") &&
            (fieldType === "text" || fieldType === "number"))
    );
}

function normalizeItemId(id: string): string {
    if (!/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(id)) {
        throw new Error(`Invalid item ID: ${id}`);
    }
    return id.includes(":") ? id : `minecraft:${id}`;
}

function normalizeItemCount(count: number): number {
    if (!Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
        throw new Error(`Invalid item count: ${count}`);
    }
    return count;
}

function capitalizeCoordinate(value: string): string {
    return value === "pitch" ? "Pitch" : value === "yaw" ? "Yaw" : value.toUpperCase();
}
