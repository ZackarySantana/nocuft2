import type {
    NormalizationResult,
    Operation,
    OperationInput,
    UnsupportedOperation,
} from "./model.js";
import { camelCase, normalizeName } from "./util/strings.js";

export interface RawActionDump {
    actions: RawAction[];
}

export interface RawAction {
    name: string;
    codeblockName: string;
    subAction: string;
    tags: RawTag[];
    slots: RawSlot[];
    icon: {
        name: string;
        description: string[];
        arguments?: RawArgument[];
    };
}

export interface RawTag {
    name: string;
    defaultOption: string;
    options: Array<{
        name: string;
    }>;
}

export interface RawArgument {
    type: string;
    plural: boolean;
    optional: boolean;
    description: string[];
    text?: string;
}

export type RawSlotArgument =
    | RawArgument
    | {
          text: string;
          type?: undefined;
          description?: undefined;
      };

export interface RawTagSlot {
    id: number;
    type: "tag";
    index: number;
    optional: boolean;
    tag: string;
}

export interface RawSingleSlot {
    id: number;
    type: "single";
    index: number;
    optional: boolean;
    argument: RawSlotArgument;
}

export interface RawPluralSlot {
    id: number;
    type: "plural";
    index: number;
    optional: boolean;
    argument: RawSlotArgument;
    minimumLength: number;
    listShortcut: boolean;
}

export interface RawStaticSlot {
    id: number;
    type: "static";
    index: number;
    optional: boolean;
    argument: RawSlotArgument;
}

export interface RawOrVariant {
    index: number;
    name: string;
    slots: Array<RawSingleSlot | RawPluralSlot | RawStaticSlot | RawTagSlot>;
}

export interface RawOrSlot {
    id: number;
    type: "or";
    variants: RawOrVariant[];
}

export type RawSlot = RawTagSlot | RawSingleSlot | RawPluralSlot | RawOrSlot;

function hasTypedArgument(argument: RawSlotArgument): argument is RawArgument {
    return (
        typeof argument.type === "string" && Array.isArray(argument.description)
    );
}

function resolveArgument(
    argument: RawSlotArgument,
    fallback: RawArgument | undefined,
): RawArgument | undefined {
    return hasTypedArgument(argument) ? argument : fallback;
}

class UnsupportedShapeError extends Error {}

function unsupportedPlayerAction(
    action: RawAction,
    reason: UnsupportedOperation["reason"],
    detail: string,
): NormalizationResult {
    return {
        kind: "unsupported",
        operation: {
            id: `player.${normalizeName(action.name)}`,
            receiver: "player",
            method: camelCase(action.name),
            native: {
                block: "player_action",
                action: action.subAction,
            },
            reason,
            detail,
        },
    };
}

function lacksPublicArgumentMetadata(action: RawAction): boolean {
    const valueSlots = action.slots.filter(
        (slot): slot is RawSingleSlot | RawPluralSlot =>
            slot.type === "single" || slot.type === "plural",
    );

    return (
        action.icon.name.trim() === "" &&
        (action.icon.arguments?.length ?? 0) === 0 &&
        valueSlots.length > 0 &&
        valueSlots.every((slot) => !hasTypedArgument(slot.argument))
    );
}

export function normalizePlayerAction(action: RawAction): NormalizationResult {
    if (lacksPublicArgumentMetadata(action)) {
        return unsupportedPlayerAction(
            action,
            "missing_public_metadata",
            "The action has placeholder slots and no public icon argument metadata.",
        );
    }

    try {
        let iconArgumentIndex = 0;

        const inputs = action.slots.flatMap<OperationInput>(
            (slot, slotIndex) => {
                if (slot.type === "tag") {
                    return [];
                }

                const iconArgument = action.icon.arguments?.[iconArgumentIndex];
                iconArgumentIndex += 1;

                if (slot.type === "or") {
                    const variants = slot.variants.map((variant) => {
                        if (variant.slots.length !== 1) {
                            throw new UnsupportedShapeError(
                                `${action.name}: or-slot ${slotIndex} variant ${variant.index} has ${variant.slots.length} nested slots`,
                            );
                        }

                        const nestedSlot = variant.slots[0];
                        if (nestedSlot.type === "tag") {
                            throw new UnsupportedShapeError(
                                `${action.name}: or-slot ${slotIndex} variant ${variant.index} contains a tag slot`,
                            );
                        }

                        const argument = resolveArgument(
                            nestedSlot.argument,
                            iconArgument,
                        );
                        if (!argument) {
                            throw new UnsupportedShapeError(
                                `${action.name}: cannot resolve argument metadata for or-slot ${slot.id} variant ${variant.index}`,
                            );
                        }

                        return {
                            argument,
                            slot: nestedSlot,
                            encoding: {
                                orSlotId: slot.id,
                                variantIndex: variant.index,
                                slotId: nestedSlot.id,
                                index: nestedSlot.index,
                                layout: nestedSlot.type,
                            } as const,
                        };
                    });

                    if (variants.length === 0) {
                        throw new UnsupportedShapeError(
                            `${action.name}: or-slot ${slot.id} has no variants`,
                        );
                    }

                    const first = variants[0];
                    const firstType = first.argument.type.toLowerCase();
                    const firstId = normalizeName(
                        first.argument.description.join(" "),
                    );
                    const firstCardinality =
                        first.slot.type === "plural" ? "plural" : "single";

                    for (const variant of variants.slice(1)) {
                        const type = variant.argument.type.toLowerCase();
                        const id = normalizeName(
                            variant.argument.description.join(" "),
                        );
                        const cardinality =
                            variant.slot.type === "plural"
                                ? "plural"
                                : "single";

                        if (
                            type !== firstType ||
                            id !== firstId ||
                            cardinality !== firstCardinality
                        ) {
                            throw new UnsupportedShapeError(
                                `${action.name}: or-slot ${slot.id} variants have different public argument shapes`,
                            );
                        }
                    }

                    const base = {
                        id: firstId,
                        type: firstType,
                        native: {
                            encodings: variants.map(
                                (variant) => variant.encoding,
                            ),
                        },
                    };

                    if (first.slot.type === "plural") {
                        return [
                            {
                                ...base,
                                cardinality: "plural",
                                minimumLength: first.slot.minimumLength,
                                listShortcut: first.slot.listShortcut,
                            },
                        ];
                    }

                    return [
                        {
                            ...base,
                            cardinality: "single",
                            optional: first.argument.optional,
                        },
                    ];
                }

                const argument = resolveArgument(slot.argument, iconArgument);

                if (!argument) {
                    throw new UnsupportedShapeError(
                        `${action.name}: cannot resolve argument metadata for slot ${slot.id}`,
                    );
                }

                const base = {
                    id: normalizeName(argument.description.join(" ")),
                    type: argument.type.toLowerCase(),
                    native: {
                        encodings: [
                            {
                                slotId: slot.id,
                                index: slot.index,
                                layout: slot.type,
                            },
                        ],
                    },
                };

                if (slot.type === "single") {
                    return [
                        {
                            ...base,
                            cardinality: "single",
                            optional: argument.optional,
                        },
                    ];
                }

                return [
                    {
                        ...base,
                        cardinality: "plural",
                        minimumLength: slot.minimumLength,
                        listShortcut: slot.listShortcut,
                    },
                ];
            },
        );

        const operation: Operation = {
            id: `player.${normalizeName(action.name)}`,
            receiver: "player",
            method: camelCase(action.name),

            native: {
                block: "player_action",
                action: action.subAction,
            },

            inputs,

            tags: action.tags.map((tag) => ({
                id: normalizeName(tag.name),
                defaultOption: normalizeName(tag.defaultOption),
                options: tag.options.map((option) =>
                    normalizeName(option.name),
                ),
            })),
        };

        return {
            kind: "operation",
            operation,
        };
    } catch (cause) {
        if (cause instanceof UnsupportedShapeError) {
            return unsupportedPlayerAction(
                action,
                "unsupported_shape",
                cause.message,
            );
        }

        throw new Error(`Failed to normalize player action ${action.name}`, {
            cause,
        });
    }
}
