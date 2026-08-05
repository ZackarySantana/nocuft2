package dev.nocuft.client.protocol;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.json.JsonException;
import dev.nocuft.client.manifest.PlotManifest;
import dev.nocuft.client.plan.Bundle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * The frames a build tool and this client exchange, and how they are read.
 *
 * <p>One frame per message. Every request is answered by exactly one response
 * carrying the same id and method, and a response repeats its method so a
 * frame can be read without remembering what was asked. Progress arrives as
 * events under the same id and never ends a request.
 *
 * <p>Reading is strict. A frame that does not parse is answered with
 * {@code protocol.malformed} rather than acted on partially, because the
 * whole point of this client is that a caller is never left guessing what
 * happened to its request.
 */
public final class Protocol {
    public static final int VERSION = 0;

    private Protocol() {
    }

    /** Every request this client answers. */
    public enum Method {
        HELLO("hello"),
        BUNDLE_PUSH("bundle.push"),
        OPEN("open");

        private final String wire;

        Method(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }

        public static Method of(String value) {
            for (Method method : values()) {
                if (method.wire.equals(value)) {
                    return method;
                }
            }
            throw new ProtocolException(
                ErrorCode.PROTOCOL_UNKNOWN_METHOD,
                "This client answers no request named " + value + "."
            );
        }
    }

    /**
     * Every way a request can be refused.
     *
     * <p>Enumerated rather than free text so a code that is not in the
     * contract cannot reach the wire: a caller matching on codes would have no
     * way to handle one nobody declared.
     */
    public enum ErrorCode {
        PROTOCOL_MALFORMED("protocol.malformed"),
        PROTOCOL_UNSUPPORTED_VERSION("protocol.unsupported_version"),
        PROTOCOL_UNKNOWN_METHOD("protocol.unknown_method"),
        BUNDLE_INVALID("bundle.invalid"),
        BUNDLE_UNKNOWN_PROJECT("bundle.unknown_project"),
        PLOT_NOT_CONNECTED("plot.not_connected"),
        PLOT_NOT_DEV("plot.not_dev"),
        PLOT_UNKNOWN_SIZE("plot.unknown_size"),
        PLOT_CHUNKS_UNLOADED("plot.chunks_unloaded"),
        PLOT_NO_CAPACITY("plot.no_capacity"),
        APPLY_UNKNOWN_UNIT("apply.unknown_unit"),
        APPLY_ABORTED("apply.aborted"),
        CLIENT_INTERNAL("client.internal");

        private final String wire;

        ErrorCode(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }

        /** Looks up a code the planner named, refusing one nobody declared. */
        public static ErrorCode of(String value) {
            for (ErrorCode code : values()) {
                if (code.wire.equals(value)) {
                    return code;
                }
            }
            throw new IllegalArgumentException(
                "The protocol declares no error code " + value
                    + ". Add it to the contract before answering with it."
            );
        }
    }

    /** What an apply is doing while it runs. */
    public enum Phase {
        CLEARING("clearing"),
        PLACING("placing");

        private final String wire;

        Phase(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }

        static Phase of(String value) {
            for (Phase phase : values()) {
                if (phase.wire.equals(value)) {
                    return phase;
                }
            }
            throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, "No such phase " + value + ".");
        }
    }

    /** One message on the wire. */
    public sealed interface Frame {
        String id();
    }

    public record Request(String id, Method method, Json.Obj params) implements Frame {}

    public record Success(String id, Method method, Json.Obj result) implements Frame {}

    public record Failure(String id, Method method, ErrorCode code, String message) implements Frame {}

    public record Progress(
        String id,
        Phase phase,
        int done,
        int total,
        Optional<String> detail
    ) implements Frame {}

    /** A named and versioned peer. */
    public record Agent(String name, String version) {}

    /** Reads one frame, or refuses it. */
    public static Frame read(String text) {
        Json value;
        try {
            value = Json.read(text);
        } catch (JsonException error) {
            throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, error.getMessage());
        }
        return readFrame(value);
    }

    /** Reads one already parsed frame, which is how a recorded exchange replays. */
    public static Frame readFrame(Json value) {
        Json.Obj frame = object(value, "a frame");
        String kind = string(frame, "kind");
        String id = string(frame, "id");
        return switch (kind) {
            case "request" -> new Request(
                id,
                Method.of(string(frame, "method")),
                object(frame.members().get("params"), "params")
            );
            case "response" -> readResponse(frame, id);
            case "event" -> readProgress(frame, id);
            default -> throw new ProtocolException(
                ErrorCode.PROTOCOL_MALFORMED,
                "A frame is a request, a response, or an event, not " + kind + "."
            );
        };
    }

    private static Frame readResponse(Json.Obj frame, String id) {
        Method method = Method.of(string(frame, "method"));
        if (!(frame.members().get("ok") instanceof Json.Bool ok)) {
            throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, "A response says whether it succeeded.");
        }
        if (ok.value()) {
            return new Success(id, method, object(frame.members().get("result"), "result"));
        }
        Json.Obj error = object(frame.members().get("error"), "error");
        return new Failure(
            id,
            method,
            ErrorCode.of(string(error, "code")),
            string(error, "message")
        );
    }

    private static Frame readProgress(Json.Obj frame, String id) {
        if (!"progress".equals(string(frame, "event"))) {
            throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, "The only event is progress.");
        }
        Json.Obj params = object(frame.members().get("params"), "params");
        return new Progress(
            id,
            Phase.of(string(params, "phase")),
            (int) number(params, "done"),
            (int) number(params, "total"),
            optionalString(params, "detail")
        );
    }

    /** Writes one frame as the single message it travels in. */
    public static String write(Frame frame) {
        Map<String, Json> members = new LinkedHashMap<>();
        switch (frame) {
            case Request request -> {
                members.put("kind", new Json.Str("request"));
                members.put("id", new Json.Str(request.id()));
                members.put("method", new Json.Str(request.method().wire()));
                members.put("params", request.params());
            }
            case Success success -> {
                members.put("kind", new Json.Str("response"));
                members.put("id", new Json.Str(success.id()));
                members.put("method", new Json.Str(success.method().wire()));
                members.put("ok", new Json.Bool(true));
                members.put("result", success.result());
            }
            case Failure failure -> {
                members.put("kind", new Json.Str("response"));
                members.put("id", new Json.Str(failure.id()));
                members.put("method", new Json.Str(failure.method().wire()));
                members.put("ok", new Json.Bool(false));
                members.put("error", CanonicalJson.object(
                    "code", new Json.Str(failure.code().wire()),
                    "message", new Json.Str(failure.message())
                ));
            }
            case Progress progress -> {
                members.put("kind", new Json.Str("event"));
                members.put("id", new Json.Str(progress.id()));
                members.put("event", new Json.Str("progress"));
                Map<String, Json> params = new LinkedHashMap<>();
                params.put("phase", new Json.Str(progress.phase().wire()));
                params.put("done", new Json.Num(progress.done()));
                params.put("total", new Json.Num(progress.total()));
                progress.detail().ifPresent(detail -> params.put("detail", new Json.Str(detail)));
                members.put("params", new Json.Obj(params));
            }
        }
        return CanonicalJson.write(new Json.Obj(members));
    }

    // Typed readers for the parameters this client acts on. Writing a result
    // is left to the caller, because only the caller knows the answer; reading
    // is here, because a request must never be half understood.

    /** {@code hello}: the version and name of the tool on the other end. */
    public static Agent readHello(Json.Obj params) {
        if (number(params, "protocolVersion") != VERSION) {
            throw new ProtocolException(
                ErrorCode.PROTOCOL_UNSUPPORTED_VERSION,
                "This client speaks protocol version " + VERSION + "."
            );
        }
        Json.Obj client = object(params.members().get("client"), "client");
        return new Agent(string(client, "name"), string(client, "version"));
    }

    /** {@code bundle.push}: a project's compiled code. */
    public static Bundle readBundlePush(Json.Obj params) {
        Json bundle = params.members().get("bundle");
        if (bundle == null) {
            throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, "params must carry a bundle.");
        }
        return Bundle.fromJson(CanonicalJson.write(bundle));
    }

    /** {@code open}: which project to show, if any in particular. */
    public static Optional<String> readOpen(Json.Obj params) {
        return optionalString(params, "project");
    }

    /** Writes a manifest for a response that carries one, or null for none. */
    public static Json manifest(Optional<PlotManifest> manifest) {
        return manifest.<Json>map(value -> Json.read(value.toJson())).orElseGet(Json.Null::new);
    }

    private static Json.Obj object(Json value, String where) {
        if (value instanceof Json.Obj object) {
            return object;
        }
        throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, where + " must be an object.");
    }

    private static Json.Arr array(Json value, String where) {
        if (value instanceof Json.Arr array) {
            return array;
        }
        throw new ProtocolException(ErrorCode.PROTOCOL_MALFORMED, where + " must be an array.");
    }

    private static String string(Json.Obj object, String key) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return value.value();
        }
        throw new ProtocolException(
            ErrorCode.PROTOCOL_MALFORMED,
            "A frame must carry a nonempty " + key + "."
        );
    }

    private static double number(Json.Obj object, String key) {
        if (object.members().get(key) instanceof Json.Num value) {
            return value.value();
        }
        throw new ProtocolException(
            ErrorCode.PROTOCOL_MALFORMED,
            "A frame must carry the number " + key + "."
        );
    }

    private static Optional<String> optionalString(Json.Obj object, String key) {
        if (object.members().get(key) instanceof Json.Str value && !value.value().isEmpty()) {
            return Optional.of(value.value());
        }
        return Optional.empty();
    }
}
