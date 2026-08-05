declare const valueBrand: unique symbol;

import type { SoundInput } from "../generated/sounds";

export interface Location {
    readonly [valueBrand]: "Location";
}

export declare function location(x: number, y: number, z: number): Location;

export type ComponentInput = string | number | boolean;

export interface Sound {
    readonly [valueBrand]: "Sound";
}

export declare function sound(id: SoundInput): Sound;

export type AnyValueInput = ComponentInput | Location | Item | Sound;

export type { SoundId, SoundInput } from "../generated/sounds";

export interface Item {
    readonly [valueBrand]: "Item";
}

export declare function item(id: string): Item;
