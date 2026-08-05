import type { GameActions } from "./generated/game-actions";
import type { UnsupportedGameActions } from "./generated/unsupported-game-actions";

export interface Game extends GameActions {
    readonly unsupported: UnsupportedGameActions;
}

export declare const game: Game;
