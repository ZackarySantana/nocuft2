import {
    control,
    events,
    game,
    item,
    location,
    players,
    plot,
    process,
} from "@nocuft/diamondfire";

const lobby = location(0, 65, 0);
const phase = plot.var.game.enum("phase", "lobby", "arena", "ended");
const alive = plot.var.game.number("alive");

function broadcast(message: string): void {
    players.all().sendMessage(message);
    players.all().actionBar(message);
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
