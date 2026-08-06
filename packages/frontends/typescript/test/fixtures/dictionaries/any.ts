import { dictionary, list, type AnyValueInput, type Dictionary } from "nocuft";

function consume(value: Dictionary<AnyValueInput>): void {
}

export function dictionaryAny(): void {
    let mixed = dictionary<AnyValueInput>({ score: 1, name: "one", values: list<number>(2) });
    consume(mixed);
}
