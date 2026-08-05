package dev.nocuft.client.manifest;

/** A manifest the client refused to read or to write. */
public final class ManifestException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ManifestException(String message) {
        super(message);
    }
}
