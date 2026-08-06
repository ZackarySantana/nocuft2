import { events, players, plot } from "nocuft";

const queued = players.var.game.boolean("queued");
const wins = players.var.saved.number("wins");
const rounds = plot.var.saved.number("rounds");

export const join = events.player.join((event) => {
    queued.set(event.player, true);
    event.player.set(queued, false);
    wins.set(event.player, wins.get(event.player) + 1);
    players.all().where(queued, true).sendMessage("Queued");
    event.player.sendMessage(
        queued.get(event.player),
        event.player.name(),
        event.player.uuid(),
    );
    queued.clear(event.player);
    rounds.set(rounds.get() + 1);
});
