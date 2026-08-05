import type {
    NormalizationResult,
    EventDefinition,
    EventMutator,
    Operation,
    OperationInput,
    OperationReceiver,
    SoundDefinition,
    UnsupportedOperation,
} from "./model.js";
import { camelCase, normalizeName } from "./util/strings.js";

export interface RawActionDump {
    actions: RawAction[];
    gameValues: RawGameValue[];
    sounds: RawSound[];
}

export interface RawGameValue {
    category: string;
    icon: {
        name: string;
        description: string[];
        worksWith: string[];
        returnType: string;
    };
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
        cancellable?: boolean;
        worksWith?: string[];
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
    return isCurrentAction(action, "PLAYER ACTION");
}

export function isCurrentEntityAction(action: RawAction): boolean {
    return isCurrentAction(action, "ENTITY ACTION");
}

const eventScopedGameActions = new Set([
    "SetEventDeathMsg",
    "SetEventDamage",
    "RedstoneStrength",
    "SetEventSound",
    "SetEventXP",
    "SetExhaustion",
    "SetDisplayedItem",
    "SetEventProj",
    "SetEventHeal",
    "CancelEvent",
    "UncancelEvent",
]);

export function isCurrentGameAction(action: RawAction): boolean {
    return (
        isCurrentAction(action, "GAME ACTION") &&
        !eventScopedGameActions.has(action.name.trim())
    );
}

export function isCurrentControlAction(action: RawAction): boolean {
    return isCurrentAction(action, "CONTROL");
}

function isCurrentAction(action: RawAction, block: string): boolean {
    return action.codeblockName === block && action.legacyReplacement === undefined;
}

export function normalizeEvents(
    actions: readonly RawAction[],
    gameValues: readonly RawGameValue[],
): EventDefinition[] {
    const eventValues = gameValues.filter(
        (value) => value.category === "Event Values",
    );
    const mutatorActions = actions.filter(isCurrentEventMutatorAction);
    const events = actions
        .filter(
            (action) =>
                action.codeblockName === "GAME EVENT" ||
                action.codeblockName === "PLAYER EVENT" ||
                action.codeblockName === "ENTITY EVENT",
        )
        .map((action): EventDefinition => {
            const player = action.codeblockName === "PLAYER EVENT";
            const entity = action.codeblockName === "ENTITY EVENT";
            const group = player ? "player" : entity ? "entity" : "plot";
            const generatedMethod = camelCase(action.name.trim());
            const method =
                group === "plot" && generatedMethod.startsWith("plot")
                    ? generatedMethod.slice(4).replace(/^./, (character) =>
                          character.toLowerCase(),
                      )
                    : generatedMethod;
            return {
                id: `${group}.${method}`,
                group,
                method,
                description: action.icon.description.join(" "),
                callbackParameter: player
                    ? "player_event"
                    : entity
                      ? "entity_event"
                      : "none",
                cancellable: action.icon.cancellable === true,
                fields: eventValues
                    .filter((value) => eventValueApplies(value, action))
                    .map((value) => normalizeEventField(value)),
                entityRoles: getEventEntityRoles(action),
                mutators: mutatorActions
                    .filter((mutator) => eventActionApplies(mutator, action))
                    .map(normalizeEventMutator),
                native: {
                    block: player
                        ? "event"
                        : entity
                          ? "entity_event"
                          : "game_event",
                    action: action.subAction.trim(),
                },
            };
        });

    const ids = new Set<string>();
    for (const event of events) {
        if (ids.has(event.id)) {
            throw new Error(`Duplicate generated event ID: ${event.id}`);
        }
        ids.add(event.id);
    }

    return events.toSorted((left, right) => left.id.localeCompare(right.id));
}

function isCurrentEventMutatorAction(action: RawAction): boolean {
    return (
        isCurrentAction(action, "GAME ACTION") &&
        action.icon.name.trim().startsWith("Set Event ") &&
        (action.icon.worksWith?.length ?? 0) > 0
    );
}

function eventActionApplies(mutator: RawAction, event: RawAction): boolean {
    return (mutator.icon.worksWith ?? []).some((worksWith) =>
        eventApplicabilityMatches(worksWith, event),
    );
}

function eventApplicabilityMatches(worksWith: string, event: RawAction): boolean {
    const applicability = normalizeEventApplicability(worksWith);
    const eventName = normalizeEventApplicability(event.icon.name || event.name);
    if (applicability === eventName) {
        return true;
    }
    if (applicability === "damage events") {
        return eventName.includes("damage") || eventName.includes("take dmg");
    }
    if (applicability === "death events") {
        return eventName.includes("death") || eventName.includes("kill player");
    }
    if (applicability === "entity death events") {
        return (
            event.codeblockName === "ENTITY EVENT" &&
            eventName.includes("death")
        );
    }
    if (applicability === "exhaustion events") {
        return event.name.trim() === "Exhaustion";
    }
    return false;
}

function normalizeEventMutator(action: RawAction): EventMutator {
    const shape = normalizeOperationShape(action);
    return {
        id: `game.${normalizeName(action.name)}`,
        method: camelCase(action.name.trim()),
        description: action.icon.description.join(" ").replace(/\s+/g, " ").trim(),
        native: {
            block: "game_action",
            action: action.subAction.trim(),
        },
        ...shape,
    };
}

function getEventEntityRoles(action: RawAction): EventDefinition["entityRoles"] {
    const playerVictimEvents = new Set([
        "PlayerDmgPlayer",
        "KillPlayer",
        "ClickPlayer",
        "LeftClickPlayer",
    ]);
    const name = action.name.trim();
    if (playerVictimEvents.has(name)) {
        return [{ name: "victim", type: "player", native: "Victim" }];
    }

    const roles: EventDefinition["entityRoles"] = [];
    if (action.codeblockName === "ENTITY EVENT") {
        roles.push({ name: "entity", type: "entity", native: "Default" });
    }
    const damageVictimEvents = new Set([
        "EntityDmgEntity",
        "ProjDmgEntity",
        "EntityKillEntity",
        "ProjKillEntity",
        "DamageEntity",
        "KillMob",
        "EntityDmgPlayer",
        "ProjDmgPlayer",
        "MobKillPlayer",
    ]);
    if (damageVictimEvents.has(name)) {
        roles.push({
            name: "victim",
            type:
                name === "EntityDmgPlayer" ||
                name === "ProjDmgPlayer" ||
                name === "MobKillPlayer"
                    ? "player"
                    : "entity",
            native: "Victim",
        });
    }
    if (["EntityDmgEntity", "EntityDmgPlayer"].includes(name)) {
        roles.push({ name: "damager", type: "entity", native: "Damager" });
    }
    if (["EntityKillEntity", "MobKillPlayer"].includes(name)) {
        roles.push({ name: "killer", type: "entity", native: "Killer" });
    }
    if (["ProjDmgEntity", "ProjKillEntity", "ProjDmgPlayer"].includes(name)) {
        roles.push(
            { name: "shooter", type: "entity", native: "Shooter" },
            { name: "projectile", type: "entity", native: "Projectile" },
        );
    }
    if (["ShootBow", "ShootProjectile", "ProjHit"].includes(name)) {
        roles.push({ name: "projectile", type: "entity", native: "Projectile" });
    }
    return roles;
}

function eventValueApplies(value: RawGameValue, event: RawAction): boolean {
    return value.icon.worksWith.some((worksWith) =>
        eventApplicabilityMatches(worksWith, event),
    );
}

function normalizeEventApplicability(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^player /, "")
        .replace(/ game event$/, " event")
        .replace(/ power event$/, " event")
        .replace(/ product$/, " event");
}

function normalizeEventField(value: RawGameValue): EventDefinition["fields"][number] {
    const type = valueTypes[value.icon.returnType];
    if (
        type !== "text" &&
        type !== "number" &&
        type !== "component" &&
        type !== "location" &&
        type !== "item" &&
        type !== "list" &&
        type !== "vector"
    ) {
        throw new Error(
            `Unsupported event value type ${value.icon.returnType} for ${value.icon.name}`,
        );
    }
    return {
        name: camelCase(
            value.icon.name
                .trim()
                .replace(/^Event /, "")
                .replace(/ Event /, " "),
        ),
        description: value.icon.description.join(" "),
        type,
        native: value.icon.name.trim(),
    };
}

class UnsupportedShapeError extends Error {}

function unsupportedAction(
    action: RawAction,
    receiver: OperationReceiver,
    nativeBlock: string,
    reason: UnsupportedOperation["reason"],
    detail: string,
): NormalizationResult {
    return {
        kind: "unsupported",
        operation: {
            id: `${receiver}.${normalizeName(action.name)}`,
            receiver,
            method: camelCase(action.name),
            native: {
                block: nativeBlock,
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
    return normalizeAction(action, "player");
}

export function normalizeEntityAction(action: RawAction): NormalizationResult {
    return normalizeAction(action, "entity");
}

export function normalizeGameAction(action: RawAction): NormalizationResult {
    return normalizeAction(action, "game");
}

export function normalizeControlAction(action: RawAction): NormalizationResult {
    return normalizeAction(action, "control", "control");
}

function normalizeAction(
    action: RawAction,
    receiver: OperationReceiver,
    nativeBlock = `${receiver}_action`,
): NormalizationResult {
    try {
        const shape = normalizeOperationShape(action);

        const operation: Operation = {
            id: `${receiver}.${normalizeName(action.name)}`,
            receiver,
            method: camelCase(action.name),
            description: action.icon.description
                .join(" ")
                .replace(/\s+/g, " ")
                .trim(),

            native: {
                block: nativeBlock,
                action: action.subAction.trim(),
            },

            ...shape,
        };

        return {
            kind: "operation",
            operation,
        };
    } catch (cause) {
        if (cause instanceof UnsupportedShapeError) {
            return unsupportedAction(
                action,
                receiver,
                nativeBlock,
                "unsupported_shape",
                cause.message,
            );
        }

        throw new Error(`Failed to normalize ${receiver} action ${action.name}`, {
            cause,
        });
    }
}

export function normalizeOperationShape(
    action: RawAction,
): Pick<Operation, "inputs" | "tags"> {
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

        return {
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
