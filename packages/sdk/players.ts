import type { PlayerActions } from "./generated/player-actions";
import type { UnsupportedPlayerActions } from "./generated/unsupported-actions";
import type { PlayerVariable, PlayerVariables } from "./variables/players";

export interface PlayerSelection extends PlayerActions {
    count(): number;
    one(): Player;
    random(count: number): PlayerSelection;
    set<T>(variable: PlayerVariable<T, Player>, value: T): void;
    where<T>(variable: PlayerVariable<T, Player>, value: T): PlayerSelection;
}

export interface Player extends PlayerSelection {
    name(): string;
    uuid(): string;
}

export interface Players extends PlayerVariables {
    readonly unsupported: UnsupportedPlayerActions;

    all(): PlayerSelection;
}

export declare const players: Players;
