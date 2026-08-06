import { list } from "nocuft";

export function invalidFractionalSlice(): void {
    let values = list(1, 2).slice(0, 1.5);
}
