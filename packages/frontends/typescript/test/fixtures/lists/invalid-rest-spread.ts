import { list, type List } from "nocuft";

function consume(...values: number[]): void {
}

export function invalidRestSpread(values: List<number>): void {
    consume(...values);
    consume(...list<number>(1, 2));
}
