package dev.nocuft.client.mod;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.mod.api.ApiServer;
import dev.nocuft.client.protocol.Protocol;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

/**
 * Drives the API over a real socket.
 *
 * <p>The promises worth checking here are the ones a reader cannot verify by
 * looking: that no request is ever left unanswered, that none is answered
 * twice, that a local tool is trusted immediately, and that a web page cannot
 * reach the port at all. None of that needs Minecraft, so none of it waits for
 * a game to run.
 */
public final class ApiServerCheck {
    private static final List<String> FAILURES = new ArrayList<>();

    private ApiServerCheck() {
    }

    private static void check(boolean condition, String description) {
        System.out.println((condition ? "  ok   " : "  FAIL ") + description);
        if (!condition) {
            FAILURES.add(description);
        }
    }

    /** A build tool on the other end of the socket. */
    private static final class Peer extends WebSocketClient {
        private final BlockingQueue<String> received = new LinkedBlockingQueue<>();
        private final CountDownLatch closed = new CountDownLatch(1);
        private volatile int closeCode = -1;

        Peer(int port, Map<String, String> headers) {
            super(URI.create("ws://127.0.0.1:" + port), headers);
        }

        @Override
        public void onOpen(ServerHandshake handshake) {
        }

        @Override
        public void onMessage(String message) {
            received.add(message);
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
            closeCode = code;
            closed.countDown();
        }

        @Override
        public void onError(Exception error) {
        }

        Protocol.Frame answer() throws InterruptedException {
            String message = received.poll(5, TimeUnit.SECONDS);
            if (message == null) {
                throw new AssertionError("A request went unanswered for five seconds.");
            }
            return Protocol.read(message);
        }

        void ask(String id, Protocol.Method method, Json.Obj params) {
            send(Protocol.write(new Protocol.Request(id, method, params)));
        }
    }

    private static Json.Obj hello(String name) {
        return CanonicalJson.object(
            "protocolVersion", new Json.Num(Protocol.VERSION),
            "client", CanonicalJson.object(
                "name", new Json.Str(name),
                "version", new Json.Str("0.0.0")
            )
        );
    }

    public static void main(String[] arguments) throws Exception {
        ApiServer server = new ApiServer((session, request, reply) -> {
            switch (request.method()) {
                case HELLO -> {
                    session.describePeer(Protocol.readHello(request.params()));
                    reply.ok(CanonicalJson.object());
                }
                // Answers twice on purpose, to prove the second is dropped.
                case OPEN -> {
                    reply.ok(CanonicalJson.object());
                    reply.ok(CanonicalJson.object());
                }
                default -> reply.fail(Protocol.ErrorCode.PLOT_NOT_CONNECTED, "not yet");
            }
        }, session -> { }, 0);
        server.setDaemon(true);
        server.start();
        int port = waitForPort(server);
        check(server.getAddress().getAddress().isLoopbackAddress(), "the API binds only to loopback");

        Peer tool = new Peer(port, Map.of());
        tool.connectBlocking(5, TimeUnit.SECONDS);

        tool.ask("1", Protocol.Method.HELLO, hello("nocuft"));
        check(
            tool.answer() instanceof Protocol.Success success
                && success.id().equals("1")
                && success.method() == Protocol.Method.HELLO,
            "a request is answered with its own id and method"
        );

        tool.ask("2", Protocol.Method.BUNDLE_PUSH, CanonicalJson.object());
        check(
            tool.answer() instanceof Protocol.Failure failure
                && failure.code() == Protocol.ErrorCode.PLOT_NOT_CONNECTED,
            "a local tool reaches the handler immediately"
        );

        tool.send("{not json");
        check(
            tool.answer() instanceof Protocol.Failure failure
                && failure.code() == Protocol.ErrorCode.PROTOCOL_MALFORMED,
            "a frame that does not parse is answered rather than dropped"
        );

        tool.send("{\"kind\":\"request\",\"id\":\"3\",\"method\":\"explode\",\"params\":{}}");
        check(
            tool.answer() instanceof Protocol.Failure failure
                && failure.code() == Protocol.ErrorCode.PROTOCOL_UNKNOWN_METHOD,
            "a request nobody declared is answered rather than dropped"
        );

        tool.ask("4", Protocol.Method.OPEN, CanonicalJson.object());
        check(tool.answer() instanceof Protocol.Success, "the first answer arrives");
        check(
            tool.received.poll(1, TimeUnit.SECONDS) == null,
            "a second answer to the same request is dropped"
        );

        Peer editor = new Peer(port, Map.of());
        editor.connectBlocking(5, TimeUnit.SECONDS);
        editor.ask("1", Protocol.Method.HELLO, hello("editor"));
        check(editor.answer() instanceof Protocol.Success, "a second tool may attach at the same time");
        tool.ask("5", Protocol.Method.HELLO, hello("nocuft"));
        check(tool.answer() instanceof Protocol.Success, "and the first is still attached");

        // Only a browser sends Origin, and loopback does not keep a page the
        // player has open away from this port.
        Peer page = new Peer(port, Map.of("Origin", "https://example.com"));
        page.connectBlocking(5, TimeUnit.SECONDS);
        check(page.closed.await(5, TimeUnit.SECONDS), "a handshake from a web page is closed");
        check(page.closeCode == 1008, "and closed as a policy violation, got " + page.closeCode);

        server.stop(1000);
        if (!FAILURES.isEmpty()) {
            throw new AssertionError("API server checks failed: " + FAILURES);
        }
        System.out.println("API server checks passed");

        BundleStoreCheck.run();
    }

    private static int waitForPort(ApiServer server) throws InterruptedException {
        for (int attempt = 0; attempt < 100; attempt += 1) {
            int port = server.getPort();
            if (port > 0) {
                return port;
            }
            Thread.sleep(50);
        }
        throw new AssertionError("The API server never bound a port.");
    }
}
