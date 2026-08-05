package dev.nocuft.client;

import dev.nocuft.client.json.CanonicalJson;
import dev.nocuft.client.json.Json;
import dev.nocuft.client.json.JsonException;
import dev.nocuft.client.template.Template;
import dev.nocuft.client.template.TemplateException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

/** Proves the client reads a code line the way the compiler wrote it. */
public final class CoreTest {
    public static void main(String[] arguments) throws Exception {
        CoreTest tests = new CoreTest();
        tests.aNumberIsWrittenTheWayTheCompilerWritesOne();
        tests.aStringIsEscapedTheWayTheCompilerEscapesOne();
        tests.membersAreSortedAtEveryDepth();
        tests.aDocumentTheCompilerWouldNotProduceIsRefused();
        tests.aGeneratedTemplateHashesToItsDeclaredDigest();
        tests.aTemplateRoundTripsThroughItsPayload();
        tests.aLineIsNamedByItsHeader();
        tests.aPayloadIsFoundWhateverWrappedIt();
        tests.aPayloadThatIsNotATemplateIsRefused();
        ManifestTest.run();
        PlannerTest.run();
        if (arguments.length != 1) {
            throw new AssertionError("Expected the packages directory path");
        }
        ProtocolTest.run(Path.of(arguments[0]));
        PlotTest.run();
        System.out.println("client core tests passed");
    }

    private static void check(boolean condition, String description) {
        if (!condition) {
            throw new AssertionError(description);
        }
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

    private static void checkRefused(Runnable action, String description) {
        try {
            action.run();
        } catch (JsonException | TemplateException expected) {
            return;
        }
        throw new AssertionError(description);
    }

    /**
     * Every pair here is what ECMAScript prints for that double, which is what
     * the compiler's digest was taken over.
     */
    private void aNumberIsWrittenTheWayTheCompilerWritesOne() {
        checkEquals(CanonicalJson.number(0.0), "0", "zero");
        checkEquals(CanonicalJson.number(-0.0), "0", "negative zero is written as zero");
        checkEquals(CanonicalJson.number(1.0), "1", "an integral double drops its point");
        checkEquals(CanonicalJson.number(-1.0), "-1", "a negative integral double");
        checkEquals(CanonicalJson.number(100.0), "100", "trailing zeros are digits, not a point");
        checkEquals(CanonicalJson.number(1.5), "1.5", "a fraction");
        checkEquals(CanonicalJson.number(-1.5), "-1.5", "a negative fraction");
        checkEquals(CanonicalJson.number(0.1), "0.1", "a leading zero");
        checkEquals(CanonicalJson.number(0.001), "0.001", "three leading zeros");
        checkEquals(CanonicalJson.number(0.00001), "0.00001", "five leading zeros");
        checkEquals(CanonicalJson.number(0.000001), "0.000001", "the last fixed form");
        checkEquals(CanonicalJson.number(1e-7), "1e-7", "the first negative exponent form");
        checkEquals(CanonicalJson.number(1.2345e-10), "1.2345e-10", "a negative exponent with digits");
        checkEquals(CanonicalJson.number(1e20), "100000000000000000000", "the last fixed integer form");
        checkEquals(CanonicalJson.number(1e21), "1e+21", "the first positive exponent form");
        checkEquals(CanonicalJson.number(9.999999999999999e20), "999999999999999900000", "just under the switch");
        checkEquals(CanonicalJson.number(123456789.0), "123456789", "a plain integer");
        checkEquals(CanonicalJson.number(0.30000000000000004), "0.30000000000000004", "the shortest digits that read back");
        checkEquals(CanonicalJson.number(1.0 / 3.0), "0.3333333333333333", "a repeating fraction");
        checkEquals(CanonicalJson.number(9007199254740992.0), "9007199254740992", "the largest exact integer");
        checkEquals(CanonicalJson.number(1.7976931348623157e308), "1.7976931348623157e+308", "the largest double");
        checkEquals(CanonicalJson.number(4.9e-324), "5e-324", "the smallest double");
        checkRefused(
            () -> CanonicalJson.number(Double.POSITIVE_INFINITY),
            "a non-finite number is refused rather than written"
        );
    }

    private void aStringIsEscapedTheWayTheCompilerEscapesOne() {
        checkEquals(CanonicalJson.write(new Json.Str("plain")), "\"plain\"", "a plain string");
        checkEquals(CanonicalJson.write(new Json.Str("a\"b\\c")), "\"a\\\"b\\\\c\"", "a quote and a backslash");
        checkEquals(CanonicalJson.write(new Json.Str("\n\t\r\b\f")), "\"\\n\\t\\r\\b\\f\"", "the named escapes");
        checkEquals(CanonicalJson.write(new Json.Str("\u0001")), "\"\\u0001\"", "an unnamed control character");
        // A forward slash and a non-ASCII character are written as themselves,
        // which is what ECMAScript does and what the digest was taken over.
        checkEquals(CanonicalJson.write(new Json.Str("a/b")), "\"a/b\"", "a forward slash is not escaped");
        checkEquals(CanonicalJson.write(new Json.Str("\u00e9")), "\"\u00e9\"", "a non-ASCII character is not escaped");
        checkEquals(CanonicalJson.write(new Json.Str("\ud83d\ude00")), "\"\ud83d\ude00\"", "a surrogate pair is a character");
        checkEquals(CanonicalJson.write(new Json.Str("\ud800")), "\"\\ud800\"", "a lone surrogate is escaped");
    }

    private void membersAreSortedAtEveryDepth() {
        String canonical = CanonicalJson.canonicalize(
            "{\"b\":1,\"a\":{\"z\":[{\"y\":true,\"x\":null}],\"A\":2}}"
        );
        checkEquals(
            canonical,
            "{\"a\":{\"A\":2,\"z\":[{\"x\":null,\"y\":true}]},\"b\":1}",
            "members sort by code unit, so an upper case key sorts before a lower case one"
        );
    }

    private void aDocumentTheCompilerWouldNotProduceIsRefused() {
        checkRefused(() -> Json.read("{\"a\":1,\"a\":2}"), "a duplicate member is refused");
        checkRefused(() -> Json.read("{} {}"), "content after the value is refused");
        checkRefused(() -> Json.read("{\"a\":01}"), "a leading zero is refused");
        checkRefused(() -> Json.read("{\"a\":\"\n\"}"), "an unescaped control character is refused");
        checkRefused(() -> Json.read("{\"a\":1,}"), "a trailing comma is refused");
        checkRefused(() -> Json.read("[1e]"), "a truncated exponent is refused");
    }

    /**
     * The digest the compiler declares for a template is recomputed here from
     * the payload alone. Agreement is what lets the client decide whether a
     * line on a plot is the line that was built, without asking the compiler.
     */
    private void aGeneratedTemplateHashesToItsDeclaredDigest() {
        Template template = Template.decode(firstGoldenPayload());
        checkEquals(
            template.sha256(),
            Template.sha256(template.canonicalJson()),
            "a payload hashes to its canonical JSON"
        );
    }

    private void aTemplateRoundTripsThroughItsPayload() {
        Template original = Template.decode(firstGoldenPayload());
        Template again = Template.decode(original.encode());
        checkEquals(again.sha256(), original.sha256(), "a template survives being written and read again");
        checkEquals(again.canonicalJson(), original.canonicalJson(), "the canonical form survives");
    }

    private void aLineIsNamedByItsHeader() {
        Optional<Template.Header> header = Template.decode(firstGoldenPayload()).header();
        check(header.isPresent(), "a code line has a header");
        check(!header.get().block().isEmpty(), "a header names its block");
    }

    private void aPayloadIsFoundWhateverWrappedIt() {
        String payload = firstGoldenPayload();
        checkEquals(Template.payloadsIn(payload), List.of(payload), "a bare payload");
        checkEquals(
            Template.payloadsIn("{\"code\":\"" + payload + "\"}"),
            List.of(payload),
            "a payload inside a codetemplatedata value"
        );
        checkEquals(
            Template.payloadsIn("{\"code\":\\\"" + payload + "\\\"}"),
            List.of(payload),
            "a payload escaped inside SNBT"
        );
        checkEquals(
            Template.payloadsIn(payload + ".\n" + payload),
            List.of(payload, payload),
            "two payloads, in the order they appear"
        );
        checkEquals(Template.payloadsIn("nothing here"), List.of(), "prose carries no payload");
        checkEquals(Template.payloadsIn("bm90IGEgdGVtcGxhdGU="), List.of(), "Base64 that is not gzip");
    }

    private void aPayloadThatIsNotATemplateIsRefused() {
        checkRefused(() -> Template.decode("not base64!"), "a payload that is not Base64 is refused");
        checkRefused(() -> Template.decode("bm90IGdyaXA="), "a payload that is not gzip is refused");
    }

    private String firstGoldenPayload() {
        String json = CanonicalJson.write(CanonicalJson.object(
            "blocks", new Json.Arr(List.of(CanonicalJson.object(
                "args", CanonicalJson.object("items", new Json.Arr(List.of())),
                "block", new Json.Str("func"),
                "data", new Json.Str("hello"),
                "id", new Json.Str("block")
            )))
        ));
        return new Template(Json.read(json), json, Template.sha256(json)).encode();
    }
}
