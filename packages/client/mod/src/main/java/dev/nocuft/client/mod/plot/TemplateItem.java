package dev.nocuft.client.mod.plot;

import net.minecraft.core.component.DataComponents;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.nbt.StringTag;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.component.CustomData;

/**
 * The item a code line travels as.
 *
 * <p>DiamondFire expands a template when the item is placed, so this client
 * never builds code blocks itself: it puts the right item in hand and puts it
 * down. The whole line is one string on the item, under a key belonging to
 * DiamondFire's own plugin, which is why the format here is theirs rather than
 * anything this project chose.
 */
public final class TemplateItem {
    /** Bukkit's own container for plugin data on an item. */
    private static final String PUBLIC_BUKKIT_VALUES = "PublicBukkitValues";

    /** DiamondFire's plugin is Hypercube, and this is where it keeps a line. */
    private static final String TEMPLATE_KEY = "hypercube:codetemplatedata";

    private TemplateItem() {
    }

    /**
     * Builds the item for one code line.
     *
     * @param payload the gzipped and Base64 encoded template
     * @param name    what to call it, which is only ever seen if it is dropped
     */
    public static ItemStack of(String payload, String name) {
        ItemStack item = new ItemStack(Items.ENDER_CHEST);
        CompoundTag values = new CompoundTag();
        values.put(TEMPLATE_KEY, StringTag.valueOf(templateData(payload, name)));
        CompoundTag data = new CompoundTag();
        data.put(PUBLIC_BUKKIT_VALUES, values);
        item.set(DataComponents.CUSTOM_DATA, CustomData.of(data));
        item.set(DataComponents.CUSTOM_NAME, Component.literal(name));
        return item;
    }

    /**
     * The value DiamondFire reads, which is JSON inside a string.
     *
     * <p>Written by hand rather than by a serializer, because it has exactly
     * four fields and one of them is already Base64; the name is the only part
     * that could carry a character needing an escape, so it is the only part
     * escaped.
     */
    private static String templateData(String payload, String name) {
        return "{\"author\":\"Nocuft\",\"name\":\"" + escape(name)
            + "\",\"version\":1,\"code\":\"" + payload + "\"}";
    }

    private static String escape(String value) {
        StringBuilder escaped = new StringBuilder();
        for (int index = 0; index < value.length(); index += 1) {
            char character = value.charAt(index);
            if (character == '"' || character == '\\') {
                escaped.append('\\');
            }
            if (character < 0x20) {
                continue;
            }
            escaped.append(character);
        }
        return escaped.toString();
    }
}
