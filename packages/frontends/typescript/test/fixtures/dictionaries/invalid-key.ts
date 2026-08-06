import { type Dictionary } from "nocuft";

export function invalidDictionaryKey(value: Dictionary<number>): void {
    let score = value.get(1);
}
