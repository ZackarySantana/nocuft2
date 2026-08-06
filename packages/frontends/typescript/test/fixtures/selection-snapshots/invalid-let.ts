import { players } from "nocuft";

export function choose(): void {
    let selected = players.all().one();
    selected.sendMessage("mutable");
}
