package dev.nocuft.client.mod.plot;

import dev.nocuft.client.plot.Codespace;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.BooleanSupplier;
import net.minecraft.client.Minecraft;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.network.protocol.game.ServerboundPlayerInputPacket;
import net.minecraft.network.protocol.game.ServerboundSetCreativeModeSlotPacket;
import net.minecraft.world.entity.player.Input;
import net.minecraft.world.item.ItemStack;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Takes code lines off a plot.
 *
 * <p>Breaking a line's first block while sneaking is how DiamondFire removes
 * the whole line, which is the same gesture a player makes by hand. Nothing
 * here drives a menu: the alternative is running the plot's clear command and
 * clicking through the dialog it opens, which breaks whenever that dialog
 * changes and cannot say which line it removed.
 *
 * <p>Only lines the caller named are broken. Clearing everything is a decision
 * about which lines, made before anything is broken, not something this
 * discovers as it goes.
 */
public final class Breaker {
    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    /** Ticks between one break and the next. */
    private static final int PACE_TICKS = 4;

    /** Lines removed between inventory clears, before returned items overflow. */
    private static final int CLEAR_EVERY = 10;

    /** Ticks to wait for every line to go before saying which did not. */
    private static final int CONFIRM_TIMEOUT_TICKS = 80;

    private Breaker() {
    }

    /**
     * Breaks each named line, then checks they are all gone.
     *
     * @param inDev rechecked before every line, not trusted from the start
     */
    public static Placer.Result breakLines(
        Minecraft client,
        List<Codespace.LinePosition> lines,
        BooleanSupplier inDev,
        Placer.Progress progress
    ) throws InterruptedException {
        // Empty handed for the whole run, because what a code line does when
        // struck depends on what struck it, and doing this per line would put
        // a packet between arriving and striking.
        Placer.onGameThread(client, () -> {
            if (client.player != null && client.player.connection != null) {
                client.player.getInventory().setSelectedSlot(0);
                client.player.getInventory().setItem(0, ItemStack.EMPTY);
                client.player.connection.send(
                    new ServerboundSetCreativeModeSlotPacket(36, ItemStack.EMPTY)
                );
            }
            return true;
        });

        // Held up and given the reach for the same reasons a placement is:
        // lines are stacked, and a player who falls between two of them is no
        // longer within range of either.
        Placer.Flight flight = Placer.hold(client);
        Reach.Held reach = Reach.extend(client);
        List<Codespace.LinePosition> broken = new ArrayList<>();
        try {
            for (Codespace.LinePosition line : lines) {
                if (!inDev.getAsBoolean()) {
                    return new Placer.Result(describe(broken), Optional.of(
                        "The player left dev mode, so nothing further was removed."
                    ));
                }
                BlockPos at = new BlockPos(line.x(), line.y(), line.z());
                Optional<String> failure = Placer.approach(client, at);
                if (failure.isPresent()) {
                    return new Placer.Result(describe(broken), failure);
                }
                Optional<String> swung = breakOne(client, at);
                if (swung.isPresent()) {
                    return new Placer.Result(describe(broken), swung);
                }
                broken.add(line);
                progress.placed(broken.size(), lines.size(), at.getX() + ", " + at.getZ());
                if (broken.size() % CLEAR_EVERY == 0) {
                    Placer.clearInventory(client);
                }
                Thread.sleep(PACE_TICKS * 50L);
            }
            return confirm(client, broken);
        } finally {
            Reach.retract(client, reach);
            Placer.release(client, flight);
        }
    }

    /**
     * Breaks the line's first block while sneaking, which takes the whole line
     * with it. Breaking it without sneaking takes only that block and leaves
     * the rest of the line standing.
     *
     * <p>The sneak and the break go out together, in that order, in one tick.
     * Sneaking is a state the server keeps, and the game announces the
     * player's real input every tick, so a sneak set and then waited on is
     * overwritten by the client's own packet before the break arrives. Sent
     * back to back they are processed in order and the sneak still holds.
     *
     * <p>Nothing waits between arriving and striking, because there is nothing
     * to wait for: the approach is a teleport the server performed itself, so
     * the position the strike is judged from is one it has already agreed to.
     */
    private static Optional<String> breakOne(Minecraft client, BlockPos at)
        throws InterruptedException {
        return Placer.onGameThread(client, () -> {
            if (client.player == null || client.gameMode == null
                || client.level == null) {
                return Optional.of("The player left the world.");
            }
            // Everything around the target, because breaking the wrong block
            // looks exactly like a break that did not work.
            LOGGER.info(
                "Breaking at {} from {} ({} away, sneaking): here={} west={} east={}",
                at,
                client.player.position(),
                String.format("%.1f", client.player.getEyePosition()
                    .distanceTo(net.minecraft.world.phys.Vec3.atCenterOf(at))),
                name(client, at),
                name(client, at.west()),
                name(client, at.east())
            );
            var network = client.player.connection;
            Input was = client.player.getLastSentInput();
            client.player.setShiftKeyDown(true);
            network.send(new ServerboundPlayerInputPacket(
                new Input(false, false, false, false, false, true, false)
            ));
            boolean attacked = client.gameMode.startDestroyBlock(at, Direction.UP);
            network.send(new ServerboundPlayerInputPacket(was));
            client.player.setShiftKeyDown(was.shift());
            LOGGER.info("  attackBlock={}", attacked);
            return Optional.<String>empty();
        });
    }

    private static Placer.Result confirm(
        Minecraft client,
        List<Codespace.LinePosition> broken
    ) throws InterruptedException {
        List<Codespace.LinePosition> remaining = new ArrayList<>(broken);
        for (int tick = 0; tick < CONFIRM_TIMEOUT_TICKS && !remaining.isEmpty(); tick += 1) {
            List<Codespace.LinePosition> still = new ArrayList<>();
            for (Codespace.LinePosition line : remaining) {
                BlockPos at = new BlockPos(line.x(), line.y(), line.z());
                Boolean there = Placer.onGameThread(client, () ->
                    client.level != null && PlotReader.lineExistsAt(client.level, at)
                );
                if (Boolean.TRUE.equals(there)) {
                    still.add(line);
                }
            }
            remaining = still;
            if (!remaining.isEmpty()) {
                Thread.sleep(50);
            }
        }

        List<Codespace.LinePosition> gone = new ArrayList<>(broken);
        gone.removeAll(remaining);
        if (remaining.isEmpty()) {
            return new Placer.Result(describe(gone), Optional.empty());
        }
        for (Codespace.LinePosition line : remaining) {
            LOGGER.warn("Line at {},{} is still there after breaking it", line.x(), line.z());
        }
        Codespace.LinePosition first = remaining.get(0);
        BlockPos at = new BlockPos(first.x(), first.y(), first.z());
        String there = Placer.onGameThread(client, () -> name(client, at) + " (west: "
            + name(client, at.west()) + ", east: " + name(client, at.east()) + ")");
        return new Placer.Result(describe(gone), Optional.of(
            remaining.size() + " line(s) would not come off. At " + at.getX() + ", " + at.getZ()
                + " there is still " + there + ". The log has what each break hit."
        ));
    }

    private static String name(Minecraft client, BlockPos at) {
        return client.level == null
            ? "?"
            : client.level.getBlockState(at).getBlock().getName().getString();
    }

    private static List<String> describe(List<Codespace.LinePosition> lines) {
        List<String> described = new ArrayList<>();
        for (Codespace.LinePosition line : lines) {
            described.add(line.x() + ", " + line.z());
        }
        return described;
    }
}
