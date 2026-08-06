import { entities, location, players } from "nocuft";

const origin = location(0, 64, 0);

export function selections(): void {
    players.random(2).sendMessage("Chosen");
    players.named("Alice").sendMessage("Named");
    entities.lastEntity().setGlowing();
    entities.byUuid("uuid-1", "uuid-2").remove();
    entities.named("Display Name").remove();
    entities.namedWith({ ignoreFormatting: false }, "Styled Name").remove();
    entities.all().random(5).nearest(origin, 2).remove();
    entities.all().farthestWith({ ignoreYAxis: true }, origin).remove();
}
