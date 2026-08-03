import { players } from "@nocuft/diamondfire";

export function hello(): void {
    players.all().sendMessage("Hello!");
}
