import {
    control,
    events,
    game,
    item,
    location,
    players,
    plot,
    process,
} from "nocuft";

const lobby = location(0, 65, 0);
const phase = plot.var.game.enum("phase", "lobby", "arena", "ended");
const alive = plot.var.game.number("alive");
const queued = players.var.game.boolean("queued");
const bearer = players.var.game.boolean("bearer");

function broadcast(message: string): void {
    players.all().sendMessage(message);
    players.all().actionBar(message);
}

export function chooseBearer(): void {
    const candidates = players.all().where(queued, true);
    if (candidates.count() === 0) {
        broadcast("Nobody is queued.");
        return;
    }
    const player = candidates.one();
    player.set(bearer, true);
    player.giveItems([item("minecraft:mace")]);
    broadcast(`${player.name()} has the mace!`);
    players.all().playSound(["item.trident.thunder"]);
}

export const boot = events.plot.startup(() => {
    phase.set("lobby");
    alive.clear();
    players.all().setAllowPvpWith({ pvp: "disable" });
    game.mobSpawningWith({ mobSpawning: "disable" });
    broadcast("Arena initialized.");
});

export const attack = events.player.playerDmgPlayer((event) => {
    if (event.player.mainHandItem() === item("minecraft:mace")) {
        event.setEventDamage(999);
        players.all().playSound(["item.trident.thunder"]);
    }
    event.victim.sendMessage("Damage:", event.damage, "Cause:", event.damageCause);
});

export const join = events.player.join((event) => {
    queued.set(event.player, true);
    event.player.teleport(lobby);
    event.player.setAllowPvpWith({ pvp: "disable" });
    countdown.start("Prepare for battle.", 1);
    countdown.startWith(
        {
            targetMode: "withNoTargets",
            localVariables: "dontCopy",
        },
        "Fight!",
        2,
    );
});

export const countdown = process.create((message: string, delay: number) => {
    control.waitWith({ timeUnit: "seconds" }, delay);
    broadcast(message);
});
