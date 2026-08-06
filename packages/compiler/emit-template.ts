import type {
    LowActionStatement,
    LowModule,
    LowStatement,
    LowTemplate,
    LowValue,
    LowVariableValue,
    LowFunctionTemplate,
    LowProcessTemplate,
} from "@nocuft/dfir";
import { structuralBindings } from "./generated/structural-bindings.js";

export interface NativeItem {
    id: string;
    data: Record<string, unknown>;
}

export interface NativeSlotItem {
    item: NativeItem;
    slot: number;
}

export interface NativeCodeBlock {
    id: "block";
    block: string;
    action?: string;
    subAction?: string;
    data?: string;
    args: {
        items: NativeSlotItem[];
    };
    target?: string;
    direct?: "open" | "close";
}

export interface NativeTemplate {
    blocks: NativeCodeBlock[];
}

export interface EmittedTemplate {
    name: string;
    nativeName: string;
    kind: "player_event" | "entity_event" | "game_event" | "function" | "process";
    template: NativeTemplate;
    json: string;
}

export function emitTemplates(module: LowModule): EmittedTemplate[] {
    return module.templates.map((template) => {
        const native = emitTemplate(template);
        return {
            name: template.name,
            nativeName:
                template.kind === "event" ? template.action : template.name,
            kind: emittedKind(template),
            template: native,
            json: JSON.stringify(native),
        };
    });
}

function emittedKind(template: LowTemplate): EmittedTemplate["kind"] {
    if (template.kind === "function") {
        return "function";
    }
    if (template.kind === "process") {
        return "process";
    }
    switch (template.block) {
        case "event":
            return "player_event";
        case "entity_event":
            return "entity_event";
        case "game_event":
            return "game_event";
        default:
            throw new Error(`Unsupported event block: ${template.block}`);
    }
}

export function emitTemplate(template: LowTemplate): NativeTemplate {
    return {
        blocks: [
            template.kind === "function"
                ? emitFunctionHeader(template)
                : template.kind === "process"
                  ? emitProcessHeader(template)
                  : emitEventHeader(template.block, template.action),
            ...template.body.flatMap(emitStatement),
        ],
    };
}

function emitStatement(statement: LowStatement): NativeCodeBlock[] {
    switch (statement.kind) {
        case "action":
            return [emitAction(statement)];
        case "call_function":
            return [emitFunctionCall(statement)];
        case "start_process":
            return [emitStartProcess(statement)];
        case "select_object":
            return [emitSelectObject(statement)];
        case "if":
            return [
                emitAction({
                    kind: "action",
                    block: statement.block,
                    action: statement.action,
                    target: statement.target,
                    arguments: statement.arguments,
                    tags: statement.tags,
                }),
                emitBracket("open"),
                ...statement.body.flatMap(emitStatement),
                emitBracket("close"),
                ...(statement.elseBody
                    ? [
                          {
                              id: "block" as const,
                              block: structuralBindings.else.native.block,
                              args: { items: [] },
                          },
                          emitBracket("open"),
                          ...statement.elseBody.flatMap(emitStatement),
                          emitBracket("close"),
                      ]
                    : []),
            ];
        case "repeat":
            return [
                {
                    ...emitAction({
                        kind: "action",
                        block: statement.block,
                        action: statement.action,
                        arguments: statement.arguments,
                        tags: statement.tags,
                    }),
                    ...(statement.subAction === undefined
                        ? {}
                        : { subAction: statement.subAction }),
                },
                emitBracket("open"),
                ...statement.body.flatMap(emitStatement),
                emitBracket("close"),
            ];
    }
}

function emitBracket(direct: "open" | "close"): NativeCodeBlock {
    return {
        id: "block",
        block: "bracket",
        direct,
        args: { items: [] },
    };
}

function emitSelectObject(
    statement: import("@nocuft/dfir").LowSelectObjectStatement,
): NativeCodeBlock {
    return {
        ...emitAction({
            kind: "action",
            block: "select_obj",
            action: statement.action,
            arguments: statement.arguments,
            tags: statement.tags,
        }),
        ...(statement.subAction === undefined
            ? {}
            : { subAction: statement.subAction }),
    };
}

function emitEventHeader(block: string, action: string): NativeCodeBlock {
    return {
        id: "block",
        block,
        action,
        args: { items: [] },
    };
}

function emitFunctionHeader(template: LowFunctionTemplate): NativeCodeBlock {
    const parameters: NativeSlotItem[] = (template.parameters ?? [])
        .filter((parameter) => parameter.kind === "value")
        .map((parameter, slot) => ({
        item: {
            id: "pn_el",
            data: {
                name: parameter.name,
                optional: false,
                plural: parameter.rest === true,
                type: nativeParameterType(
                    parameter.rest === true ? parameter.type.elementType : parameter.type,
                ),
            },
        },
        slot,
    }));
    if (parameters.length > 26) {
        throw new Error(`Function ${template.name} has too many parameters`);
    }
    return {
        id: "block",
        block: "func",
        data: template.name,
        args: {
            items: [
                ...parameters,
                {
                    item: {
                        id: "bl_tag",
                        data: {
                            tag: "Is Hidden",
                            option:
                                template.exported === false ? "True" : "False",
                            block: "func",
                            action: "dynamic",
                        },
                    },
                    slot: 26,
                },
            ],
        },
    };
}

function emitProcessHeader(template: LowProcessTemplate): NativeCodeBlock {
    const items: NativeSlotItem[] = (template.parameters ?? []).map(
        (parameter, slot) => ({
            item: {
                id: "pn_el",
                data: {
                    name: parameter.name,
                    optional: false,
                    plural: parameter.rest === true,
                    type: nativeParameterType(parameter.type),
                },
            },
            slot,
        }),
    );
    assertPhysicalArgumentLimit(items.length, `Process ${template.name} header`);
    const occupiedSlots = new Set(items.map((item) => item.slot));
    for (const tag of template.tags) {
        pushItem(items, occupiedSlots, {
            item: emitTag(tag, template.block, template.action),
            slot: tag.native.slot,
        });
    }
    return {
        id: "block",
        block: template.block,
        data: template.name,
        args: { items: items.toSorted((left, right) => left.slot - right.slot) },
    };
}

function nativeParameterType(
    type: import("@nocuft/dfir").ValueType,
): string {
    if (typeof type === "object") return type.kind === "list" ? "list" : "dict";
    switch (type) {
        case "text": return "txt";
        case "number":
        case "boolean": return "num";
        case "component": return "comp";
        case "location": return "loc";
        case "item": return "item";
        case "sound": return "snd";
        case "any": return "any";
    }
}

function emitFunctionCall(statement: import("@nocuft/dfir").LowFunctionCallStatement): NativeCodeBlock {
    assertPhysicalArgumentLimit(statement.arguments.length, `Call to ${statement.function}`);
    return {
        id: "block",
        block: "call_func",
        data: statement.function,
        args: {
            items: statement.arguments.map((value, slot) => ({
                item: emitValue(value),
                slot,
            })),
        },
        ...(statement.target ? { target: emitTarget(statement.target) } : {}),
    };
}

function emitStartProcess(
    statement: import("@nocuft/dfir").LowStartProcessStatement,
): NativeCodeBlock {
    assertPhysicalArgumentLimit(statement.arguments.length, `Start process ${statement.process}`);
    const items: NativeSlotItem[] = statement.arguments.map((value, slot) => ({
        item: emitValue(value),
        slot,
    }));
    const occupiedSlots = new Set(items.map((item) => item.slot));
    for (const tag of statement.tags) {
        pushItem(items, occupiedSlots, {
            item: emitTag(tag, statement.block, statement.action),
            slot: tag.native.slot,
        });
    }
    return {
        id: "block",
        block: statement.block,
        data: statement.process,
        args: { items: items.toSorted((left, right) => left.slot - right.slot) },
    };
}

function assertPhysicalArgumentLimit(count: number, context: string): void {
    if (count > 27) throw new Error(`${context} has ${count} physical arguments; native calls support at most 27`);
}

function emitTag(
    tag: import("@nocuft/dfir").LowTag,
    block: string,
    action: string,
): NativeItem {
    return {
        id: "bl_tag",
        data: {
            tag: tag.native.name,
            option: tag.native.option,
            block,
            action,
        },
    };
}

function emitAction(statement: LowActionStatement): NativeCodeBlock {
    const items: NativeSlotItem[] = [];
    const occupiedSlots = new Set<number>();
    let expansion = 0;

    for (const argument of statement.arguments.toSorted(
        (left, right) => left.index - right.index,
    )) {
        if (
            (argument.layout === "single" && argument.values.length !== 1) ||
            (argument.layout === "plural" &&
                argument.values.length < argument.minimumLength)
        ) {
            throw new Error(
                `Invalid value count for native input ${argument.index}`,
            );
        }
        const start = argument.index + expansion;
        argument.values.forEach((value, offset) => {
            pushItem(items, occupiedSlots, {
                item: emitValue(value),
                slot: start + offset,
            });
        });
        if (argument.layout === "plural") {
            expansion += Math.max(0, argument.values.length - 1);
        }
    }

    for (const tag of statement.tags) {
        pushItem(items, occupiedSlots, {
            item: emitTag(tag, statement.block, statement.action),
            slot: tag.native.slot,
        });
    }

    return {
        id: "block",
        block: statement.block,
        action: statement.action,
        args: {
            items: items.toSorted((left, right) => left.slot - right.slot),
        },
        ...(statement.target === "current_player"
            ? {}
            : statement.target
              ? { target: emitTarget(statement.target) }
              : {}),
    };
}

function emitValue(value: LowValue): NativeItem {
    switch (value.kind) {
        case "parameter":
            return {
                id: "var",
                data: { name: value.name, scope: "line" },
            };
        case "variable":
            return {
                id: "var",
                data: { name: nativeVariableName(value), scope: value.scope },
            };
        case "game_value":
            return {
                id: "g_val",
                data: {
                    type: value.name,
                    target: value.target,
                },
            };
        case "text":
            return {
                id: "txt",
                data: {
                    name: value.value,
                },
            };
        case "number":
            return {
                id: "num",
                data: {
                    name: String(value.value),
                },
            };
        case "component":
            return {
                id: "comp",
                data: {
                    name: value.value,
                },
            };
        case "sound":
            return {
                id: "snd",
                data: {
                    sound: value.value,
                    pitch: 1,
                    vol: 2,
                },
            };
        case "location":
            return {
                id: "loc",
                data: {
                    isBlock: false,
                    loc: {
                        x: value.x,
                        y: value.y,
                        z: value.z,
                        pitch: 0,
                        yaw: 0,
                    },
                },
            };
        case "item":
            if (value.snbt !== undefined) {
                if (value.snbt.trim().length === 0) throw new Error("Captured item SNBT cannot be empty");
                return { id: "item", data: { item: value.snbt } };
            }
            if (!Number.isFinite(value.count) || !Number.isInteger(value.count) || value.count < 1) {
                throw new Error(`Invalid item count: ${value.count}`);
            }
            return {
                id: "item",
                data: {
                    item: `{count:${value.count},id:${JSON.stringify(value.id)}}`,
                },
            };
    }
}

function nativeVariableName(value: LowVariableValue): string {
    return value.scope !== "line" && value.owner === "player" ? `%uuid ${value.name}` : value.name;
}

function pushItem(
    items: NativeSlotItem[],
    occupiedSlots: Set<number>,
    item: NativeSlotItem,
): void {
    if (!Number.isInteger(item.slot) || item.slot < 0 || item.slot > 26) {
        throw new Error(`Native item slot is out of range: ${item.slot}`);
    }
    if (occupiedSlots.has(item.slot)) {
        throw new Error(`Native item slot is occupied: ${item.slot}`);
    }
    occupiedSlots.add(item.slot);
    items.push(item);
}

function emitTarget(target: LowActionStatement["target"]): string {
    switch (target) {
        case "all_players":
            return "AllPlayers";
        case "current_player":
            throw new Error("Current player uses the default native target");
        case "selection":
            return "Selection";
        case undefined:
            throw new Error("Cannot emit an undefined target");
    }
}
