import type { RawAction } from "./actiondump.js";
import type { StructuralActionBinding, StructuralBindings } from "./structures.js";

type SelectorArgumentType = "any" | "number" | "text" | "component" | "location";

export interface SelectorBinding {
    id: string;
    owner: "players" | "entities" | "selection" | "event";
    method: string;
    kind: "source" | "filter";
    resultType: "player" | "entity";
    native: {
        action: string;
        subAction?: string;
        arguments: Array<{
            index: number;
            type: SelectorArgumentType;
            cardinality: "single" | "plural";
            optional: boolean;
        }>;
        tags: Array<{
            name: string;
            slot: number;
            defaultOption: string;
            options: string[];
        }>;
    };
}

interface SelectorPolicy {
    owner: "players" | "entities" | "selection" | "event";
    method: string;
    kind: "source" | "filter";
    resultType: "player" | "entity";
    /**
     * Native argument slots selected for this public binding. This projects
     * one alternative out of native actions that advertise multiple OR
     * signatures under the same action name.
     */
    argumentIndexes?: readonly number[];
}

const policy = {
    RandomPlayer: { owner: "players", method: "random", kind: "source", resultType: "player" },
    PlayerName: { owner: "players", method: "named", kind: "source", resultType: "player" },
    AllPlayers: { owner: "players", method: "all", kind: "source", resultType: "player" },
    LastEntity: { owner: "entities", method: "lastEntity", kind: "source", resultType: "entity" },
    EntityUUID: { owner: "entities", method: "byUuid", kind: "source", resultType: "entity" },
    EntityName: {
        owner: "entities",
        method: "named",
        kind: "source",
        resultType: "entity",
        argumentIndexes: [2],
    },
    AllEntities: { owner: "entities", method: "all", kind: "source", resultType: "entity" },
    FilterRandom: { owner: "selection", method: "random", kind: "filter", resultType: "entity" },
    FilterDistance: { owner: "selection", method: "nearest", kind: "filter", resultType: "entity" },
    FilterCondition: { owner: "selection", method: "where", kind: "filter", resultType: "entity" },
    EventTarget: { owner: "event", method: "eventTarget", kind: "source", resultType: "entity" },
} as const satisfies Record<string, SelectorPolicy>;

const valueTypes = {
    ANY_TYPE: "any",
    NUMBER: "number",
    TEXT: "text",
    COMPONENT: "component",
    LOCATION: "location",
} as const;

export function normalizeSelectors(
    actions: readonly RawAction[],
    structuralBindings: StructuralBindings,
): SelectorBinding[] {
    return Object.entries(policy).map(([name, entry]) => {
        const action = actions.find(
            (candidate) =>
                candidate.codeblockName === "SELECT OBJECT" &&
                candidate.name === name &&
                candidate.legacyReplacement === undefined,
        );
        if (!action) throw new Error(`Missing current SELECT OBJECT / ${name}`);
        if (name === "FilterCondition") {
            return normalizeConditionSelector(
                action,
                entry,
                structuralBindings.ifVariable["="],
            );
        }
        const selectedIndexes = "argumentIndexes" in entry
            ? new Set<number>(entry.argumentIndexes)
            : undefined;
        const arguments_ = (action.icon.arguments ?? []).flatMap((argument, index) => {
            if (selectedIndexes && !selectedIndexes.has(index)) return [];
            if (!argument.type || !(argument.type in valueTypes)) return [];
            return [{
                index,
                type: valueTypes[argument.type as keyof typeof valueTypes],
                cardinality: argument.plural ? "plural" as const : "single" as const,
                optional: argument.optional === true,
            }];
        });
        if (selectedIndexes && arguments_.length !== selectedIndexes.size) {
            throw new Error(
                `SELECT OBJECT / ${name} is missing a configured argument index`,
            );
        }
        return {
            id: `select.${name}`,
            owner: entry.owner,
            method: entry.method,
            kind: entry.kind,
            resultType: entry.resultType,
            native: {
                action: action.subAction.trim(),
                arguments: arguments_,
                tags: action.tags.map((tag) => ({
                    name: tag.name,
                    slot: tag.slot,
                    defaultOption: tag.defaultOption,
                    options: tag.options.map((option) => option.name),
                })),
            },
        };
    });
}

function normalizeConditionSelector(
    action: RawAction,
    entry: SelectorPolicy,
    condition: StructuralActionBinding,
): SelectorBinding {
    if (!action.subActionBlocks?.includes(condition.native.block)) {
        throw new Error(
            `SELECT OBJECT / ${action.name} does not allow ${condition.native.block}`,
        );
    }
    return {
        id: `select.${action.name}`,
        owner: entry.owner,
        method: entry.method,
        kind: entry.kind,
        resultType: entry.resultType,
        native: {
            action: action.subAction.trim(),
            subAction: condition.native.action,
            arguments: condition.inputs.map((input) => {
                if (input.acceptedTypes.length !== 1) {
                    throw new Error(
                        `IF VARIABLE / ${condition.native.action} argument ${input.native.index} does not have one accepted type`,
                    );
                }
                const type = input.acceptedTypes[0] as SelectorArgumentType;
                if (!["any", "number", "text", "component", "location"].includes(type)) {
                    throw new Error(
                        `Unsupported selector condition argument type ${type}`,
                    );
                }
                return {
                    index: input.native.index,
                    type,
                    cardinality: input.cardinality,
                    optional: input.cardinality === "single"
                        ? input.optional
                        : input.minimumLength === 0,
                };
            }),
            tags: condition.tags.map((tag) => ({
                name: tag.native.name,
                slot: tag.native.slot,
                defaultOption: tag.native.options[tag.defaultOption],
                options: tag.options.map((option) => tag.native.options[option]),
            })),
        },
    };
}

export function renderSelectorBindings(selectors: readonly SelectorBinding[]): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const selectorBindings = ${JSON.stringify(Object.fromEntries(selectors.map((selector) => [selector.id, selector])), null, 4)} as const;`,
        "",
    ].join("\n");
}
