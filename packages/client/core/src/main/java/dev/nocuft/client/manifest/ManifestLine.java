package dev.nocuft.client.manifest;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.template.Template;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Carries a manifest in the codespace as one ordinary code line.
 *
 * <p>The line is a process nothing ever starts, so it occupies a code line and
 * never runs. Its body is a single list variable holding the manifest, split
 * into text values. A process and a list of text are constructs DiamondFire
 * already understands, which is the point: a code line survives being placed
 * and picked back up, and nothing else on a plot does. There is no field on a
 * code block for a tool to write its own data into, so the data has to be
 * code.
 *
 * <p>The manifest travels Base64 encoded rather than as raw JSON. A text value
 * is a place DiamondFire expects colour codes and percent placeholders, and
 * Base64 spends a third more room to use an alphabet that contains neither.
 */
public final class ManifestLine {
    /** The process the manifest lives in, and the list variable inside it. */
    public static final String NAME = "nocuft_manifest";

    /**
     * Characters of Base64 per text value. Far below anything DiamondFire
     * objects to, and small enough that a manifest for a large plot still fits
     * the values one code block holds.
     */
    private static final int CHUNK = 1000;

    /** A code block's chest holds 27 slots, and slot 0 holds the variable. */
    private static final int VALUES_PER_BLOCK = 26;

    private ManifestLine() {
    }

    /** Builds the code line that records this manifest. */
    public static Template build(PlotManifest manifest) {
        List<String> chunks = chunk(
            Base64.getEncoder().encodeToString(manifest.toJson().getBytes(StandardCharsets.UTF_8))
        );

        List<Json> blocks = new ArrayList<>();
        blocks.add(header());
        for (int start = 0; start < chunks.size(); start += VALUES_PER_BLOCK) {
            int end = Math.min(start + VALUES_PER_BLOCK, chunks.size());
            // The first block creates the list and the rest extend it, so a
            // manifest longer than one chest still reads back in order.
            blocks.add(values(
                start == 0 ? "CreateList" : "AppendValue",
                chunks.subList(start, end)
            ));
        }

        Json template = CanonicalJson.object("blocks", new Json.Arr(blocks));
        String canonical = CanonicalJson.write(template);
        return new Template(template, canonical, Template.sha256(canonical));
    }

    /** True when this code line is a manifest rather than a plot's own code. */
    public static boolean isManifestLine(Template template) {
        return template.header()
            .filter(header -> "process".equals(header.block()) && NAME.equals(header.name()))
            .isPresent();
    }

    /**
     * Reads the manifest a code line carries, or nothing when the line is not
     * a manifest at all.
     *
     * <p>A line that says it is a manifest but cannot be read is an error
     * rather than an absence: treating it as absent would let an apply believe
     * the plot was unclaimed and overwrite someone's work.
     */
    public static Optional<PlotManifest> read(Template template) {
        if (!isManifestLine(template)) {
            return Optional.empty();
        }
        StringBuilder encoded = new StringBuilder();
        for (Json block : blocksOf(template)) {
            if (!(block instanceof Json.Obj entry)) {
                continue;
            }
            if (!(entry.members().get("block") instanceof Json.Str kind)
                || !"set_var".equals(kind.value())) {
                continue;
            }
            for (Json.Obj item : itemsOf(entry)) {
                if (item.members().get("id") instanceof Json.Str id
                    && "txt".equals(id.value())
                    && item.members().get("data") instanceof Json.Obj data
                    && data.members().get("name") instanceof Json.Str value) {
                    encoded.append(value.value());
                }
            }
        }
        if (encoded.isEmpty()) {
            throw new ManifestException("The manifest line on this plot carries no manifest.");
        }
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(encoded.toString());
        } catch (IllegalArgumentException error) {
            throw new ManifestException("The manifest line on this plot is not readable.");
        }
        return Optional.of(PlotManifest.fromJson(new String(bytes, StandardCharsets.UTF_8)));
    }

    private static List<Json> blocksOf(Template template) {
        if (template.blocks() instanceof Json.Obj root
            && root.members().get("blocks") instanceof Json.Arr list) {
            return list.elements();
        }
        return List.of();
    }

    /** Chest items of one code block, in slot order. */
    private static List<Json.Obj> itemsOf(Json.Obj block) {
        if (!(block.members().get("args") instanceof Json.Obj args)
            || !(args.members().get("items") instanceof Json.Arr items)) {
            return List.of();
        }
        List<Json.Obj> ordered = new ArrayList<>();
        List<Json> sorted = new ArrayList<>(items.elements());
        sorted.sort((left, right) -> Double.compare(slotOf(left), slotOf(right)));
        for (Json element : sorted) {
            if (element instanceof Json.Obj slot
                && slot.members().get("item") instanceof Json.Obj item) {
                ordered.add(item);
            }
        }
        return ordered;
    }

    private static double slotOf(Json element) {
        if (element instanceof Json.Obj slot && slot.members().get("slot") instanceof Json.Num number) {
            return number.value();
        }
        return Double.MAX_VALUE;
    }

    private static Json header() {
        Json tag = slot(26, CanonicalJson.object(
            "id", new Json.Str("bl_tag"),
            "data", CanonicalJson.object(
                "action", new Json.Str("dynamic"),
                "block", new Json.Str("process"),
                "option", new Json.Str("False"),
                "tag", new Json.Str("Is Hidden")
            )
        ));
        Map<String, Json> block = new LinkedHashMap<>();
        block.put("id", new Json.Str("block"));
        block.put("block", new Json.Str("process"));
        block.put("data", new Json.Str(NAME));
        block.put("args", CanonicalJson.object("items", new Json.Arr(List.of(tag))));
        return new Json.Obj(block);
    }

    private static Json values(String action, List<String> chunks) {
        List<Json> items = new ArrayList<>();
        items.add(slot(0, CanonicalJson.object(
            "id", new Json.Str("var"),
            "data", CanonicalJson.object(
                "name", new Json.Str(NAME),
                "scope", new Json.Str("local")
            )
        )));
        for (int index = 0; index < chunks.size(); index += 1) {
            items.add(slot(index + 1, CanonicalJson.object(
                "id", new Json.Str("txt"),
                "data", CanonicalJson.object("name", new Json.Str(chunks.get(index)))
            )));
        }
        Map<String, Json> block = new LinkedHashMap<>();
        block.put("id", new Json.Str("block"));
        block.put("block", new Json.Str("set_var"));
        block.put("action", new Json.Str(action));
        block.put("args", CanonicalJson.object("items", new Json.Arr(items)));
        return new Json.Obj(block);
    }

    private static Json slot(int slot, Json item) {
        return CanonicalJson.object("item", item, "slot", new Json.Num(slot));
    }

    private static List<String> chunk(String text) {
        List<String> chunks = new ArrayList<>();
        for (int start = 0; start < text.length(); start += CHUNK) {
            chunks.add(text.substring(start, Math.min(start + CHUNK, text.length())));
        }
        return chunks;
    }
}
