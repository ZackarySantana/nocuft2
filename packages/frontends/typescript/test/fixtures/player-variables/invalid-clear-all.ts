import { events, players } from "nocuft";

const queued = players.var.game.boolean("queued");

export const boot = events.plot.startup(() => {
    queued.clearAll();
});
