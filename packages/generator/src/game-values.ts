import type { RawGameValue } from "./actiondump.js";
import { camelCase, normalizeName } from "./util/strings.js";

const supportedValues = new Map([
    ["Locational Values/Location", "location"],
    ["Item Values/Main Hand Item", "item"],
    ["Item Values/Off Hand Item", "item"],
    ["Item Values/Cursor Item", "item"],
] as const);

export function normalizeTargetGameValues(values: readonly RawGameValue[]) {
    const normalized = Object.fromEntries(
        [...supportedValues].map(([key, valueType]) => {
            const [category, nativeName] = key.split("/");
            const value = values.find(
                (candidate) =>
                    candidate.category === category &&
                    candidate.icon.name.trim() === nativeName,
            );
            if (!value) {
                throw new Error(`Missing ${key}`);
            }
            const expectedReturnType = valueType === "location" ? "LOCATION" : "ITEM";
            if (value.icon.returnType !== expectedReturnType) {
                throw new Error(
                    `Expected ${key} to return ${expectedReturnType}`,
                );
            }
            const method = camelCase(nativeName);
            return [
                method,
                {
                    id: `target.${normalizeName(nativeName)}`,
                    method,
                    receiver: "player",
                    valueType,
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
            valueType: "location" | "item";
            description: string;
            native: { name: string };
        }
    >;
}

export function renderTargetGameValues(values: ReturnType<typeof normalizeTargetGameValues>): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const targetGameValues = ${JSON.stringify(values, null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderPlayerValues(
    values: ReturnType<typeof normalizeTargetGameValues>,
): string {
    const imports = [
        ...new Set(
            Object.values(values).map((value) =>
                value.valueType === "location" ? "Location" : "Item",
            ),
        ),
    ].sort();
    return [
        "// This file is generated. Do not edit manually.",
        `import type { ${imports.join(", ")} } from "../values/index";`,
        "",
        "export interface PlayerValues {",
        ...Object.values(values).map(
            (value) =>
                `    /** ${value.description} */\n    ${value.method}(): ${value.valueType === "location" ? "Location" : "Item"};`,
        ),
        "}",
        "",
    ].join("\n");
}
