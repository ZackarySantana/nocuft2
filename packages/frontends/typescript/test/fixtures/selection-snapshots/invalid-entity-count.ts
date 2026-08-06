import { entities, players } from "nocuft";

export function countEntities(): void {
    const count = entities.all().count();
    players.all().sendMessage(count);
}
