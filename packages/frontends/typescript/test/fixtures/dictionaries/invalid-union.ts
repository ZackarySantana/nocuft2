import { dictionary } from "nocuft";

export function invalidDictionaryUnion(): void {
    // @ts-expect-error Exercises analyzer validation beyond the SDK type.
    let value = dictionary({ score: 1, name: "one" });
}
