package dev.nocuft.client.template;

/** A template payload the client refused to read. */
public final class TemplateException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public TemplateException(String message) {
        super(message);
    }
}
