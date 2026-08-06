import { list, type List } from "nocuft";

function consume(matrix: List<List<number>>, ...rows: List<number>[]): void {
    for (const row of rows) {
    }
}

function consumeArrays(...rows: number[][]): void {
    for (const row of rows) {
    }
}

export function callRest(): void {
    consume(
        list<List<number>>(list<number>(1)),
        list<number>(2),
        list<number>(3),
    );
    consumeArrays([4], [5]);
}
