import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
    isCurrentPlayerAction,
    normalizePlayerAction,
    normalizeSounds,
    type RawAction,
    type RawActionDump,
} from "../src/actiondump.js";
import type { NormalizationResult, Operation } from "../src/model.js";
import { renderCompilerSounds } from "../src/render/compiler.js";
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

test("uses current actions instead of legacy records", () => {
    const legacy = findPlayerAction("BossBar");
    const replacement = actionDump.actions.find(
        (candidate) => candidate.name.trim() === "SetBossBar",
    );

    assert.ok(replacement);
    assert.equal(isCurrentPlayerAction(legacy), false);
    assert.equal(isCurrentPlayerAction(replacement), true);
});

test("normalizes SendMessage tags and plural input", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("SendMessage")),
    );

    assert.equal(operation.method, "sendMessage");
    assert.equal(operation.description, "Sends a chat message to a player.");
    assert.equal(operation.inputs.length, 1);
    assert.equal(operation.inputs[0].cardinality, "plural");
    assert.deepEqual(operation.inputs[0].acceptedTypes, ["any"]);
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

    assert.deepEqual(input.acceptedTypes, ["number"]);
    assert.equal(input.cardinality, "single");
    if (input.cardinality === "single") {
        assert.equal(input.optional, false);
    }
});

test("uses the non-legacy SetBossBar icon arguments", () => {
    const action = actionDump.actions.find(
        (candidate) =>
            candidate.codeblockName === "PLAYER ACTION" &&
            candidate.name.trim() === "SetBossBar",
    );
    assert.ok(action);
    const operation = requireOperation(
        normalizePlayerAction(action),
    );

    assert.equal(operation.native.action, "SetBossBar");
    assert.deepEqual(
        operation.inputs.map((input) => input.acceptedTypes),
        [["component"], ["number"], ["number"], ["number"]],
    );
});

test("maps upstream item-like value types", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("BlockDisguise")),
    );

    assert.deepEqual(operation.inputs[0].acceptedTypes, ["item"]);
    assert.deepEqual(renderPlayerActions([operation]).unsupported, []);
});

test("derives positional inputs from icon arguments", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("TpSequence")),
    );
    const delay = operation.inputs[1];

    assert.deepEqual(delay.acceptedTypes, ["number"]);
    assert.equal(delay.native.index, 1);
    assert.equal(delay.cardinality, "single");
    if (delay.cardinality === "single") {
        assert.equal(delay.optional, true);
    }
});

test("projects OR signatures into accepted types and optional inputs", () => {
    const heal = requireOperation(
        normalizePlayerAction(findPlayerAction("Heal")),
    );
    const texture = requireOperation(
        normalizePlayerAction(findPlayerAction("DispHeadTexture")),
    );

    assert.deepEqual(heal.inputs[0].acceptedTypes, ["number"]);
    assert.equal(heal.inputs[0].cardinality, "single");
    if (heal.inputs[0].cardinality === "single") {
        assert.equal(heal.inputs[0].optional, true);
    }
    assert.deepEqual(texture.inputs[1].acceptedTypes, ["item", "text"]);
});

test("normalizes tag-only actions with blank icon names", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("GetTargetEntity")),
    );

    assert.deepEqual(operation.inputs, []);
    assert.deepEqual(
        operation.tags.map((tag) => tag.id),
        ["ignore_blocks"],
    );
});

test("renders supported player operations", () => {
    const operations = ["SendMessage", "SetHealth"].map((name) =>
        requireOperation(normalizePlayerAction(findPlayerAction(name))),
    );
    const rendered = renderPlayerActions(operations);

    assert.match(
        rendered.source,
        /sendMessage\(\.\.\.messages: AnyValueInput\[\]\): void;/,
    );
    assert.match(
        rendered.source,
        /\/\*\* Sends a chat message to a player\. \*\//,
    );
    assert.match(rendered.source, /setHealth\(health: number\): void;/);
    assert.match(rendered.intrinsicSource, /"sendMessageWith": \{/);
    assert.match(rendered.intrinsicSource, /"optionsIndex": 0/);
    assert.match(rendered.intrinsicSource, /"input": "message_to_send"/);
    assert.match(rendered.intrinsicSource, /"types": \[\s*"any"/);
    assert.match(rendered.intrinsicSource, /"minimumLength": 0/);
    assert.match(
        rendered.intrinsicSource,
        /"merging": \{[\s\S]*"tag": "text_value_merging"[\s\S]*"noSpaces": "no_spaces"/,
    );
    assert.match(
        rendered.intrinsicSource,
        /"inheritStyles": \{[\s\S]*"kind": "boolean"[\s\S]*"false": "false"/,
    );
    assert.deepEqual(rendered.unsupported, []);
});

test("generates known sound IDs and accepts custom sounds", () => {
    const sounds = normalizeSounds(actionDump.sounds);
    const rendered = renderSounds(sounds);

    assert.ok(sounds.some((sound) => sound.id === "item.trident.thunder"));
    assert.match(rendered, /"item\.trident\.thunder"/);
    assert.match(rendered, /SoundInput = SoundId \| \(string & \{\}\)/);
    assert.match(
        renderCompilerSounds([
            {
                id: "item.trident.thunder",
                native: "ITEM.TRIDENT.THUNDER",
            },
        ]),
        /"item\.trident\.thunder": "ITEM\.TRIDENT\.THUNDER"/,
    );
});

test("requires the minimum length for final plural inputs", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("ActionBar")),
    );
    const rendered = renderPlayerActions([operation]);

    assert.match(
        rendered.source,
        /actionBar\(\.\.\.messages: \[ComponentInput, \.\.\.ComponentInput\[\]\]\): void;/,
    );
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
    assert.match(
        rendered.source,
        /soundsToPlay: \[SoundInput, \.\.\.SoundInput\[\]\]/,
    );
    assert.deepEqual(rendered.unsupported, []);
});

test("uses positional metadata for optional action inputs", () => {
    const operation = requireOperation(
        normalizePlayerAction(findPlayerAction("PlaySound")),
    );

    assert.deepEqual(
        operation.inputs.map((input) => input.native.index),
        [0, 1],
    );
    assert.equal(operation.inputs[1].cardinality, "single");
    if (operation.inputs[1].cardinality === "single") {
        assert.equal(operation.inputs[1].optional, true);
    }
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
    assert.match(
        rendered.intrinsicSource,
        /"setSlotItem": \{[\s\S]*"sourceIndex": 0,[\s\S]*"input": "item_to_set"[\s\S]*"sourceIndex": 1,[\s\S]*"input": "slot_to_set"/,
    );
    assert.deepEqual(rendered.unsupported, []);
});
