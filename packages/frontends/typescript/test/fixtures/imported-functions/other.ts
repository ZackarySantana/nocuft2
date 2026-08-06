import { players } from "nocuft";

export function welcome(): void {
    players.all().sendMessage("Other welcome");
}
