package dev.nocuft.client.template;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * One DiamondFire code line, and the digest that identifies it.
 *
 * <p>A template travels as gzip compressed, Base64 encoded JSON inside an
 * item's {@code hypercube:codetemplatedata} value. The digest is of the
 * uncompressed canonical JSON rather than of the encoded payload, because
 * compression is not a function of the code alone: two encoders producing the
 * same code produce different bytes. Hashing the canonical form is what lets a
 * line lifted off a plot be compared against a build.
 */
public record Template(Json blocks, String canonicalJson, String sha256) {
    /**
     * A payload is found by its gzip signature rather than by the syntax
     * quoting it, because a capture arrives bare, as JSON, escaped inside
     * SNBT, or single quoted inside SNBT.
     */
    private static final Pattern PAYLOAD = Pattern.compile("H4sI[A-Za-z0-9+/]*={0,2}");

    private static final int MAX_COMPRESSED_BYTES = 1_048_576;
    private static final int MAX_DECOMPRESSED_BYTES = 8_388_608;

    /** Reads a template from its Base64 payload. */
    public static Template decode(String encoded) {
        byte[] compressed;
        try {
            compressed = Base64.getDecoder().decode(encoded);
        } catch (IllegalArgumentException error) {
            throw new TemplateException("A template payload must be canonical Base64.");
        }
        if (compressed.length > MAX_COMPRESSED_BYTES) {
            throw new TemplateException(
                "A template payload of " + compressed.length + " bytes is larger than a code line can be."
            );
        }
        byte[] bytes = decompress(compressed);
        String text = new String(bytes, StandardCharsets.UTF_8);
        Json blocks = Json.read(text);
        String canonical = CanonicalJson.write(blocks);
        return new Template(blocks, canonical, sha256(canonical));
    }

    /** Writes a template back to the Base64 payload a plot accepts. */
    public String encode() {
        byte[] bytes = canonicalJson.getBytes(StandardCharsets.UTF_8);
        ByteArrayOutputStream target = new ByteArrayOutputStream();
        try (GZIPOutputStream gzip = new GZIPOutputStream(target)) {
            gzip.write(bytes);
        } catch (IOException error) {
            throw new UncheckedIOException(error);
        }
        return Base64.getEncoder().encodeToString(target.toByteArray());
    }

    /**
     * Pulls every template payload out of arbitrary captured text, in the
     * order it appears.
     */
    public static List<String> payloadsIn(String text) {
        // Whitespace never appears inside a payload, but a capture may have
        // wrapped one across lines, so removing it rejoins rather than
        // truncates.
        String compact = text.replaceAll("\\s+", "");
        Matcher matcher = PAYLOAD.matcher(compact);
        List<String> payloads = new ArrayList<>();
        while (matcher.find()) {
            payloads.add(matcher.group());
        }
        return List.copyOf(payloads);
    }

    /** The block a code line starts with, which is all a plot names it by. */
    public Optional<Header> header() {
        if (!(blocks instanceof Json.Obj root)) {
            return Optional.empty();
        }
        if (!(root.members().get("blocks") instanceof Json.Arr list) || list.elements().isEmpty()) {
            return Optional.empty();
        }
        if (!(list.elements().get(0) instanceof Json.Obj first)) {
            return Optional.empty();
        }
        if (!(first.members().get("block") instanceof Json.Str block)) {
            return Optional.empty();
        }
        // Functions and processes carry their name in data; an event names an
        // action instead. Reading both keeps this independent of the kind,
        // which a line read off a plot does not declare.
        String name = first.members().get("data") instanceof Json.Str data
            ? data.value()
            : first.members().get("action") instanceof Json.Str action ? action.value() : null;
        return Optional.of(new Header(block.value(), name));
    }

    /** How a code line is addressed on a plot. */
    public record Header(String block, String name) {}

    /** Lowercase hexadecimal SHA-256 of the UTF-8 text. */
    public static String sha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(text.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException("SHA-256 is required.", error);
        }
    }

    private static byte[] decompress(byte[] compressed) {
        ByteArrayOutputStream target = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        try (GZIPInputStream gzip = new GZIPInputStream(new java.io.ByteArrayInputStream(compressed))) {
            while (true) {
                int read = gzip.read(buffer);
                if (read < 0) {
                    break;
                }
                target.write(buffer, 0, read);
                if (target.size() > MAX_DECOMPRESSED_BYTES) {
                    throw new TemplateException(
                        "A template larger than " + MAX_DECOMPRESSED_BYTES + " bytes is not a code line."
                    );
                }
            }
        } catch (IOException error) {
            throw new TemplateException("A template payload must be gzip: " + error.getMessage());
        }
        return target.toByteArray();
    }
}
