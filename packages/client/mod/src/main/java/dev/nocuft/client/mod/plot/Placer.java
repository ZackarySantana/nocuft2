package dev.nocuft.client.mod.plot;

import dev.nocuft.client.plot.Codespace;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.BooleanSupplier;
import net.minecraft.client.Minecraft;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.network.protocol.game.ServerboundPlayerAbilitiesPacket;
import net.minecraft.network.protocol.game.ServerboundSetCreativeModeSlotPacket;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Abilities;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.phys.BlockHitResult;
import net.minecraft.world.phys.Vec3;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Puts code lines onto a plot.
 *
 * <p>Placing is the small part. DiamondFire expands a template when the item
 * is placed, so this walks to a free spot, puts the item in hand, and right
 * clicks. What it does not do is build anything itself.
 *
 * <p>Every step is refused outside dev mode, rechecked before each line rather
 * than once at the start. DiamondFire's rules permit automation and the
 * movement it needs on a plot in build or dev mode and nowhere else, and a
 * player who leaves halfway through is no longer somewhere this may act.
 */
public final class Placer {
    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    /**
     * Close enough not to move at all.
     *
     * <p>Far enough that a run does not move: every line a build puts on a
     * plot sits within this of the first, so the player arrives once and
     * places the lot from there. That is what {@link Reach} buys, and it is
     * worth more than the time it saves. A placement that never moves has no
     * teleport to wait on, and waiting on one is the slowest thing a run does.
     */
    private static final double NO_MOVE_WITHIN = Reach.WORKING;

    /**
     * Ticks between asking to be teleported and asking again.
     *
     * <p>A command that went unheard looks exactly like one still being acted
     * on, so the asking is repeated on a pace slow enough that the answer to
     * the first has had every chance to arrive first.
     */
    private static final int RESEND_TICKS = 20;

    /** Ticks before giving up, so a move that never arrives still ends. */
    private static final int MAX_MOVE_TICKS = 100;

    /** Ticks between putting the item in hand and using it. */
    private static final int HOLD_TICKS = 4;

    /** Ticks between one click and the next, so DiamondFire is not flooded. */
    private static final int PACE_TICKS = 2;

    /** Ticks to wait for every line to appear before saying which did not. */
    private static final int CONFIRM_TIMEOUT_TICKS = 80;

    /** One line to place, and where it goes. */
    public record Placement(String unitId, String payload, String name, Codespace.LinePosition at) {}

    /** What became of a run. */
    public record Result(List<String> placed, Optional<String> failure) {
        public boolean ok() {
            return failure.isEmpty();
        }
    }

    /** Told as each line lands, so a caller can report progress. */
    public interface Progress {
        void placed(int done, int total, String unitId);
    }

    private Placer() {
    }

    /**
     * Places each line in turn, stopping at the first that will not go.
     *
     * <p>Stopping rather than continuing is deliberate: a run that carries on
     * past a failure leaves a plot holding some of a build and no record of
     * which part, which is the state this whole client exists to avoid.
     *
     * @param inDev rechecked before every line, not trusted from the start
     */
    public static Result place(
        Minecraft client,
        List<Placement> placements,
        BooleanSupplier inDev,
        Progress progress
    ) throws InterruptedException {
        // What the player was holding, so it can be given back. The client
        // this is adapted from captures it and never restores it, quietly
        // destroying whatever was in hand.
        ItemStack wasHolding = onClientThread(client, () -> client.player == null
            ? ItemStack.EMPTY
            : client.player.getInventory().getItem(0).copy());
        Integer wasSelected = onClientThread(client, () -> client.player == null
            ? 0
            : client.player.getInventory().getSelectedSlot());
        Flight flight = hold(client);
        Reach.Held reach = Reach.extend(client);
        try {
            return run(client, placements, inDev, progress);
        } finally {
            restore(client, wasHolding, wasSelected);
            Reach.retract(client, reach);
            release(client, flight);
        }
    }

    /** Whether the player was flying, and whether they may. */
    public record Flight(boolean allowed, boolean flying) {}

    /**
     * Keeps the player in the air for the length of a run.
     *
     * <p>Lines are stacked five blocks apart, so a run climbs, and a player
     * standing at a line falls out from under it the moment nothing holds them
     * there. Zeroing the velocity on each move is not enough: the ticks spent
     * waiting for the server to agree where the player is are ticks spent
     * falling, and two blocks of fall puts the next line out of reach and
     * starts the jump over.
     *
     * <p>Only flying is asked for. Whether it is permitted is the server's to
     * say, and it says so by ignoring this, which leaves a run behaving as it
     * did before rather than failing.
     */
    public static Flight hold(Minecraft client) throws InterruptedException {
        return onClientThread(client, () -> {
            if (client.player == null || client.player.connection == null) {
                return new Flight(false, false);
            }
            Abilities abilities = client.player.getAbilities();
            Flight was = new Flight(abilities.mayfly, abilities.flying);
            if (!abilities.mayfly || abilities.flying) {
                return was;
            }
            abilities.flying = true;
            client.player.connection.send(new ServerboundPlayerAbilitiesPacket(abilities));
            return was;
        });
    }

    /** Puts the player back down, but only if this is what took them up. */
    public static void release(Minecraft client, Flight was) {
        client.execute(() -> {
            if (client.player == null || client.player.connection == null) {
                return;
            }
            Abilities abilities = client.player.getAbilities();
            if (abilities.flying == was.flying()) {
                return;
            }
            abilities.flying = was.flying();
            client.player.connection.send(new ServerboundPlayerAbilitiesPacket(abilities));
        });
    }

    /** Gives back the slot the templates were passed through. */
    private static void restore(Minecraft client, ItemStack was, int selected) {
        client.execute(() -> {
            if (client.player == null || client.player.connection == null) {
                return;
            }
            client.player.getInventory().setItem(0, was);
            client.player.connection.send(new ServerboundSetCreativeModeSlotPacket(36, was));
            client.player.getInventory().setSelectedSlot(selected);
        });
    }

    private static Result run(
        Minecraft client,
        List<Placement> placements,
        BooleanSupplier inDev,
        Progress progress
    ) throws InterruptedException {
        List<Placement> clicked = new ArrayList<>();
        for (Placement placement : placements) {
            if (!inDev.getAsBoolean()) {
                return new Result(named(clicked), Optional.of(
                    "The player left dev mode, so nothing further was placed."
                ));
            }
            Optional<String> failure = placeOne(client, placement);
            if (failure.isPresent()) {
                return new Result(named(clicked), failure);
            }
            clicked.add(placement);
            progress.placed(clicked.size(), placements.size(), placement.unitId());
            Thread.sleep(PACE_TICKS * 50L);
        }

        // Every line is checked once at the end rather than each being waited
        // on in turn. Waiting per line spends the round trip again for every
        // one of them, and what actually matters is whether the codespace
        // ended up holding the build, which is a question about all of them.
        return confirm(client, clicked);
    }

    /**
     * Checks that every line asked for is now on the plot.
     *
     * <p>DiamondFire writes a sign when it expands a template, so a line that
     * never appears is one it refused. Naming those is the whole point: a run
     * that reports placing what it did not is worse than one that fails.
     */
    private static Result confirm(Minecraft client, List<Placement> clicked)
        throws InterruptedException {
        List<Placement> missing = new ArrayList<>(clicked);
        for (int tick = 0; tick < CONFIRM_TIMEOUT_TICKS && !missing.isEmpty(); tick += 1) {
            List<Placement> stillMissing = new ArrayList<>();
            for (Placement placement : missing) {
                BlockPos at = new BlockPos(
                    placement.at().x(), placement.at().y(), placement.at().z()
                );
                Boolean there = onClientThread(client, () ->
                    client.level != null && PlotReader.lineExistsAt(client.level, at)
                );
                if (!Boolean.TRUE.equals(there)) {
                    stillMissing.add(placement);
                }
            }
            missing = stillMissing;
            if (!missing.isEmpty()) {
                Thread.sleep(50);
            }
        }

        List<Placement> landed = new ArrayList<>(clicked);
        landed.removeAll(missing);
        if (missing.isEmpty()) {
            return new Result(named(landed), Optional.empty());
        }
        List<String> names = new ArrayList<>();
        for (Placement placement : missing) {
            names.add(placement.name() + " at " + placement.at().x() + ", " + placement.at().z());
            LOGGER.warn("No line at {} for {}", placement.at(), placement.name());
        }
        return new Result(named(landed), Optional.of(
            "DiamondFire did not expand " + names.size()
            + (names.size() == 1 ? " template: " : " templates: ") + String.join("; ", names)
        ));
    }

    private static List<String> named(List<Placement> placements) {
        List<String> names = new ArrayList<>();
        for (Placement placement : placements) {
            names.add(placement.unitId());
        }
        return names;
    }

    private static Optional<String> placeOne(Minecraft client, Placement placement)
        throws InterruptedException {
        BlockPos target = new BlockPos(
            placement.at().x(), placement.at().y(), placement.at().z()
        );

        // A position that already holds something is not a free line, and
        // placing into it is how a run reports having placed a line that was
        // already there. Whose it is cannot be told yet, so it is refused.
        Boolean occupied = onClientThread(client, () ->
            client.level != null && !client.level.getBlockState(target).isAir()
        );
        if (Boolean.TRUE.equals(occupied)) {
            return Optional.of(
                "There is already something at " + target.getX() + ", " + target.getY()
                + ", " + target.getZ() + ", so " + placement.name() + " was not placed."
            );
        }

        Optional<String> moved = moveWithinReach(client, target);
        if (moved.isPresent()) {
            return moved;
        }

        ItemStack item = TemplateItem.of(placement.payload(), placement.name());
        Optional<String> failure = onClientThread(client, () -> {
            if (client.player == null || client.level == null) {
                return Optional.of("The player left the world.");
            }
            // Put in hand and used in the same tick, so both packets go out
            // together and arrive in that order. Waiting between them was
            // guarding against a race the connection does not have.
            client.player.getInventory().setSelectedSlot(0);
            client.player.getInventory().setItem(0, item);
            client.player.connection.send(
                new ServerboundSetCreativeModeSlotPacket(36, item)
            );
            // Clicked against the target itself with its top face, which is
            // how a template is placed: the position is empty, so the block
            // lands there rather than above it.
            BlockHitResult hit = new BlockHitResult(
                Vec3.atCenterOf(target),
                Direction.UP,
                target,
                false
            );
            LOGGER.info(
                "Placing {} at {} from {} ({} away)",
                placement.name(),
                target,
                client.player.position(),
                String.format("%.1f", client.player.position().distanceTo(Vec3.atCenterOf(target)))
            );
            InteractionResult result = client.gameMode == null
                ? InteractionResult.FAIL
                : client.gameMode.useItemOn(client.player, InteractionHand.MAIN_HAND, hit);
            if (result.consumesAction()) {
                return Optional.empty();
            }
            // What the world looked like when it was refused, because the
            // reason is almost always the ground around the target rather
            // than the click.
            LOGGER.warn(
                "Refused at {} ({}): below={} at={} above={} player={} reach={}",
                target,
                placement.name(),
                client.level.getBlockState(target.below()),
                client.level.getBlockState(target),
                client.level.getBlockState(target.above()),
                client.player.position(),
                client.player.position().distanceTo(Vec3.atCenterOf(target))
            );
            return Optional.of(
                "DiamondFire refused the placement of " + placement.name()
                + " at " + target.getX() + ", " + target.getY() + ", " + target.getZ()
                + ". See the log for what was there."
            );
        });
        if (failure.isPresent()) {
            return failure;
        }

        return Optional.empty();
    }

    /** Gets close enough to a position for anything that has to touch it. */
    public static Optional<String> approach(Minecraft client, BlockPos target)
        throws InterruptedException {
        return moveWithinReach(client, target);
    }

    /**
     * Whether the world here is really there, rather than only reading as
     * empty because it has not arrived.
     *
     * <p>Reaching further than the game sends chunks is the one thing the
     * extended range makes possible that is worse than moving: an unloaded
     * chunk answers every question about itself with air, so a position in one
     * looks free, looks placed into, and looks like a line that never
     * appeared.
     */
    private static boolean loaded(Minecraft client, BlockPos at) {
        return client.level != null && client.level.getChunkSource()
            .getChunkNow(at.getX() >> 4, at.getZ() >> 4) != null;
    }

    /**
     * Gets close enough for the server to accept an interaction.
     *
     * <p>The server does the moving: "/p tp" is DiamondFire's own teleport,
     * asked for over chat like any player would. This client used to move
     * itself and pay the anti-cheat for the distance in movement packets, and
     * that was wrong at the root: the server counts at most five movement
     * packets a tick before treating the burst as one, so any move past a few
     * blocks was refused, undone, and retried in a visible fight. A teleport
     * the server performed itself is a position it has already agreed to, so
     * there is nothing to settle and nothing to be put back from.
     */
    private static Optional<String> moveWithinReach(Minecraft client, BlockPos target)
        throws InterruptedException {
        // One block down the line, which is inside the plot and close enough
        // that the next line along needs no move at all. Whole numbers,
        // because every teleport command reads those and not every one reads
        // fractions.
        BlockPos standing = new BlockPos(target.getX(), target.getY(), target.getZ() + 1);
        Vec3 centre = Vec3.atCenterOf(target);

        for (int tick = 0; tick < MAX_MOVE_TICKS; tick += 1) {
            boolean ask = tick % RESEND_TICKS == 0;
            Boolean there = onClientThread(client, () -> {
                if (client.player == null || client.player.connection == null) {
                    return null;
                }
                if (client.player.getEyePosition().closerThan(centre, NO_MOVE_WITHIN)
                    && loaded(client, target)) {
                    return true;
                }
                if (ask) {
                    client.player.connection.sendCommand(
                        "p tp " + standing.getX() + " " + standing.getY() + " " + standing.getZ()
                    );
                }
                return false;
            });
            if (there == null) {
                return Optional.of("The player left the world.");
            }
            // In range on the server's own word: the position came from its
            // teleport, and the confirmation went back before this client
            // could even read it. This is also most lines without any move at
            // all: they are three blocks apart and the one before was within
            // arm's reach.
            if (there) {
                return Optional.empty();
            }
            Thread.sleep(50);
        }
        return Optional.of(
            "Could not get within reach of " + target.getX() + ", " + target.getZ() + "."
        );
    }

    /** Slots in the main inventory, hotbar included. */
    private static final int INVENTORY_SLOTS = 36;

    /** Slots in the hotbar, which the server numbers apart from the rest. */
    private static final int HOTBAR_SLOTS = 9;

    /** Container index of the first hotbar slot. */
    private static final int HOTBAR_CONTAINER_OFFSET = 36;

    /**
     * Empties the player's inventory before removed line items can overflow
     * onto the plot.
     */
    public static void clearInventory(Minecraft client) throws InterruptedException {
        onClientThread(client, () -> {
            if (client.player == null || client.player.connection == null) {
                return false;
            }
            for (int slot = 0; slot < INVENTORY_SLOTS; slot += 1) {
                client.player.getInventory().setItem(slot, ItemStack.EMPTY);
                int container = slot < HOTBAR_SLOTS ? HOTBAR_CONTAINER_OFFSET + slot : slot;
                client.player.connection.send(
                    new ServerboundSetCreativeModeSlotPacket(container, ItemStack.EMPTY)
                );
            }
            return true;
        });
    }

    /** Runs on the client thread and waits, because the world is only safe there. */
    public static <T> T onGameThread(
        Minecraft client,
        java.util.function.Supplier<T> work
    ) throws InterruptedException {
        return onClientThread(client, work);
    }

    private static <T> T onClientThread(
        Minecraft client,
        java.util.function.Supplier<T> work
    ) throws InterruptedException {
        java.util.concurrent.CompletableFuture<T> done = new java.util.concurrent.CompletableFuture<>();
        client.execute(() -> {
            try {
                done.complete(work.get());
            } catch (RuntimeException error) {
                done.completeExceptionally(error);
            }
        });
        try {
            return done.get();
        } catch (java.util.concurrent.ExecutionException error) {
            LOGGER.error("A placement step failed", error.getCause());
            throw new IllegalStateException(error.getCause());
        }
    }

}
