import { events } from "nocuft";
import { repeat, welcome as greet } from "./helpers.js";
import { otherWelcome } from "./barrel.js";

export const join = events.player.join((_event) => {
    greet("Hello from another file");
    otherWelcome();
    repeat(0);
});
