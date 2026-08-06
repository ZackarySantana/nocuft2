import assert from "node:assert/strict";
import test from "node:test";
import type { LowModule } from "@nocuft/dfir";
import { emitTemplates } from "../emit-template.js";

test("emits FilterCondition action and subAction on the select object block", () => {
    const low: LowModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "filterSelection",
            body: [{
                kind: "select_object",
                action: "FilterCondition",
                subAction: "=",
                arguments: [],
                tags: [],
            }],
        }],
    };

    assert.deepEqual(emitTemplates(low)[0].template.blocks[1], {
        id: "block",
        block: "select_obj",
        action: "FilterCondition",
        subAction: "=",
        args: { items: [] },
    });
});

test("emits Repeat While as one block with its condition action", () => {
    const low: LowModule = {
        kind: "module",
        templates: [{
            kind: "function",
            name: "repeatWhile",
            body: [{
                kind: "repeat",
                block: "repeat",
                action: "While",
                subAction: ">",
                arguments: [],
                tags: [],
                body: [],
            }],
        }],
    };

    assert.deepEqual(emitTemplates(low)[0].template.blocks.slice(1), [
        {
            id: "block",
            block: "repeat",
            action: "While",
            subAction: ">",
            args: { items: [] },
        },
        { id: "block", block: "bracket", direct: "open", args: { items: [] } },
        { id: "block", block: "bracket", direct: "close", args: { items: [] } },
    ]);
    assert.equal(
        emitTemplates(low)[0].template.blocks.some((block) => block.block === "if_var"),
        false,
    );
});

test("marks only private functions as hidden", () => {
    const low: LowModule = {
        kind: "module",
        templates: [
            { kind: "function", name: "privateFunction", exported: false, body: [] },
            { kind: "function", name: "publicFunction", exported: true, body: [] },
        ],
    };

    const emitted = emitTemplates(low);
    assert.equal(emitted[0].template.blocks[0].args.items[0].item.data.option, "True");
    assert.equal(emitted[1].template.blocks[0].args.items[0].item.data.option, "False");
});
