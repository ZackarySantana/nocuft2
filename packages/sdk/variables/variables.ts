import type { PlayerVariable } from "./players";
import type { PlotVariable } from "./plot";
import type { AnyValueInput, Dictionary, List } from "../values/index";

type FactoryVariable<T, Target> = [Target] extends [never]
    ? PlotVariable<T>
    : PlayerVariable<T>;

export interface VariableFactory<Target = never> {
    string(name: string): FactoryVariable<string, Target>;
    number(name: string): FactoryVariable<number, Target>;
    boolean(name: string): FactoryVariable<boolean, Target>;
    list<T extends AnyValueInput = AnyValueInput>(name: string): FactoryVariable<List<T>, Target>;
    dictionary<V extends AnyValueInput = AnyValueInput>(name: string): FactoryVariable<Dictionary<V>, Target>;
    enum<const Values extends readonly string[]>(
        name: string,
        ...values: Values
    ): FactoryVariable<Values[number], Target>;
}
