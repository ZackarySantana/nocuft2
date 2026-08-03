import { readFile, writeFile } from "node:fs/promises";
import {
    normalizePlayerAction,
    normalizeSounds,
    type RawActionDump,
} from "./actiondump.js";
import {
    renderPlayerActions,
    renderUnsupportedActions,
} from "./render/typescript.js";
import { renderSounds } from "./render/values.js";

const actionDumpURL = new URL("./actiondump.json", import.meta.url);

const source = await readFile(actionDumpURL, "utf-8");
const parsed: RawActionDump = JSON.parse(source);

if (!Array.isArray(parsed.actions)) {
    throw new Error("actions is not an array");
}
if (!Array.isArray(parsed.sounds)) {
    throw new Error("sounds is not an array");
}
const playerActions = parsed.actions.filter(
    (action) =>
        action.codeblockName === "PLAYER ACTION" &&
        action.name === action.name.trim() &&
        action.subAction === action.subAction.trim(),
);

if (playerActions.length === 0) {
    throw new Error("No PLAYER ACTION entries found");
}

const results = playerActions.map(normalizePlayerAction);
const operations = results.flatMap((result) =>
    result.kind === "operation" ? [result.operation] : [],
);
const unsupportedOperations = results.flatMap((result) =>
    result.kind === "unsupported" ? [result.operation] : [],
);

const renderedPlayerActions = renderPlayerActions(operations);
const allUnsupportedOperations = [
    ...unsupportedOperations,
    ...renderedPlayerActions.unsupported,
];
const rendererUnsupportedIds = new Set(
    renderedPlayerActions.unsupported.map((operation) => operation.id),
);
const supportedOperations = operations.filter(
    (operation) => !rendererUnsupportedIds.has(operation.id),
);
const partiallySupportedOperations = supportedOperations.filter(
    (operation) => operation.omittedInputs.length > 0,
);
const unsupportedOutput = renderUnsupportedActions(allUnsupportedOperations);
const soundsOutput = renderSounds(normalizeSounds(parsed.sounds));
const outputUrl = new URL(
    "../../sdk/generated/player-actions.ts",
    import.meta.url,
);
const unsupportedOutputUrl = new URL(
    "../../sdk/generated/unsupported-actions.ts",
    import.meta.url,
);
const soundsOutputUrl = new URL(
    "../../sdk/generated/sounds.ts",
    import.meta.url,
);

await Promise.all([
    writeFile(outputUrl, renderedPlayerActions.source, "utf8"),
    writeFile(unsupportedOutputUrl, unsupportedOutput, "utf8"),
    writeFile(soundsOutputUrl, soundsOutput, "utf8"),
]);

console.log(
    [
        `Generated ${supportedOperations.length} player actions`,
        `(${partiallySupportedOperations.length} partial)`,
        `and documented ${allUnsupportedOperations.length} unsupported actions.`,
    ].join(" "),
);
