import { game, players } from "nocuft";

export function configureGame(): void {
    game.mobSpawningWith({ mobSpawning: "disable" });
    players.all().setAllowPvpWith({ pvp: "disable" });
}
