import { dictionary } from "nocuft";

export function invalidDictionaryMethod(): void {
    let value = dictionary({ score() { return 1; } });
}
