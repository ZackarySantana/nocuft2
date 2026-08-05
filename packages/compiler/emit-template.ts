import type {
    LowActionStatement,
    LowModule,
    LowTemplate,
    LowValue,
} from "@nocuft/dfir";

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
    data?: string;
    args: {
        items: NativeSlotItem[];
    };
    target?: string;
}

export interface NativeTemplate {
    blocks: NativeCodeBlock[];
}

export interface EmittedTemplate {
    name: string;
    template: NativeTemplate;
    json: string;
}

export function emitTemplates(module: LowModule): EmittedTemplate[] {
    return module.templates.map((template) => {
        const native = emitTemplate(template);
        return {
            name: template.name,
            template: native,
            json: JSON.stringify(native),
        };
    });
}

export function emitTemplate(template: LowTemplate): NativeTemplate {
    return {
        blocks: [
            emitFunctionHeader(template.name),
            ...template.body.map(emitAction),
        ],
    };
}

function emitFunctionHeader(name: string): NativeCodeBlock {
    return {
        id: "block",
        block: "func",
        data: name,
        args: {
            items: [
                {
                    item: {
                        id: "bl_tag",
                        data: {
                            tag: "Is Hidden",
                            option: "False",
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
            item: {
                id: "bl_tag",
                data: {
                    tag: tag.native.name,
                    option: tag.native.option,
                    block: statement.block,
                    action: statement.action,
                },
            },
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
        ...(statement.target ? { target: emitTarget(statement.target) } : {}),
    };
}

function emitValue(value: LowValue): NativeItem {
    switch (value.kind) {
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
            return {
                id: "item",
                data: {
                    item: `{count:1,id:${JSON.stringify(value.id)}}`,
                },
            };
    }
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
        case undefined:
            throw new Error("Cannot emit an undefined target");
    }
}
