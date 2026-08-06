import type { RawGameValue } from "./actiondump.js";
import { camelCase, normalizeName } from "./util/strings.js";

type TargetGameValueType =
    | "location"
    | "item"
    | "component"
    | "text"
    | { kind: "list"; elementType: TargetGameValueType };

const supportedValues = new Map<string, { valueType: TargetGameValueType; returnType: string }>([
    ["Locational Values/Location", { valueType: "location", returnType: "LOCATION" }],
    ["Item Values/Main Hand Item", { valueType: "item", returnType: "ITEM" }],
    ["Item Values/Off Hand Item", { valueType: "item", returnType: "ITEM" }],
    ["Item Values/Cursor Item", { valueType: "item", returnType: "ITEM" }],
    ["Item Values/Inventory Menu Items", {
        valueType: { kind: "list", elementType: "item" },
        returnType: "LIST",
    }],
    ["Informational Values/Name ", { valueType: "component", returnType: "COMPONENT" }],
    ["Informational Values/UUID", { valueType: "text", returnType: "TEXT" }],
]);

const internalValues = new Map([
    ["Plot Values/Selection Target UUIDs", {
        id: "selection_target_uuids",
        valueType: { kind: "list", elementType: "text" },
        returnType: "LIST",
    }],
    ["Plot Values/Selection Size", { id: "selection_size", valueType: "number", returnType: "NUMBER" }],
] as const);

export function normalizeTargetGameValues(values: readonly RawGameValue[]) {
    const normalized = Object.fromEntries(
        [...supportedValues].map(([key, metadata]) => {
            const [category, nativeName] = key.split("/");
            const value = values.find(
                (candidate) =>
                    candidate.category === category &&
                    candidate.icon.name === nativeName,
            );
            if (!value) {
                throw new Error(`Missing ${key}`);
            }
            if (value.icon.returnType !== metadata.returnType) {
                throw new Error(
                    `Expected ${key} to return ${metadata.returnType}`,
                );
            }
            const method = camelCase(nativeName);
            return [
                method,
                {
                    id: `target.${normalizeName(nativeName)}`,
                    method,
                    receiver: "player",
                    valueType: metadata.valueType,
                    description: value.icon.description.join(" "),
                    native: { name: nativeName },
                },
            ];
        }),
    );
    if (Object.keys(normalized).length !== supportedValues.size) {
        throw new Error("Duplicate target game-value method");
    }
    return normalized as Record<
        string,
        {
            id: string;
            method: string;
            receiver: "player";
            valueType: TargetGameValueType;
            description: string;
            native: { name: string };
        }
    >;
}

export function normalizeInternalGameValues(values: readonly RawGameValue[]) {
    return Object.fromEntries(
        [...internalValues].map(([key, metadata]) => {
            const [category, nativeName] = key.split("/");
            const value = values.find(
                (candidate) => candidate.category === category && candidate.icon.name === nativeName,
            );
            if (!value) throw new Error(`Missing ${key}`);
            if (value.icon.returnType !== metadata.returnType) {
                throw new Error(`Expected ${key} to return ${metadata.returnType}`);
            }
            return [metadata.id, {
                id: metadata.id,
                valueType: metadata.valueType,
                description: value.icon.description.join(" "),
                native: { name: nativeName },
            }];
        }),
    ) as Record<string, {
        id: string;
        valueType: { kind: "list"; elementType: "text" } | "number";
        description: string;
        native: { name: string };
    }>;
}

export function renderTargetGameValues(
    values: ReturnType<typeof normalizeTargetGameValues>,
    internal: ReturnType<typeof normalizeInternalGameValues>,
): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const targetGameValues = ${JSON.stringify(values, null, 4)} as const;`,
        "",
        `export const internalGameValues = ${JSON.stringify(internal, null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderPlayerValues(
    values: ReturnType<typeof normalizeTargetGameValues>,
): string {
    const imports = [
        ...new Set(
            Object.values(values).flatMap((value) => {
                const types: string[] = [];
                const collect = (type: TargetGameValueType): void => {
                    if (typeof type !== "string") {
                        types.push("List");
                        collect(type.elementType);
                    } else if (type === "location") types.push("Location");
                    else if (type === "item") types.push("Item");
                    else if (type === "component") types.push("ComponentInput");
                };
                collect(value.valueType);
                return types;
            }),
        ),
    ].sort();
    return [
        "// This file is generated. Do not edit manually.",
        `import type { ${imports.join(", ")} } from "../values/index";`,
        "",
        "export interface PlayerValues {",
        ...Object.values(values).map((value) => {
            const renderType = (type: TargetGameValueType): string => {
                if (typeof type !== "string") return `List<${renderType(type.elementType)}>`;
                if (type === "location") return "Location";
                if (type === "item") return "Item";
                if (type === "component") return "ComponentInput";
                return "string";
            };
            return `    /** ${value.description} */\n    ${value.method}(): ${renderType(value.valueType)};`;
        }),
        "}",
        "",
    ].join("\n");
}
