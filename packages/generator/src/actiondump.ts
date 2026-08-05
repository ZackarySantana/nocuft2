import type {
    NormalizationResult,
    Operation,
    OperationInput,
    SoundDefinition,
    UnsupportedOperation,
} from "./model.js";
import { camelCase, normalizeName } from "./util/strings.js";

export interface RawActionDump {
    actions: RawAction[];
    sounds: RawSound[];
}

export interface RawSound {
    sound: string;
    soundId: string;
}

export interface RawAction {
    name: string;
    codeblockName: string;
    subAction: string;
    legacyReplacement?: unknown;
    tags: RawTag[];
    icon: {
        name: string;
        description: string[];
        arguments: RawArgument[];
    };
}

export interface RawTag {
    name: string;
    slot: number;
    defaultOption: string;
    options: Array<{
        name: string;
    }>;
}

export interface RawArgument {
    type?: string;
    plural?: boolean;
    optional?: boolean;
    description?: string[];
    text?: string;
}

interface ProjectedArgument {
    alternatives: Array<RawArgument | undefined>;
}

const valueTypes: Readonly<Record<string, string>> = {
    ANY_TYPE: "any",
    BLOCK: "item",
    BLOCK_TAG: "text",
    BYTE: "number",
    COMPONENT: "component",
    DICT: "dict",
    ENTITY_TYPE: "item",
    ITEM: "item",
    LIST: "list",
    LOCATION: "location",
    NUMBER: "number",
    PARTICLE: "particle",
    POTION: "potion",
    PROJECTILE: "item",
    SOUND: "sound",
    SPAWN_EGG: "item",
    TEXT: "text",
    VARIABLE: "variable",
    VECTOR: "vector",
    VEHICLE: "item",
};

export function isCurrentPlayerAction(action: RawAction): boolean {
    return (
        action.codeblockName === "PLAYER ACTION" &&
        action.legacyReplacement === undefined
    );
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
                action: action.subAction.trim(),
            },
            reason,
            detail,
        },
    };
}

function projectArgumentChunk(chunk: readonly RawArgument[]): ProjectedArgument[] {
    const alternatives: RawArgument[][] = [[]];
    let hasOr = false;
    for (const argument of chunk) {
        if (argument.text === "OR") {
            hasOr = true;
            alternatives.push([]);
        } else if (argument.type !== undefined) {
            alternatives[alternatives.length - 1].push(argument);
        }
    }

    if (!hasOr) {
        return alternatives[0].map((argument) => ({
            alternatives: [argument],
        }));
    }

    const width = Math.max(
        0,
        ...alternatives.map((alternative) => alternative.length),
    );
    return Array.from({ length: width }, (_, index) => ({
        alternatives: alternatives.map((alternative) => alternative[index]),
    }));
}

function projectArguments(arguments_: readonly RawArgument[]): ProjectedArgument[] {
    const projected: ProjectedArgument[] = [];
    let chunk: RawArgument[] = [];
    const flush = (): void => {
        projected.push(...projectArgumentChunk(chunk));
        chunk = [];
    };

    for (const argument of arguments_) {
        if (argument.text === "") {
            flush();
        } else {
            chunk.push(argument);
        }
    }
    flush();
    return projected;
}

export function normalizePlayerAction(action: RawAction): NormalizationResult {
    try {
        const inputs = projectArguments(action.icon.arguments).flatMap<OperationInput>(
            (projection, index) => {
                const present = projection.alternatives.filter(
                    (argument): argument is RawArgument => argument !== undefined,
                );
                const representative =
                    present.find((argument) => argument.type !== "NONE") ??
                    present[0];
                const acceptedTypes = [
                    ...new Set(
                        present.flatMap((argument) => {
                            if (!argument.type || argument.type === "NONE") {
                                return [];
                            }
                            const type = valueTypes[argument.type];
                            if (!type) {
                                throw new UnsupportedShapeError(
                                    `${action.name}: unknown value type ${argument.type}`,
                                );
                            }
                            return [type];
                        }),
                    ),
                ].toSorted();

                if (!representative || acceptedTypes.length === 0) {
                    return [];
                }
                if (!representative.description) {
                    throw new UnsupportedShapeError(
                        `${action.name}: argument ${index} has no description`,
                    );
                }

                const optional = projection.alternatives.some(
                    (argument) =>
                        argument === undefined ||
                        argument.optional === true ||
                        argument.type === "NONE",
                );
                const plural = present.some(
                    (argument) => argument.plural === true,
                );
                const base = {
                    id: normalizeName(representative.description.join(" ")),
                    acceptedTypes:
                        action.codeblockName === "PLAYER ACTION" &&
                        action.name.trim() === "SendMessage" &&
                        index === 0
                            ? ["any"]
                            : acceptedTypes,
                    native: { index },
                };

                return plural
                    ? [
                          {
                              ...base,
                              cardinality: "plural" as const,
                              minimumLength: optional ? 0 : 1,
                          },
                      ]
                    : [
                          {
                              ...base,
                              cardinality: "single" as const,
                              optional,
                          },
                      ];
            },
        );

        const inputIds = new Set<string>();
        for (const input of inputs) {
            if (!input.id || inputIds.has(input.id)) {
                throw new UnsupportedShapeError(
                    `${action.name}: duplicate or empty argument ID ${input.id}`,
                );
            }
            inputIds.add(input.id);
        }

        const operation: Operation = {
            id: `player.${normalizeName(action.name)}`,
            receiver: "player",
            method: camelCase(action.name),
            description: action.icon.description
                .join(" ")
                .replace(/\s+/g, " ")
                .trim(),

            native: {
                block: "player_action",
                action: action.subAction.trim(),
            },

            inputs,

            tags: action.tags.map((tag) => ({
                id: normalizeName(tag.name),
                defaultOption: normalizeName(tag.defaultOption),
                options: tag.options.map((option) =>
                    normalizeName(option.name),
                ),
                native: {
                    name: tag.name,
                    slot: tag.slot,
                    options: Object.fromEntries(
                        tag.options.map((option) => [
                            normalizeName(option.name),
                            option.name,
                        ]),
                    ),
                },
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

export function normalizeSounds(
    sounds: readonly RawSound[],
): SoundDefinition[] {
    const normalized = sounds.map((sound) => ({
        id: sound.soundId,
        native: sound.sound,
    }));
    const seen = new Set<string>();

    for (const sound of normalized) {
        if (seen.has(sound.id)) {
            throw new Error(`Duplicate sound ID: ${sound.id}`);
        }
        seen.add(sound.id);
    }

    return normalized.toSorted((left, right) =>
        left.id.localeCompare(right.id),
    );
}
