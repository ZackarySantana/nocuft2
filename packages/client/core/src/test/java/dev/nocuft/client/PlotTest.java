package dev.nocuft.client;

import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.plot.Location;
import dev.nocuft.client.plot.ModeMessages;
import dev.nocuft.client.plot.PaidRank;
import dev.nocuft.client.plot.PlotDataMessages;
import dev.nocuft.client.plot.PlotSize;
import dev.nocuft.client.plot.WhoisMessages;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Proves the client knows where it is and how much room a plot has. */
public final class PlotTest {
    private static final List<String> FAILURES = new ArrayList<>();

    private PlotTest() {
    }

    static void run() {
        onlyDevPermitsTouchingCode();
        aModeChangeIsReadFromWhatTheServerSays();
        theSizeIsReadFromWhatPlotDataSays();
        theOwnerAndTheirRankAreReadFromTheListings();
        anUnknownSizeStaysUnknown();
        linesAreLaidOutInAGrid();
        aPlotHoldsWhatItsSizeAllows();

        if (!FAILURES.isEmpty()) {
            throw new AssertionError("Plot checks failed: " + FAILURES);
        }
    }

    private static void check(boolean condition, String description) {
        if (!condition) {
            FAILURES.add(description);
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

    /**
     * DiamondFire allows automation on a plot in build or dev mode and nowhere
     * else, and code only exists in dev.
     */
    private static void onlyDevPermitsTouchingCode() {
        for (Location location : Location.values()) {
            checkEquals(
                location.permitsCodeAccess(),
                location == Location.DEV,
                location + " permits code access"
            );
        }
    }

    private static void aModeChangeIsReadFromWhatTheServerSays() {
        checkEquals(
            ModeMessages.fromChat("» You are now in dev mode."),
            Optional.of(Location.DEV),
            "dev mode is announced in chat"
        );
        checkEquals(
            ModeMessages.fromChat("» You are now in build mode."),
            Optional.of(Location.BUILD),
            "build mode is announced in chat"
        );
        checkEquals(
            ModeMessages.fromChat("» Joined game: Zombie Apocalypse"),
            Optional.of(Location.PLAY),
            "joining a game is announced in chat"
        );
        checkEquals(
            ModeMessages.gameJoined("» Joined game: Zombie Apocalypse"),
            Optional.of("Zombie Apocalypse"),
            "and names the game"
        );
        checkEquals(
            ModeMessages.fromOverlay("⧈ 1234 Tokens  ᛥ 5 Tickets  ⚡ 90 Sparks"),
            Optional.of(Location.SPAWN),
            "spawn is announced on the action bar"
        );
        checkEquals(
            ModeMessages.fromOverlay("⏵⏵ - ⧈ -1 Tokens  ᛥ 0 Tickets  ⚡ 0 Sparks"),
            Optional.of(Location.SPAWN),
            "with a rank prefix and negative amounts"
        );

        // Anything unrecognised leaves the location alone, because acting on a
        // plot this client only thinks it is on is worse than acting on none.
        checkEquals(
            ModeMessages.fromChat("» You are now in dev mode"),
            Optional.empty(),
            "a message that is nearly the announcement is not one"
        );
        checkEquals(
            ModeMessages.fromChat("Player: You are now in dev mode."),
            Optional.empty(),
            "another player saying it is not the server saying it"
        );
        checkEquals(
            ModeMessages.fromOverlay("⧈ lots Tokens  ᛥ 5 Tickets  ⚡ 90 Sparks"),
            Optional.empty(),
            "an action bar that does not match is not spawn"
        );
        checkEquals(ModeMessages.fromChat(""), Optional.empty(), "nothing is not an announcement");

        // "/locate" says where the player already is, which no announcement
        // will: announcements only say where they have just arrived.
        checkEquals(
            ModeMessages.fromLocate(
                "You are currently coding on:\n"
                    + "→ lidtop testing grounds [30000030]\n"
                    + "→ Owner: vellfii [Whitelisted]\n"
                    + "→ Server: Private Node 30"
            ),
            Optional.of(Location.DEV),
            "coding is dev mode"
        );
        checkEquals(
            ModeMessages.fromLocate("You are currently building on:"),
            Optional.of(Location.BUILD),
            "building is build mode"
        );
        checkEquals(
            ModeMessages.fromLocate("You are currently playing on:"),
            Optional.of(Location.PLAY),
            "playing is play mode"
        );
        checkEquals(
            ModeMessages.fromLocate("You are currently at spawn."),
            Optional.of(Location.SPAWN),
            "and spawn is spawn"
        );
        checkEquals(
            ModeMessages.fromLocate("Player: You are currently coding on:"),
            Optional.empty(),
            "a player quoting the answer is not the answer"
        );
        checkEquals(
            ModeMessages.fromLocate("» You are now in dev mode."),
            Optional.empty(),
            "and an announcement is not a locate answer"
        );

        // The client asked, the player did not, so the answer is recognised
        // for hiding, and only when it is the answer and nothing else.
        check(
            ModeMessages.isLocateAnswer(
                "You are currently coding on:\n→ lidtop testing grounds [30000030]"
            ),
            "the answer and its rows may be hidden"
        );
        check(
            !ModeMessages.isLocateAnswer("→ Owner: vellfii [Whitelisted]"),
            "rows without their heading are not the answer"
        );
        check(
            !ModeMessages.isLocateAnswer("You are currently coding on:\nPlayer: hello"),
            "and neither is an answer with anything else mixed in"
        );
    }

    /**
     * "/plot data" answers the size from the server's own record, which is
     * right however little of the plot is loaded.
     */
    private static void theSizeIsReadFromWhatPlotDataSays() {
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Size: 51x51"),
            Optional.of(PlotSize.BASIC),
            "a basic plot is announced by its side"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Size: 101x101"),
            Optional.of(PlotSize.LARGE),
            "and a large one"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Size: 301x301"),
            Optional.of(PlotSize.MASSIVE),
            "and a massive one"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat(
                "Plot Information:\n"
                    + "→ Name: lidtop testing grounds\n"
                    + "→ ID: 30000030\n"
                    + "→ Owner: vellfii\n"
                    + "→ Server: Private Node 30\n"
                    + "→ Whitelisted: Yes\n"
                    + "→ Size: 1001x1001\n"
                    + "→ # of Events: 0"
            ),
            Optional.of(PlotSize.MEGA),
            "the size is found inside the whole listing"
        );

        // An answer that cannot be trusted is still an answer: unknown says to
        // stop waiting, where empty says to keep listening.
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Size: 123x123"),
            Optional.of(PlotSize.UNKNOWN),
            "a side matching no plot answers unknown"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Size: 51x101"),
            Optional.of(PlotSize.UNKNOWN),
            "as does a plot that is not square"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("→ Name: Size: 51x51"),
            Optional.empty(),
            "a row that only contains the words is not the size row"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("Player: Size: 51x51"),
            Optional.empty(),
            "a player quoting the listing is not the listing"
        );
        checkEquals(
            PlotDataMessages.sizeFromChat("» You are now in dev mode."),
            Optional.empty(),
            "and other chat says nothing about size"
        );

        // The client asked for the listing, the player did not, so the rows
        // are recognised for hiding. Anything else is shown: hiding chat that
        // was not asked about is worse than showing chat that was.
        check(PlotDataMessages.isListing("Plot Information:"), "the heading may be hidden");
        check(PlotDataMessages.isListing("→ Size: 1001x1001"), "and each row");
        check(
            PlotDataMessages.isListing(
                "        \nPlot Information:\n\n→ Name: lidtop testing grounds \n→ # of Events: 0 "
            ),
            "and the listing arriving whole, spacer lines and padding included"
        );
        check(!PlotDataMessages.isListing("» You are now in dev mode."), "other chat is shown");
        check(
            !PlotDataMessages.isListing("Player: → Size: 51x51"),
            "a player quoting a row is shown"
        );
        check(
            !PlotDataMessages.isListing("Plot Information:\nPlayer: hello"),
            "as is a listing with anything else mixed in"
        );
        check(!PlotDataMessages.isListing(""), "and an empty message is not the listing");
    }

    /**
     * The owner's paid rank decides which code actions their plot may carry,
     * so the owner is read off the listings and their rank off "/whois".
     */
    private static void theOwnerAndTheirRankAreReadFromTheListings() {
        checkEquals(
            PlotDataMessages.ownerFromChat("→ Owner: vellfii"),
            Optional.of("vellfii"),
            "the plot data listing names the owner"
        );
        checkEquals(
            PlotDataMessages.ownerFromChat("→ Owner: vellfii [Whitelisted]"),
            Optional.of("vellfii"),
            "as does the locate answer, tag and all"
        );
        checkEquals(
            PlotDataMessages.ownerFromChat("Player: Owner: vellfii"),
            Optional.empty(),
            "a player quoting the row is not the row"
        );

        // The profile, as the server writes it: the heading with a trailing
        // space, and the rank tag dressed in ornaments and zero width
        // non-joiners, which is why the name is searched for in the row.
        String profile = "        \nProfile of vellfii \n\n"
            + "→ Ranks: [Admin][SrMod][◆\u200cOverlord\u200c◆]\n"
            + "→ Badges: ⛨ ⭐\n"
            + "→ Joined: Nov 17, 2015";
        checkEquals(
            WhoisMessages.profiled(profile),
            Optional.of("vellfii"),
            "the profile says whose it is"
        );
        checkEquals(
            WhoisMessages.rankFromChat(profile),
            Optional.of(PaidRank.OVERLORD),
            "and the paid rank is found among the staff ranks"
        );
        checkEquals(
            WhoisMessages.rankFromChat("→ Ranks: None"),
            Optional.of(PaidRank.NONE),
            "no ranks reads as none, which is an answer"
        );
        checkEquals(
            WhoisMessages.rankFromChat("→ Ranks: [Admin]"),
            Optional.of(PaidRank.NONE),
            "and staff alone is still none: moderation says nothing about plots"
        );
        checkEquals(
            WhoisMessages.rankFromChat("→ Badges: ⭐"),
            Optional.empty(),
            "a message without the row answers nothing"
        );
        check(WhoisMessages.isProfile(profile), "the whole profile may be hidden");
        check(
            !WhoisMessages.isProfile("Profile of vellfii\nPlayer: hello"),
            "but not with anything else mixed in"
        );

        // The ranks are a ladder, which is what placement checks will lean on.
        check(PaidRank.OVERLORD.covers(PaidRank.NOBLE), "a higher rank covers a lower");
        check(PaidRank.NOBLE.covers(PaidRank.NOBLE), "and itself");
        check(!PaidRank.NONE.covers(PaidRank.NOBLE), "and none covers only none");
        check(PaidRank.MYTHIC.covers(PaidRank.EMPEROR), "the ladder is ordered");
        check(!PaidRank.EMPEROR.covers(PaidRank.MYTHIC), "in one direction");
    }

    private static void anUnknownSizeStaysUnknown() {
        Codespace unknown = new Codespace(0, 0, 50, 19, 49, PlotSize.UNKNOWN);
        checkEquals(unknown.capacity(), Optional.empty(), "an unknown size has no capacity");
        checkEquals(unknown.lineAt(0), Optional.empty(), "and no line has a position");
        check(unknown.positions().isEmpty(), "and nothing is offered to place into");
        checkEquals(PlotSize.of("nonsense"), PlotSize.UNKNOWN, "an unreadable size reads as unknown");
    }

    private static void linesAreLaidOutInAGrid() {
        Codespace plot = new Codespace(100, 200, 50, 19, 49, PlotSize.BASIC);
        Codespace.LinePosition first = plot.lineAt(0).orElseThrow();
        checkEquals(first.x(), 98, "the first line is two west of the origin, clear of the border");
        checkEquals(first.y(), 50, "on the floor");
        checkEquals(first.z(), 200, "at the origin's z");

        Codespace.LinePosition second = plot.lineAt(1).orElseThrow();
        checkEquals(second.x(), 95, "the next is three further west, two columns clear");
        checkEquals(second.y(), 50, "in the same layer");

        int perLayer = plot.linesPerLayer().orElseThrow();
        Codespace.LinePosition wrapped = plot.lineAt(perLayer).orElseThrow();
        checkEquals(wrapped.x(), 98, "a full layer starts again at the first column");
        checkEquals(wrapped.y(), 55, "five blocks higher");

        Codespace dug = new Codespace(100, 200, 5, 19, 49, PlotSize.BASIC);
        checkEquals(dug.lineAt(0).orElseThrow().y(), 5, "a plot whose floor is lower starts lower");
        check(dug.layers() > plot.layers(), "and has room for more layers");
    }

    private static void aPlotHoldsWhatItsSizeAllows() {
        Codespace basic = new Codespace(0, 0, 50, 19, 49, PlotSize.BASIC);
        checkEquals(
            basic.linesPerLayer(), Optional.of(6),
            "a nineteen wide plot holds six lines a layer, with the border kept clear"
        );
        checkEquals(basic.layers(), 42, "and forty two layers above the floor");
        checkEquals(basic.capacity(), Optional.of(252), "which is what it holds");
        checkEquals(basic.positions().size(), 252, "and every one has a position");

        Codespace mega = new Codespace(0, 0, 50, 299, 299, PlotSize.MEGA);
        check(
            mega.capacity().orElseThrow() > basic.capacity().orElseThrow(),
            "a mega plot holds more, because it is wider rather than only longer"
        );

        // Every position is distinct, which is what stops a placement putting
        // two lines in one spot.
        Codespace plot = new Codespace(0, 0, 50, 19, 49, PlotSize.BASIC);
        check(
            plot.positions().stream().distinct().count() == plot.positions().size(),
            "no two lines are laid out in the same place"
        );
    }
}
