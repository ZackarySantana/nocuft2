import { dictionary, list, type List } from "nocuft";

export function invalidDictionaryValue(): void {
    let value = dictionary<List<number>>({ score: list<string>("bad") });
}
