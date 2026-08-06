import { dictionary } from "nocuft";

const entries = { score: 1 };

export function invalidDictionaryArgument(): void {
    let value = dictionary(entries);
}
