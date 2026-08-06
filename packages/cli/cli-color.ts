import type { WriteStream } from "node:tty";

const RESET = "\u001b[0m";

export function supportsColor(stream: Pick<WriteStream, "isTTY">): boolean {
    if (process.env.FORCE_COLOR === "0") return false;
    if (process.env.FORCE_COLOR !== undefined) return true;
    return stream.isTTY === true && process.env.NO_COLOR === undefined && process.env.TERM !== "dumb";
}

export function colorizeCliText(text: string, enabled: boolean): string {
    if (!enabled || text.length === 0) return text;
    return text.split("\n").map(colorizeLine).join("\n");
}

function colorizeLine(line: string): string {
    if (line.length === 0) return line;

    const diagnostic = /^(\s*)(error|warning)(\[[^\]]+\])?(:)/iu.exec(line);
    if (diagnostic !== null) {
        const prefix = diagnostic[0];
        const indentation = diagnostic[1];
        const severity = diagnostic[2].toLowerCase();
        return `${indentation}${paint(prefix.slice(indentation.length), severity === "error" ? "1;31" : "1;33")}`
            + colorizeValues(line.slice(prefix.length));
    }

    if (/^(?:Usage|Commands|Options):$/u.test(line)) return paint(line, "1;36");
    if (/^[A-Z][A-Z0-9 _-]*(?:\s{2,}[A-Z][A-Z0-9 _-]*)+$/u.test(line)) return paint(line, "1;36");

    let output = colorizeValues(line);
    output = output.replace(
        /^(Registered|Updated|Installed|Uninstalled|Unregistered|Created|Restored|Removed|Renamed|Rolled|Connected|Watching|Stopped)(?=\b)/u,
        (word) => paint(word, "1;32"),
    );
    output = output.replace(/^([A-Z][A-Za-z ]+:)(\s+)/u, (_, label: string, spacing: string) =>
        `${paint(label, "36")}${spacing}`);
    output = output.replace(/^(\s{2})(nocuft\b.*?)(?=\s{2,}|$)/u, (_, indentation: string, command: string) =>
        `${indentation}${paint(command, "36")}`);
    return output;
}

function colorizeValues(line: string): string {
    return line
        .replace(/"(nocuft [^"]+)"/gu, (_, command: string) => `"${paint(command, "36")}"`)
        .replace(/\b(ready|current|active|ok|unchanged|added|merged)\b/gu, (value) => paint(value, "32"))
        .replace(/\b(outdated|warning)\b/gu, (value) => paint(value, "33"))
        .replace(/\b(missing|deleted|failed|stale)\b/gu, (value) => paint(value, "31"))
        .replace(/\bv([1-9][0-9]*)\b/gu, (value) => paint(value, "35"))
        .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,31}\b/gu, (value) => paint(value, "2"))
        .replace(/\b[0-9a-f]{64}\b/gu, (value) => paint(value, "2"))
        .replace(/https?:\/\/[^\s]+/gu, (value) => paint(value, "4;36"));
}

function paint(text: string, code: string): string {
    return `\u001b[${code}m${text}${RESET}`;
}
