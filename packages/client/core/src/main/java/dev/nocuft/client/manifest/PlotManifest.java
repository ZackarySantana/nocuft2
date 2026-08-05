package dev.nocuft.client.manifest;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.template.Template;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * What a client last applied to a codespace, as recorded on the plot itself.
 *
 * <p>This is the only thing that makes an application unambiguous. A code line
 * carries no mark of its own, so without a manifest the question "is the code
 * on this plot the code I built?" can only be answered by matching a line's
 * header, and a header is not an identity: two projects that both export
 * {@code helper} write the same one. The manifest names every line by the
 * digest of the code that was placed, so a coder opening the plot sees whose
 * build is on it and whether it is still theirs.
 *
 * @see ManifestLine for how it is carried in the codespace
 */
public record PlotManifest(
    String appliedAt,
    Player appliedBy,
    Agent client,
    List<Project> projects
) {
    public static final String FORMAT = "nocuft-plot-manifest";
    public static final int VERSION = 0;

    private static final Pattern TIMESTAMP =
        Pattern.compile("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$");

    /** The player whose client placed the code. */
    public record Player(String name, Optional<String> uuid) {}

    /** A named and versioned tool. */
    public record Agent(String name, String version) {}

    /** The registry a project was compiled against. */
    public record Registry(String id, String version, String sha256) {}

    /** One code line a project contributed. */
    public record Unit(String id, String kind, String name, String sha256) {
        /**
         * How this line is addressed on the plot: its code block and the name
         * on it. Both matter, because a function and a process may carry the
         * same name and are not the same line.
         */
        public String header() {
            String block = switch (kind) {
                case "player_event" -> "event";
                case "entity_event" -> "entity_event";
                case "game_event" -> "game_event";
                case "function" -> "func";
                case "process" -> "process";
                default -> throw new ManifestException(
                    "A manifest unit is one of the five code line kinds, not " + kind + "."
                );
            };
            return block + " " + name;
        }
    }

    /** Everything one project put on the plot. */
    public record Project(
        String id,
        String module,
        String digest,
        Optional<Agent> compiler,
        Optional<Registry> registry,
        List<Unit> units
    ) {}

    public PlotManifest {
        if (!TIMESTAMP.matcher(appliedAt).matches()) {
            throw new ManifestException(
                "A manifest records when it was applied as an RFC 3339 timestamp in UTC, not "
                    + appliedAt + "."
            );
        }
        projects = List.copyOf(projects);
    }

    /**
     * What an applied selection comes to: the digest over each line's own
     * digest, sorted.
     *
     * <p>Only the code. A unit's id carries the module its build compiled
     * under, and a module is a name each machine chooses at registration, so
     * two people can produce identical lines under different ids. Hashing the
     * ids would have each of them read the other's apply as out of date, and
     * applying would flip it back, forever, while the plot never changed.
     *
     * <p>Sorting is what makes two applies of the same lines agree however
     * they were ordered.
     */
    public static String digestOf(List<Unit> units) {
        List<String> lines = new ArrayList<>();
        for (Unit unit : units) {
            lines.add(unit.sha256() + "\n");
        }
        lines.sort(null);
        return Template.sha256(String.join("", lines));
    }

    /** The digest a plot is identified by: the whole manifest, canonically. */
    public String digest() {
        return Template.sha256(toJson());
    }

    /** Writes the manifest as the canonical JSON the schema describes. */
    public String toJson() {
        List<Json> projectValues = new ArrayList<>();
        for (Project project : projects) {
            Map<String, Json> members = new LinkedHashMap<>();
            members.put("id", new Json.Str(project.id()));
            members.put("module", new Json.Str(project.module()));
            members.put("digest", new Json.Str(project.digest()));
            project.compiler().ifPresent(compiler -> members.put("compiler", agent(compiler)));
            project.registry().ifPresent(registry -> members.put("registry", CanonicalJson.object(
                "id", new Json.Str(registry.id()),
                "version", new Json.Str(registry.version()),
                "sha256", new Json.Str(registry.sha256())
            )));
            List<Json> unitValues = new ArrayList<>();
            for (Unit unit : project.units()) {
                unitValues.add(CanonicalJson.object(
                    "id", new Json.Str(unit.id()),
                    "kind", new Json.Str(unit.kind()),
                    "name", new Json.Str(unit.name()),
                    "sha256", new Json.Str(unit.sha256())
                ));
            }
            members.put("units", new Json.Arr(unitValues));
            projectValues.add(new Json.Obj(members));
        }

        Map<String, Json> root = new LinkedHashMap<>();
        root.put("format", new Json.Str(FORMAT));
        root.put("version", new Json.Num(VERSION));
        root.put("appliedAt", new Json.Str(appliedAt));
        Map<String, Json> player = new LinkedHashMap<>();
        player.put("name", new Json.Str(appliedBy.name()));
        appliedBy.uuid().ifPresent(uuid -> player.put("uuid", new Json.Str(uuid)));
        root.put("appliedBy", new Json.Obj(player));
        root.put("client", agent(client));
        root.put("projects", new Json.Arr(projectValues));
        return CanonicalJson.write(new Json.Obj(root));
    }

    /** Reads a manifest, refusing one this client would not have written. */
    public static PlotManifest fromJson(String text) {
        Json.Obj root = object(Json.read(text), "the manifest");
        String format = string(root, "format", "the manifest");
        if (!FORMAT.equals(format)) {
            throw new ManifestException("A manifest names the format " + FORMAT + ", not " + format + ".");
        }
        double version = number(root, "version", "the manifest");
        if (version != VERSION) {
            throw new ManifestException(
                "This client reads manifest version " + VERSION + ", and the plot carries "
                    + CanonicalJson.number(version) + "."
            );
        }

        Json.Obj player = object(root.members().get("appliedBy"), "appliedBy");
        Player appliedBy = new Player(
            string(player, "name", "appliedBy"),
            optionalString(player, "uuid")
        );
        Json.Obj clientValue = object(root.members().get("client"), "client");
        Agent client = new Agent(
            string(clientValue, "name", "client"),
            string(clientValue, "version", "client")
        );

        List<Project> projects = new ArrayList<>();
        for (Json element : array(root.members().get("projects"), "projects").elements()) {
            Json.Obj entry = object(element, "a project");
            List<Unit> units = new ArrayList<>();
            for (Json unitElement : array(entry.members().get("units"), "units").elements()) {
                Json.Obj unit = object(unitElement, "a unit");
                units.add(new Unit(
                    string(unit, "id", "a unit"),
                    string(unit, "kind", "a unit"),
                    string(unit, "name", "a unit"),
                    string(unit, "sha256", "a unit")
                ));
            }
            Optional<Agent> compiler = Optional.empty();
            if (entry.members().get("compiler") instanceof Json.Obj value) {
                compiler = Optional.of(new Agent(
                    string(value, "name", "compiler"),
                    string(value, "version", "compiler")
                ));
            }
            Optional<Registry> registry = Optional.empty();
            if (entry.members().get("registry") instanceof Json.Obj value) {
                registry = Optional.of(new Registry(
                    string(value, "id", "registry"),
                    string(value, "version", "registry"),
                    string(value, "sha256", "registry")
                ));
            }
            projects.add(new Project(
                string(entry, "id", "a project"),
                string(entry, "module", "a project"),
                string(entry, "digest", "a project"),
                compiler,
                registry,
                units
            ));
        }

        return new PlotManifest(
            string(root, "appliedAt", "the manifest"),
            appliedBy,
            client,
            projects
        );
    }

    private static Json.Obj agent(Agent agent) {
        return CanonicalJson.object(
            "name", new Json.Str(agent.name()),
            "version", new Json.Str(agent.version())
        );
    }

    private static Json.Obj object(Json value, String where) {
        if (value instanceof Json.Obj object) {
            return object;
        }
        throw new ManifestException(where + " must be an object.");
    }

    private static Json.Arr array(Json value, String where) {
        if (value instanceof Json.Arr array) {
            return array;
        }
        throw new ManifestException(where + " must be an array.");
    }

    private static String string(Json.Obj object, String key, String where) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return value.value();
        }
        throw new ManifestException(where + " must carry a nonempty " + key + ".");
    }

    private static double number(Json.Obj object, String key, String where) {
        if (object.members().get(key) instanceof Json.Num value) {
            return value.value();
        }
        throw new ManifestException(where + " must carry the number " + key + ".");
    }

    private static Optional<String> optionalString(Json.Obj object, String key) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return Optional.of(value.value());
        }
        return Optional.empty();
    }
}
