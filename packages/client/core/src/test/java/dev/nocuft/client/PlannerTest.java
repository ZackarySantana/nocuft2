package dev.nocuft.client;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.plan.Bundle;
import dev.nocuft.client.plan.BundleException;
import dev.nocuft.client.plan.Planner;
import dev.nocuft.client.template.Template;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Proves a selection becomes exactly the lines it names, or is refused.
 *
 * <p>There is little to prove here because there is little left to decide. An
 * apply clears the codespace and places the selection, so the plot carries what
 * was applied to it and the planner never has to work out whose a line is,
 * whether it has been edited, or what order to touch things in.
 */
public final class PlannerTest {
    static void run() {
        aBundleThatCouldNotBePlacedCleanlyIsRefused();
        twoUnitsAPlotCouldNotTellApartAreRefused();
        aSelectionBecomesTheLinesItNames();
        theSameUnitAskedForTwiceIsPlacedOnce();
        theDigestCoversOnlyWhatWasSelected();
        aUnitNoBuildProducesIsRefused();
        aProcessBundleIsAccepted();
    }

    private static void check(boolean condition, String description) {
        if (!condition) {
            throw new AssertionError(description);
        }
    }

    private static void checkEquals(Object actual, Object expected, String description) {
        if (!expected.equals(actual)) {
            throw new AssertionError(
                description + System.lineSeparator()
                    + "  expected: " + expected + System.lineSeparator()
                    + "  actual:   " + actual
            );
        }
    }

    private static String checkRefused(Runnable action, String description) {
        try {
            action.run();
        } catch (BundleException expected) {
            return expected.code();
        }
        throw new AssertionError(description);
    }

    /** A code line whose header names this block and name. */
    private static Template line(String block, String name, String body) {
        List<Json> blocks = new ArrayList<>();
        Map<String, Json> header = new LinkedHashMap<>();
        header.put("id", new Json.Str("block"));
        header.put("block", new Json.Str(block));
        header.put(block.endsWith("event") ? "action" : "data", new Json.Str(name));
        blocks.add(new Json.Obj(header));
        blocks.add(CanonicalJson.object(
            "id", new Json.Str("block"),
            "block", new Json.Str("player_action"),
            "action", new Json.Str(body)
        ));
        Json template = CanonicalJson.object("blocks", new Json.Arr(blocks));
        String canonical = CanonicalJson.write(template);
        return new Template(template, canonical, Template.sha256(canonical));
    }

    private static Json unitJson(String id, String kind, String block, String name, String body) {
        Template template = line(block, name, body);
        String encoded = template.encode();
        return CanonicalJson.object(
            "id", new Json.Str(id),
            "kind", new Json.Str(kind),
            "name", new Json.Str(name),
            "sha256", new Json.Str(template.sha256()),
            "encoding", new Json.Str("diamondfire-template-gzip-base64"),
            "compressedBytes", new Json.Num(Base64.getDecoder().decode(encoded).length),
            "uncompressedBytes", new Json.Num(
                template.canonicalJson().getBytes(java.nio.charset.StandardCharsets.UTF_8).length
            ),
            "data", new Json.Str(encoded)
        );
    }

    private static String bundleJson(String projectId, List<Json> templates) {
        return CanonicalJson.write(CanonicalJson.object(
            "format", new Json.Str("diamondfire-deployment"),
            "version", new Json.Num(0),
            "protocolVersion", new Json.Num(0),
            "compiler", CanonicalJson.object(
                "name", new Json.Str("nocuft"),
                "version", new Json.Str("0.0.0")
            ),
            "project", CanonicalJson.object(
                "id", new Json.Str(projectId),
                "module", new Json.Str(projectId)
            ),
            "registry", CanonicalJson.object(
                "id", new Json.Str("example.registry"),
                "version", new Json.Str("0.0.0"),
                "sha256", new Json.Str(String.format("%064x", 1))
            ),
            "capabilities", new Json.Arr(List.of()),
            "templates", new Json.Arr(templates)
        ));
    }

    /** The arena build: a join event and a helper function. */
    private static Bundle arena() {
        return Bundle.fromJson(bundleJson("example.arena", List.of(
            unitJson("example.arena.join", "player_event", "event", "Join", "SendMessage"),
            unitJson("example.arena.helper", "function", "func", "helper", "GiveItems")
        )));
    }

    private static void aProcessBundleIsAccepted() {
        Bundle bundle = Bundle.fromJson(bundleJson("example.process", List.of(
            unitJson("example.process.countdown", "process", "process", "countdown", "Wait")
        )));
        checkEquals(
            bundle.units().get(0).kind(),
            "process",
            "a process template is accepted"
        );
    }

    private static List<String> idsOf(List<Bundle.Unit> units) {
        List<String> ids = new ArrayList<>();
        units.forEach(unit -> ids.add(unit.id()));
        return ids;
    }

    private static void aBundleThatCouldNotBePlacedCleanlyIsRefused() {
        Template template = line("func", "helper", "GiveItems");
        Json wrongDigest = CanonicalJson.object(
            "id", new Json.Str("example.arena.helper"),
            "kind", new Json.Str("function"),
            "name", new Json.Str("helper"),
            "sha256", new Json.Str(String.format("%064x", 0)),
            "encoding", new Json.Str("diamondfire-template-gzip-base64"),
            "compressedBytes", new Json.Num(1),
            "uncompressedBytes", new Json.Num(1),
            "data", new Json.Str(template.encode())
        );
        String code = checkRefused(
            () -> Bundle.fromJson(bundleJson("example.arena", List.of(wrongDigest))),
            "a payload that does not hash to its declared digest is refused"
        );
        checkEquals(code, "bundle.invalid", "the refusal is named");
    }

    /**
     * A plot addresses a line by the block and the name on it, so two units
     * that produce the same header are one line however different their ids.
     */
    private static void twoUnitsAPlotCouldNotTellApartAreRefused() {
        checkEquals(
            checkRefused(
                () -> Bundle.fromJson(bundleJson("example.arena", List.of(
                    unitJson("example.arena.first", "function", "func", "helper", "SendMessage"),
                    unitJson("example.arena.second", "function", "func", "helper", "GiveItems")
                ))),
                "a build with two units a plot could not tell apart is refused"
            ),
            "bundle.invalid",
            "the refusal is named"
        );
    }

    private static void aSelectionBecomesTheLinesItNames() {
        Bundle bundle = arena();
        Planner.Plan plan = Planner.plan(
            Map.of(bundle.projectId(), bundle),
            new Planner.Request(bundle.projectId(), List.of("example.arena.join"))
        );
        checkEquals(
            idsOf(plan.place()),
            List.of("example.arena.join"),
            "only what was selected is placed"
        );
    }

    private static void theSameUnitAskedForTwiceIsPlacedOnce() {
        Bundle bundle = arena();
        Planner.Plan plan = Planner.plan(
            Map.of(bundle.projectId(), bundle),
            new Planner.Request(
                bundle.projectId(),
                List.of("example.arena.join", "example.arena.join")
            )
        );
        checkEquals(
            idsOf(plan.place()),
            List.of("example.arena.join"),
            "a selection is a set, so a repeated unit is one line"
        );
    }

    private static void theDigestCoversOnlyWhatWasSelected() {
        Bundle bundle = arena();
        Planner.Plan one = Planner.plan(
            Map.of(bundle.projectId(), bundle),
            new Planner.Request(bundle.projectId(), List.of("example.arena.join"))
        );
        Planner.Plan both = Planner.plan(
            Map.of(bundle.projectId(), bundle),
            new Planner.Request(
                bundle.projectId(),
                List.of("example.arena.join", "example.arena.helper")
            )
        );
        check(
            !one.digest().equals(both.digest()),
            "applying part of a build is not recorded as applying all of it"
        );
        checkEquals(
            both.digest(),
            bundle.digest(),
            "selecting everything is the build's own digest"
        );
    }

    private static void aUnitNoBuildProducesIsRefused() {
        Bundle bundle = arena();
        checkEquals(
            checkRefused(() -> Planner.plan(
                Map.of(bundle.projectId(), bundle),
                new Planner.Request(bundle.projectId(), List.of("example.arena.ghost"))
            ), "selecting a unit no build produces is refused"),
            "apply.unknown_unit",
            "the refusal is named"
        );
        checkEquals(
            checkRefused(() -> Planner.plan(
                Map.of(),
                new Planner.Request("example.missing", List.of())
            ), "applying a project this client holds no build for is refused"),
            "bundle.unknown_project",
            "the refusal is named"
        );
    }
}
