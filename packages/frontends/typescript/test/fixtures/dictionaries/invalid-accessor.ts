import { dictionary } from "nocuft";

export function invalidDictionaryAccessor(): void {
    let value = dictionary({ get score() { return 1; } });
}
