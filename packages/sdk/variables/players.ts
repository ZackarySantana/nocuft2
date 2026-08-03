import type { Player } from "../players";
import type { VariableFactory } from "./variables";

export interface PlayerVariables {
    readonly saved: VariableFactory<Player>;
    readonly game: VariableFactory<Player>;
}

export interface PlayerVariable<T, Target> {
    get(player: Target): T;
    set(player: Target, value: T): void;
    clear(player: Target): void;
    clearAll(): void;
}
