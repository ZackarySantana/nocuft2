import assert from "node:assert/strict";
import test from "node:test";
import { colorizeCliText } from "../cli-color.js";
import { renderTextTable } from "../text-table.js";

test("aligns text tables before terminal colors are applied", () => {
    const table = renderTextTable(
        ["ITEM", "VERSION", "STATUS", "ID"],
        [
            ["a", "v1", "deleted", "first"],
            ["long-item", "v25", "active", "second"],
        ],
    );
    assert.equal(table, [
        "ITEM       VERSION  STATUS   ID",
        "a          v1       deleted  first",
        "long-item  v25      active   second",
        "",
    ].join("\n"));
    const colored = colorizeCliText(table, true);
    assert.match(colored, /a {10}\u001b\[35mv1\u001b\[0m {7}\u001b\[31mdeleted\u001b\[0m  first/u);
});
