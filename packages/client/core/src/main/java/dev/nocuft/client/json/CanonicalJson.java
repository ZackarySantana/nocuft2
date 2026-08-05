package dev.nocuft.client.json;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Writes JSON the way the compiler writes it, so the same value produces the
 * same bytes and therefore the same digest in both.
 *
 * <p>The compiler canonicalizes by sorting every object's keys and then
 * handing the value to ECMAScript's own serializer. Two rules follow from
 * that and are the whole of this class: keys sort by UTF-16 code unit, which
 * is what Java's string ordering already does, and a number is written the way
 * ECMAScript writes one, which is not the way Java does.
 */
public final class CanonicalJson {
    private CanonicalJson() {
    }

    /** Serializes a value with every object's members sorted. */
    public static String write(Json value) {
        StringBuilder result = new StringBuilder();
        writeValue(value, result);
        return result.toString();
    }

    /** Reads a document and writes it back in canonical form. */
    public static String canonicalize(String text) {
        return write(Json.read(text));
    }

    private static void writeValue(Json value, StringBuilder result) {
        switch (value) {
            case Json.Obj object -> {
                result.append('{');
                List<String> keys = new ArrayList<>(object.members().keySet());
                keys.sort(null);
                boolean first = true;
                for (String key : keys) {
                    if (!first) {
                        result.append(',');
                    }
                    first = false;
                    writeString(key, result);
                    result.append(':');
                    Json member = object.members().get(key);
                    writeValue(member, result);
                }
                result.append('}');
            }
            case Json.Arr array -> {
                result.append('[');
                boolean first = true;
                for (Json element : array.elements()) {
                    if (!first) {
                        result.append(',');
                    }
                    first = false;
                    writeValue(element, result);
                }
                result.append(']');
            }
            case Json.Str string -> writeString(string.value(), result);
            case Json.Num number -> result.append(number(number.value()));
            case Json.Bool bool -> result.append(bool.value() ? "true" : "false");
            case Json.Null ignored -> result.append("null");
        }
    }

    private static void writeString(String value, StringBuilder result) {
        result.append('"');
        for (int index = 0; index < value.length(); index += 1) {
            char character = value.charAt(index);
            switch (character) {
                case '"' -> result.append("\\\"");
                case '\\' -> result.append("\\\\");
                case '\b' -> result.append("\\b");
                case '\f' -> result.append("\\f");
                case '\n' -> result.append("\\n");
                case '\r' -> result.append("\\r");
                case '\t' -> result.append("\\t");
                default -> {
                    if (character < 0x20 || isLoneSurrogate(value, index, character)) {
                        // A lone surrogate is escaped rather than written, which
                        // is what a well-formed ECMAScript serializer does, so a
                        // name carrying one still round-trips to the same bytes.
                        result.append(String.format("\\u%04x", (int) character));
                    } else {
                        result.append(character);
                    }
                }
            }
        }
        result.append('"');
    }

    private static boolean isLoneSurrogate(String value, int index, char character) {
        if (Character.isHighSurrogate(character)) {
            return index + 1 >= value.length() || !Character.isLowSurrogate(value.charAt(index + 1));
        }
        if (Character.isLowSurrogate(character)) {
            return index == 0 || !Character.isHighSurrogate(value.charAt(index - 1));
        }
        return false;
    }

    /**
     * Writes a number the way ECMAScript's Number::toString does.
     *
     * <p>Both languages write the shortest digits that read back to the same
     * double, but they do not always agree on which those are, and they never
     * agree on the form: Java writes 100.0 and 1.0E21 where ECMAScript writes
     * 100 and 1e+21. A digest taken over the wrong one silently never matches
     * the compiler's, so the digits are chosen here the way the specification
     * defines rather than borrowed from Java's own printer.
     */
    public static String number(double value) {
        if (!Double.isFinite(value)) {
            throw new JsonException("JSON cannot carry the non-finite number " + value + ".");
        }
        if (value == 0.0) {
            // Negative zero is written as zero, as ECMAScript writes it.
            return "0";
        }
        if (value < 0.0) {
            return "-" + number(-value);
        }

        // The fewest significant digits that still read back to this double,
        // each rounded to nearest with ties to even, which is the value
        // ECMAScript's Number::toString is defined to produce.
        BigDecimal exact = new BigDecimal(value);
        BigDecimal shortest = exact;
        for (int digits = 1; digits <= 17; digits += 1) {
            BigDecimal candidate = exact.round(new MathContext(digits, RoundingMode.HALF_EVEN));
            if (candidate.doubleValue() == value) {
                shortest = candidate;
                break;
            }
        }
        shortest = shortest.stripTrailingZeros();

        String significant = shortest.unscaledValue().toString();
        int k = significant.length();
        // The value is 0.<significant digits> times ten to the n.
        int n = k - shortest.scale();

        if (k <= n && n <= 21) {
            return significant + "0".repeat(n - k);
        }
        if (0 < n && n <= 21) {
            return significant.substring(0, n) + "." + significant.substring(n);
        }
        if (-6 < n && n <= 0) {
            return "0." + "0".repeat(-n) + significant;
        }
        String exponent = (n - 1 >= 0 ? "e+" : "e-") + Math.abs(n - 1);
        if (k == 1) {
            return significant + exponent;
        }
        return significant.charAt(0) + "." + significant.substring(1) + exponent;
    }

    /** Builds an object from alternating keys and values. */
    public static Json.Obj object(Object... pairs) {
        if (pairs.length % 2 != 0) {
            throw new JsonException("An object is built from alternating keys and values.");
        }
        Map<String, Json> members = new LinkedHashMap<>();
        for (int index = 0; index < pairs.length; index += 2) {
            members.put((String) pairs[index], (Json) pairs[index + 1]);
        }
        return new Json.Obj(members);
    }
}
