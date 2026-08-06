import { dictionary } from "nocuft";

export function discardedDictionaryTransform(): void {
    let value = dictionary({ score: 1 });
    value.with("score", 2);
}
