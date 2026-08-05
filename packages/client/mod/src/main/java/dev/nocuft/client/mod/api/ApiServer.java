package dev.nocuft.client.mod.api;

import dev.nocuft.client.json.Json;
import dev.nocuft.client.protocol.Protocol;
import dev.nocuft.client.protocol.ProtocolException;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The local endpoint a build tool talks to.
 *
 * <p>Listens on loopback only, on a port of its own so it can sit beside the
 * other DiamondFire clients rather than fighting them for one.
 *
 * <p>Two things here are deliberate departures from how this has been done
 * before. A handshake carrying an {@code Origin} is refused, because a browser
 * sends one and a build tool does not: without that check any page the player
 * visits can open a socket to this port and start driving their game. And
 * every connection is kept, rather than the newest replacing the last, so a
 * watch process and an editor can both be attached.
 */
public final class ApiServer extends WebSocketServer {
    /** Distinct from CodeClient on 31375 and recode on 31371. */
    public static final int PORT = 31380;

    private static final Logger LOGGER = LoggerFactory.getLogger("nocuft");

    private final RequestHandler handler;
    private final Consumer<Session> onDisconnect;
    private final Map<WebSocket, Session> sessions = new ConcurrentHashMap<>();

    /** Answers a request. Runs off the game thread; see {@link RequestHandler}. */
    public interface RequestHandler {
        /**
         * @param session the connection the request arrived on
         * @param request what was asked
         * @param reply   how to answer, callable from any thread and exactly once
         */
        void handle(Session session, Protocol.Request request, Reply reply);
    }

    /** Answers one request, and reports progress until it does. */
    public interface Reply {
        void progress(Protocol.Phase phase, int done, int total, Optional<String> detail);

        void ok(Json.Obj result);

        void fail(Protocol.ErrorCode code, String message);
    }

    /** One attached build tool. */
    public static final class Session {
        private final WebSocket socket;
        private volatile Protocol.Agent peer;

        private Session(WebSocket socket) {
            this.socket = socket;
        }

        public Optional<Protocol.Agent> peer() {
            return Optional.ofNullable(peer);
        }

        public void describePeer(Protocol.Agent agent) {
            this.peer = agent;
        }

        void send(Protocol.Frame frame) {
            if (socket.isOpen()) {
                socket.send(Protocol.write(frame));
            }
        }
    }

    /** How many build tools are attached right now. */
    public int connectionCount() {
        return sessions.size();
    }

    public ApiServer(RequestHandler handler, Consumer<Session> onDisconnect) {
        this(handler, onDisconnect, PORT);
    }

    /** Binds a chosen port, which lets a check run without taking the real one. */
    public ApiServer(RequestHandler handler, Consumer<Session> onDisconnect, int port) {
        super(new InetSocketAddress("127.0.0.1", port));
        this.handler = handler;
        this.onDisconnect = onDisconnect;
        setReuseAddr(true);
    }

    @Override
    public void onStart() {
        // The bound port, not the constant: a check binds an ephemeral one.
        LOGGER.info("Nocuft is listening on ws://127.0.0.1:{}", getPort());
    }

    @Override
    public void onOpen(WebSocket socket, ClientHandshake handshake) {
        // Only a browser sends Origin. Loopback does not protect this port
        // from a page the player has open, and this is what does.
        if (handshake.hasFieldValue("Origin")) {
            LOGGER.warn(
                "Refused a connection from the web origin {}. Nocuft is driven by a build tool, not a page.",
                handshake.getFieldValue("Origin")
            );
            socket.close(1008, "Nocuft does not accept connections from a web page.");
            return;
        }
        sessions.put(socket, new Session(socket));
    }

    @Override
    public void onClose(WebSocket socket, int code, String reason, boolean remote) {
        Session session = sessions.remove(socket);
        if (session != null) {
            onDisconnect.accept(session);
        }
    }

    @Override
    public void onError(WebSocket socket, Exception error) {
        if (socket == null) {
            LOGGER.error("The Nocuft API failed", error);
            return;
        }
        LOGGER.warn("A Nocuft API connection failed: {}", error.toString());
        Session session = sessions.remove(socket);
        if (session != null) {
            onDisconnect.accept(session);
        }
    }

    @Override
    public void onMessage(WebSocket socket, String message) {
        Session session = sessions.get(socket);
        if (session == null) {
            return;
        }

        Protocol.Request request;
        try {
            if (!(Protocol.read(message) instanceof Protocol.Request parsed)) {
                // This client answers requests; it is not driven by responses.
                socket.send(Protocol.write(new Protocol.Failure(
                    "0",
                    Protocol.Method.HELLO,
                    Protocol.ErrorCode.PROTOCOL_MALFORMED,
                    "This client answers requests and sends responses, not the other way round."
                )));
                return;
            }
            request = parsed;
        } catch (ProtocolException error) {
            // The id is unknown when the frame did not parse, so the answer
            // carries a placeholder rather than going unanswered.
            socket.send(Protocol.write(new Protocol.Failure(
                "0",
                Protocol.Method.HELLO,
                error.code(),
                error.getMessage()
            )));
            return;
        }

        Reply reply = new SingleReply(session, request);
        try {
            handler.handle(session, request, reply);
        } catch (ProtocolException error) {
            reply.fail(error.code(), error.getMessage());
        } catch (RuntimeException error) {
            LOGGER.error("A Nocuft request failed unexpectedly", error);
            reply.fail(Protocol.ErrorCode.CLIENT_INTERNAL, String.valueOf(error.getMessage()));
        }
    }

    /**
     * Answers exactly once.
     *
     * <p>A request answered twice would leave a caller matching the second
     * answer to a request it already finished, and one answered never is the
     * failure this whole client exists to remove, so both are guarded here
     * rather than in every handler.
     */
    private static final class SingleReply implements Reply {
        private final Session session;
        private final Protocol.Request request;
        private volatile boolean answered;

        private SingleReply(Session session, Protocol.Request request) {
            this.session = session;
            this.request = request;
        }

        @Override
        public void progress(Protocol.Phase phase, int done, int total, Optional<String> detail) {
            if (answered) {
                return;
            }
            session.send(new Protocol.Progress(request.id(), phase, done, total, detail));
        }

        @Override
        public void ok(Json.Obj result) {
            if (claim()) {
                session.send(new Protocol.Success(request.id(), request.method(), result));
            }
        }

        @Override
        public void fail(Protocol.ErrorCode code, String message) {
            if (claim()) {
                session.send(new Protocol.Failure(request.id(), request.method(), code, message));
            }
        }

        private synchronized boolean claim() {
            if (answered) {
                LOGGER.warn("A Nocuft request was answered twice; the second answer was dropped.");
                return false;
            }
            answered = true;
            return true;
        }
    }
}
