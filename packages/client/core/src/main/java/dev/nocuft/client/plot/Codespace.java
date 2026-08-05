package dev.nocuft.client.plot;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Where code lines sit in a plot, and how many will fit.
 *
 * <p>A codespace is a grid: lines run west from the plot origin two blocks
 * apart, stacked in layers five blocks high, each line running south for as
 * far as the plot is long. None of that is published by DiamondFire, so the
 * origin and the height of the first layer are measured off the plot rather
 * than assumed, and only the spacing between lines and layers is carried as a
 * constant. It is kept here, apart from anything that touches the game, so it
 * can be checked and corrected in one place.
 *
 * <p>The size cannot always be worked out, and an unknown size stays unknown.
 * Guessing it produces a capacity that is wrong in the one direction that
 * matters: a placement that believes it has room and does not.
 *
 * @param width blocks of codespace across, measured between its edges
 * @param length blocks of codespace down, measured between its edges
 */
public record Codespace(
    int originX,
    int originZ,
    int lineY,
    int width,
    int length,
    PlotSize size
) {
    /**
     * Blocks between the start of one line and the start of the next.
     *
     * <p>Three, measured on a plot: a line, then two empty columns, then the
     * next line. Two was taken from another client and is wrong; DiamondFire
     * refuses a template placed a column too close with nothing to say about
     * why beyond calling it invalid.
     */
    public static final int LINE_SPACING = 3;

    /** A layer is five blocks high. */
    public static final int LAYER_HEIGHT = 5;

    /**
     * Blocks between the origin and the first line, measured across the
     * direction lines run.
     *
     * <p>Two rather than one: flush against the border put the code hard
     * against the build area beside it, so every line now starts one block
     * further in. The whole grid moves together, which is why this is named
     * here and not added at a call site.
     */
    public static final int EDGE_CLEARANCE = 2;

    /** The world stops here, which is what bounds the layers. */
    public static final int MAX_Y = 255;

    /** One code line's starting block. */
    public record LinePosition(int x, int y, int z) {}

    /**
     * Lines that fit side by side in one layer.
     *
     * <p>Counted from the measured width rather than from what the size is
     * supposed to be, because the width is known exactly and the size is
     * matched to it with room to spare.
     */
    public Optional<Integer> linesPerLayer() {
        if (size == PlotSize.UNKNOWN || width < EDGE_CLEARANCE) {
            return Optional.empty();
        }
        return Optional.of((width - EDGE_CLEARANCE) / LINE_SPACING + 1);
    }

    /** Layers this plot has room for above its first. */
    public int layers() {
        return Math.max(0, (MAX_Y - lineY) / LAYER_HEIGHT + 1);
    }

    /** How many code lines this plot holds, when that is knowable. */
    public Optional<Integer> capacity() {
        return linesPerLayer().map(perLayer -> perLayer * layers());
    }

    /**
     * Where the nth line starts, counting from the origin outward.
     *
     * <p>Empty when the size is unknown, because the count per layer is what
     * decides when to start another, or when the plot has no room for it.
     */
    public Optional<LinePosition> lineAt(int index) {
        if (index < 0) {
            return Optional.empty();
        }
        Optional<Integer> perLayer = linesPerLayer();
        if (perLayer.isEmpty() || perLayer.get() == 0) {
            return Optional.empty();
        }
        int layer = index / perLayer.get();
        if (layer >= layers()) {
            return Optional.empty();
        }
        int within = index % perLayer.get();
        return Optional.of(new LinePosition(
            originX - EDGE_CLEARANCE - within * LINE_SPACING,
            lineY + layer * LAYER_HEIGHT,
            originZ
        ));
    }

    /** Every position a line could start at, in the order they are filled. */
    public List<LinePosition> positions() {
        List<LinePosition> positions = new ArrayList<>();
        int total = capacity().orElse(0);
        for (int index = 0; index < total; index += 1) {
            lineAt(index).ifPresent(positions::add);
        }
        return List.copyOf(positions);
    }
}
