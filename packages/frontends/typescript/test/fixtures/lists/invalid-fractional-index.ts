import { list } from "nocuft";

export function invalidFractionalIndex(): void {
    let values = list(1, 2);
    let value = values[0.5];
}
