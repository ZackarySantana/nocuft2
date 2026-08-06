import { events, players, process } from "nocuft";

const queued = players.var.game.boolean("queued");
const bearer = players.var.game.boolean("bearer");

function broadcast(message: string): void {
    players.all().sendMessage(message);
}

export function choose(): void {
    const selected = players.all().where(queued, true);
    const alias = selected;
    const chosen = alias.one();
    const second = selected.random(1);
    chosen.set(bearer, true);
    bearer.set(chosen, true);
    bearer.clear(chosen);
    chosen.sendMessage("A");
    second.sendMessage("B");
    chosen.sendMessage(bearer.get(chosen));
    broadcast(`${chosen.name()} ${chosen.uuid()}`);
}

export function emptyOneStillContinues(): void {
    const empty = players.all().where(queued, false).one();
    empty.sendMessage("no-op when empty");
    players.all().sendMessage("still runs");
}

export function countSelections(): void {
    const selected = players.all().where(queued, true);
    const alias = selected;
    if (alias.count() > 0) {
        players.all().sendMessage(
            `${alias.count()} / ${players.random(2).count()} / ${selected.where(queued, false).count()}`,
        );
    }
}

export function scoped(enabled: boolean): void {
    const outside = players.all();
    if (enabled) {
        const branch = outside.one();
        branch.sendMessage("then");
    } else {
        const branch = players.random(1);
        branch.sendMessage("else");
    }
    while (enabled) {
        const iteration = outside.random(1);
        iteration.sendMessage("loop");
        break;
    }
    outside.sendMessage("outside");
}

export const join = events.player.join((_event) => {
    const selected = players.all().one();
    selected.sendMessage("event");
});

export const worker = process.create(() => {
    const selected = players.all().one();
    selected.sendMessage("process");
});
