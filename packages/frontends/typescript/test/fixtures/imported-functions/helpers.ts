import { events, players } from "nocuft";
import { visits } from "./state.js";

function announce(message: string): void {
    players.all().sendMessage(message);
}

export function welcome(message: string): void {
    visits.set(1);
    announce(message);
}

export function repeat(value: number): void {
    if (value > 0) {
        repeat(value - 1);
    }
}

export function unused(): void {
    players.all().sendMessage("Unused");
}

export const ignored = events.plot.startup(() => {
    players.all().sendMessage("Not an entry event");
});
