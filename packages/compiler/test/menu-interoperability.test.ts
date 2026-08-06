import assert from "node:assert/strict";
import test from "node:test";
import { analyzeTypeScript } from "../../frontends/typescript/analyze.js";
import { emitTemplates } from "../emit-template.js";
import { lowerHighModule } from "../lower.js";

const fixture = (file: string) =>
    new URL(`../../frontends/typescript/test/fixtures/lists/${file}`, import.meta.url).pathname;

test("emits inventory menu List<Item> spreads as one plural native value end to end", () => {
    const high = analyzeTypeScript({
        tsconfigPath: fixture("tsconfig.json"),
        entryFile: fixture("menu.ts"),
    });
    const emitted = emitTemplates(lowerHighModule(high));

    const showMenu = emitted.find((template) => template.name === "showMenu");
    assert.ok(showMenu);
    assert.deepEqual(showMenu.template.blocks.at(-1), {
        id: "block",
        block: "player_action",
        action: "ShowInv",
        args: { items: [{
            item: { id: "var", data: { name: "items", scope: "line" } },
            slot: 0,
        }] },
    });

    const extendMenu = emitted.find((template) => template.name === "extendMenu");
    assert.ok(extendMenu);
    assert.deepEqual(extendMenu.template.blocks.slice(-2).map((block) => ({
        action: block.action,
        spread: block.args.items[0],
    })), ["AddInvRow", "ExpandInv"].map((action) => ({
        action,
        spread: {
            item: { id: "var", data: { name: "items", scope: "line" } },
            slot: 0,
        },
    })));

    const reopenMenu = emitted.find((template) => template.name === "reopenMenu");
    assert.ok(reopenMenu);
    assert.deepEqual(reopenMenu.template.blocks.at(-1), {
        id: "block",
        block: "player_action",
        action: "ShowInv",
        args: { items: [{
            item: { id: "g_val", data: { type: "Inventory Menu Items", target: "Default" } },
            slot: 0,
        }] },
    });
});
