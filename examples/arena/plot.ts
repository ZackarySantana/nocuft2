// This is psydo code and should not be used as documentation.
import { plot, players, location } from "@nocuft/diamondfire";

const lobby = location(0, 65, 0);
const arena = location(48, 65, 0);

let phase = plot.game.enum("lobby", "arena", "ended");
let alive = plot.game.number("alive");
let bearer = players.game.boolean("bearer");
let spectating = players.game.boolean("spectating");

let queuedAmount = plot.game.number("queuedAmount");
let queued = players.game.boolean("queued");

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
    player.giveItem(items.create("mace or something"));
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
