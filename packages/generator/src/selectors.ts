import type { RawAction } from "./actiondump.js";

export interface SelectorBinding {
    id: string;
    owner: "players" | "entities" | "selection" | "event";
    method: string;
    kind: "source" | "filter";
    resultType: "player" | "entity";
    native: {
        action: string;
        arguments: Array<{
            index: number;
            type: "number" | "text" | "component" | "location";
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
    EventTarget: { owner: "event", method: "eventTarget", kind: "source", resultType: "entity" },
} as const satisfies Record<string, SelectorPolicy>;

const valueTypes = {
    NUMBER: "number",
    TEXT: "text",
    COMPONENT: "component",
    LOCATION: "location",
} as const;

export function normalizeSelectors(actions: readonly RawAction[]): SelectorBinding[] {
    return Object.entries(policy).map(([name, entry]) => {
        const action = actions.find(
            (candidate) =>
                candidate.codeblockName === "SELECT OBJECT" &&
                candidate.name === name &&
                candidate.legacyReplacement === undefined,
        );
        if (!action) throw new Error(`Missing current SELECT OBJECT / ${name}`);
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

export function renderSelectorBindings(selectors: readonly SelectorBinding[]): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const selectorBindings = ${JSON.stringify(Object.fromEntries(selectors.map((selector) => [selector.id, selector])), null, 4)} as const;`,
        "",
    ].join("\n");
}
