import { events, players, plot } from "@nocuft/diamondfire";

const phase = plot.var.game.enum("phase", "lobby", "arena", "ended");
const alive = plot.var.game.number("alive");
const title = plot.var.game.string("title");
const enabled = plot.var.game.boolean("enabled");

export const boot = events.plot.startup(() => {
    phase.set("lobby");
    alive.set(2);
    title.set("Arena");
    enabled.set(true);
    alive.clear();
    players.all().sendMessage(phase.get(), alive.get(), title.get(), enabled.get());
});
