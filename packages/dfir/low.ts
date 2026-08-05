export interface LowModule {
    kind: "module";
    templates: LowTemplate[];
}

export interface LowTemplate {
    kind: "function";
    name: string;
    body: LowStatement[];
}

export type LowStatement = LowActionStatement;

export interface LowActionStatement {
    kind: "action";
    block: string;
    action: string;
    target?: LowTarget;
    arguments: LowArgument[];
    tags: LowTag[];
}

export type LowTarget = "all_players";

export interface LowArgument {
    index: number;
    layout: "single" | "plural";
    minimumLength: number;
    values: LowValue[];
}

export type LowValue =
    | LowTextValue
    | LowNumberValue
    | LowComponentValue
    | LowSoundValue
    | LowLocationValue
    | LowItemValue;

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

export type LowItemValue = {
    kind: "item";
    id: string;
};

export interface LowTag {
    id: string;
    option: string;
    native: {
        name: string;
        option: string;
        slot: number;
    };
}
