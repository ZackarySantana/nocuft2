import { dictionary } from "nocuft";

const key = "score";

export function invalidComputedDictionaryProperty(): void {
    let value = dictionary({ [key]: 1 });
}
