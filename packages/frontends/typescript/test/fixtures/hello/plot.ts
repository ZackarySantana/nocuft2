import { players } from "nocuft";

export function hello(): void {
    players.all().sendMessage("Hello!");
}
