import type { EntityActions } from "./generated/entity-actions";
import type { UnsupportedEntityActions } from "./generated/unsupported-entity-actions";
import type { ComponentInput, Location } from "./values/index";

export interface SelectionDistanceOptions {
    readonly ignoreYAxis?: boolean;
}

export interface EntitySelection extends EntityActions {
    count(): number;
    one(): Entity;
    random(count?: number): EntitySelection;
    nearest(location: Location, count?: number): EntitySelection;
    nearestWith(options: SelectionDistanceOptions, location: Location, count?: number): EntitySelection;
    farthest(location: Location, count?: number): EntitySelection;
    farthestWith(options: SelectionDistanceOptions, location: Location, count?: number): EntitySelection;
}

export interface Entity extends EntitySelection {
    uuid(): string;
}

export interface Entities {
    readonly unsupported: UnsupportedEntityActions;
    all(): EntitySelection;
    lastEntity(): Entity;
    byUuid(uuid: string, ...additionalUuids: string[]): EntitySelection;
    named(name: ComponentInput, ...additionalNames: ComponentInput[]): EntitySelection;
    namedWith(options: { readonly ignoreFormatting?: boolean }, name: ComponentInput, ...additionalNames: ComponentInput[]): EntitySelection;
}

export declare const entities: Entities;
