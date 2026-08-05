package dev.nocuft.client;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.plan.Bundle;
import dev.nocuft.client.protocol.Protocol;
import dev.nocuft.client.protocol.ProtocolException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

/** Proves the Java client implements the localhost deployment protocol. */
public final class ProtocolTest {
    private ProtocolTest() {
    }

    static void run(Path packagesRoot) throws Exception {
        everyFrameShapeRoundTrips();
        helloIsValidated();
        onlyIterationOneMethodsAreAccepted();
        malformedFramesAreRefusedByName();
        undeclaredErrorCodesCannotReachTheWire();
        typeScriptBundlesDecodeInJava(packagesRoot);
    }

    private static void checkEquals(Object actual, Object expected, String description) {
        if (!expected.equals(actual)) {
            throw new AssertionError(
                description + System.lineSeparator()
                    + "  expected: " + expected + System.lineSeparator()
                    + "  actual:   " + actual
            );
        }
    }

    private static Protocol.ErrorCode checkRefused(Runnable action, String description) {
        try {
            action.run();
        } catch (ProtocolException expected) {
            return expected.code();
        }
        throw new AssertionError(description);
    }

    private static void everyFrameShapeRoundTrips() {
        List<Protocol.Frame> frames = List.of(
            new Protocol.Request("1", Protocol.Method.HELLO, CanonicalJson.object()),
            new Protocol.Success("2", Protocol.Method.OPEN, CanonicalJson.object()),
            new Protocol.Failure(
                "3",
                Protocol.Method.BUNDLE_PUSH,
                Protocol.ErrorCode.BUNDLE_INVALID,
                "bad bundle"
            ),
            new Protocol.Progress("4", Protocol.Phase.PLACING, 1, 2, Optional.of("app.test/main"))
        );
        for (Protocol.Frame frame : frames) {
            String written = Protocol.write(frame);
            checkEquals(Protocol.write(Protocol.read(written)), written, "a frame round trips");
        }
    }

    private static void helloIsValidated() {
        Protocol.Agent peer = Protocol.readHello(CanonicalJson.object(
            "protocolVersion", new Json.Num(Protocol.VERSION),
            "client", CanonicalJson.object(
                "name", new Json.Str("nocuft"),
                "version", new Json.Str("0.1.0")
            )
        ));
        checkEquals(peer, new Protocol.Agent("nocuft", "0.1.0"), "hello names the client");
        checkEquals(
            checkRefused(
                () -> Protocol.readHello(CanonicalJson.object(
                    "protocolVersion", new Json.Num(Protocol.VERSION + 1),
                    "client", CanonicalJson.object(
                        "name", new Json.Str("nocuft"),
                        "version", new Json.Str("0.1.0")
                    )
                )),
                "a later protocol is refused"
            ),
            Protocol.ErrorCode.PROTOCOL_UNSUPPORTED_VERSION,
            "the version refusal is named"
        );
    }

    private static void onlyIterationOneMethodsAreAccepted() {
        checkEquals(Protocol.Method.of("hello"), Protocol.Method.HELLO, "hello is accepted");
        checkEquals(
            Protocol.Method.of("bundle.push"),
            Protocol.Method.BUNDLE_PUSH,
            "bundle push is accepted"
        );
        checkEquals(Protocol.Method.of("open"), Protocol.Method.OPEN, "open is accepted");
        checkEquals(
            checkRefused(
                () -> Protocol.Method.of("pair"),
                "pairing is not part of protocol version zero"
            ),
            Protocol.ErrorCode.PROTOCOL_UNKNOWN_METHOD,
            "pair is refused as unknown"
        );
    }

    private static void malformedFramesAreRefusedByName() {
        checkEquals(
            checkRefused(() -> Protocol.read("{"), "invalid JSON is refused"),
            Protocol.ErrorCode.PROTOCOL_MALFORMED,
            "the malformed frame refusal is named"
        );
    }

    private static void undeclaredErrorCodesCannotReachTheWire() {
        try {
            Protocol.ErrorCode.of("apply.something_went_wrong");
        } catch (IllegalArgumentException expected) {
            checkEquals(
                Protocol.ErrorCode.of("apply.unknown_unit"),
                Protocol.ErrorCode.APPLY_UNKNOWN_UNIT,
                "a declared error code resolves"
            );
            return;
        }
        throw new AssertionError("an undeclared error code was accepted");
    }

    private static void typeScriptBundlesDecodeInJava(Path packagesRoot) throws Exception {
        Path fixture = packagesRoot.resolve("deployment/test/fixtures/function-bundle.json");
        Bundle bundle = Bundle.fromJson(Files.readString(fixture, StandardCharsets.UTF_8));
        checkEquals(
            bundle.projectId(),
            "4c026963-a287-4e18-a86c-747d86e3a917",
            "Java reads the TypeScript bundle's project identity"
        );
        checkEquals(bundle.module(), "app.hello", "Java reads the TypeScript bundle's module");
        checkEquals(bundle.units().size(), 1, "Java decodes the TypeScript bundle's template");
        checkEquals(bundle.units().get(0).name(), "hello", "the template header agrees");
    }
}
