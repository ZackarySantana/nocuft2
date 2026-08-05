package dev.nocuft.client.plot;

/**
 * Where the player is, as far as this client can tell.
 *
 * <p>Only {@link #DEV} permits anything automatic. DiamondFire's rules allow
 * automation and the movement it needs on a plot in build or dev mode and
 * nowhere else, so every action this client takes is gated on being here
 * rather than on merely having been asked.
 */
public enum Location {
    /** Not on DiamondFire, or not yet told where. */
    UNKNOWN("unknown"),
    DISCONNECTED("disconnected"),
    SPAWN("spawn"),
    /** In someone's game, where this client does nothing. */
    PLAY("play"),
    /** On a plot, building rather than coding. */
    BUILD("build"),
    /** On a plot's codespace, which is the only place code may be touched. */
    DEV("dev");

    private final String wire;

    Location(String wire) {
        this.wire = wire;
    }

    public String wire() {
        return wire;
    }

    /** Whether this client may read or change code from here. */
    public boolean permitsCodeAccess() {
        return this == DEV;
    }
}
