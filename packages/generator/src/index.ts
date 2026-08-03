import { readFile, writeFile } from "node:fs/promises";
import { normalizePlayerAction, type RawActionDump } from "./actiondump.js";
import {
    renderPlayerActions,
    renderUnsupportedActions,
} from "./render/typescript.js";

const actionDumpURL = new URL("./actiondump.json", import.meta.url);

const source = await readFile(actionDumpURL, "utf-8");
const parsed: RawActionDump = JSON.parse(source);

if (!Array.isArray(parsed.actions)) {
    throw new Error("actions is not an array");
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
const unsupportedOutput = renderUnsupportedActions(allUnsupportedOperations);
const outputUrl = new URL(
    "../../sdk/generated/player-actions.ts",
    import.meta.url,
);
const unsupportedOutputUrl = new URL(
    "../../sdk/generated/unsupported-actions.ts",
    import.meta.url,
);

await Promise.all([
    writeFile(outputUrl, renderedPlayerActions.source, "utf8"),
    writeFile(unsupportedOutputUrl, unsupportedOutput, "utf8"),
]);
