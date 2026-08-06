import { list } from "nocuft";

export function invalidNegativeSlice(): void {
    let values = list(1, 2).slice(-1);
}
