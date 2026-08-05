package dev.nocuft.client.plot;

import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Reads where the player is from what DiamondFire tells them.
 *
 * <p>DiamondFire announces a mode change in chat and nowhere else a client can
 * see, so this is the only way to know. That makes it fragile in a specific
 * way: a wording change on the server silently stops every automatic thing
 * this client does. Every string it depends on is therefore named here, one
 * predicate each, so a break is one edit in one file and can be checked
 * without a game.
 *
 * <p>Nothing is guessed. A message this does not recognise leaves the location
 * as it was, because acting on a plot this client only thinks it is on is
 * worse than acting on none.
 */
public final class ModeMessages {
    /**
     * The action bar on spawn, which shows the player's currencies. Matched
     * loosely because the numbers and the rank prefix vary.
     */
    private static final Pattern SPAWN_OVERLAY = Pattern.compile(
        "^(?:⏵+ - )?⧈ -?\\d+ Tokens {2}ᛥ -?\\d+ Tickets {2}⚡ -?\\d+ Sparks$"
    );

    private static final String DEV = "» You are now in dev mode.";
    private static final String BUILD = "» You are now in build mode.";
    private static final String PLAY = "» Joined game: ";

    /**
     * The headings "/locate" answers with, which name the mode by its verb.
     *
     * <p>Only the coding one has been read off the server; the others are
     * what its pattern says they should be. A wrong guess here costs nothing:
     * a heading the server never says matches nothing, and the location is
     * then learned from the next announcement instead.
     */
    private static final String LOCATE_CODING = "You are currently coding on:";
    private static final String LOCATE_BUILDING = "You are currently building on:";
    private static final String LOCATE_PLAYING = "You are currently playing on:";
    private static final String LOCATE_SPAWN = "You are currently at spawn";

    /** The arrow the locate answer writes its detail rows behind. */
    private static final String LOCATE_ARROW = "→";

    private ModeMessages() {
    }

    /**
     * The location a "/locate" answer announces, if the message is one.
     *
     * <p>This is what asking outright is for: an announcement only says where
     * the player has just arrived, so a client that joins mid-session knows
     * nothing until they move. The answer says where they already are.
     *
     * @param message the message with its formatting already removed; the
     *     heading is found among its lines, since the answer arrives with the
     *     plot's details under it
     */
    public static Optional<Location> fromLocate(String message) {
        for (String line : message.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.equals(LOCATE_CODING)) {
                return Optional.of(Location.DEV);
            }
            if (trimmed.equals(LOCATE_BUILDING)) {
                return Optional.of(Location.BUILD);
            }
            if (trimmed.equals(LOCATE_PLAYING)) {
                return Optional.of(Location.PLAY);
            }
            if (trimmed.startsWith(LOCATE_SPAWN)) {
                return Optional.of(Location.SPAWN);
            }
        }
        return Optional.empty();
    }

    /**
     * Whether a message is a "/locate" answer and nothing else.
     *
     * <p>For hiding, when the client asked and the player did not. Fails soft
     * in the showing direction, like the plot data listing does: a message
     * carrying anything besides the heading and its detail rows is shown.
     */
    public static boolean isLocateAnswer(String message) {
        boolean sawHeading = false;
        for (String line : message.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (fromLocate(trimmed).isPresent()) {
                sawHeading = true;
            } else if (!trimmed.startsWith(LOCATE_ARROW)) {
                return false;
            }
        }
        return sawHeading;
    }

    /**
     * The location a chat message announces, if it announces one.
     *
     * @param message the message with its formatting already removed
     */
    public static Optional<Location> fromChat(String message) {
        if (DEV.equals(message)) {
            return Optional.of(Location.DEV);
        }
        if (BUILD.equals(message)) {
            return Optional.of(Location.BUILD);
        }
        if (message.startsWith(PLAY)) {
            return Optional.of(Location.PLAY);
        }
        return Optional.empty();
    }

    /** The location an action bar message announces, if it announces one. */
    public static Optional<Location> fromOverlay(String message) {
        return SPAWN_OVERLAY.matcher(message).matches()
            ? Optional.of(Location.SPAWN)
            : Optional.empty();
    }

    /** The name of the game a play message announced, for the screen. */
    public static Optional<String> gameJoined(String message) {
        return message.startsWith(PLAY)
            ? Optional.of(message.substring(PLAY.length()).trim())
            : Optional.empty();
    }
}
