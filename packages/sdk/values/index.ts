declare const valueBrand: unique symbol;

export interface Location {
    readonly [valueBrand]: "Location";
}

export declare function location(x: number, y: number, z: number): Location;

export type ComponentInput = string | number | boolean;

export type { SoundId, SoundInput } from "../generated/sounds";
