import type { PlayerTarget } from "../players";
import type { VariableFactory } from "./variables";

export interface PlayerVariables {
    readonly saved: VariableFactory<PlayerTarget>;
    readonly game: VariableFactory<PlayerTarget>;
}

export interface PlayerVariable<T> {
    get(player: PlayerTarget): T;
    set(player: PlayerTarget, value: T): void;
    clear(player: PlayerTarget): void;
    clearAll(): void;
}
