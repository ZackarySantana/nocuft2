package dev.nocuft.client.plot;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reads what "/whois" says about a player.
 *
 * <p>Asked about a plot's owner, because the owner's paid rank is what decides
 * which code actions the plot may carry. Like the other server listings, every
 * string this depends on is named here so a wording change is one edit in one
 * file, and a message this does not recognise answers nothing.
 */
public final class WhoisMessages {
    /** The heading the profile opens with, before the player's name. */
    private static final String HEADING = "Profile of ";

    /** The arrow every detail row is written behind. */
    private static final String ARROW = "→";

    /**
     * The row the ranks are on. Matched to the row and searched from there:
     * the server dresses a rank tag in brackets, ornaments, and invisible
     * joining characters, so the name is looked for inside the row rather
     * than the tag being reconstructed around it.
     */
    private static final Pattern RANKS = Pattern.compile("^\\W*Ranks:\\s*(.*)$");

    /** Paid ranks highest first, so the first found is the one held. */
    private static final PaidRank[] LADDER = {
        PaidRank.OVERLORD, PaidRank.MYTHIC, PaidRank.EMPEROR, PaidRank.NOBLE
    };

    private WhoisMessages() {
    }

    /**
     * Whose profile a message is, if it is one.
     *
     * <p>The name and not just a yes, because the answer is only believed when
     * it is about the player that was asked about: anyone can be whois'd at
     * any time, including by the player themselves.
     */
    public static Optional<String> profiled(String message) {
        for (String line : message.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.startsWith(HEADING)) {
                String name = trimmed.substring(HEADING.length()).trim();
                if (!name.isEmpty()) {
                    return Optional.of(name);
                }
            }
        }
        return Optional.empty();
    }

    /**
     * The highest paid rank a profile shows, if the message carries the row.
     *
     * <p>{@link PaidRank#NONE} when the row is there and no paid rank is on
     * it, which covers both "None" and a staff member with no paid rank:
     * moderation ranks say nothing about what a plot may carry.
     */
    public static Optional<PaidRank> rankFromChat(String message) {
        for (String line : message.split("\n")) {
            Matcher matcher = RANKS.matcher(line.trim());
            if (!matcher.matches()) {
                continue;
            }
            String row = matcher.group(1);
            for (PaidRank rank : LADDER) {
                if (row.toLowerCase(java.util.Locale.ROOT).contains(rank.wire())) {
                    return Optional.of(rank);
                }
            }
            return Optional.of(PaidRank.NONE);
        }
        return Optional.empty();
    }

    /**
     * Whether a message is a "/whois" profile and nothing else.
     *
     * <p>For hiding, when the client asked and the player did not. Fails soft
     * in the showing direction like every other listing: a message carrying
     * anything besides the heading and its rows is shown.
     */
    public static boolean isProfile(String message) {
        boolean sawHeading = false;
        for (String line : message.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (trimmed.startsWith(HEADING)) {
                sawHeading = true;
            } else if (!trimmed.startsWith(ARROW)) {
                return false;
            }
        }
        return sawHeading;
    }
}
