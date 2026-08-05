package dev.nocuft.client.mod.ui;

import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.mod.NocuftClient;
import dev.nocuft.client.mod.plot.PlotReader;
import dev.nocuft.client.plan.Bundle;
import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.plot.Location;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.EditBox;
import net.minecraft.client.gui.components.Tooltip;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.input.MouseButtonEvent;
import net.minecraft.network.chat.Component;

/**
 * What this plot is carrying, and what could be applied to it.
 *
 * <p>Only what the client actually knows is shown. Nocuft is the source of
 * truth for what a project builds to, so with nothing attached this screen
 * says that rather than showing a build nothing can vouch for.
 *
 * <p>Two columns, both starting at the same place on every row. Aligning a
 * column against its own row's contents leaves it beginning somewhere
 * different on each line, and down a column is the only way anyone reads this.
 */
public final class NocuftScreen extends Screen {
    private static final int TITLE = 0xFFFFFFFF;
    private static final int ATTACHMENT = 0xFFD9C27F;
    private static final int SECTION = 0xFF7A7A7A;
    private static final int GROUP = 0xFF8FA8C8;
    private static final int NAME = 0xFFE6E6E6;
    private static final int DETAIL = 0xFF9A9A9A;
    private static final int APPLIED = 0xFF7FBF7F;
    private static final int OUTDATED = 0xFFD9A05B;
    private static final int PANEL = 0xB0101014;
    private static final int RULE = 0x30FFFFFF;

    private static final int PANEL_WIDTH = 480;
    private static final int PADDING = 12;
    private static final int INDENT = 10;
    private static final int COLUMN_GAP = 12;

    /**
     * Room kept for the tick and for the open marker.
     *
     * <p>Fixed rather than measured, because a tick and an empty box are not
     * the same width in this font and neither are a plus and a minus, so
     * writing them into the line moves everything after them when one is
     * clicked.
     */
    private static final int TICK_WIDTH = 16;
    private static final int MARKER_WIDTH = 10;

    /** Builds the reader has chosen. Nothing is chosen to begin with. */
    private final Set<String> chosen = new HashSet<>();

    /** Builds the reader has opened. Everything starts closed. */
    private final Set<String> expanded = new HashSet<>();

    /**
     * Namespaces the reader has folded. Everything starts open, because a
     * namespace exists to hold its builds and hiding them by default would leave
     * the list looking empty the first time it is opened.
     */
    private final Set<String> collapsedNamespaces = new HashSet<>();

    /** Builds that cannot be ticked while what is ticked stays ticked. */
    private final Set<String> blocked = new HashSet<>();

    /** Narrows the list to builds whose name contains this. */
    private String filter = "";

    /**
     * Whether the plot's own record has been folded into the selection yet.
     *
     * <p>Once, and only once the manifest has been read, which happens after
     * the screen opens. Doing it again would undo every tick the reader had
     * changed since.
     */
    private boolean primed;

    private EditBox search;
    private int scroll;
    private int rowHeight;
    private int panelLeft;
    private int panelRight;
    private int panelBottom;
    private int statusTop;
    private int headingTop;
    private int searchTop;
    private int listTop;
    private int listBottom;

    private enum Kind {
        /** A heading over a group of rows. */
        SECTION,
        /** The namespace a set of builds share. */
        NAMESPACE,
        /** What the columns below it hold. */
        COLUMNS,
        PROJECT,
        UNIT,
        NOTE,
        SPACER
    }

    /**
     * One line of the list. A project row carries the project it opens; a
     * namespace row carries the namespace it folds. Every other row carries none
     * and is not clickable.
     */
    private record Row(Kind kind, String left, String right, String project) {
        static Row of(Kind kind, String left, String right) {
            return new Row(kind, left, right, null);
        }
    }

    public NocuftScreen() {
        super(Component.literal("Nocuft"));
    }

    @Override
    protected void init() {
        rowHeight = font.lineHeight + 3;
        int panel = Math.min(PANEL_WIDTH, width - 2 * PADDING);
        panelLeft = (width - panel) / 2;
        panelRight = panelLeft + panel;
        boolean attached = NocuftClient.connections() > 0;

        statusTop = 24 + rowHeight + 8;
        headingTop = statusTop + rowHeight + 4;
        searchTop = headingTop + rowHeight + 2;
        listTop = attached ? searchTop + 16 : headingTop + rowHeight;
        panelBottom = height - 34;
        listBottom = Math.max(listTop + rowHeight, panelBottom - rowHeight);

        search = new EditBox(
            font,
            panelLeft + PADDING,
            searchTop,
            panelRight - panelLeft - PADDING * 2,
            14,
            Component.literal("Search builds")
        );
        search.setHint(Component.literal("search builds"));
        search.setMaxLength(64);
        search.setResponder(text -> {
            filter = text.trim().toLowerCase(Locale.ROOT);
            scroll = 0;
        });
        search.setValue(filter);
        if (attached) {
            addRenderableWidget(search);
            setInitialFocus(search);
        } else {
            filter = "";
        }

        int buttonWidth = 96;
        int gap = 4;
        // What applying does is said on the button rather than written under
        // the list. It is one sentence, it only matters at the moment of
        // pressing, and the list is what the screen is for.
        addRenderableWidget(Button.builder(Component.literal("Apply"), button -> apply())
            .bounds(width / 2 - buttonWidth - gap / 2, height - 26, buttonWidth, 20)
            .tooltip(Tooltip.create(Component.literal(
                "Clears this codespace and places what is ticked."
            )))
            .build());
        addRenderableWidget(Button.builder(Component.translatable("gui.done"), button -> onClose())
            .bounds(width / 2 + gap / 2, height - 26, buttonWidth, 20)
            .build());

        NocuftClient.rereadPlot();
    }

    /** Every build under a namespace, in the order they are listed. */
    private List<Bundle> buildsIn(String namespace) {
        List<Bundle> builds = new ArrayList<>();
        for (Bundle bundle : NocuftClient.held()) {
            if (namespaceOf(bundle.module()).equals(namespace)) {
                builds.add(bundle);
            }
        }
        return builds;
    }

    /** Whether every build under a namespace is ticked. */
    private boolean namespaceChosen(String namespace) {
        List<Bundle> builds = buildsIn(namespace);
        if (builds.isEmpty()) {
            return false;
        }
        for (Bundle bundle : builds) {
            if (!chosen.contains(bundle.projectId())) {
                return false;
            }
        }
        return true;
    }

    /**
     * Whether a namespace cannot be taken whole.
     *
     * <p>Either two of its builds want the same line, or one of them wants a
     * line something already ticked elsewhere wants. Ticking a namespace is an
     * offer to apply all of it, so it is not offered when all of it cannot go.
     */
    private boolean namespaceBlocked(String namespace) {
        return namespaceRefusal(namespace).isPresent();
    }

    /**
     * Why a namespace cannot be taken whole, in the few words a tooltip has.
     *
     * <p>The two reasons are separated because they are answered differently:
     * a line taken elsewhere is freed by unticking what took it, and a line
     * two of these builds both want cannot be freed at all.
     */
    private Optional<String> namespaceRefusal(String namespace) {
        if (namespaceChosen(namespace)) {
            return Optional.empty();
        }
        Set<String> elsewhere = new HashSet<>();
        for (Bundle bundle : NocuftClient.held()) {
            if (chosen.contains(bundle.projectId())
                && !namespaceOf(bundle.module()).equals(namespace)) {
                elsewhere.addAll(claimedLines(bundle));
            }
        }
        Set<String> within = new HashSet<>();
        for (Bundle bundle : buildsIn(namespace)) {
            List<String> lines = new ArrayList<>(claimedLines(bundle));
            lines.sort(null);
            for (String line : lines) {
                if (elsewhere.contains(line)) {
                    return Optional.of(taken(line));
                }
                if (!within.add(line)) {
                    return Optional.of("Two builds here want " + line + ".");
                }
            }
        }
        return Optional.empty();
    }

    /** The one line said on hover about a clash, wherever it is found. */
    private static String taken(String line) {
        return line + " is already taken.";
    }

    /**
     * The part of a build's module it shares with its siblings.
     *
     * <p>The module, not the project id. A project is identified by a UUID
     * committed with it, which is what makes a plot recognise it across a
     * rename and across machines, and which says nothing anyone would want to
     * read. Everything shown here reads the module instead.
     */
    private static String namespaceOf(String module) {
        int lastDot = module.lastIndexOf('.');
        return lastDot <= 0 ? "" : module.substring(0, lastDot);
    }

    /** What is left of a build's module once its namespace is taken off. */
    private static String shortNameOf(String module) {
        int lastDot = module.lastIndexOf('.');
        return lastDot <= 0 ? module : module.substring(lastDot + 1);
    }

    /**
     * The code lines a build claims on a plot.
     *
     * <p>Every one of them: a plot carries one Join event rather than one per
     * build, and one function of a given name rather than one per build.
     */
    private static Set<String> claimedLines(Bundle bundle) {
        Set<String> lines = new HashSet<>();
        for (Bundle.Unit unit : bundle.units()) {
            lines.add(unit.headerKey());
        }
        return lines;
    }

    private Set<String> claimedNames() {
        Set<String> claimed = new HashSet<>();
        for (Bundle bundle : NocuftClient.held()) {
            if (chosen.contains(bundle.projectId())) {
                claimed.addAll(claimedLines(bundle));
            }
        }
        return claimed;
    }

    /**
     * The first line two builds both want, for saying which it is.
     *
     * <p>Never for a build that is ticked: its lines are in the claimed set
     * because it claimed them, so asking would have it clash with itself.
     */
    private Optional<String> firstClash(Bundle bundle, Set<String> claimed) {
        if (chosen.contains(bundle.projectId())) {
            return Optional.empty();
        }
        List<String> lines = new ArrayList<>(claimedLines(bundle));
        lines.sort(null);
        for (String line : lines) {
            if (claimed.contains(line)) {
                return Optional.of(line);
            }
        }
        return Optional.empty();
    }

    private List<Row> rows(boolean everything) {
        List<Row> rows = new ArrayList<>();
        if (NocuftClient.connections() == 0) {
            rows.add(Row.of(Kind.NOTE, "Nocuft is not running. Run nocuft gui", ""));
            return rows;
        }

        // Grouped by the name a set of builds share, because a list of a
        // dozen that all begin the same way reads as one undifferentiated
        // block. The search still matches the whole name, so filtering by a
        // namespace and filtering by a build are the same act.
        Map<String, List<Bundle>> byNamespace = new LinkedHashMap<>();
        for (Bundle bundle : NocuftClient.held()) {
            if (!filter.isEmpty()
                && !bundle.module().toLowerCase(Locale.ROOT).contains(filter)) {
                continue;
            }
            byNamespace
                .computeIfAbsent(namespaceOf(bundle.module()), key -> new ArrayList<>())
                .add(bundle);
        }

        if (NocuftClient.held().isEmpty()) {
            rows.add(Row.of(Kind.NOTE, "Nocuft is attached but has sent no build yet.", ""));
        } else if (byNamespace.isEmpty()) {
            rows.add(Row.of(Kind.NOTE, "No build matches that.", ""));
        }

        for (Map.Entry<String, List<Bundle>> group : byNamespace.entrySet()) {
            String namespace = group.getKey();
            boolean namespaceOpen = namespace.isEmpty()
                || everything
                || !collapsedNamespaces.contains(namespace);
            if (!namespace.isEmpty()) {
                int builds = group.getValue().size();
                rows.add(new Row(
                    Kind.NAMESPACE,
                    namespace,
                    // How many builds hide under a folded namespace, so folding
                    // one does not leave only a name and no sense of size.
                    namespaceOpen
                        ? ""
                        : builds + (builds == 1 ? " build" : " builds"),
                    namespace
                ));
            }
            if (!namespaceOpen) {
                rows.add(Row.of(Kind.SPACER, "", ""));
                continue;
            }
            for (Bundle bundle : group.getValue()) {
                boolean open = everything || expanded.contains(bundle.projectId());
                int lines = bundle.units().size();
                // What the plot is carrying, when it is carrying this, and
                // otherwise how big the build is. That is the question the
                // list exists to answer, and it does not change under the
                // pointer the way a clash would.
                NocuftClient.Applied applied = NocuftClient.appliedState(bundle);
                rows.add(new Row(
                    Kind.PROJECT,
                    shortNameOf(bundle.module()),
                    switch (applied) {
                        case CURRENT -> "applied";
                        case OUTDATED -> "outdated";
                        case NO -> lines + (lines == 1 ? " line" : " lines");
                    },
                    bundle.projectId()
                ));
                if (!open) {
                    continue;
                }
                rows.add(Row.of(Kind.COLUMNS, "LINE", "KIND"));
                for (Bundle.Unit unit : bundle.units()) {
                    rows.add(Row.of(
                        Kind.UNIT,
                        unit.label().orElse(unit.name()),
                        unit.kind().replace('_', ' ')
                    ));
                }
            }
            rows.add(Row.of(Kind.SPACER, "", ""));
        }
        return rows;
    }

    /**
     * One line about the plot: what it is on the left, what it carries on the
     * right.
     *
     * <p>One line, above the list rather than under it. What a plot is holding
     * is the context the list is read in, and a paragraph of it below the
     * builds was read last and mattered first.
     */
    private record Status(String left, String right, int color) {}

    private Status status() {
        Location location = NocuftClient.location();
        if (!location.permitsCodeAccess()) {
            return new Status(describe(location), "", DETAIL);
        }
        Optional<Codespace> space = NocuftClient.codespace();
        if (space.isEmpty()) {
            return new Status("Codespace not found", "see the log", OUTDATED);
        }

        Optional<PlotReader.Reading> read = NocuftClient.plotReading();
        int lines = read.map(reading -> reading.lines().size()).orElse(0);
        String left = space.get().size().wire() + " plot"
            + read.map(ignored -> ", " + lines + (lines == 1 ? " line" : " lines")).orElse("");

        // Amber for code this client did not put here, because applying is
        // about to destroy it and that is the only warning there is.
        Optional<PlotManifest> manifest = NocuftClient.plotManifest();
        if (manifest.isPresent()) {
            return new Status(
                left,
                "applied by " + manifest.get().appliedBy().name(),
                APPLIED
            );
        }
        if (read.isEmpty()) {
            return new Status(left, "not read", DETAIL);
        }
        return lines == 0
            ? new Status(left, "empty", DETAIL)
            : new Status(left, "not applied by Nocuft", OUTDATED);
    }

    @Override
    public void extractRenderState(
        GuiGraphicsExtractor context,
        int mouseX,
        int mouseY,
        float delta
    ) {
        super.extractRenderState(context, mouseX, mouseY, delta);

        // What the plot already carries starts ticked, because applying makes
        // the plot exactly what is ticked. Without this, applying one build
        // silently takes off every other build already there, which is a thing
        // nobody would mean by ticking one box.
        if (!primed && NocuftClient.plotManifest().isPresent()) {
            primed = true;
            for (Bundle bundle : NocuftClient.held()) {
                if (NocuftClient.appliedState(bundle) != NocuftClient.Applied.NO) {
                    chosen.add(bundle.projectId());
                }
            }
        }

        Set<String> claimed = claimedNames();
        blocked.clear();
        for (Bundle bundle : NocuftClient.held()) {
            if (!chosen.contains(bundle.projectId())
                && firstClash(bundle, claimed).isPresent()) {
                blocked.add(bundle.projectId());
            }
        }

        List<Row> rows = rows(false);
        int visible = Math.max(1, (listBottom - listTop) / rowHeight);
        int maxScroll = Math.max(0, rows.size() - visible);
        scroll = Math.min(scroll, maxScroll);

        context.fill(panelLeft, 16, panelRight, panelBottom, PANEL);

        // One line: what this is in the middle, which version it is out of
        // the way on the left, and whether it can do anything on the right.
        int centre = (panelLeft + panelRight) / 2;
        context.text(
            font, Component.literal("v" + NocuftClient.VERSION), panelLeft + PADDING, 24, SECTION
        );
        context.centeredText(
            font, Component.literal("Nocuft"), centre, 24, TITLE
        );
        String attachment = NocuftClient.connections() > 0 ? "attached" : "not attached";
        context.text(
            font,
            Component.literal(attachment),
            panelRight - PADDING - font.width(attachment),
            24,
            ATTACHMENT
        );
        context.fill(
            panelLeft + PADDING, statusTop - 6, panelRight - PADDING, statusTop - 5, RULE
        );
        Status status = status();
        context.text(
            font, Component.literal(status.left()), panelLeft + PADDING, statusTop, DETAIL
        );
        context.text(
            font,
            Component.literal(status.right()),
            panelRight - PADDING - font.width(status.right()),
            statusTop,
            status.color()
        );
        if (NocuftClient.connections() > 0) {
            context.centeredText(
                font, Component.literal("BUILDS"), centre, headingTop, SECTION
            );
        }

        // Measured over every row there could be, not every row on screen, so
        // opening a build does not move the column of the ones around it.
        int widest = 0;
        for (Row row : rows(true)) {
            widest = Math.max(widest, font.width(row.right()));
        }
        int detailColumn = panelRight - PADDING - widest;

        context.enableScissor(panelLeft, listTop, panelRight, listBottom);
        int y = listTop;
        for (int index = scroll; index < rows.size() && y < listBottom; index += 1) {
            drawRow(context, rows.get(index), y, detailColumn, widest);
            y += rowHeight;
        }
        context.disableScissor();

        // Why a row cannot be taken, said where it is refused rather than only
        // when it is pressed.
        hovered(rows, mouseX, mouseY)
            .flatMap(this::refusal)
            .ifPresent(reason -> context.setTooltipForNextFrame(
                font, Component.literal(reason), mouseX, mouseY
            ));

        if (maxScroll > 0) {
            context.centeredText(
                font, Component.literal("scroll for more"), centre, listBottom + 2, SECTION
            );
        }
    }

    private void drawRow(
        GuiGraphicsExtractor context,
        Row row,
        int y,
        int detailColumn,
        int widest
    ) {
        int left = panelLeft + PADDING;
        switch (row.kind()) {
            case SPACER -> { }
            case SECTION -> context.centeredText(
                font, Component.literal(row.left()), (panelLeft + panelRight) / 2, y, SECTION
            );
            case NAMESPACE -> {
                boolean whole = namespaceChosen(row.project());
                boolean cannot = namespaceBlocked(row.project());
                boolean open = !collapsedNamespaces.contains(row.project());
                // An empty box even when the namespace cannot be taken whole:
                // the greyed name and the hover already say so, and a third
                // glyph in the box reads as a third kind of tick.
                context.text(
                    font,
                    Component.literal(whole ? "[x]" : "[ ]"),
                    left,
                    y,
                    whole ? GROUP : SECTION
                );
                context.text(
                    font,
                    Component.literal(open ? "-" : "+"),
                    left + TICK_WIDTH,
                    y,
                    SECTION
                );
                draw(
                    context, row, y, left + TICK_WIDTH + MARKER_WIDTH,
                    detailColumn, cannot ? SECTION : GROUP, DETAIL
                );
            }
            case NOTE -> {
                context.text(
                    font, Component.literal(row.left()), left + INDENT, y, DETAIL
                );
                context.text(
                    font, Component.literal(row.right()), detailColumn, y, DETAIL
                );
            }
            case COLUMNS -> {
                int nameLeft = left + INDENT * 2 + TICK_WIDTH + MARKER_WIDTH;
                drawCentred(
                    context, row.left(), nameLeft, detailColumn - COLUMN_GAP - nameLeft, y
                );
                drawCentred(context, row.right(), detailColumn, widest, y);
            }
            case PROJECT -> {
                boolean ticked = chosen.contains(row.project());
                boolean dim = blocked.contains(row.project());
                int tickLeft = left + INDENT;
                context.text(
                    font,
                    Component.literal(ticked ? "[x]" : "[ ]"),
                    tickLeft,
                    y,
                    ticked ? TITLE : SECTION
                );
                context.text(
                    font,
                    Component.literal(expanded.contains(row.project()) ? "-" : "+"),
                    tickLeft + TICK_WIDTH,
                    y,
                    SECTION
                );
                draw(
                    context, row, y, tickLeft + TICK_WIDTH + MARKER_WIDTH,
                    detailColumn, dim ? SECTION : TITLE, appliedColor(row.project())
                );
            }
            case UNIT -> draw(
                context, row, y, left + INDENT * 2 + TICK_WIDTH + MARKER_WIDTH,
                detailColumn, NAME, DETAIL
            );
        }
    }

    /** Why this row is greyed out, if it is. */
    private Optional<String> refusal(Row row) {
        if (row.project() == null) {
            return Optional.empty();
        }
        if (row.kind() == Kind.NAMESPACE) {
            return namespaceRefusal(row.project());
        }
        if (row.kind() != Kind.PROJECT) {
            return Optional.empty();
        }
        for (Bundle bundle : NocuftClient.held()) {
            if (bundle.projectId().equals(row.project())) {
                return firstClash(bundle, claimedNames()).map(NocuftScreen::taken);
            }
        }
        return Optional.empty();
    }

    /** The row the mouse is over, when it is over the list at all. */
    private Optional<Row> hovered(List<Row> rows, int mouseX, int mouseY) {
        if (mouseY < listTop || mouseY >= listBottom
            || mouseX < panelLeft || mouseX >= panelRight) {
            return Optional.empty();
        }
        int index = scroll + (mouseY - listTop) / rowHeight;
        return index >= 0 && index < rows.size()
            ? Optional.of(rows.get(index))
            : Optional.empty();
    }

    private void drawCentred(
        GuiGraphicsExtractor context,
        String text,
        int columnLeft,
        int width,
        int y
    ) {
        context.text(
            font,
            Component.literal(text),
            columnLeft + Math.max(0, (width - font.width(text)) / 2),
            y,
            SECTION
        );
    }

    /** The build this row is about, when the client still holds it. */
    private Optional<Bundle> bundleOf(String projectId) {
        for (Bundle bundle : NocuftClient.held()) {
            if (bundle.projectId().equals(projectId)) {
                return Optional.of(bundle);
            }
        }
        return Optional.empty();
    }

    /** What colour says about a build being on the plot, or not being. */
    private int appliedColor(String projectId) {
        return bundleOf(projectId)
            .map(NocuftClient::appliedState)
            .map(state -> switch (state) {
                case CURRENT -> APPLIED;
                case OUTDATED -> OUTDATED;
                case NO -> DETAIL;
            })
            .orElse(DETAIL);
    }

    private void draw(
        GuiGraphicsExtractor context,
        Row row,
        int y,
        int nameLeft,
        int detailColumn,
        int nameColor,
        int detailColor
    ) {
        // Trimmed rather than allowed to run into the column beside it, which
        // is what makes the list readable.
        int room = Math.max(16, detailColumn - COLUMN_GAP - nameLeft);
        context.text(
            font,
            Component.literal(font.plainSubstrByWidth(row.left(), room)),
            nameLeft,
            y,
            nameColor
        );
        context.text(
            font, Component.literal(row.right()), detailColumn, y, detailColor
        );
    }

    private static String describe(Location location) {
        return switch (location) {
            case DEV -> "In dev mode.";
            case BUILD -> "In build mode.";
            case PLAY -> "In someone's game.";
            case SPAWN -> "At spawn.";
            case DISCONNECTED -> "Not connected to DiamondFire.";
            case UNKNOWN -> "Not on DiamondFire, or not told where yet.";
        };
    }

    /** Takes or leaves every build under a namespace at once. */
    private void toggleNamespace(String namespace) {
        if (namespaceChosen(namespace)) {
            for (Bundle bundle : buildsIn(namespace)) {
                chosen.remove(bundle.projectId());
            }
            return;
        }
        if (namespaceBlocked(namespace)) {
            return;
        }
        for (Bundle bundle : buildsIn(namespace)) {
            chosen.add(bundle.projectId());
        }
    }

    /** Applies what is ticked, and closes. */
    private void apply() {
        if (NocuftClient.applySelection(chosen) > 0) {
            onClose();
        }
    }

    @Override
    public boolean mouseClicked(MouseButtonEvent click, boolean doubled) {
        double mouseX = click.x();
        double mouseY = click.y();
        if (click.button() == 0 && mouseY >= listTop && mouseY < listBottom
            && mouseX >= panelLeft && mouseX < panelRight) {
            int index = scroll + (int) ((mouseY - listTop) / rowHeight);
            List<Row> rows = rows(false);
            if (index >= 0 && index < rows.size()) {
                Row row = rows.get(index);
                if (row.kind() == Kind.NAMESPACE && row.project() != null) {
                    // The tick and the name are separate targets: one decides
                    // whether every build under the namespace is applied, the
                    // other whether those builds are shown.
                    if (mouseX < panelLeft + PADDING + TICK_WIDTH) {
                        toggleNamespace(row.project());
                    } else if (!collapsedNamespaces.remove(row.project())) {
                        collapsedNamespaces.add(row.project());
                    }
                    return true;
                }
                if (row.kind() == Kind.PROJECT && row.project() != null) {
                    int tickLeft = panelLeft + PADDING + INDENT;
                    // The tick and the name are separate targets: one decides
                    // whether the build is applied, the other whether its
                    // lines are shown.
                    if (mouseX < tickLeft + TICK_WIDTH) {
                        if (!chosen.remove(row.project()) && !blocked.contains(row.project())) {
                            chosen.add(row.project());
                        }
                    } else if (!expanded.remove(row.project())) {
                        expanded.add(row.project());
                    }
                    return true;
                }
            }
        }
        return super.mouseClicked(click, doubled);
    }

    @Override
    public boolean mouseScrolled(double mouseX, double mouseY, double horizontal, double vertical) {
        scroll = Math.max(0, scroll - (int) Math.signum(vertical));
        return true;
    }

    @Override
    public boolean isPauseScreen() {
        return false;
    }
}
