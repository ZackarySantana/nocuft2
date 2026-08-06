import { players } from "nocuft";
import { items } from "./captured-items.js";

export function giveCapturedItem(): void {
    players.all().giveItems([
        items["sword-of-doom"],
        items["sword-of-doom"].withName("Renamed"),
    ]);
}
