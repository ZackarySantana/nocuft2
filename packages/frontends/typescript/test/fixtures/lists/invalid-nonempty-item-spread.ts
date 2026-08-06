import { item, line, type List } from "nocuft";

export function invalidNonemptyItemSpread(names: List<string>): void {
    let named = line.item(item("stone"));
    // @ts-ignore The frontend emits a more specific diagnostic for runtime lists.
    named = named.withName(...names);
}
