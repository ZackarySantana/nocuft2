import { players, type List } from "nocuft";

export function invalidNonemptySpread(messages: List<string>): void {
    // @ts-ignore The frontend emits a more specific diagnostic for runtime lists.
    players.all().actionBar(...messages);
}
