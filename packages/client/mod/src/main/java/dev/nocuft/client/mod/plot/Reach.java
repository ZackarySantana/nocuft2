package dev.nocuft.client.mod.plot;

import net.minecraft.client.Minecraft;
import net.minecraft.core.component.DataComponents;
import net.minecraft.network.chat.Component;
import net.minecraft.network.protocol.game.ServerboundSetCreativeModeSlotPacket;
import net.minecraft.resources.Identifier;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.entity.EquipmentSlotGroup;
import net.minecraft.world.entity.ai.attributes.AttributeModifier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.component.ItemAttributeModifiers;

/**
 * How far the server will let this client touch a code line.
 *
 * <p>The server checks every interaction against where it believes the player
 * is, and an interaction from too far away is answered with nothing at all: no
 * refusal, no message, no line. Moving close enough costs a teleport and the
 * wait for it, and paying that per line is most of what a run would spend its
 * time on.
 *
 * <p>So the disagreement is made not to matter. A held item may carry attribute
 * modifiers, the server applies them to the player, and one of those attributes
 * is how far a block may be reached. Sixty-four blocks of it means the server
 * being eighteen blocks out of date is no longer the difference between a line
 * appearing and a line silently not.
 *
 * <p>It is worth being plain about what this is: it is the mechanism a reach
 * hack uses. It is confined to what DiamondFire already permits, which is
 * automation on a plot in dev mode, and it is given back at the end of every
 * run rather than held.
 */
public final class Reach {
    /**
     * Blocks added to what the player may touch.
     *
     * <p>Enough that no line on a plot is ever out of range from where the run
     * started, which is the point: a placement that never moves is a placement
     * with nothing to be out of date about.
     */
    public static final double EXTRA = 64.0;

    /**
     * How far a run will work from before it moves at all.
     *
     * <p>Well inside what is granted, because the margin is what absorbs a
     * server that still has the player somewhere else.
     */
    public static final double WORKING = 48.0;

    /** The offhand's index in the packet the server is told about slots by. */
    private static final int CONTAINER_SLOT = 45;

    private static final Identifier ID = Identifier.fromNamespaceAndPath("nocuft", "reach");

    /** The offhand as it was, so it can be given back. */
    public record Held(ItemStack was) {}

    private Reach() {
    }

    /**
     * Puts the reach into the player's offhand and waits for the server to
     * apply it.
     *
     * <p>The offhand rather than the hand that places, so that the item doing
     * the placing is only ever a template and the reach is not being put down
     * and picked up between every line. The attribute belongs to the player
     * once it is equipped, so which hand grants it does not matter.
     *
     * <p>Waiting is not optional. The server applies an item's modifiers when
     * it next ticks the player, so a click sent in the same breath as the item
     * is judged by the reach the player had before it.
     */
    public static Held extend(Minecraft client) throws InterruptedException {
        ItemStack was = Placer.onGameThread(client, () -> client.player == null
            ? ItemStack.EMPTY
            : client.player.getOffhandItem().copy());

        ItemStack item = new ItemStack(Items.PAPER);
        item.set(DataComponents.ATTRIBUTE_MODIFIERS, ItemAttributeModifiers.builder()
            .add(
                Attributes.BLOCK_INTERACTION_RANGE,
                new AttributeModifier(ID, EXTRA, AttributeModifier.Operation.ADD_VALUE),
                EquipmentSlotGroup.OFFHAND
            )
            .build());
        item.set(DataComponents.CUSTOM_NAME, Component.literal("Nocuft reach"));

        Placer.onGameThread(client, () -> {
            if (client.player != null && client.player.connection != null) {
                client.player.setItemInHand(InteractionHand.OFF_HAND, item);
                client.player.connection.send(
                    new ServerboundSetCreativeModeSlotPacket(CONTAINER_SLOT, item)
                );
            }
            return true;
        });
        Thread.sleep(SETTLE_TICKS * 50L);
        return new Held(was);
    }

    /** Ticks for the server to notice what the player is now holding. */
    private static final int SETTLE_TICKS = 4;

    /** Gives the offhand back, whatever was in it. */
    public static void retract(Minecraft client, Held held) {
        client.execute(() -> {
            if (client.player == null || client.player.connection == null) {
                return;
            }
            client.player.setItemInHand(InteractionHand.OFF_HAND, held.was());
            client.player.connection.send(
                new ServerboundSetCreativeModeSlotPacket(CONTAINER_SLOT, held.was())
            );
        });
    }
}
