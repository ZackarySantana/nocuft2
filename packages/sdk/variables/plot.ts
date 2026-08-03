import type { VariableFactory } from "./variables";

export interface PlotVariables {
    readonly saved: VariableFactory;
    readonly game: VariableFactory;
}

export interface PlotVariable<T> {
    get(): T;
    set(value: T): void;
    clear(): void;
}
