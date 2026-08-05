package dev.nocuft.client.plot;

import java.util.Optional;

/**
 * How large a plot is, which is what decides how much code it holds.
 *
 * <p>{@link #UNKNOWN} is a real answer and not a placeholder. DiamondFire does
 * not tell a client the size, so it is worked out from the world, and that can
 * fail: chunks may not be loaded, or the plot may be laid out in a way this
 * does not recognise. Answering unknown costs a refusal; guessing costs a
 * placement that believed it had room.
 */
public enum PlotSize {
    /** 50 blocks of code, twenty wide. */
    BASIC("basic", 50, 20, 51),
    LARGE("large", 100, 20, 101),
    MASSIVE("massive", 300, 20, 301),
    /** Wide as well as long, so its codespace is far larger than the rest. */
    MEGA("mega", 300, 300, 1001),
    UNKNOWN("unknown", 0, 0, 0);

    private final String wire;
    private final int codeLength;
    private final int codeWidth;
    private final int plotSide;

    PlotSize(String wire, int codeLength, int codeWidth, int plotSide) {
        this.wire = wire;
        this.codeLength = codeLength;
        this.codeWidth = codeWidth;
        this.plotSide = plotSide;
    }

    public String wire() {
        return wire;
    }

    /** How far south a line may run, when that is known. */
    public Optional<Integer> codeLength() {
        return this == UNKNOWN ? Optional.empty() : Optional.of(codeLength);
    }

    /** How far west the lines may spread, when that is known. */
    public Optional<Integer> codeWidth() {
        return this == UNKNOWN ? Optional.empty() : Optional.of(codeWidth);
    }

    /**
     * The size whose whole plot is this many blocks on a side.
     *
     * <p>This is the number "/plot data" announces, and it is one more than
     * the play area's round figure because the border rows around it are
     * counted in. Matched exactly: a side matching no size stays unknown,
     * because a guessed capacity fails in the one direction that matters.
     */
    public static PlotSize ofPlotSide(int blocks) {
        for (PlotSize size : values()) {
            if (size != UNKNOWN && size.plotSide == blocks) {
                return size;
            }
        }
        return UNKNOWN;
    }

    public static PlotSize of(String value) {
        for (PlotSize size : values()) {
            if (size.wire.equals(value)) {
                return size;
            }
        }
        return UNKNOWN;
    }
}
