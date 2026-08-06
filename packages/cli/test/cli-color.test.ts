import assert from "node:assert/strict";
import test from "node:test";
import { colorizeCliText } from "../cli-color.js";

test("colors semantic CLI output when enabled", () => {
    const output = colorizeCliText([
        "ITEM  VERSION  STATUS",
        "sword  v2  outdated",
        "warning[projects.unavailable]: stale is missing",
        "Updated 2 project items.",
    ].join("\n"), true);
    assert.match(output, /\u001b\[1;36mITEM  VERSION  STATUS\u001b\[0m/u);
    assert.match(output, /\u001b\[35mv2\u001b\[0m/u);
    assert.match(output, /\u001b\[33moutdated\u001b\[0m/u);
    assert.match(output, /\u001b\[1;33mwarning\[projects\.unavailable\]:\u001b\[0m/u);
    assert.match(output, /\u001b\[1;32mUpdated\u001b\[0m/u);
});

test("leaves redirected CLI output byte-for-byte plain", () => {
    const output = "error[items.not_found]: Item was not found.\n";
    assert.equal(colorizeCliText(output, false), output);
});
