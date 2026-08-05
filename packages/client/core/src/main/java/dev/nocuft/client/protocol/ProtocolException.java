package dev.nocuft.client.protocol;

/** A request this client refused, carrying the code it is answered with. */
public final class ProtocolException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final Protocol.ErrorCode code;

    public ProtocolException(Protocol.ErrorCode code, String message) {
        super(message);
        this.code = code;
    }

    public Protocol.ErrorCode code() {
        return code;
    }
}
