package dev.nocuft.client.json;

/** A JSON document the client refused to read or to write. */
public final class JsonException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public JsonException(String message) {
        super(message);
    }
}
