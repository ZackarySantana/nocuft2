import { events } from "nocuft";
import { broken } from "./helper.js";

export const join = events.player.join((_event) => {
    broken();
});
