package dev.nocuft.client.plot;

/**
 * The paid rank a player holds, which is what decides which code actions
 * their plots may carry.
 *
 * <p>The action dump names a required rank on a couple of hundred actions and
 * a handful of game values, and it is the plot owner's rank that is checked,
 * not the rank of whoever is placing. So what a build may be placed onto is a
 * question about the owner, and this is the answer's type.
 *
 * <p>The ranks are a ladder: each includes everything below it, which is what
 * {@link #covers} encodes. {@link #NONE} is a real answer, a player with no
 * paid rank, not a failure to find one.
 */
public enum PaidRank {
    NONE("none"),
    NOBLE("noble"),
    EMPEROR("emperor"),
    MYTHIC("mythic"),
    OVERLORD("overlord");

    private final String wire;

    PaidRank(String wire) {
        this.wire = wire;
    }

    public String wire() {
        return wire;
    }

    /** Whether a player holding this rank meets a requirement of that one. */
    public boolean covers(PaidRank required) {
        return ordinal() >= required.ordinal();
    }
}
