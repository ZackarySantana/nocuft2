package dev.nocuft.client.mod.plot;

import dev.nocuft.client.manifest.ManifestLine;
import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.plot.Location;
import dev.nocuft.client.plot.PaidRank;
import dev.nocuft.client.plot.PlotDataMessages;
import dev.nocuft.client.plot.PlotSize;
import dev.nocuft.client.plot.WhoisMessages;
import java.util.Optional;
import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;
import net.minecraft.client.Minecraft;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Holds which codespace the player is standing in, and what is on it.
 *
 * <p>Entering dev mode teleports the player into the codespace, so where they
 * land is where it starts. That is not something DiamondFire tells a client;
 * it is inferred, and inferred from a position that is only reliable before
 * the player walks. So it is taken a moment after the mode changes and not
 * again until the mode changes again.
 *
 * <p>The plot's size is asked of the server with "/plot data plot" rather than
 * measured, because measuring fails when the far border of a large plot sits
 * in chunks the server never sent. The world is still read for the nearby
 * corner where lines begin.
 *
 * <p>Reading the plot is done once on arrival rather than every frame, because
 * it walks the whole codespace, and again only when something asks.
 */
public final class PlotTracker {
    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    /** Ticks to let the teleport land before the position is believed. */
    private static final int SETTLE_TICKS = 20;

    /** Ticks to wait for a server listing before measuring as a fallback. */
    private static final int ANSWER_TICKS = 60;

    /** Ticks requested listing details remain hidden after the answer. */
    private static final int HUSH_TICKS = 10;

    private volatile Codespace codespace;
    private volatile PlotReader.Reading reading;
    private volatile PlotManifest manifest;
    private volatile String owner;
    private volatile PaidRank ownerRank;
    private Location was = Location.UNKNOWN;
    private int settling;
    private int awaiting;
    private int hushing;
    private int prying;
    private PlotSize announced;

    /** Starts listening for the plot and owner listings this tracker requests. */
    public void register() {
        ClientReceiveMessageEvents.ALLOW_GAME.register((message, overlay) -> {
            boolean wantListing = awaiting > 0 || hushing > 0;
            boolean wantProfile = prying > 0;
            if (overlay || (!wantListing && !wantProfile)) {
                return true;
            }
            String text = message.getString();
            if (awaiting > 0) {
                PlotDataMessages.sizeFromChat(text).ifPresent(size -> announced = size);
                PlotDataMessages.ownerFromChat(text).ifPresent(name -> owner = name);
            }
            String about = owner;
            if (wantProfile && about != null
                && WhoisMessages.profiled(text).filter(about::equalsIgnoreCase).isPresent()) {
                WhoisMessages.rankFromChat(text).ifPresent(rank -> {
                    ownerRank = rank;
                    LOGGER.info("Plot owner {} holds the paid rank {}", about, rank.wire());
                });
                prying = Math.min(prying, HUSH_TICKS);
                return !WhoisMessages.isProfile(text);
            }
            return !(wantListing && PlotDataMessages.isListing(text));
        });
    }

    /** Called every client tick, which is the only place the world is read. */
    public void tick(Minecraft client, Location location) {
        if (location != Location.DEV) {
            if (was == Location.DEV) {
                // Leaving dev leaves nothing behind: a codespace read on one
                // plot says nothing about the next, and neither does its
                // manifest.
                codespace = null;
                reading = null;
                manifest = null;
                owner = null;
                ownerRank = null;
            }
            was = location;
            settling = 0;
            awaiting = 0;
            hushing = 0;
            prying = 0;
            announced = null;
            return;
        }
        if (was != Location.DEV) {
            was = Location.DEV;
            settling = SETTLE_TICKS;
            return;
        }
        if (settling > 0) {
            settling -= 1;
            if (settling == 0) {
                ask(client);
            }
            return;
        }
        if (hushing > 0) {
            hushing -= 1;
        }
        if (prying > 0) {
            prying -= 1;
            if (prying == 0 && ownerRank == null) {
                LOGGER.warn(
                    "\"/whois {}\" went unanswered, so the owner's rank is unknown.", owner
                );
            }
        }
        if (awaiting > 0) {
            PlotSize size = announced;
            announced = null;
            if (size == PlotSize.UNKNOWN) {
                awaiting = 0;
                hushing = HUSH_TICKS;
                LOGGER.warn(
                    "The server announced a plot size this client does not know,"
                        + " so the plot is being measured instead."
                );
                locate(client, null);
                pry(client);
            } else if (size != null) {
                awaiting = 0;
                hushing = HUSH_TICKS;
                locate(client, size);
                pry(client);
            } else {
                awaiting -= 1;
                if (awaiting == 0) {
                    LOGGER.warn(
                        "\"/plot data plot\" went unanswered,"
                            + " so the plot is being measured instead."
                    );
                    locate(client, null);
                }
            }
        }
    }

    /** Asks the server how large the current plot is. */
    private void ask(Minecraft client) {
        if (client.player == null || client.player.connection == null) {
            locate(client, null);
            return;
        }
        announced = null;
        awaiting = ANSWER_TICKS;
        client.player.connection.sendCommand("plot data plot");
    }

    /** Asks the server for the plot owner's paid rank. */
    private void pry(Minecraft client) {
        String about = owner;
        if (about == null || ownerRank != null
            || client.player == null || client.player.connection == null) {
            return;
        }
        prying = ANSWER_TICKS;
        client.player.connection.sendCommand("whois " + about);
    }

    /**
     * Works out which codespace the player is in from the stone border around
     * it.
     *
     * <p>Where the player lands is not the corner of anything: DiamondFire
     * drops them inside the codespace, so taking their position as the origin
     * put every line somewhere in the middle, which DiamondFire then refused
     * because a template goes at the start of a line. The border is the one
     * part of the layout that can be measured.
     */
    private void locate(Minecraft client, PlotSize known) {
        if (client.player == null || client.level == null) {
            return;
        }
        Optional<PlotReader.Bounds> measured = known == null
            ? PlotReader.bounds(client)
            : PlotReader.boundsFromSize(client, known);
        if (measured.isEmpty()) {
            LOGGER.warn("Could not find the codespace border, so this plot cannot be used.");
            return;
        }
        PlotReader.Bounds bounds = measured.get();

        // Lines run west from the eastern edge, down the long side of the
        // codespace, two apart. That is the same on every plot, so it is taken
        // as given rather than inferred once per session.
        int originX = bounds.eastX();
        int originZ = bounds.northZ() + 1;
        int lineY = bounds.floorY() + 1;
        PlotSize size = known == null ? sizeOf(bounds.length()) : known;

        // Code already here is the check on that, not a replacement for it: it
        // sits where lines go, so anything off the grid means the grid is
        // wrong and says so rather than being quietly worked around.
        PlotReader.codeExtent(client, bounds).ifPresent(code -> {
            int firstLineX = originX - Codespace.EDGE_CLEARANCE;
            if (code.lineY() != lineY
                || (firstLineX - code.eastmostX()) % Codespace.LINE_SPACING != 0) {
                LOGGER.warn(
                    "Code here sits at x{} y{}, which is off the grid this client computed"
                        + " from the edges (first line x{} y{}). Placing will go wrong.",
                    code.eastmostX(), code.lineY(), firstLineX, lineY
                );
            }
        });

        Codespace found = new Codespace(
            originX, originZ, lineY, bounds.width(), bounds.length(), size
        );
        codespace = found;
        LOGGER.info(
            "Codespace origin {},{} lines at y{} width {} length {} size {}",
            originX, originZ, lineY, bounds.width(), bounds.length(), size.wire()
        );
        refresh(client);
    }

    /**
     * The size a measured length belongs to.
     *
     * <p>Matched with room either side rather than exactly, because the border
     * is measured from wherever the player happens to be standing and a block
     * or two of slack costs nothing. A length matching none of them stays
     * unknown rather than being rounded to the nearest.
     */
    private static PlotSize sizeOf(int length) {
        for (PlotSize size : new PlotSize[] {PlotSize.BASIC, PlotSize.LARGE, PlotSize.MASSIVE}) {
            int expected = size.codeLength().orElse(0);
            if (Math.abs(length - expected) <= 4) {
                return size;
            }
        }
        return PlotSize.UNKNOWN;
    }

    /** Reads the codespace again, which is what a rescan asks for. */
    public void refresh(Minecraft client) {
        Codespace found = codespace;
        if (found == null) {
            return;
        }
        PlotReader.read(client, found).ifPresent(result -> {
            reading = result;
            LOGGER.info(
                "Read {} line(s) on the codespace, {} unreadable",
                result.lines().size(), result.unreadable()
            );
        });
    }

    public Optional<Codespace> codespace() {
        return Optional.ofNullable(codespace);
    }

    /** Who owns the current plot, once the server listing has answered. */
    public Optional<String> owner() {
        return Optional.ofNullable(owner);
    }

    /** The owner's paid rank, once the profile listing has answered. */
    public Optional<PaidRank> ownerRank() {
        return Optional.ofNullable(ownerRank);
    }

    public Optional<PlotReader.Reading> reading() {
        return Optional.ofNullable(reading);
    }

    /**
     * Where the manifest line sits, when this plot carries one.
     *
     * <p>Found from the signs, which are read for free with the rest of the
     * codespace. Nothing has to be picked up to know whether a manifest is
     * here; that is only needed to know what it says.
     */
    public Optional<Codespace.LinePosition> manifestLine() {
        PlotReader.Reading read = reading;
        if (read == null) {
            return Optional.empty();
        }
        for (PlotReader.ObservedLine line : read.lines()) {
            if (namesManifest(line.name())) {
                return Optional.of(
                    new Codespace.LinePosition(line.x(), line.y(), line.z())
                );
            }
        }
        return Optional.empty();
    }

    /**
     * Whether a sign's name could be the manifest's.
     *
     * <p>A prefix rather than the whole name, because a sign holds about
     * fifteen characters and the manifest's name is about fifteen characters,
     * so whether it arrives whole is not something to depend on. Being
     * generous costs one wasted pickup and nothing else: what is read back is
     * checked for being a manifest before it is believed, so a line that
     * merely starts the same way is discarded rather than trusted.
     */
    private static boolean namesManifest(String name) {
        return !name.isEmpty()
            && ManifestLine.NAME.regionMatches(true, 0, name, 0, name.length());
    }

    /** What the plot says was last applied to it, once that has been read. */
    public Optional<PlotManifest> manifest() {
        return Optional.ofNullable(manifest);
    }

    public void remember(PlotManifest read) {
        manifest = read;
    }

    /** Forgets the manifest without forgetting the plot, for a fresh read. */
    public void forgetManifest() {
        manifest = null;
    }
}
