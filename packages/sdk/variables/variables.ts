import type { PlayerVariable } from "./players";
import type { PlotVariable } from "./plot";

type FactoryVariable<T, Target> = [Target] extends [never]
    ? PlotVariable<T>
    : PlayerVariable<T, Target>;

export interface VariableFactory<Target = never> {
    string(name: string): FactoryVariable<string, Target>;
    number(name: string): FactoryVariable<number, Target>;
    boolean(name: string): FactoryVariable<boolean, Target>;
    enum<const Values extends readonly string[]>(
        name: string,
        ...values: Values
    ): FactoryVariable<Values[number], Target>;
}
