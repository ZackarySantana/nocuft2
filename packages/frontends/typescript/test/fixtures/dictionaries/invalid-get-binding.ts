import { dictionary } from "nocuft";

export function invalidDictionaryGetBinding(): void {
    let rows = dictionary({ score: 1 });
    let [score] = rows.get("score");
}
