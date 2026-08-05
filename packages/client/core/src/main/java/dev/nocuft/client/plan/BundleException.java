package dev.nocuft.client.plan;

/**
 * A refusal, carrying the protocol error code a caller is answered with.
 *
 * <p>Every way an apply can be refused is named, because a caller waiting on a
 * placement that will never happen is the failure this client exists to
 * remove.
 */
public class BundleException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final String code;

    public BundleException(String code, String message) {
        super(message);
        this.code = code;
    }

    /** A code from the protocol's declared set, such as {@code bundle.invalid}. */
    public String code() {
        return code;
    }
}
