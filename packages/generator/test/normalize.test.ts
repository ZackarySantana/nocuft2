import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
    isCurrentPlayerAction,
    isCurrentEntityAction,
    isCurrentGameAction,
    isCurrentControlAction,
    normalizePlayerAction,
    normalizeEntityAction,
    normalizeGameAction,
    normalizeControlAction,
    normalizeEvents,
    normalizeSounds,
    type RawAction,
    type RawActionDump,
} from "../src/actiondump.js";
import type { NormalizationResult, Operation } from "../src/model.js";
import { renderCompilerSounds } from "../src/render/compiler.js";
import { renderControlActions, renderEntityActions, renderGameActions, renderPlayerActions } from "../src/render/typescript.js";
import { renderSounds } from "../src/render/values.js";
import {
    renderCompilerEventBindings,
    renderEvents,
    renderFrontendEventBindings,
} from "../src/render/events.js";
import {
    normalizeTargetGameValues,
    renderPlayerValues,
} from "../src/game-values.js";
import {
    normalizeSelectors,
    renderSelectorBindings,
} from "../src/selectors.js";
import { camelCase, normalizeName } from "../src/util/strings.js";
import {
    normalizeProcessBindings,
    renderProcessSdk,
} from "../src/processes.js";

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

test("normalizes apostrophes without inventing word boundaries", () => {
    assert.equal(normalizeName("Don't copy"), "dont_copy");
    assert.equal(camelCase("Don't copy"), "dontCopy");
});

test("generates control wait and process options from DiamondFire metadata", () => {
    const control = actionDump.actions
        .filter(isCurrentControlAction)
        .map(normalizeControlAction)
        .flatMap((result) => result.kind === "operation" ? [result.operation] : []);
    const wait = control.find((operation) => operation.id === "control.wait");
    assert.ok(wait);
    assert.equal(wait.native.block, "control");
    assert.deepEqual(wait.tags[0], {
        id: "time_unit",
        defaultOption: "ticks",
        options: ["ticks", "seconds", "minutes"],
        native: {
            name: "Time Unit",
            slot: 26,
            options: { ticks: "Ticks", seconds: "Seconds", minutes: "Minutes" },
        },
    });
    assert.match(renderControlActions([wait]).source, /timeUnit\?: "ticks" \| "seconds" \| "minutes"/);

    const processes = normalizeProcessBindings(actionDump.actions);
    assert.equal(processes.start.native.block, "start_process");
    assert.deepEqual(processes.start.tags.map((tag) => tag.id), [
        "target_mode",
        "local_variables",
    ]);
    assert.match(renderProcessSdk(processes), /"withCurrentTargets"/);
    assert.match(renderProcessSdk(processes), /"dontCopy"/);
});

test("generates exact player target game values", () => {
    const values = normalizeTargetGameValues(actionDump.gameValues);

    assert.deepEqual(values.mainHandItem, {
        id: "target.main_hand_item",
        method: "mainHandItem",
        receiver: "player",
        valueType: "item",
        description: "Gets a target's currently held item.",
        native: { name: "Main Hand Item" },
    });
    assert.equal(values.offHandItem.native.name, "Off Hand Item");
    assert.equal(values.location.valueType, "location");
    assert.equal("mainHand" in values, false);
    const sdk = renderPlayerValues(values);
    assert.match(sdk, /mainHandItem\(\): Item;/);
    assert.match(sdk, /offHandItem\(\): Item;/);
});

test("projects selector alternatives into distinct public bindings", () => {
    const selectors = normalizeSelectors(actionDump.actions);
    const byUuid = selectors.find((selector) => selector.id === "select.EntityUUID");
    const named = selectors.find((selector) => selector.id === "select.EntityName");

    assert.ok(byUuid);
    assert.ok(named);
    assert.equal(byUuid.method, "byUuid");
    assert.deepEqual(byUuid.native.arguments, [
        {
            index: 0,
            type: "text",
            cardinality: "plural",
            optional: false,
        },
    ]);
    assert.equal(named.method, "named");
    assert.deepEqual(named.native.arguments, [
        {
            index: 2,
            type: "component",
            cardinality: "plural",
            optional: false,
        },
    ]);

    const rendered = renderSelectorBindings(selectors);
    assert.match(
        rendered,
        /"select\.EntityName"[\s\S]*?"arguments": \[[\s\S]*?"index": 2,[\s\S]*?"type": "component"/,
    );
    assert.doesNotMatch(rendered, /"argumentIndexes"/);
});

test("normalizes and renders supported events", () => {
    const events = normalizeEvents(actionDump.actions, actionDump.gameValues);

    assert.equal(events.length, 125);
    assert.equal(new Set(events.map((event) => event.id)).size, events.length);
    assert.deepEqual(
        events.find((event) => event.id === "plot.startup"),
        {
            id: "plot.startup",
            group: "plot",
            method: "startup",
            description: "Executes code when a plot is first started.",
            callbackParameter: "none",
            cancellable: false,
            fields: [],
            entityRoles: [],
            mutators: [],
            native: { block: "game_event", action: "PlotStartup" },
        },
    );
    assert.deepEqual(events.find((event) => event.id === "player.join"), {
        id: "player.join",
        group: "player",
        method: "join",
        description: "Executes code when a player joins the plot.",
        callbackParameter: "player_event",
        cancellable: false,
        fields: [],
        entityRoles: [],
        mutators: [],
        native: { block: "event", action: "Join" },
    });
    assert.ok(events.some((event) => event.id === "plot.blockExplode"));
    assert.ok(events.some((event) => event.id === "player.playerDmgPlayer"));
    assert.deepEqual(
        events.find((event) => event.id === "entity.entityDmgEntity")
            ?.entityRoles,
        [
            { name: "entity", type: "entity", native: "Default" },
            { name: "victim", type: "entity", native: "Victim" },
            { name: "damager", type: "entity", native: "Damager" },
        ],
    );

    const sdk = renderEvents(events);
    assert.match(
        sdk,
        /import type \{ ComponentInput, Item, Location, SoundInput \} from "\.\/values\/index";/,
    );
    assert.match(sdk, /startup\(callback: \(\) => void\): void;/);
    assert.match(
        sdk,
        /join\(callback: \(event: PlayerJoinEvent\) => void\): void;/,
    );
    assert.match(sdk, /export interface PlayerJoinEvent/);
    assert.match(sdk, /readonly player: Player;/);
    assert.match(sdk, /readonly message: string;/);
    assert.match(sdk, /readonly victim: Player;/);
    assert.match(sdk, /readonly entity: Entity;/);
    assert.match(sdk, /readonly damager: Entity;/);
    assert.match(sdk, /cancel\(\): void;/);
    assert.match(sdk, /setEventDamage\(newDamageAmount: number\): void;/);
    assert.doesNotMatch(sdk, /\bsetDamage\(/);
    const damageEvent = events.find(
        (event) => event.id === "player.playerDmgPlayer",
    );
    assert.deepEqual(damageEvent?.mutators[0], {
        id: "game.set_event_damage",
        method: "setEventDamage",
        description: "Sets the damage dealt in this event.",
        native: { block: "game_action", action: "SetEventDamage" },
        inputs: [
            {
                id: "new_damage_amount",
                acceptedTypes: ["number"],
                cardinality: "single",
                optional: false,
                native: { index: 0 },
            },
        ],
        tags: [],
    });
    assert.equal(
        events.find((event) => event.id === "player.chat")?.mutators.length,
        0,
    );

    const frontend = renderFrontendEventBindings(events);
    assert.match(frontend, /"plot\.startup"/);
    assert.match(frontend, /"callbackParameter": "player_event"/);
    assert.match(frontend, /"setEventDamage"/);
    assert.match(frontend, /"operation": "game\.set_event_damage"/);

    const compiler = renderCompilerEventBindings(events);
    assert.match(compiler, /"block": "game_event"/);
    assert.match(compiler, /"action": "Join"/);
    assert.match(compiler, /"game\.set_event_damage"/);
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

test("normalizes and renders current entity actions", () => {
    const current = actionDump.actions.filter(isCurrentEntityAction);
    assert.equal(current.length, 184);
    const operations = current.flatMap((action) => {
        const result = normalizeEntityAction(action);
        return result.kind === "operation" ? [result.operation] : [];
    });
    const rendered = renderEntityActions(operations);

    assert.equal(operations.length, 184);
    assert.equal(rendered.unsupported.length, 11);
    assert.match(rendered.source, /export interface EntityActions/);
    assert.match(rendered.source, /remove\(\): void;/);
    assert.match(rendered.intrinsicSource, /export const entityIntrinsics/);
    assert.match(rendered.intrinsicSource, /"receiver": "entity"/);
});

test("normalizes ordinary game actions without event-scoped actions", () => {
    const current = actionDump.actions.filter(isCurrentGameAction);
    assert.equal(current.length, 66);
    const operations = current.flatMap((action) => {
        const result = normalizeGameAction(action);
        return result.kind === "operation" ? [result.operation] : [];
    });
    const rendered = renderGameActions(operations);
    const mobSpawning = operations.find(
        (operation) => operation.id === "game.mob_spawning",
    );

    assert.equal(mobSpawning?.method, "mobSpawning");
    assert.deepEqual(mobSpawning?.tags, [
        {
            id: "mob_spawning",
            defaultOption: "enable",
            options: ["enable", "disable"],
            native: {
                name: "Mob Spawning",
                slot: 26,
                options: { enable: "Enable", disable: "Disable" },
            },
        },
    ]);
    assert.match(rendered.source, /mobSpawning\(\): void;/);
    assert.match(
        rendered.source,
        /mobSpawningWith\(options: MobSpawningOptions\): void;/,
    );
    assert.doesNotMatch(rendered.source, /setMobSpawning/);
    assert.doesNotMatch(rendered.source, /setEventDamage/);
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
