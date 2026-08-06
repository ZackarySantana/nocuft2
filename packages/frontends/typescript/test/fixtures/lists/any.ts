import { list, type AnyValueInput, type List } from "nocuft";

function consume(values: List<AnyValueInput>): void {
}

function consumeNested(values: List<List<AnyValueInput>>): void {
}

export function acceptsAnyList(values: List<number>, nested: List<List<number>>, index: number): void {
    consume(values);
    consumeNested(nested);
    let dynamic = values[index];
}
