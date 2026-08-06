import type { PlayerActions } from "./generated/player-actions";
import type { UnsupportedPlayerActions } from "./generated/unsupported-actions";
import type { PlayerVariable, PlayerVariables } from "./variables/players";
import type { Location } from "./values/index";
import type { SelectionDistanceOptions } from "./entities";
import type { PlayerValues } from "./generated/player-values";

export interface PlayerSelection extends PlayerActions {
    count(): number;
    one(): Player;
    random(count?: number): PlayerSelection;
    nearest(location: Location, count?: number): PlayerSelection;
    nearestWith(options: SelectionDistanceOptions, location: Location, count?: number): PlayerSelection;
    farthest(location: Location, count?: number): PlayerSelection;
    farthestWith(options: SelectionDistanceOptions, location: Location, count?: number): PlayerSelection;
    set<T>(variable: PlayerVariable<T>, value: T): void;
    where<T>(variable: PlayerVariable<T>, value: T): PlayerSelection;
}

export interface Player extends PlayerSelection, PlayerValues {}

/** A player or player selection passed into a reusable package function. */
export type PlayerTarget = PlayerSelection;

export interface Players {
    readonly unsupported: UnsupportedPlayerActions;
    readonly var: PlayerVariables;

    all(): PlayerSelection;
    random(count?: number): PlayerSelection;
    named(nameOrUuid: string, ...additionalNamesOrUuids: string[]): PlayerSelection;
}

export declare const players: Players;
