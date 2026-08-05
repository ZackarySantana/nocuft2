// This is psydo code and should not be used as documentation.
import { plot, players, location, item } from "@nocuft/diamondfire";

const lobby = location(0, 65, 0);
const arena = location(48, 65, 0);

let phase = plot.var.game.enum("lobby", "arena", "ended");
let alive = plot.var.game.number("alive");
let bearer = players.var.game.boolean("bearer");
let spectating = players.var.game.boolean("spectating");

let queuedAmount = plot.var.game.number("queuedAmount");
let queued = players.var.game.boolean("queued");

function broadcast(message: string): void {
    players.all().sendMessage(message);
    players.all().actionBar(message);
}

function clearBearer(): void {
    players
        .all()
        .where(bearer, true)
        .sendMessage("You are no longer the bearer.");
}

function annointBearer(): void {}

function startGame(): void {
    if (queuedAmount.get() < 2) {
        broadcast("Need at least 2 players.");
        return;
    }

    phase.set("arena"); // or phase = "arena"; because of typescript's type system.
    alive.set(queuedAmount.get() - 1); // Can we even do this? queued will be a type. We need to lower this to a temp variable assignment at the dfir-high level? Maybe a new method.
    players.all().where(queued, true).teleport(arena);

    let player = players.all().where(queued, true).one();
    player.set(bearer, true);
    player.giveItems([item("mace or something")]);
    broadcast(`${player.name()} has the mace!`);
    players.all().playSound(["item.trident.thunder"]);

    queued.clearAll(); // Shorthand for clearing all players, like queued.get(players.all()).clear()
    queuedAmount.clear();
}

function gameStartCountdown(): void {
    // Should we do this or async function calls? They could be both exposed but I really want ONE way to do everything.
    process.start(() => {
        for (let remaining = 200; remaining > 0; remaining--) {
            broadcast(`${remaining} seconds remaining!`);
            process.sleepTicks(20);
            // or a custom time library that returns objects with a sleep unit like golang:
            // process.sleep(time.seconds(1));
        }
    });
}

function endGame(): string {
    // phase = "ended";
    phase.set("ended");
    players.all().set(queued, false);
    players.all().teleport(lobby);

    let player = players.all().where(bearer, true).one();

    if (alive.get() > 0) {
        scheduler.after(seconds(6), () => {
            phase.set("lobby");
        });

        return `${player.name()} lost.`;
    }

    return "No winners. Round over.";
}

export function boot(event: PlotStartupEvent) {
    // phase = "lobby";
    phase.set("lobby");
    // alive = 0;
    alive.clear();
    game.setPvp(false);
    game.setMobSpawning(false);
}

export function leave(event: PlayerLeaveEvent) {
    if (phase.get() !== "arena") return;

    const wasBearer = bearer.get(event.player);
    if (wasBearer) {
        broadcast(endGame());
        return;
    }

    if (!spectating.get(event.player)) {
        alive.set(alive.get() - 1);
        spectating.set(event.player, true);
    }
}

export function smash(event: PlayerAttackPlayer) {
    if (phase.get() !== "arena") {
        // !== and != are the same
        event.cancel();
        return;
    }

    const attacker = event.player;
    const victim = event.target;

    if (bearer.get(attacker) && attacker.isHolding("mace or whatever")) {
        event.setDamage(999);
        players.all().playSound(["item.trident.thunder"]);
    }
}

// should we do events and processes like this:
export const join = events.player.join((event) => {
    // This should lower to %default for 99% of events.
    event.player.teleport(lobby);

    // Counts down every 2 seconds, e.g. 10, 8, 6, 4, 2, 0.
    countdown.run(10, 2);
    // or override the targets and locals tags
    countdown.runWith(10, 2, {
        targets: "forEachPlayer",
        locals: "copy",
    });
});

export const countdown = process.create(
    (seconds: number, step: number) => {
        for (let secs = seconds; secs >= 0; secs -= step) {
            broadcast(`${secs} seconds remaining!`);
            scheduler.wait(step * time.second);
        }
    },
    {
        // Optional, provide default locals and targets option that can be overridden at runtime.
        locals: "dontCopy", // Or "copy" or "share"
        targets: "current", // or "none" or "forEachInSelection" or "forEachPlayer"
    },
);
