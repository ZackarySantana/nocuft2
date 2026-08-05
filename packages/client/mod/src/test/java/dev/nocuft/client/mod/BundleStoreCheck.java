package dev.nocuft.client.mod;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.plan.Bundle;
import dev.nocuft.client.template.Template;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Drives what the client holds while Nocuft is attached.
 *
 * <p>Nocuft is the source of truth for what a project builds to, so nothing it
 * said outlives the connection. The check that matters is the last one.
 */
public final class BundleStoreCheck {
    private static final List<String> FAILURES = new ArrayList<>();

    private BundleStoreCheck() {
    }

    private static void check(boolean condition, String description) {
        System.out.println((condition ? "  ok   " : "  FAIL ") + description);
        if (!condition) {
            FAILURES.add(description);
        }
    }

    private static String bundleJson(String projectId, String unitName) {
        Map<String, Json> header = new LinkedHashMap<>();
        header.put("id", new Json.Str("block"));
        header.put("block", new Json.Str("func"));
        header.put("data", new Json.Str(unitName));
        Json template = CanonicalJson.object("blocks", new Json.Arr(List.of(new Json.Obj(header))));
        String canonical = CanonicalJson.write(template);
        Template line = new Template(template, canonical, Template.sha256(canonical));

        return CanonicalJson.write(CanonicalJson.object(
            "format", new Json.Str("diamondfire-deployment"),
            "version", new Json.Num(0),
            "protocolVersion", new Json.Num(0),
            "compiler", CanonicalJson.object(
                "name", new Json.Str("nocuft"), "version", new Json.Str("0.0.0")
            ),
            "project", CanonicalJson.object(
                "id", new Json.Str(projectId),
                "module", new Json.Str(projectId)
            ),
            "registry", CanonicalJson.object(
                "id", new Json.Str("example.registry"),
                "version", new Json.Str("0.0.0"),
                "sha256", new Json.Str(String.format("%064x", 1))
            ),
            "capabilities", new Json.Arr(List.of()),
            "policy", CanonicalJson.object(
                "strategy", new Json.Str("rebuild"),
                "collision", new Json.Str("error"),
                "drift", new Json.Str("replace"),
                "pruneOwned", new Json.Bool(true)
            ),
            "templates", new Json.Arr(List.of(CanonicalJson.object(
                "id", new Json.Str(projectId + "." + unitName),
                "kind", new Json.Str("function"),
                "name", new Json.Str(unitName),
                "sha256", new Json.Str(line.sha256()),
                "encoding", new Json.Str("diamondfire-template-gzip-base64"),
                "compressedBytes", new Json.Num(Base64.getDecoder().decode(line.encode()).length),
                "uncompressedBytes", new Json.Num(
                    canonical.getBytes(java.nio.charset.StandardCharsets.UTF_8).length
                ),
                "data", new Json.Str(line.encode())
            )))
        ));
    }

    static void run() throws Exception {
        BundleStore store = new BundleStore();
        Object gui = new Object();
        Object editor = new Object();
        check(store.size() == 0, "a client that has been told nothing holds nothing");

        String json = bundleJson("example.arena", "helper");
        store.push(gui, Bundle.fromJson(json));
        check(store.size() == 1, "a pushed build is held");
        check(
            store.get("example.arena").orElseThrow().units().get(0).name().equals("helper"),
            "and can be looked up by project"
        );

        String updated = bundleJson("example.arena", "renamed");
        store.push(gui, Bundle.fromJson(updated));
        check(store.size() == 1, "pushing a project again replaces it rather than adding one");
        check(
            store.get("example.arena").orElseThrow().units().get(0).name().equals("renamed"),
            "and the newer build is the one kept"
        );

        String other = bundleJson("example.families", "tick");
        store.push(editor, Bundle.fromJson(other));
        check(store.byProject().size() == 2, "two projects are held side by side");

        check(store.forget("example.arena"), "a build can be forgotten");
        check(!store.forget("example.arena"), "and forgetting it again says so");
        check(store.size() == 1, "the other is untouched");

        store.push(gui, Bundle.fromJson(json));
        store.forget(gui);
        check(store.size() == 1, "a disconnect drops only that connection's builds");
        check(store.get("example.families").isPresent(), "another connection's build remains");
        store.forget(editor);
        check(store.all().isEmpty(), "nothing remains after every supplier disconnects");

        if (!FAILURES.isEmpty()) {
            throw new AssertionError("Bundle store checks failed: " + FAILURES);
        }
        System.out.println("Bundle store checks passed");
    }
}
