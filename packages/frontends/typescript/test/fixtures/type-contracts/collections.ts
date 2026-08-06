import { dictionary, list, type AnyValueInput, type List } from "nocuft";

const entries = { score: 1 };

export function supportedCollections(): void {
    let empty = list<number>();
    let numbers = list(1, 2);
    let nested = list<List<number>>(list<number>(3));
    let emptyRows = dictionary<List<number>>();
    let rows = dictionary({ first: list<number>(1), second: list<number>(2) });
    let scores = dictionary({ score: 1, level: 2 });
    let mixed = dictionary<AnyValueInput>({ score: 1, name: "one" });
}

export function unsupportedCollections(): void {
    // @ts-expect-error Empty lists require an explicit element type.
    let untypedList = list();
    // @ts-expect-error Empty dictionaries require explicit key and value types.
    let untypedDictionary = dictionary();
    // @ts-expect-error Dictionaries are built from inline object literals.
    let variableEntries = dictionary(entries);
    // @ts-expect-error Dictionary values share one type unless it is declared.
    let unionValues = dictionary({ score: 1, name: "one" });
}
