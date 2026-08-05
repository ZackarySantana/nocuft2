package dev.nocuft.client;

import dev.nocuft.client.json.Json;
import dev.nocuft.client.manifest.ManifestException;
import dev.nocuft.client.manifest.ManifestLine;
import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.template.Template;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Proves a plot can say what it is carrying, and who put it there. */
public final class ManifestTest {
    static void run() {
        aManifestRoundTripsThroughItsJson();
        aManifestRoundTripsThroughACodeLine();
        aManifestTooLargeForOneBlockStillReadsBackInOrder();
        aSelectionDigestIgnoresOrderAndFollowsTheCode();
        aManifestLineIsToldApartFromOrdinaryCode();
        aManifestThisClientWouldNotHaveWrittenIsRefused();
        aManifestLineNeverRuns();
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

    private static void checkRefused(Runnable action, String description) {
        try {
            action.run();
        } catch (ManifestException expected) {
            return;
        }
        throw new AssertionError(description);
    }

    private static PlotManifest.Unit unit(int index) {
        return new PlotManifest.Unit(
            "example.arena.unit" + index,
            "function",
            "unit" + index,
            String.format("%064x", index)
        );
    }

    private static PlotManifest manifestOf(int units) {
        List<PlotManifest.Unit> list = new ArrayList<>();
        for (int index = 0; index < units; index += 1) {
            list.add(unit(index));
        }
        PlotManifest.Project project = new PlotManifest.Project(
            "example.arena",
            "example.arena",
            PlotManifest.digestOf(list),
            Optional.of(new PlotManifest.Agent("nocuft", "0.0.0")),
            Optional.of(new PlotManifest.Registry(
                "example.registry",
                "0.0.0",
                String.format("%064x", 7)
            )),
            list
        );
        return new PlotManifest(
            "2026-07-26T18:04:11Z",
            new PlotManifest.Player(
                "ExampleCoder",
                Optional.of("3f9c2b18-64a7-4d0e-9c11-5a8be2d47f30")
            ),
            new PlotManifest.Agent("nocuft-client", "0.0.0"),
            List.of(project)
        );
    }

    private static void aManifestRoundTripsThroughItsJson() {
        PlotManifest original = manifestOf(3);
        PlotManifest again = PlotManifest.fromJson(original.toJson());
        checkEquals(again, original, "a manifest survives being written and read");
        checkEquals(again.toJson(), original.toJson(), "the canonical JSON is stable");
        checkEquals(again.digest(), original.digest(), "the manifest digest is stable");
    }

    private static void aManifestRoundTripsThroughACodeLine() {
        PlotManifest original = manifestOf(3);
        Template line = ManifestLine.build(original);
        // The line survives being encoded and decoded the way a plot would
        // hand it back, not only being read straight out of memory.
        Template placed = Template.decode(line.encode());
        checkEquals(placed.sha256(), line.sha256(), "the manifest line digest survives placement");
        Optional<PlotManifest> read = ManifestLine.read(placed);
        check(read.isPresent(), "a manifest line carries a manifest");
        checkEquals(read.get(), original, "the manifest survives the code line");
    }

    private static void aManifestTooLargeForOneBlockStillReadsBackInOrder() {
        // Twenty-six text values fit one chest, so this spills into a second
        // block and proves the parts are rejoined in order rather than by
        // whichever block was read first.
        PlotManifest original = manifestOf(300);
        Template line = ManifestLine.build(original);
        int blocks = ((Json.Arr) ((Json.Obj) line.blocks()).members().get("blocks")).elements().size();
        check(blocks > 2, "a large manifest needs more than one value block, got " + blocks);
        checkEquals(
            ManifestLine.read(Template.decode(line.encode())).orElseThrow(),
            original,
            "a manifest larger than one code block survives"
        );
    }

    private static void aSelectionDigestIgnoresOrderAndFollowsTheCode() {
        List<PlotManifest.Unit> ordered = List.of(unit(1), unit(2), unit(3));
        List<PlotManifest.Unit> shuffled = List.of(unit(3), unit(1), unit(2));
        checkEquals(
            PlotManifest.digestOf(shuffled),
            PlotManifest.digestOf(ordered),
            "the same units in another order are the same selection"
        );

        List<PlotManifest.Unit> changed = List.of(
            unit(1),
            new PlotManifest.Unit("example.arena.unit2", "function", "unit2", String.format("%064x", 99)),
            unit(3)
        );
        check(
            !PlotManifest.digestOf(changed).equals(PlotManifest.digestOf(ordered)),
            "a changed line changes the selection digest"
        );

        List<PlotManifest.Unit> fewer = List.of(unit(1), unit(2));
        check(
            !PlotManifest.digestOf(fewer).equals(PlotManifest.digestOf(ordered)),
            "a removed line changes the selection digest"
        );

        // Two people registering one project under different names compile
        // the same lines under different unit ids. If the digest noticed, each
        // would read the other's apply as out of date and applying would flip
        // it back, forever, while the plot never changed.
        List<PlotManifest.Unit> renamed = new ArrayList<>();
        for (PlotManifest.Unit was : ordered) {
            renamed.add(new PlotManifest.Unit(
                was.id().replace("example.arena", "app.someone_elses_name"),
                was.kind(),
                was.name(),
                was.sha256()
            ));
        }
        checkEquals(
            PlotManifest.digestOf(renamed),
            PlotManifest.digestOf(ordered),
            "the same code under another module is the same selection"
        );
    }

    private static void aManifestLineIsToldApartFromOrdinaryCode() {
        Template manifest = ManifestLine.build(manifestOf(1));
        check(ManifestLine.isManifestLine(manifest), "the manifest line is recognised");

        Template ordinary = Template.decode(
            ManifestLine.build(manifestOf(1)).encode()
        );
        check(ManifestLine.isManifestLine(ordinary), "it is still recognised after placement");

        String code = "{\"blocks\":[{\"block\":\"func\",\"data\":\"helper\",\"id\":\"block\"}]}";
        Template handwritten = Template.decode(
            new Template(Json.read(code), code, Template.sha256(code)).encode()
        );
        check(!ManifestLine.isManifestLine(handwritten), "an ordinary line is not a manifest");
        checkEquals(ManifestLine.read(handwritten), Optional.empty(), "an ordinary line carries no manifest");
    }

    private static void aManifestThisClientWouldNotHaveWrittenIsRefused() {
        checkRefused(
            () -> PlotManifest.fromJson("{\"format\":\"something-else\",\"version\":0}"),
            "another tool's document is refused"
        );
        checkRefused(
            () -> PlotManifest.fromJson("{\"format\":\"nocuft-plot-manifest\",\"version\":1}"),
            "a manifest from a later client is refused rather than half read"
        );
        checkRefused(
            () -> new PlotManifest(
                "26 July 2026",
                new PlotManifest.Player("ExampleCoder", Optional.empty()),
                new PlotManifest.Agent("nocuft-client", "0.0.0"),
                List.of()
            ),
            "a timestamp that is not RFC 3339 in UTC is refused"
        );
    }

    /**
     * A process runs only when something starts one. Nothing does, so the
     * manifest costs a code line and no execution.
     */
    private static void aManifestLineNeverRuns() {
        Template line = ManifestLine.build(manifestOf(2));
        checkEquals(line.header().orElseThrow().block(), "process", "the manifest is a process");
        checkEquals(line.header().orElseThrow().name(), "nocuft_manifest", "the process is named");
        check(
            !line.canonicalJson().contains("start_process"),
            "nothing in the manifest line starts the process it defines"
        );
    }
}
