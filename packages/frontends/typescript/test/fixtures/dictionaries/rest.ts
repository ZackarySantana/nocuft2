import { type Dictionary, type List } from "nocuft";

export function dictionaryRest(
    nested: Dictionary<Dictionary<List<number>>>,
    ...others: Dictionary<List<number>>[]
): void {
    for (const [outerKey, inner] of nested) {
        for (const [innerKey, values] of inner) {
            for (const value of values) {
            }
        }
    }
    for (const [key, values] of others[0]) {
    }
}
