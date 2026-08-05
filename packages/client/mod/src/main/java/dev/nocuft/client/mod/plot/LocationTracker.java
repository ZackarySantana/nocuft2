package dev.nocuft.client.mod.plot;

import dev.nocuft.client.plot.Location;
import dev.nocuft.client.plot.ModeMessages;
import java.util.Optional;
import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import net.minecraft.client.Minecraft;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Follows where the player is.
 *
 * <p>Two sources, because each answers what the other cannot. "/locate" is
 * asked once on joining and says where the player already is, which no
 * announcement will: DiamondFire only announces arrivals, so a client that
 * joins mid-session would otherwise know nothing until the player moves.
 * After that the announcements keep the answer current for free, without
 * asking the server anything again.
 *
 * <p>What the messages mean is decided in {@code client/core}, where it can be
 * checked without a game running. This is only the wiring.
 */
public final class LocationTracker {
    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    /** DiamondFire's own addresses, so another server is never acted on. */
    private static final String SERVER_SUFFIX = "mcdiamondfire.com";

    /** Ticks after joining before "/locate" is asked, so the world is there. */
    private static final int ASK_DELAY_TICKS = 40;

    /** Ticks to wait for the answer before giving up on being told. */
    private static final int ANSWER_TICKS = 100;

    /** Ticks to keep hiding detail rows after the answer heading arrives. */
    private static final int HUSH_TICKS = 10;

    /** Maximum requests per visit before announcements are awaited instead. */
    private static final int MAX_ASKS = 3;

    private volatile Location location = Location.UNKNOWN;
    private volatile String server;
    private int asking;
    private int awaiting;
    private int asked;

    public void register() {
        ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
            server = address(client);
            // Joining lands somewhere this client was not watching, so it is
            // unknown until "/locate" answers or an announcement arrives.
            location = Location.UNKNOWN;
            asking = 0;
            awaiting = 0;
            asked = 0;
            LOGGER.info("Joined {}", server == null ? "a server" : server);
        });
        ClientPlayConnectionEvents.DISCONNECT.register((handler, client) -> {
            location = Location.DISCONNECTED;
            server = null;
        });

        ClientReceiveMessageEvents.ALLOW_GAME.register((message, overlay) -> {
            if (!onDiamondFire()) {
                return true;
            }
            String text = message.getString();
            Optional<Location> announced = overlay
                ? ModeMessages.fromOverlay(text)
                : ModeMessages.fromChat(text);
            announced.ifPresent(this::moveTo);
            if (overlay || awaiting <= 0) {
                return true;
            }
            ModeMessages.fromLocate(text).ifPresent(found -> {
                moveTo(found);
                awaiting = Math.min(awaiting, HUSH_TICKS);
            });
            return !ModeMessages.isLocateAnswer(text);
        });
    }

    /** Called every client tick, which is where the asking is paced. */
    public void tick(Minecraft client) {
        if (!onDiamondFire()) {
            asking = 0;
            awaiting = 0;
            asked = 0;
            return;
        }
        if (awaiting > 0) {
            awaiting -= 1;
            return;
        }
        if (location != Location.UNKNOWN) {
            asking = 0;
            return;
        }
        if (asking == 0) {
            if (asked < MAX_ASKS) {
                asking = ASK_DELAY_TICKS;
            }
            return;
        }
        if (client.player == null || client.player.connection == null) {
            return;
        }
        asking -= 1;
        if (asking == 0) {
            asked += 1;
            awaiting = ANSWER_TICKS;
            client.player.connection.sendCommand("locate");
        }
    }

    private void moveTo(Location next) {
        if (location == next) {
            return;
        }
        location = next;
        LOGGER.info("Now in {}", next.wire());
    }

    /**
     * Whether this is DiamondFire at all.
     *
     * <p>Another server could say anything, including something that reads
     * like a mode change, and this client would then believe it was on a plot.
     */
    public boolean onDiamondFire() {
        return server != null && server.toLowerCase(java.util.Locale.ROOT).contains(SERVER_SUFFIX);
    }

    public Location location() {
        return onDiamondFire() ? location : Location.UNKNOWN;
    }

    public Optional<String> server() {
        return Optional.ofNullable(server);
    }

    private static String address(Minecraft client) {
        var entry = client.getCurrentServer();
        return entry == null ? null : entry.ip;
    }
}
