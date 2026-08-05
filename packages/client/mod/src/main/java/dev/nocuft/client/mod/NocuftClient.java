package dev.nocuft.client.mod;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.manifest.ManifestLine;
import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.mod.api.ApiServer;
import dev.nocuft.client.mod.plot.Breaker;
import dev.nocuft.client.mod.plot.LocationTracker;
import dev.nocuft.client.mod.plot.Placer;
import dev.nocuft.client.mod.plot.Scanner;
import dev.nocuft.client.mod.plot.PlotReader;
import dev.nocuft.client.mod.plot.PlotTracker;
import dev.nocuft.client.mod.ui.NocuftScreen;
import dev.nocuft.client.plot.Location;
import dev.nocuft.client.plan.Bundle;
import dev.nocuft.client.plan.BundleException;
import dev.nocuft.client.plan.Planner;
import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.protocol.Protocol;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.command.v2.ClientCommands;
import net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientLifecycleEvents;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Entry point for the Nocuft client.
 *
 * <p>Everything this client decides is decided in {@code client/core}, which
 * carries no Minecraft and is tested against the compiler's own goldens. What
 * lives here is only what has to touch the game: the port Nocuft talks to, the
 * command that opens the screen, and the marshalling between them.
 */
public final class NocuftClient implements ClientModInitializer {
    public static final String MOD_ID = "nocuft";
    public static final String VERSION = "0.1.0";

    private static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    /** Builds this client currently holds, kept for the next session too. */
    private static BundleStore bundles;

    /**
     * A screen may only be opened from the client thread, and requests arrive
     * on the API thread, so one is parked here and raised on the next tick.
     */
    private static volatile Screen pendingScreen;

    private static ApiServer server;
    private static LocationTracker where;
    private static PlotTracker plot;

    @Override
    public void onInitializeClient() {
        bundles = new BundleStore();
        where = new LocationTracker();
        where.register();
        plot = new PlotTracker();
        plot.register();

        server = new ApiServer(NocuftClient::handle, NocuftClient::forget);
        server.setDaemon(true);
        server.start();

        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            Screen screen = pendingScreen;
            if (screen != null) {
                pendingScreen = null;
                client.gui.setScreen(screen);
            }
            where.tick(client);
            plot.tick(client, where.location());
        });

        ClientLifecycleEvents.CLIENT_STOPPING.register(client -> stop());
        ClientCommandRegistrationCallback.EVENT.register((dispatcher, access) ->
            dispatcher.register(ClientCommands.literal(MOD_ID)
                .executes(context -> {
                    openLater(new NocuftScreen());
                    return 1;
                })));

        LOGGER.info("Nocuft {} ready on port {}.", VERSION, ApiServer.PORT);
    }

    private static void stop() {
        if (server == null) {
            return;
        }
        try {
            // Anything still waiting is answered by the socket closing rather
            // than being left to time out.
            server.stop(1000);
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
        }
    }

    /** Answers one request. Runs on the API thread, never the client thread. */
    private static void handle(
        ApiServer.Session session,
        Protocol.Request request,
        ApiServer.Reply reply
    ) {
        switch (request.method()) {
            case HELLO -> {
                Protocol.Agent peer = Protocol.readHello(request.params());
                session.describePeer(peer);
                reply.ok(CanonicalJson.object(
                    "protocolVersion", new Json.Num(Protocol.VERSION),
                    "mod", CanonicalJson.object(
                        "name", new Json.Str("nocuft-client"),
                        "version", new Json.Str(VERSION)
                    ),
                    "capabilities", new Json.Arr(List.of())
                ));
            }
            case BUNDLE_PUSH -> {
                Bundle bundle = Protocol.readBundlePush(request.params());
                bundles.push(session, bundle);
                reply.ok(CanonicalJson.object(
                    "project", new Json.Str(bundle.projectId()),
                    "digest", new Json.Str(bundle.digest()),
                    "units", new Json.Num(bundle.units().size())
                ));
            }
            case OPEN -> {
                openLater(new NocuftScreen());
                reply.ok(CanonicalJson.object());
            }
        }
    }

    /**
     * Applies the builds the screen has ticked.
     *
     * @param chosen project ids the reader ticked
     * @return how many projects were asked for, so the screen knows to close
     */
    public static int applySelection(java.util.Set<String> chosen) {
        List<Planner.Request> requests = new ArrayList<>();
        for (Bundle bundle : bundles.all()) {
            if (!chosen.contains(bundle.projectId())) {
                continue;
            }
            List<String> units = new ArrayList<>();
            for (Bundle.Unit unit : bundle.units()) {
                units.add(unit.id());
            }
            requests.add(new Planner.Request(bundle.projectId(), units));
        }
        if (requests.isEmpty()) {
            tell("Nothing is ticked, so nothing was applied.");
            return 0;
        }
        Thread worker = new Thread(
            () -> apply(requests, new ChatReply()),
            "nocuft-apply"
        );
        worker.setDaemon(true);
        worker.start();
        return requests.size();
    }

    /** Reads the codespace again, waiting for it, from off the client thread. */
    private static void rereadPlotAndWait() {
        Minecraft game = Minecraft.getInstance();
        try {
            Placer.onGameThread(game, () -> {
                plot.refresh(game);
                return true;
            });
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
        }
    }

    /** Reads the codespace again, for whenever the screen is opened. */
    public static void rereadPlot() {
        Minecraft game = Minecraft.getInstance();
        game.execute(() -> {
            plot.refresh(game);
            readManifest();
        });
    }

    /**
     * Reads what the plot says it is carrying.
     *
     * <p>Cheap, and that is the point of doing it this way. Finding the
     * manifest costs nothing: its header is on a sign like every other line's,
     * so the codespace read that has already happened says whether one is
     * there. Only its contents have to be picked up, and that is one line
     * rather than the whole plot, however much code is on it.
     */
    private static void readManifest() {
        if (plot == null || plot.manifest().isPresent()) {
            return;
        }
        Optional<Codespace.LinePosition> at = plot.manifestLine();
        if (at.isEmpty() || !where.location().permitsCodeAccess()) {
            return;
        }
        Thread worker = new Thread(() -> {
            try {
                Scanner.Result result = Scanner.scan(
                    Minecraft.getInstance(),
                    List.of(at.get()),
                    () -> where.location().permitsCodeAccess(),
                    (done, total, line) -> { }
                );
                for (Scanner.ScannedLine line : result.lines()) {
                    ManifestLine.read(line.template()).ifPresent(plot::remember);
                }
            } catch (InterruptedException error) {
                Thread.currentThread().interrupt();
            } catch (RuntimeException error) {
                // A manifest that will not read is worth saying out loud. It
                // means the plot claims to carry a build and cannot say which,
                // which is exactly the state this client exists to prevent.
                LOGGER.warn("The manifest on this plot could not be read", error);
                tell("This plot has a Nocuft manifest that could not be read.");
            }
        }, "nocuft-manifest");
        worker.setDaemon(true);
        worker.start();
    }

    /**
     * How a build stands against this plot.
     *
     * <p>Three states, not five. Because every apply clears the plot first,
     * the plot carries exactly what was last applied to it, so a build is
     * either not on it, on it as built, or on it as an older build. There is
     * no drift to find and no foreign line to account for.
     */
    public enum Applied {
        /** Not on this plot. */
        NO,
        /** On this plot, and the same code this client now holds. */
        CURRENT,
        /** On this plot, but built before what this client now holds. */
        OUTDATED
    }

    /** Whether a build is on the plot, and whether it is the one held now. */
    public static Applied appliedState(Bundle bundle) {
        Optional<PlotManifest> manifest = plot == null ? Optional.empty() : plot.manifest();
        if (manifest.isEmpty()) {
            return Applied.NO;
        }
        for (PlotManifest.Project project : manifest.get().projects()) {
            if (project.id().equals(bundle.projectId())) {
                return project.digest().equals(bundle.digest())
                    ? Applied.CURRENT
                    : Applied.OUTDATED;
            }
        }
        return Applied.NO;
    }

    /** What the plot records about the last apply, for the screen to show. */
    public static Optional<PlotManifest> plotManifest() {
        return plot == null ? Optional.empty() : plot.manifest();
    }

    /**
     * Every build this client holds, and how it stands against the plot.
     *
     * <p>What the screen shows, said over the wire so a build tool can show
     * the same thing without asking twice.
     */
    private static List<Json> projectStates() {
        List<Json> states = new ArrayList<>();
        Optional<PlotManifest> manifest = plotManifest();
        for (Bundle bundle : held()) {
            List<Json> units = new ArrayList<>();
            for (Bundle.Unit unit : bundle.units()) {
                Map<String, Json> described = new LinkedHashMap<>();
                described.put("id", new Json.Str(unit.id()));
                described.put("kind", new Json.Str(unit.kind()));
                described.put("name", new Json.Str(unit.name()));
                unit.label().ifPresent(label -> described.put("label", new Json.Str(label)));
                unit.group().ifPresent(group -> described.put("group", new Json.Str(group)));
                described.put("sha256", new Json.Str(unit.sha256()));
                described.put("state", new Json.Str(wire(appliedState(bundle))));
                units.add(new Json.Obj(described));
            }

            Map<String, Json> project = new LinkedHashMap<>();
            project.put("id", new Json.Str(bundle.projectId()));
            project.put("source", new Json.Str(connections() > 0 ? "live" : "cached"));
            project.put("built", new Json.Str(bundle.digest()));
            project.put("applied", appliedRecord(manifest, bundle.projectId()));
            project.put("units", new Json.Arr(units));
            states.add(new Json.Obj(project));
        }
        return states;
    }

    /** What the plot records about one project, or null when it records none. */
    private static Json appliedRecord(Optional<PlotManifest> manifest, String projectId) {
        if (manifest.isEmpty()) {
            return new Json.Null();
        }
        for (PlotManifest.Project project : manifest.get().projects()) {
            if (project.id().equals(projectId)) {
                return CanonicalJson.object(
                    "digest", new Json.Str(project.digest()),
                    "appliedBy", new Json.Str(manifest.get().appliedBy().name()),
                    "appliedAt", new Json.Str(manifest.get().appliedAt())
                );
            }
        }
        return new Json.Null();
    }

    private static String wire(Applied applied) {
        return switch (applied) {
            case NO -> "no";
            case CURRENT -> "current";
            case OUTDATED -> "outdated";
        };
    }

    /**
     * Takes every line off the codespace, and says what stopped it if
     * something did.
     *
     * <p>Everything, not only what this client recognises. A plot is either
     * carrying what Nocuft last applied or it is not, and there is no third
     * state to preserve: an apply that left a line it did not recognise would
     * be back to a plot whose contents nothing can vouch for.
     */
    private static Optional<String> removeEveryLine(Placer.Progress progress) {
        Minecraft game = Minecraft.getInstance();
        Optional<Codespace> space = plot.codespace();
        if (space.isEmpty()) {
            return Optional.of("This client has not found the edges of this codespace.");
        }
        rereadPlotAndWait();
        List<Codespace.LinePosition> lines = PlotReader.occupiedPositions(game, space.get());
        if (lines.isEmpty()) {
            return Optional.empty();
        }
        try {
            Placer.clearInventory(game);
            Placer.Result result = Breaker.breakLines(
                game,
                lines,
                () -> where.location().permitsCodeAccess(),
                progress
            );
            rereadPlotAndWait();
            Placer.clearInventory(game);
            plot.forgetManifest();
            return result.failure();
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            return Optional.of("Removing was interrupted.");
        }
    }

    /** Reports an apply to the player, for when it was they who asked. */
    private static final class ChatReply implements ApiServer.Reply {
        @Override
        public void progress(Protocol.Phase phase, int done, int total, Optional<String> detail) {
            if (done > 0 && (done == total || done % 5 == 0)) {
                tell(phase.wire() + " " + done + "/" + total);
            }
        }

        @Override
        public void ok(Json.Obj result) {
            Json placed = result.members().get("placed");
            int count = placed instanceof Json.Arr list ? list.elements().size() : 0;
            tell("Placed " + count + (count == 1 ? " line." : " lines."));
        }

        @Override
        public void fail(Protocol.ErrorCode code, String message) {
            tell(message);
        }
    }

    /**
     * Makes the codespace carry exactly the selection, and nothing else.
     *
     * <p>Every apply clears the plot and rebuilds it. That is not a shortcut
     * around telling one line from another: it is the whole design. A plot
     * carries what Nocuft last put there, so there is no such thing as a line
     * to reconcile with, no drift to detect line by line, and no question of
     * whether a placement replaced the right one. Whatever was there is gone
     * and what is there now is what was asked for.
     *
     * <p>The manifest goes down last, once every line has been confirmed. It
     * is the plot's record of what it is carrying, so writing it before the
     * build is complete would have it vouch for lines that never landed.
     */
    private static void apply(List<Planner.Request> requests, ApiServer.Reply reply) {
        Location location = where.location();
        if (!location.permitsCodeAccess()) {
            reply.fail(
                Protocol.ErrorCode.PLOT_NOT_DEV,
                "Code can only be placed in dev mode, and the player is in " + location.wire() + "."
            );
            return;
        }
        Optional<Codespace> space = plot.codespace();
        if (space.isEmpty() || space.get().capacity().isEmpty()) {
            reply.fail(
                Protocol.ErrorCode.PLOT_UNKNOWN_SIZE,
                "This client could not work out how much room the plot has, so it will not place into it."
            );
            return;
        }
        // Read again first, because the plot is about to be cleared and what
        // is on it decides how much of that there is to do.
        rereadPlotAndWait();
        if (plot.reading().isEmpty()) {
            reply.fail(
                Protocol.ErrorCode.PLOT_CHUNKS_UNLOADED,
                "The codespace has not been read, so what is already on it is unknown."
            );
            return;
        }

        // Everything chosen is planned before anything is placed or removed,
        // so a plot is never cleared for a selection that was going to be
        // refused anyway.
        List<Bundle.Unit> wanted = new ArrayList<>();
        List<PlotManifest.Project> recorded = new ArrayList<>();
        Map<String, String> byHeader = new LinkedHashMap<>();
        String digest = "";
        for (Planner.Request request : requests) {
            Planner.Plan plan;
            try {
                plan = Planner.plan(bundles.byProject(), request);
            } catch (BundleException error) {
                reply.fail(Protocol.ErrorCode.of(error.code()), error.getMessage());
                return;
            }
            digest = plan.digest();
            for (Bundle.Unit unit : plan.place()) {
                // A plot addresses a line by its header, so two builds that
                // produce the same one are a single line however different
                // their projects are. Placing both leaves whichever landed
                // second, which is the ambiguity this client exists to remove.
                // Every line, not only the ones something calls by name. A
                // plot carries one Join event, not one per build, so two
                // builds that both handle it cannot both be on it.
                String clash = byHeader.put(unit.headerKey(), unit.id());
                if (clash != null) {
                    reply.fail(
                        Protocol.ErrorCode.BUNDLE_INVALID,
                        clash + " and " + unit.id() + " both become the code line "
                            + unit.headerKey() + ". Only one of them can be on a plot."
                    );
                    return;
                }
                wanted.add(unit);
            }
            // What the plot will say it is carrying, taken from the build
            // rather than from what lands, so the record and the code have one
            // source between them.
            bundles.get(request.projectId()).ifPresent(bundle -> recorded.add(
                new PlotManifest.Project(
                    bundle.projectId(),
                    bundle.module(),
                    bundle.digestOf(plan.place()),
                    bundle.compiler(),
                    bundle.registry(),
                    recordedUnits(plan.place())
                )
            ));
        }
        if (wanted.isEmpty()) {
            reply.fail(Protocol.ErrorCode.APPLY_UNKNOWN_UNIT, "Nothing was selected to place.");
            return;
        }

        // The manifest occupies a code line like anything else, so the plot
        // has to have room for it as well as for the build.
        Codespace codespace = space.get();
        int room = codespace.capacity().orElse(0);
        int needed = wanted.size() + 1;
        if (needed > room) {
            reply.fail(
                Protocol.ErrorCode.PLOT_NO_CAPACITY,
                "This plot holds " + room + " lines, and the selection needs " + needed
                    + " with its manifest."
            );
            return;
        }

        // Cleared before anything is placed, so the plot passes through empty
        // rather than through some mixture of the old build and the new.
        Optional<String> cleared = removeEveryLine((done, total, at) ->
            reply.progress(Protocol.Phase.CLEARING, done, total, Optional.of(at)));
        if (cleared.isPresent()) {
            reply.fail(Protocol.ErrorCode.APPLY_ABORTED, cleared.get());
            return;
        }

        List<Codespace.LinePosition> free = PlotReader.freePositions(
            Minecraft.getInstance(), codespace, needed
        );
        if (free.size() < needed) {
            reply.fail(
                Protocol.ErrorCode.PLOT_NO_CAPACITY,
                "This plot has " + free.size() + " free line(s) and the selection needs "
                    + needed + "."
            );
            return;
        }
        List<Placer.Placement> placements = new ArrayList<>();
        for (int index = 0; index < wanted.size(); index += 1) {
            Bundle.Unit unit = wanted.get(index);
            placements.add(new Placer.Placement(
                unit.id(), unit.encoded(), unit.name(), free.get(index)
            ));
        }

        try {
            reply.progress(Protocol.Phase.PLACING, 0, placements.size(), Optional.empty());
            Placer.Result result = Placer.place(
                Minecraft.getInstance(),
                placements,
                () -> where.location().permitsCodeAccess(),
                (done, total, unitId) ->
                    reply.progress(Protocol.Phase.PLACING, done, total, Optional.of(unitId))
            );
            if (result.failure().isPresent()) {
                reply.fail(Protocol.ErrorCode.APPLY_ABORTED, result.failure().get());
                return;
            }

            // Only now, with every line confirmed on the plot. A manifest is
            // the plot's word for what it carries, and a plot that says it
            // carries a build it does not is worse than one that says nothing.
            PlotManifest manifest = record(recorded);
            Optional<String> wrote = writeManifest(manifest, free.get(wanted.size()));
            rereadPlotAndWait();
            if (wrote.isPresent()) {
                reply.fail(Protocol.ErrorCode.APPLY_ABORTED, wrote.get());
                return;
            }
            plot.remember(manifest);

            List<Json> placed = new ArrayList<>();
            result.placed().forEach(id -> placed.add(new Json.Str(id)));
            reply.ok(CanonicalJson.object(
                "placed", new Json.Arr(placed),
                "removed", new Json.Arr(List.of()),
                "digest", new Json.Str(digest),
                "manifest", new Json.Str(manifest.digest())
            ));
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            reply.fail(Protocol.ErrorCode.APPLY_ABORTED, "The placement was interrupted.");
        }
    }

    /** The units of a build as the plot records them, without their code. */
    private static List<PlotManifest.Unit> recordedUnits(List<Bundle.Unit> units) {
        List<PlotManifest.Unit> recorded = new ArrayList<>();
        for (Bundle.Unit unit : units) {
            recorded.add(unit.recorded());
        }
        return recorded;
    }

    /** What this apply will write onto the plot as its record. */
    private static PlotManifest record(List<PlotManifest.Project> projects) {
        Minecraft game = Minecraft.getInstance();
        PlotManifest.Player who = game.player == null
            ? new PlotManifest.Player("unknown", Optional.empty())
            : new PlotManifest.Player(
                game.player.getGameProfile().name(),
                Optional.of(game.player.getStringUUID())
            );
        return new PlotManifest(
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
                .withZone(ZoneOffset.UTC)
                .format(Instant.now()),
            who,
            new PlotManifest.Agent("nocuft-client", VERSION),
            projects
        );
    }

    /** Puts the manifest line down, and says what stopped it if anything did. */
    private static Optional<String> writeManifest(
        PlotManifest manifest,
        Codespace.LinePosition at
    ) throws InterruptedException {
        Placer.Result result = Placer.place(
            Minecraft.getInstance(),
            List.of(new Placer.Placement(
                ManifestLine.NAME,
                ManifestLine.build(manifest).encode(),
                ManifestLine.NAME,
                at
            )),
            () -> where.location().permitsCodeAccess(),
            (done, total, unitId) -> { }
        );
        return result.failure().map(failure ->
            "The build is on the plot, but its manifest is not: " + failure
                + " Nothing will recognise this plot as carrying it."
        );
    }

    /** Requests that a screen be shown on the next client tick. */
    public static void openLater(Screen screen) {
        pendingScreen = screen;
    }

    /** Says something to the player, from any thread. */
    public static void tell(String message) {
        Minecraft client = Minecraft.getInstance();
        client.execute(() -> {
            if (client.player != null) {
                client.player.sendSystemMessage(Component.literal("[Nocuft] " + message));
            } else {
                LOGGER.info("{}", message);
            }
        });
    }

    /** Builds this client is holding, newest push wins. */
    public static List<Bundle> held() {
        return bundles == null ? List.of() : bundles.all();
    }

    /**
     * Drops what Nocuft told this client, once Nocuft is gone.
     *
     * <p>The screen goes with it, rather than showing a build nothing can
     * still vouch for.
     */
    private static void forget(ApiServer.Session session) {
        if (bundles != null) {
            bundles.forget(session);
        }
    }

    /** How many connections are open, which is what "connected" means. */
    public static int connections() {
        return server == null ? 0 : server.connectionCount();
    }

    /** Where the player is, which decides what this client may do. */
    public static Location location() {
        return where == null ? Location.UNKNOWN : where.location();
    }

    /** The codespace the player is standing in, when they are in one. */
    public static Optional<dev.nocuft.client.plot.Codespace> codespace() {
        return plot == null ? Optional.empty() : plot.codespace();
    }

    /** What was last read off that codespace. */
    public static Optional<PlotReader.Reading> plotReading() {
        return plot == null ? Optional.empty() : plot.reading();
    }

}
