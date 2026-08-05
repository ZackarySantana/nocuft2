package dev.nocuft.client.plot;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reads what "/plot data" says about the plot the player is standing on.
 *
 * <p>The size of a plot decides how much code it holds, and measuring it off
 * the world fails exactly when it matters most: a plot big enough that its far
 * border sits in chunks the server never sent. The command answers from the
 * server's own record, so it is right however large the plot is and however
 * little of it is loaded.
 *
 * <p>Like {@link ModeMessages}, every string this depends on is named here,
 * one predicate each, so a wording change on the server is one edit in one
 * file and can be checked without a game. A message this does not recognise
 * answers nothing rather than something guessed.
 */
public final class PlotDataMessages {
    /**
     * The size line of the plot information listing, formatting stripped.
     *
     * <p>An arrow and the word, because that is how DiamondFire writes each
     * row. The leading match is symbols only: a line where anything wordlike
     * comes first is some player quoting the listing, not the listing.
     */
    private static final Pattern SIZE = Pattern.compile("^\\W*Size:\\s*(\\d{1,5})x(\\d{1,5})$");

    /**
     * The owner row, which both this listing and the "/locate" answer carry.
     *
     * <p>The name is a Minecraft username, so it is matched as one: letters,
     * digits, and underscores, up to sixteen. What may follow it, like the
     * whitelisted tag "/locate" appends, is allowed and ignored.
     */
    private static final Pattern OWNER = Pattern.compile(
        "^\\W*Owner:\\s*(\\w{1,16})(?:\\s+\\[.*\\])?$"
    );

    /** The heading the listing opens with. */
    private static final String HEADING = "Plot Information:";

    /**
     * The arrow every row of the listing is written behind.
     *
     * <p>U+2192, taken from the bytes the server actually sends. The chat font
     * draws it fancier than it is, so it is easy to transcribe wrongly from a
     * screenshot, and a wrong glyph here fails soft into showing every row.
     */
    private static final String ARROW = "→";

    private PlotDataMessages() {
    }

    /**
     * The plot owner a message names, if it names one.
     *
     * <p>Needed because the owner's paid rank, not the visitor's, is what
     * decides which code actions the plot may carry, so the owner is who
     * "/whois" is then asked about.
     */
    public static Optional<String> ownerFromChat(String message) {
        for (String line : message.split("\n")) {
            Matcher matcher = OWNER.matcher(line.trim());
            if (matcher.matches()) {
                return Optional.of(matcher.group(1));
            }
        }
        return Optional.empty();
    }

    /**
     * Whether a message is part of the plot data listing and nothing else.
     *
     * <p>The client asks for the listing itself, on every entry into dev mode,
     * so showing it every time is clutter the player never asked for. This
     * says which messages may be hidden on that account. It fails soft in the
     * showing direction: a message carrying anything besides listing rows is
     * not the listing, because hiding chat that was not asked about is worse
     * than showing chat that was.
     */
    public static boolean isListing(String message) {
        boolean sawRow = false;
        for (String line : message.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (!trimmed.equals(HEADING) && !trimmed.startsWith(ARROW)) {
                return false;
            }
            sawRow = true;
        }
        return sawRow;
    }

    /**
     * The plot size a chat message announces, if it announces one.
     *
     * <p>Empty when the message says nothing about size. {@link
     * PlotSize#UNKNOWN} when it does and the dimensions match no plot this
     * client knows: that is an answer, and the caller should stop waiting for
     * a better one rather than act on a guess.
     *
     * @param message the message with its formatting already removed; the
     *     listing may arrive as one message or one row at a time, so every
     *     line of it is tried
     */
    public static Optional<PlotSize> sizeFromChat(String message) {
        for (String line : message.split("\n")) {
            Matcher matcher = SIZE.matcher(line.trim());
            if (!matcher.matches()) {
                continue;
            }
            int width = Integer.parseInt(matcher.group(1));
            int length = Integer.parseInt(matcher.group(2));
            return Optional.of(width == length ? PlotSize.ofPlotSide(width) : PlotSize.UNKNOWN);
        }
        return Optional.empty();
    }
}
