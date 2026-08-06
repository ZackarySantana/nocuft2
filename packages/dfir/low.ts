export interface LowModule {
    kind: "module";
    templates: LowTemplate[];
}

export type LowTemplate = LowFunctionTemplate | LowProcessTemplate | LowEventTemplate;

export interface LowFunctionTemplate {
    kind: "function";
    name: string;
    exported?: boolean;
    parameters?: LowParameter[];
    body: LowStatement[];
}

export interface LowProcessTemplate {
    kind: "process";
    name: string;
    block: string;
    action: string;
    exported?: boolean;
    parameters?: LowValueParameter[];
    tags: LowTag[];
    body: LowStatement[];
}

export type LowParameter = LowValueParameter | LowTargetParameter;

export type LowValueParameter = LowSingleValueParameter | LowRestValueParameter;

export interface LowSingleValueParameter {
    kind: "value";
    name: string;
    type: ValueType;
    rest?: false;
}

export interface LowRestValueParameter {
    kind: "value";
    name: string;
    type: ListValueType;
    rest: true;
}

export interface LowTargetParameter {
    kind: "target";
    name: string;
    target: "player";
}

export interface LowEventTemplate {
    kind: "event";
    name: string;
    block: string;
    action: string;
    body: LowStatement[];
}

export type LowStatement =
    | LowActionStatement
    | LowFunctionCallStatement
    | LowStartProcessStatement
    | LowSelectObjectStatement
    | LowIfStatement
    | LowRepeatStatement;

export interface LowIfStatement {
    kind: "if";
    block: string;
    action: string;
    target?: LowTarget;
    arguments: LowArgument[];
    tags: LowTag[];
    body: LowStatement[];
    elseBody?: LowStatement[];
}

export interface LowRepeatStatement {
    kind: "repeat";
    block: string;
    action: string;
    subAction?: string;
    arguments: LowArgument[];
    tags: LowTag[];
    body: LowStatement[];
}

export interface LowFunctionCallStatement {
    kind: "call_function";
    function: string;
    arguments: LowValue[];
    target?: LowTarget;
}

export interface LowStartProcessStatement {
    kind: "start_process";
    process: string;
    block: string;
    action: string;
    arguments: LowValue[];
    tags: LowTag[];
}

export interface LowSelectObjectStatement {
    kind: "select_object";
    action: string;
    subAction?: string;
    arguments: LowArgument[];
    tags: LowTag[];
}

export type LowEventEntityRole =
    | "default"
    | "victim"
    | "damager"
    | "killer"
    | "shooter"
    | "projectile";

export interface LowActionStatement {
    kind: "action";
    block: string;
    action: string;
    target?: LowTarget;
    arguments: LowArgument[];
    tags: LowTag[];
}

export type LowTarget = "all_players" | "current_player" | "selection";

export interface LowArgument {
    index: number;
    layout: "single" | "plural";
    minimumLength: number;
    values: LowValue[];
}

export type LowValue =
    | LowGameValue
    | LowParameterValue
    | LowTextValue
    | LowNumberValue
    | LowComponentValue
    | LowSoundValue
    | LowLocationValue
    | LowItemValue
    | LowVariableValue;

export type LowVariableValue = LowLineVariableValue | LowStoredVariableValue;

export type LowLineVariableValue = {
    kind: "variable";
    name: string;
    scope: "line";
    valueType: ValueType;
};

export type LowStoredVariableValue = {
    kind: "variable";
    name: string;
    scope: "unsaved" | "saved";
    owner: "plot" | "player";
    valueType: ValueType;
};

export type LowParameterValue = {
    kind: "parameter";
    name: string;
    valueType: ValueType;
};

export type LowGameValue = {
    kind: "game_value";
    name: string;
    valueType: ValueType | "list" | "vector";
    target: string;
};

export type LowTextValue = {
    kind: "text";
    value: string;
};

export type LowNumberValue = {
    kind: "number";
    value: number;
};

export type LowComponentValue = {
    kind: "component";
    value: string;
};

export type LowSoundValue = {
    kind: "sound";
    value: string;
};

export type LowLocationValue = {
    kind: "location";
    x: number;
    y: number;
    z: number;
};

export type LowItemValue =
    | { kind: "item"; id: string; count: number; snbt?: never }
    | { kind: "item"; snbt: string; id?: never; count?: never };

export interface LowTag {
    id: string;
    option: string;
    native: {
        name: string;
        option: string;
        slot: number;
    };
}
import type { ListValueType, ValueType } from "./high.js";
