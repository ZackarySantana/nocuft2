import { dictionary } from "nocuft";

const entries = { score: 1 };

export function invalidDictionarySpread(): void {
    let value = dictionary({ ...entries });
}
