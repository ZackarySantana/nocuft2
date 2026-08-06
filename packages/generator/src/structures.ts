import type { OperationInput, OperationTag } from "./model.js";
import {
    normalizeOperationShape,
    type RawAction,
} from "./actiondump.js";

export interface StructuralActionBinding {
    native: {
        block: string;
        action: string;
    };
    inputs: OperationInput[];
    tags: OperationTag[];
}

export interface StructuralBindings {
    setVariable: Record<string, StructuralActionBinding>;
    ifVariable: Record<string, StructuralActionBinding>;
    repeat: Record<string, StructuralActionBinding>;
    else: {
        native: {
            block: "else";
        };
    };
}

const selected = {
    "SET VARIABLE": [
        "=",
        "+",
        "-",
        "x",
        "/",
        "%",
        "Exponent",
        "+=",
        "-=",
        "String",
        "CreateList",
        "GetListValue",
        "SetListValue",
        "AppendValue",
        "AppendList",
        "TrimList",
        "ListLength",
        "CreateDict",
        "GetDictValue",
        "SetDictValue",
        "GetDictSize",
        "GetDictKeys",
        "GetDictValues",
        "AppendDict",
        "RemoveDictEntry",
    ],
    "IF VARIABLE": ["=", "!=", "<", "<=", ">", ">=", "DictHasKey"],
    REPEAT: ["Range", "While", "DoWhile", "Forever", "ForEach", "ForEachEntry"],
} as const;

export function normalizeStructuralBindings(
    actions: readonly RawAction[],
): StructuralBindings {
    return {
        setVariable: normalizeGroup(actions, "SET VARIABLE", "set_var", selected["SET VARIABLE"]),
        ifVariable: normalizeGroup(actions, "IF VARIABLE", "if_var", selected["IF VARIABLE"]),
        repeat: normalizeGroup(actions, "REPEAT", "repeat", selected.REPEAT),
        else: { native: { block: "else" } },
    };
}

function normalizeGroup(
    actions: readonly RawAction[],
    codeblockName: string,
    block: string,
    names: readonly string[],
): Record<string, StructuralActionBinding> {
    return Object.fromEntries(names.map((name) => {
        const matches = actions.filter((candidate) =>
            candidate.codeblockName === codeblockName &&
            candidate.name.trim() === name &&
            candidate.legacyReplacement === undefined
        );
        if (matches.length === 0) throw new Error(`Missing current ${codeblockName} / ${name}`);
        if (matches.length > 1) throw new Error(`Duplicate current ${codeblockName} / ${name}`);
        const action = matches[0];
        return [action.subAction.trim(), {
            native: { block, action: action.subAction.trim() },
            ...normalizeOperationShape(action),
        }];
    }));
}

export function renderStructuralBindings(bindings: StructuralBindings): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const structuralBindings = ${JSON.stringify(bindings, null, 4)} as const;`,
        "",
    ].join("\n");
}
