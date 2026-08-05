export interface HighModule {
    kind: "module";
    functions: HighFunction[];
}

export interface HighFunction {
    kind: "function";
    name: string;
    body: HighStatement[];
}

export type HighStatement = HighIntrinsicStatement;

export interface HighIntrinsicStatement {
    kind: "intrinsic";
    operation: string;
    receiver: HighReceiver;
    arguments: Record<string, HighArgument>;
    options?: Record<string, string>;
}

export type HighReceiver = {
    kind: "player_selection";
    selection: "all";
};

export type HighArgument = HighExpression | HighExpression[];

export type HighExpression =
    | HighStringLiteral
    | HighNumberLiteral
    | HighBooleanLiteral
    | HighSoundLiteral
    | HighLocationLiteral
    | HighItemLiteral;

export interface HighStringLiteral {
    kind: "string";
    value: string;
}

export interface HighNumberLiteral {
    kind: "number";
    value: number;
}

export interface HighBooleanLiteral {
    kind: "boolean";
    value: boolean;
}

export interface HighSoundLiteral {
    kind: "sound";
    value: string;
}

export interface HighLocationLiteral {
    kind: "location";
    x: number;
    y: number;
    z: number;
}

export interface HighItemLiteral {
    kind: "item";
    id: string;
}
