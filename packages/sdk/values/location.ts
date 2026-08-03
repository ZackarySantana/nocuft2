declare const locationBrand: unique symbol;

export interface Location {
    readonly [locationBrand]: "Location";
}

export declare function location(x: number, y: number, z: number): Location;
