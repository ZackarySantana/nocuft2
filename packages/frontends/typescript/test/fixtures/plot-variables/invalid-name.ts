import { events, plot } from "@nocuft/diamondfire";

const alive = plot.var.game.number("");

export const boot = events.plot.startup(() => {
    alive.clear();
});
