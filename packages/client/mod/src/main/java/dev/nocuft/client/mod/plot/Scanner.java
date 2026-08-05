package dev.nocuft.client.mod.plot;

import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.template.Template;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.BooleanSupplier;
import net.minecraft.client.Minecraft;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.core.component.DataComponents;
import net.minecraft.network.protocol.game.ServerboundPickItemFromBlockPacket;
import net.minecraft.network.protocol.game.ServerboundPlayerInputPacket;
import net.minecraft.network.protocol.game.ServerboundSetCreativeModeSlotPacket;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Input;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.component.CustomData;
import net.minecraft.world.phys.BlockHitResult;
import net.minecraft.world.phys.Vec3;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Reads the code that is on a plot, as code rather than as a sign.
 *
 * <p>A sign says which line something is. It does not say whether that line is
 * the line that was built, and that is the question everything else here
 * depends on: whether a plot carries a build, whether a line has been edited,
 * whether a line belongs to this client at all. Only the code answers it, and
 * the only way to have the code is to ask DiamondFire for it.
 *
 * <p>Which gesture asks is not documented anywhere this project can rely on,
 * so both candidates are tried and the one that answers is remembered for the
 * rest of the scan. A gesture that changes nothing and a gesture that hands
 * over the wrong thing look identical from the outside, so the difference is
 * logged rather than left to be guessed at.
 */
public final class Scanner {
    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    /** The slot templates are received into and cleared from. */
    private static final int SLOT = 0;

    /** Container index of that slot, which is what the server is told. */
    private static final int CONTAINER_SLOT = 36;

    /** Ticks to wait for one gesture to be answered before trying the next. */
    private static final int HANDOVER_TIMEOUT_TICKS = 20;

    /** Characters of an item's data worth logging when a scan goes wrong. */
    private static final int DESCRIBE_LIMIT = 240;

    /** How a line is asked for, in the order the asking is tried. */
    private enum Gesture {
        /** Sneak and use, which is how a person copies a line by hand. */
        USE,
        /** Pick block, taking its data, which is what creative mode asks with. */
        PICK
    }

    /** A template that arrived, and the slot it arrived in. */
    private record Handover(int slot, String payload) {}

    /** A template that arrived, and what asking for it took. */
    private record Answer(Gesture gesture, String payload) {}

    /** One line read off the plot, with the code itself and its digest. */
    public record ScannedLine(
        Codespace.LinePosition at,
        String sha256,
        Optional<Template.Header> header,
        Template template
    ) {}

    /** What a scan found, and what it could not read. */
    public record Result(List<ScannedLine> lines, List<String> unreadable) {}

    private Scanner() {
    }

    /**
     * Reads every line on the codespace.
     *
     * <p>A line that will not come back is recorded rather than skipped. A
     * scan that quietly omits what it could not read describes a plot that
     * does not exist, and every decision made from it would be about that
     * plot rather than this one.
     */
    public static Result scan(
        Minecraft client,
        Codespace codespace,
        BooleanSupplier inDev,
        Placer.Progress progress
    ) throws InterruptedException {
        return scan(client, PlotReader.occupiedPositions(client, codespace), inDev, progress);
    }

    /**
     * Reads the lines at the positions given, and only those.
     *
     * <p>Separate from reading the whole codespace because most questions are
     * about one line. Finding the manifest costs nothing, since its header is
     * written on a sign like every other line's, so lifting the whole plot to
     * read it would be paying for a search that has already happened.
     */
    public static Result scan(
        Minecraft client,
        List<Codespace.LinePosition> positions,
        BooleanSupplier inDev,
        Placer.Progress progress
    ) throws InterruptedException {
        List<ScannedLine> lines = new ArrayList<>();
        List<String> unreadable = new ArrayList<>();

        // The hand is emptied because what a code block does when used depends
        // on what is being held, and given back afterwards because the hotbar
        // in dev mode is DiamondFire's own tools and destroying them is not
        // this client's to do.
        ItemStack wasHolding = Placer.onGameThread(client, () -> client.player == null
            ? ItemStack.EMPTY
            : client.player.getInventory().getItem(SLOT).copy());
        Integer wasSelected = Placer.onGameThread(client, () -> client.player == null
            ? 0
            : client.player.getInventory().getSelectedSlot());

        // A scan climbs the same layers a placement does, so it needs the same
        // things: something holding the player at them, and enough reach that
        // it does not have to be standing at each one.
        Placer.Flight flight = Placer.hold(client);
        Reach.Held reach = Reach.extend(client);

        // The first gesture that answers is the gesture for the rest of the
        // run, so a scan of thirty lines does not pay for the wrong one thirty
        // times over.
        Gesture answering = null;
        try {
            emptyHand(client);
            for (Codespace.LinePosition position : positions) {
                if (!inDev.getAsBoolean()) {
                    unreadable.add("the player left dev mode");
                    break;
                }
                BlockPos at = new BlockPos(position.x(), position.y(), position.z());
                Optional<String> moved = Placer.approach(client, at);
                if (moved.isPresent()) {
                    unreadable.add(at.getX() + ", " + at.getZ() + ": " + moved.get());
                    continue;
                }
                Optional<Answer> handed = copyLine(client, at, answering);
                if (handed.isEmpty()) {
                    unreadable.add(at.getX() + ", " + at.getZ() + ": nothing was handed over");
                    continue;
                }
                answering = handed.get().gesture();
                try {
                    Template template = Template.decode(handed.get().payload());
                    lines.add(new ScannedLine(
                        position, template.sha256(), template.header(), template
                    ));
                } catch (RuntimeException error) {
                    unreadable.add(at.getX() + ", " + at.getZ() + ": " + error.getMessage());
                }
                progress.placed(lines.size(), positions.size(), at.getX() + ", " + at.getZ());
            }
        } finally {
            restore(client, wasHolding, wasSelected == null ? 0 : wasSelected);
            Reach.retract(client, reach);
            Placer.release(client, flight);
        }
        return new Result(List.copyOf(lines), List.copyOf(unreadable));
    }

    /**
     * Asks DiamondFire for one line and waits for it to arrive.
     *
     * @param known the gesture that has already worked this run, or null
     */
    private static Optional<Answer> copyLine(
        Minecraft client,
        BlockPos at,
        Gesture known
    ) throws InterruptedException {
        for (Gesture gesture : known == null ? Gesture.values() : new Gesture[] {known}) {
            List<String> before = snapshot(client);
            if (!ask(client, at, gesture)) {
                return Optional.empty();
            }
            for (int tick = 0; tick < HANDOVER_TIMEOUT_TICKS; tick += 1) {
                Optional<Handover> handed =
                    Placer.onGameThread(client, () -> heldTemplate(client));
                if (handed.isPresent()) {
                    if (known == null) {
                        LOGGER.info("{} is what hands over a line here", gesture);
                    }
                    clearSlot(client, handed.get().slot());
                    return Optional.of(new Answer(gesture, handed.get().payload()));
                }
                Thread.sleep(50);
            }
            report(client, at, gesture, before);
        }
        return Optional.empty();
    }

    /**
     * Makes one gesture at a line.
     *
     * <p>The sneak and the use go out together, for the same reason breaking
     * does: the game announces the player's real input every tick, so a sneak
     * set and then waited on is gone before the use arrives.
     *
     * @return false only when there is no player to make it
     */
    private static boolean ask(Minecraft client, BlockPos at, Gesture gesture)
        throws InterruptedException {
        return Boolean.TRUE.equals(Placer.onGameThread(client, () -> {
            if (client.player == null || client.gameMode == null) {
                return false;
            }
            var network = client.player.connection;
            if (gesture == Gesture.PICK) {
                network.send(new ServerboundPickItemFromBlockPacket(at, true));
                return true;
            }
            Input was = client.player.getLastSentInput();
            client.player.setShiftKeyDown(true);
            network.send(new ServerboundPlayerInputPacket(
                new Input(false, false, false, false, false, true, false)
            ));
            BlockHitResult hit = new BlockHitResult(Vec3.atCenterOf(at), Direction.UP, at, false);
            InteractionResult result =
                client.gameMode.useItemOn(client.player, InteractionHand.MAIN_HAND, hit);
            network.send(new ServerboundPlayerInputPacket(was));
            client.player.setShiftKeyDown(was.shift());
            LOGGER.info("Used {} at {}, which the client called {}", gesture, at, result);
            return true;
        }));
    }

    /** The template on anything the player is now carrying, if any. */
    private static Optional<Handover> heldTemplate(Minecraft client) {
        if (client.player == null) {
            return Optional.empty();
        }
        var inventory = client.player.getInventory();
        for (int slot = 0; slot < inventory.getContainerSize(); slot += 1) {
            CustomData data = inventory.getItem(slot).get(DataComponents.CUSTOM_DATA);
            if (data == null) {
                continue;
            }
            // Found by its gzip signature rather than by walking the tags, so
            // it does not matter which of DiamondFire's keys it arrives under.
            List<String> payloads = Template.payloadsIn(data.copyTag().toString());
            if (!payloads.isEmpty()) {
                return Optional.of(new Handover(slot, payloads.get(0)));
            }
        }
        return Optional.empty();
    }

    /**
     * Says what the gesture did, when it did not hand over a line.
     *
     * <p>Only the slots that changed, because the hotbar in dev mode is full
     * of DiamondFire's own tools and listing all of them buries the one thing
     * being asked about.
     */
    private static void report(
        Minecraft client,
        BlockPos at,
        Gesture gesture,
        List<String> before
    ) throws InterruptedException {
        List<String> after = snapshot(client);
        List<String> changes = new ArrayList<>();
        for (int slot = 0; slot < after.size(); slot += 1) {
            String was = slot < before.size() ? before.get(slot) : "empty";
            if (!was.equals(after.get(slot))) {
                changes.add("slot " + slot + ": " + was + " -> " + after.get(slot));
            }
        }
        if (changes.isEmpty()) {
            LOGGER.warn("{} at {} was answered with nothing at all", gesture, at);
        } else {
            LOGGER.warn(
                "{} at {} changed the inventory but handed over no template: {}",
                gesture, at, String.join("; ", changes)
            );
        }
    }

    private static List<String> snapshot(Minecraft client) throws InterruptedException {
        return Placer.onGameThread(client, () -> {
            List<String> stacks = new ArrayList<>();
            if (client.player != null) {
                var inventory = client.player.getInventory();
                for (int slot = 0; slot < inventory.getContainerSize(); slot += 1) {
                    stacks.add(describe(inventory.getItem(slot)));
                }
            }
            return List.copyOf(stacks);
        });
    }

    private static String describe(ItemStack stack) {
        if (stack.isEmpty()) {
            return "empty";
        }
        CustomData data = stack.get(DataComponents.CUSTOM_DATA);
        String described = stack.getCount() + "x " + stack.getItem()
            + (data == null ? "" : " " + data.copyTag());
        return described.length() <= DESCRIBE_LIMIT
            ? described
            : described.substring(0, DESCRIBE_LIMIT) + "...";
    }

    /**
     * Takes back the one slot a template arrived in.
     *
     * <p>One slot, not every slot carrying data: DiamondFire's dev tools carry
     * data too, and clearing by that test empties the player's hotbar.
     */
    private static void clearSlot(Minecraft client, int slot) throws InterruptedException {
        Placer.onGameThread(client, () -> {
            if (client.player != null && client.player.connection != null) {
                client.player.getInventory().setItem(slot, ItemStack.EMPTY);
                client.player.connection.send(
                    new ServerboundSetCreativeModeSlotPacket(CONTAINER_SLOT + slot, ItemStack.EMPTY)
                );
            }
            return true;
        });
    }

    private static void emptyHand(Minecraft client) throws InterruptedException {
        Placer.onGameThread(client, () -> {
            if (client.player != null && client.player.connection != null) {
                client.player.getInventory().setSelectedSlot(SLOT);
                client.player.getInventory().setItem(SLOT, ItemStack.EMPTY);
                client.player.connection.send(
                    new ServerboundSetCreativeModeSlotPacket(CONTAINER_SLOT, ItemStack.EMPTY)
                );
            }
            return true;
        });
    }

    private static void restore(Minecraft client, ItemStack was, int selected) {
        client.execute(() -> {
            if (client.player == null || client.player.connection == null) {
                return;
            }
            client.player.getInventory().setItem(SLOT, was);
            client.player.connection.send(
                new ServerboundSetCreativeModeSlotPacket(CONTAINER_SLOT, was)
            );
            client.player.getInventory().setSelectedSlot(selected);
        });
    }
}
