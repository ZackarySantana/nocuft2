package dev.nocuft.client.json;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A JSON value, and a strict reader for one.
 *
 * <p>The client compares code it read off a plot against code a build
 * produced, and the comparison is a digest of canonical JSON. Reading has to
 * agree with the compiler's reader exactly, so this accepts only what JSON
 * itself defines and refuses anything a lenient reader would quietly repair.
 */
public sealed interface Json {
    /** Members in the order they were read; canonical output sorts them. */
    record Obj(Map<String, Json> members) implements Json {}

    record Arr(List<Json> elements) implements Json {}

    record Str(String value) implements Json {}

    record Num(double value) implements Json {}

    record Bool(boolean value) implements Json {}

    record Null() implements Json {}

    /** Reads exactly one JSON value, refusing trailing content. */
    static Json read(String text) {
        Reader reader = new Reader(text);
        reader.skipWhitespace();
        Json value = reader.readValue();
        reader.skipWhitespace();
        if (!reader.atEnd()) {
            throw new JsonException(
                "Unexpected content after the JSON value at offset " + reader.offset() + "."
            );
        }
        return value;
    }

    /** Reader over one JSON document. */
    final class Reader {
        private final String text;
        private int index;

        private Reader(String text) {
            this.text = text;
        }

        private int offset() {
            return index;
        }

        private boolean atEnd() {
            return index >= text.length();
        }

        private void skipWhitespace() {
            while (index < text.length()) {
                char character = text.charAt(index);
                if (character == ' ' || character == '\t' || character == '\n' || character == '\r') {
                    index += 1;
                } else {
                    return;
                }
            }
        }

        private JsonException fail(String message) {
            return new JsonException(message + " at offset " + index + ".");
        }

        private char peek() {
            if (index >= text.length()) {
                throw fail("Unexpected end of JSON");
            }
            return text.charAt(index);
        }

        private void expect(char character) {
            if (peek() != character) {
                throw fail("Expected " + character);
            }
            index += 1;
        }

        private void expectWord(String word) {
            if (!text.startsWith(word, index)) {
                throw fail("Expected " + word);
            }
            index += word.length();
        }

        private Json readValue() {
            char character = peek();
            switch (character) {
                case '{':
                    return readObject();
                case '[':
                    return readArray();
                case '"':
                    return new Str(readString());
                case 't':
                    expectWord("true");
                    return new Bool(true);
                case 'f':
                    expectWord("false");
                    return new Bool(false);
                case 'n':
                    expectWord("null");
                    return new Null();
                default:
                    return readNumber();
            }
        }

        private Json readObject() {
            expect('{');
            Map<String, Json> members = new LinkedHashMap<>();
            skipWhitespace();
            if (peek() == '}') {
                index += 1;
                return new Obj(members);
            }
            while (true) {
                skipWhitespace();
                String key = readString();
                skipWhitespace();
                expect(':');
                skipWhitespace();
                Json value = readValue();
                // A duplicate key would make the digest depend on which one a
                // reader kept, so it is refused rather than resolved.
                if (members.put(key, value) != null) {
                    throw fail("Duplicate member " + key);
                }
                skipWhitespace();
                char next = peek();
                if (next == ',') {
                    index += 1;
                    continue;
                }
                if (next == '}') {
                    index += 1;
                    return new Obj(members);
                }
                throw fail("Expected , or }");
            }
        }

        private Json readArray() {
            expect('[');
            List<Json> elements = new ArrayList<>();
            skipWhitespace();
            if (peek() == ']') {
                index += 1;
                return new Arr(elements);
            }
            while (true) {
                skipWhitespace();
                elements.add(readValue());
                skipWhitespace();
                char next = peek();
                if (next == ',') {
                    index += 1;
                    continue;
                }
                if (next == ']') {
                    index += 1;
                    return new Arr(elements);
                }
                throw fail("Expected , or ]");
            }
        }

        private String readString() {
            expect('"');
            StringBuilder result = new StringBuilder();
            while (true) {
                char character = peek();
                index += 1;
                if (character == '"') {
                    return result.toString();
                }
                if (character < 0x20) {
                    throw fail("Unescaped control character in a JSON string");
                }
                if (character != '\\') {
                    result.append(character);
                    continue;
                }
                char escape = peek();
                index += 1;
                switch (escape) {
                    case '"' -> result.append('"');
                    case '\\' -> result.append('\\');
                    case '/' -> result.append('/');
                    case 'b' -> result.append('\b');
                    case 'f' -> result.append('\f');
                    case 'n' -> result.append('\n');
                    case 'r' -> result.append('\r');
                    case 't' -> result.append('\t');
                    case 'u' -> {
                        if (index + 4 > text.length()) {
                            throw fail("Truncated unicode escape");
                        }
                        String hex = text.substring(index, index + 4);
                        for (int position = 0; position < 4; position += 1) {
                            if (Character.digit(hex.charAt(position), 16) < 0) {
                                throw fail("Invalid unicode escape");
                            }
                        }
                        result.append((char) Integer.parseInt(hex, 16));
                        index += 4;
                    }
                    default -> throw fail("Invalid escape");
                }
            }
        }

        private Json readNumber() {
            int start = index;
            if (index < text.length() && text.charAt(index) == '-') {
                index += 1;
            }
            readInteger();
            if (index < text.length() && text.charAt(index) == '.') {
                index += 1;
                readDigits();
            }
            if (index < text.length() && (text.charAt(index) == 'e' || text.charAt(index) == 'E')) {
                index += 1;
                if (index < text.length() && (text.charAt(index) == '+' || text.charAt(index) == '-')) {
                    index += 1;
                }
                readDigits();
            }
            String literal = text.substring(start, index);
            double value = Double.parseDouble(literal);
            if (!Double.isFinite(value)) {
                throw fail("JSON cannot carry the non-finite number " + literal);
            }
            return new Num(value);
        }

        private void readInteger() {
            char first = peek();
            if (first == '0') {
                index += 1;
                return;
            }
            if (first < '1' || first > '9') {
                throw fail("Expected a number");
            }
            readDigits();
        }

        private void readDigits() {
            int start = index;
            while (index < text.length()) {
                char character = text.charAt(index);
                if (character < '0' || character > '9') {
                    break;
                }
                index += 1;
            }
            if (index == start) {
                throw fail("Expected a digit");
            }
        }
    }
}
