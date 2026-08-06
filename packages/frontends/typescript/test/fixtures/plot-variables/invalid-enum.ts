import { events, plot } from "nocuft";

const phase = plot.var.game.enum("phase", "lobby", "arena", "ended");

export const boot = events.plot.startup(() => {
    // @ts-expect-error Exercises analyzer validation beyond the SDK type.
    phase.set("unknown");
});
