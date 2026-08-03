import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
    normalizePlayerAction,
    normalizeSounds,
    type RawAction,
    type RawActionDump,
} from "../src/actiondump.js";
import type { NormalizationResult, Operation } from "../src/model.js";
import { renderPlayerActions } from "../src/render/typescript.js";
import { renderSounds } from "../src/render/values.js";
import { camelCase, normalizeName } from "../src/util/strings.js";

const source = await readFile(
    new URL("../src/actiondump.json", import.meta.url),
    "utf8",
);
const actionDump: RawActionDump = JSON.parse(source);

function findPlayerAction(name: string): RawAction {
    const action = actionDump.actions.find(
        (candidate) =>
            candidate.name === name &&
            candidate.codeblockName === "PLAYER ACTION",
    );

    assert.ok(action, `Missing PLAYER ACTION / ${name}`);
    return action;
}

function requireOperation(result: NormalizationResult): Operation {
    assert.equal(result.kind, "operation");
    return result.operation;
}

test("normalizes parenthesized plural markers", () => {
    assert.equal(normalizeName("Item(s) to give"), "items_to_give");
    assert.equal(camelCase("Item(s) to give"), "itemsToGive");
});

test("normalizes SendMessage tags and plural input", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("SendMessage")),
    );

    assert.equal(operation.method, "sendMessage");
    assert.equal(operation.description, "Sends a chat message to a player.");
    assert.equal(operation.inputs.length, 1);
    assert.equal(operation.inputs[0].cardinality, "plural");
    assert.deepEqual(
        operation.tags.map((tag) => tag.id),
        ["alignment_mode", "text_value_merging", "inherit_styles"],
    );
});

test("normalizes SetHealth as a required number", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("SetHealth")),
    );
    const input = operation.inputs[0];

    assert.equal(input.type, "number");
    assert.equal(input.cardinality, "single");
    if (input.cardinality === "single") {
        assert.equal(input.optional, false);
    }
});

test("uses icon arguments for BossBar placeholder slots", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("BossBar")),
    );

    assert.deepEqual(
        operation.inputs.map((input) => input.type),
        ["text", "number", "number"],
    );
});

test("preserves TpSequence alternative native encodings", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("TpSequence")),
    );
    const delay = operation.inputs[1];

    assert.equal(delay.type, "number");
    assert.equal(delay.native.encodings.length, 2);
    assert.deepEqual(
        delay.native.encodings.map((encoding) => encoding.layout),
        ["single", "static"],
    );
});

test("classifies GetTargetEntity as unsupported metadata", () => {
    const result = normalizePlayerAction(findPlayerAction("GetTargetEntity"));

    assert.equal(result.kind, "unsupported");
    assert.equal(result.operation.reason, "missing_public_metadata");
});

test("renders supported player operations", () => {
    const operations = ["SendMessage", "SetHealth"].map((name) =>
        requireOperation(normalizePlayerAction(findPlayerAction(name))),
    );
    const rendered = renderPlayerActions(operations);

    assert.match(
        rendered.source,
        /sendMessage\(\.\.\.messages: ComponentInput\[\]\): void;/,
    );
    assert.match(
        rendered.source,
        /\/\*\* Sends a chat message to a player\. \*\//,
    );
    assert.match(rendered.source, /setHealth\(health: number\): void;/);
    assert.deepEqual(rendered.unsupported, []);
});

test("generates known sound IDs and accepts custom sounds", () => {
    const sounds = normalizeSounds(actionDump.sounds);
    const rendered = renderSounds(sounds);

    assert.ok(sounds.some((sound) => sound.id === "item.trident.thunder"));
    assert.match(rendered, /"item\.trident\.thunder"/);
    assert.match(rendered, /SoundInput = SoundId \| \(string & \{\}\)/);
});

test("renders sound action inputs using SoundInput", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("PlaySoundSeq")),
    );
    const rendered = renderPlayerActions([operation]);

    assert.match(
        rendered.source,
        /import type \{ Location, SoundInput \} from "\.\.\/values\/index";/,
    );
    assert.match(rendered.source, /soundsToPlay: SoundInput\[\]/);
    assert.deepEqual(rendered.unsupported, []);
});

test("partially supports optional slots without public metadata", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("PlaySound")),
    );

    assert.deepEqual(operation.omittedInputs, [
        {
            native: {
                slotId: 3,
                index: 2,
            },
            reason: "missing_public_metadata",
        },
    ]);

    const rendered = renderPlayerActions([operation]);
    assert.match(rendered.source, /playSound\(/);
    assert.match(
        rendered.source,
        /native input index 2 \(slot ID 3\) is omitted/,
    );
    assert.deepEqual(rendered.unsupported, []);
});

test("requires undefined for optional inputs before required inputs", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("SetSlotItem")),
    );
    const rendered = renderPlayerActions([operation]);

    assert.match(
        rendered.source,
        /setSlotItem\(itemToSet: Item \| undefined, slotToSet: number\): void;/,
    );
    assert.deepEqual(rendered.unsupported, []);
});
