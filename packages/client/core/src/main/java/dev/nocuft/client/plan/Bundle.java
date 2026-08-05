package dev.nocuft.client.plan;

import dev.nocuft.client.json.Json;
import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.template.Template;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;

/**
 * One project's compiled code, as a build tool handed it over.
 *
 * <p>Everything here is checked on the way in. A payload that does not decode,
 * or whose digest is not the digest it claims, would otherwise be discovered
 * halfway through placing it, with part of a project already on the plot.
 *
 * @param projectId the UUID committed with the project, which is what a plot matches on
 * @param module what the build calls itself, which is what a person reads
 */
public record Bundle(
    String projectId,
    String module,
    Optional<PlotManifest.Agent> compiler,
    Optional<PlotManifest.Registry> registry,
    List<Unit> units
) {
    public static final String FORMAT = "diamondfire-deployment";
    public static final int VERSION = 0;
    public static final int PROTOCOL_VERSION = 0;

    /** One code line the build produced, with the code itself. */
    public record Unit(
        String id,
        String kind,
        String name,
        Optional<String> label,
        Optional<String> group,
        String sha256,
        String encoded,
        Template template
    ) {
        /** The header this line takes on the plot, which is how a plot names it. */
        public Template.Header header() {
            return template.header().orElseThrow(() -> new BundleException(
                "bundle.invalid",
                "Unit " + id + " is not a complete code line: it has no header block."
            ));
        }

        /** The header as one comparable string, block and name together. */
        public String headerKey() {
            Template.Header header = header();
            return header.block() + " " + (header.name() == null ? "" : header.name());
        }

        /** The same unit as the plot would record it, without its code. */
        public PlotManifest.Unit recorded() {
            return new PlotManifest.Unit(id, kind, name, sha256);
        }
    }

    public Bundle {
        units = List.copyOf(units);
    }

    /** Identity of everything in this bundle, by the same rule the manifest uses. */
    public String digest() {
        return PlotManifest.digestOf(recordedUnits());
    }

    /** Identity of a chosen subset of this bundle. */
    public String digestOf(List<Unit> selected) {
        List<PlotManifest.Unit> recorded = new ArrayList<>();
        for (Unit unit : selected) {
            recorded.add(unit.recorded());
        }
        return PlotManifest.digestOf(recorded);
    }

    private List<PlotManifest.Unit> recordedUnits() {
        List<PlotManifest.Unit> recorded = new ArrayList<>();
        for (Unit unit : units) {
            recorded.add(unit.recorded());
        }
        return recorded;
    }

    public Optional<Unit> unit(String id) {
        for (Unit unit : units) {
            if (unit.id().equals(id)) {
                return Optional.of(unit);
            }
        }
        return Optional.empty();
    }

    /** Reads a deployment bundle, refusing one that could not be applied cleanly. */
    public static Bundle fromJson(String text) {
        Json.Obj root = object(Json.read(text), "the bundle");
        if (!FORMAT.equals(string(root, "format", "the bundle"))) {
            throw new BundleException("bundle.invalid", "A bundle names the format " + FORMAT + ".");
        }
        if (number(root, "version", "the bundle") != VERSION) {
            throw new BundleException(
                "bundle.invalid",
                "This client reads bundle version " + VERSION + "."
            );
        }
        if (number(root, "protocolVersion", "the bundle") != PROTOCOL_VERSION) {
            throw new BundleException(
                "bundle.invalid",
                "This client reads bundle protocol version " + PROTOCOL_VERSION + "."
            );
        }

        Json.Obj project = object(root.members().get("project"), "project");

        Optional<PlotManifest.Agent> compiler = Optional.empty();
        if (root.members().get("compiler") instanceof Json.Obj value) {
            compiler = Optional.of(new PlotManifest.Agent(
                string(value, "name", "compiler"),
                string(value, "version", "compiler")
            ));
        }
        Optional<PlotManifest.Registry> registry = Optional.empty();
        if (root.members().get("registry") instanceof Json.Obj value) {
            registry = Optional.of(new PlotManifest.Registry(
                string(value, "id", "registry"),
                string(value, "version", "registry"),
                string(value, "sha256", "registry")
            ));
        }
        List<Unit> units = new ArrayList<>();
        for (Json element : array(root.members().get("templates"), "templates").elements()) {
            units.add(unit(object(element, "a template")));
        }

        Bundle bundle = new Bundle(
            string(project, "id", "project"),
            string(project, "module", "project"),
            compiler,
            registry,
            units
        );
        bundle.checkUnitsAreDistinguishable();
        return bundle;
    }

    private static Unit unit(Json.Obj entry) {
        String id = string(entry, "id", "a template");
        String declaredDigest = string(entry, "sha256", "a template");
        String encoded = string(entry, "data", "a template");
        String encoding = string(entry, "encoding", "a template");
        int compressedBytes = positiveInteger(entry, "compressedBytes", "a template");
        int uncompressedBytes = positiveInteger(entry, "uncompressedBytes", "a template");
        if (!"diamondfire-template-gzip-base64".equals(encoding)) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " is encoded as " + encoding + ", which this client cannot place."
            );
        }

        Template template;
        try {
            template = Template.decode(encoded);
        } catch (RuntimeException error) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " does not decode to a code line: " + error.getMessage()
            );
        }
        // The digest is what the plot will be asked about later, so a payload
        // that does not hash to the digest it declares is refused here rather
        // than placed and then reported as drifted forever.
        if (!template.sha256().equals(declaredDigest)) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " declares the digest " + declaredDigest
                    + " and its code hashes to " + template.sha256() + "."
            );
        }

        if (Base64.getDecoder().decode(encoded).length != compressedBytes) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " does not have its declared compressed size."
            );
        }
        if (template.canonicalJson().getBytes(StandardCharsets.UTF_8).length != uncompressedBytes) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " does not have its declared uncompressed size."
            );
        }

        String kind = string(entry, "kind", "a template");
        String name = string(entry, "name", "a template");
        String expectedBlock = switch (kind) {
            case "player_event" -> "event";
            case "entity_event" -> "entity_event";
            case "game_event" -> "game_event";
            case "function" -> "func";
            case "process" -> "process";
            default -> throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " has unsupported kind " + kind + "."
            );
        };
        Template.Header header = template.header().orElseThrow(() -> new BundleException(
            "bundle.invalid",
            "Unit " + id + " is not a complete code line: it has no header block."
        ));
        if (!expectedBlock.equals(header.block()) || !Objects.equals(name, header.name())) {
            throw new BundleException(
                "bundle.invalid",
                "Unit " + id + " does not match its declared kind and name."
            );
        }

        return new Unit(
            id,
            kind,
            name,
            optionalString(entry, "label"),
            optionalString(entry, "group"),
            declaredDigest,
            encoded,
            template
        );
    }

    /**
     * Refuses a bundle holding two lines a plot could not tell apart.
     *
     * <p>A code line is addressed by its header and nothing else, so two units
     * that lower to the same header are one line on the plot however distinct
     * their identifiers are. Placing both leaves whichever landed second, and
     * every later read reports the other as drifted. This is the ambiguity the
     * client exists to remove, so it is refused at the door.
     */
    private void checkUnitsAreDistinguishable() {
        Map<String, String> byHeader = new HashMap<>();
        Map<String, String> byId = new HashMap<>();
        for (Unit unit : units) {
            String previousId = byId.put(unit.id(), unit.id());
            if (previousId != null) {
                throw new BundleException("bundle.invalid", "Unit " + unit.id() + " appears twice.");
            }
            Template.Header header = unit.header();
            String key = header.block() + " " + (header.name() == null ? "" : header.name());
            String previous = byHeader.put(key, unit.id());
            if (previous != null) {
                throw new BundleException(
                    "bundle.invalid",
                    "Units " + previous + " and " + unit.id() + " both become the code line "
                        + key + ". A plot cannot tell them apart, so it would carry one of them."
                );
            }
        }
    }

    private static Json.Obj object(Json value, String where) {
        if (value instanceof Json.Obj object) {
            return object;
        }
        throw new BundleException("bundle.invalid", where + " must be an object.");
    }

    private static Json.Arr array(Json value, String where) {
        if (value instanceof Json.Arr array) {
            return array;
        }
        throw new BundleException("bundle.invalid", where + " must be an array.");
    }

    private static String string(Json.Obj object, String key, String where) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return value.value();
        }
        throw new BundleException("bundle.invalid", where + " must carry a nonempty " + key + ".");
    }

    private static double number(Json.Obj object, String key, String where) {
        if (object.members().get(key) instanceof Json.Num value) {
            return value.value();
        }
        throw new BundleException("bundle.invalid", where + " must carry the number " + key + ".");
    }

    private static int positiveInteger(Json.Obj object, String key, String where) {
        double value = number(object, key, where);
        if (value < 1 || value > Integer.MAX_VALUE || value != Math.rint(value)) {
            throw new BundleException(
                "bundle.invalid",
                where + " must carry a positive integer " + key + "."
            );
        }
        return (int) value;
    }

    private static Optional<String> optionalString(Json.Obj object, String key) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return Optional.of(value.value());
        }
        return Optional.empty();
    }
}
