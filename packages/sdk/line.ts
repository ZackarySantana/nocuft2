import type { AnyValueInput, Dictionary, Item, List, Location } from "./values/index";

export interface LineLocationVariable extends Location {
    shift(x: number, y: number, z: number): void;
    shiftDirection(forwards?: number, upwards?: number, sideways?: number): void;
    shiftAxis(axis: "x" | "y" | "z", distance: number): void;
    shiftToward(target: Location, distance?: number): void;
    setCoordinate(coordinate: "x" | "y" | "z" | "pitch" | "yaw", value: number): void;
    face(target: Location, direction?: "toward" | "away"): void;
}

export type LineNumberVariable = number & {
    readonly valueType: "number";
};

export type LineStringVariable = string & {
    readonly valueType: "string";
};

export type LineBooleanVariable = boolean & {
    readonly valueType: "boolean";
};

export interface LineVariables {
    location(value: Location): LineLocationVariable;
    number(value: number): LineNumberVariable;
    string(value: string): LineStringVariable;
    boolean(value: boolean): LineBooleanVariable;
    item(value: Item): Item;
    list<T extends AnyValueInput>(value: List<T>): List<T>;
    dictionary<V extends AnyValueInput>(value: Dictionary<V>): Dictionary<V>;
}

export declare const line: LineVariables;
