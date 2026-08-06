import { list } from "nocuft";

export function invalidNegativeIndex(): void {
    let values = list(1, 2);
    let value = values[-1];
}
