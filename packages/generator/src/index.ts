import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
    isCurrentPlayerAction,
    isCurrentEntityAction,
    isCurrentGameAction,
    isCurrentControlAction,
    normalizeEvents,
    normalizePlayerAction,
    normalizeEntityAction,
    normalizeGameAction,
    normalizeControlAction,
    normalizeSounds,
    type RawActionDump,
} from "./actiondump.js";
import {
    renderPlayerActions,
    renderEntityActions,
    renderGameActions,
    renderControlActions,
    renderUnsupportedActions,
} from "./render/typescript.js";
import {
    renderCompilerSounds,
    renderPlayerOperations,
    renderEntityOperations,
    renderGameOperations,
    renderControlOperations,
} from "./render/compiler.js";
import { renderSounds } from "./render/values.js";
import {
    renderCompilerEventBindings,
    renderEvents,
    renderFrontendEventBindings,
} from "./render/events.js";
import { normalizeSelectors, renderSelectorBindings } from "./selectors.js";
import {
    normalizeInternalGameValues,
    normalizeTargetGameValues,
    renderPlayerValues,
    renderTargetGameValues,
} from "./game-values.js";
import {
    normalizeProcessBindings,
    renderCompilerProcessBindings,
    renderFrontendProcessBindings,
    renderProcessSdk,
} from "./processes.js";
import {
    normalizeStructuralBindings,
    renderStructuralBindings,
} from "./structures.js";
import {
    normalizeItemTransformBindings,
    renderItemTransformBindings,
} from "./item-transforms.js";

const actionDumpURL = new URL("./actiondump.json", import.meta.url);

const source = await readFile(actionDumpURL, "utf-8");
const parsed: RawActionDump = JSON.parse(source);

if (!Array.isArray(parsed.actions)) {
    throw new Error("actions is not an array");
}
if (!Array.isArray(parsed.sounds)) {
    throw new Error("sounds is not an array");
}
const playerActions = parsed.actions.filter(isCurrentPlayerAction);
const entityActions = parsed.actions.filter(isCurrentEntityAction);
const gameActions = parsed.actions.filter(isCurrentGameAction);
const controlActions = parsed.actions.filter(isCurrentControlAction);
const events = normalizeEvents(parsed.actions, parsed.gameValues);
const targetGameValues = normalizeTargetGameValues(parsed.gameValues);
const internalGameValues = normalizeInternalGameValues(parsed.gameValues);
const structuralBindings = normalizeStructuralBindings(parsed.actions);
const itemTransformBindings = normalizeItemTransformBindings(parsed.actions);
const selectors = normalizeSelectors(parsed.actions, structuralBindings);

if (playerActions.length === 0) {
    throw new Error("No PLAYER ACTION entries found");
}

const results = playerActions.map(normalizePlayerAction);
const entityResults = entityActions.map(normalizeEntityAction);
const gameResults = gameActions.map(normalizeGameAction);
const controlResults = controlActions.map(normalizeControlAction);
const operations = results.flatMap((result) =>
    result.kind === "operation" ? [result.operation] : [],
);
const unsupportedOperations = results.flatMap((result) =>
    result.kind === "unsupported" ? [result.operation] : [],
);
const entityOperations = entityResults.flatMap((result) =>
    result.kind === "operation" ? [result.operation] : [],
);
const unsupportedEntityOperations = entityResults.flatMap((result) =>
    result.kind === "unsupported" ? [result.operation] : [],
);
const gameOperations = gameResults.flatMap((result) =>
    result.kind === "operation" ? [result.operation] : [],
);
const unsupportedGameOperations = gameResults.flatMap((result) =>
    result.kind === "unsupported" ? [result.operation] : [],
);
const controlOperations = controlResults.flatMap((result) =>
    result.kind === "operation" ? [result.operation] : [],
);
const unsupportedControlOperations = controlResults.flatMap((result) =>
    result.kind === "unsupported" ? [result.operation] : [],
);

const renderedPlayerActions = renderPlayerActions(operations);
const renderedEntityActions = renderEntityActions(entityOperations);
const renderedGameActions = renderGameActions(gameOperations);
const renderedControlActions = renderControlActions(controlOperations);
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
const unsupportedOutput = renderUnsupportedActions(allUnsupportedOperations);
const allUnsupportedEntityOperations = [
    ...unsupportedEntityOperations,
    ...renderedEntityActions.unsupported,
];
const entityRendererUnsupportedIds = new Set(
    renderedEntityActions.unsupported.map((operation) => operation.id),
);
const supportedEntityOperations = entityOperations.filter(
    (operation) => !entityRendererUnsupportedIds.has(operation.id),
);
const unsupportedEntityOutput = renderUnsupportedActions(
    allUnsupportedEntityOperations,
    "entity",
);
const allUnsupportedGameOperations = [
    ...unsupportedGameOperations,
    ...renderedGameActions.unsupported,
];
const gameRendererUnsupportedIds = new Set(
    renderedGameActions.unsupported.map((operation) => operation.id),
);
const supportedGameOperations = gameOperations.filter(
    (operation) => !gameRendererUnsupportedIds.has(operation.id),
);
const unsupportedGameOutput = renderUnsupportedActions(
    allUnsupportedGameOperations,
    "game",
);
const allUnsupportedControlOperations = [
    ...unsupportedControlOperations,
    ...renderedControlActions.unsupported,
];
const controlRendererUnsupportedIds = new Set(
    renderedControlActions.unsupported.map((operation) => operation.id),
);
const supportedControlOperations = controlOperations.filter(
    (operation) => !controlRendererUnsupportedIds.has(operation.id),
);
const unsupportedControlOutput = renderUnsupportedActions(
    allUnsupportedControlOperations,
    "control",
);
const sounds = normalizeSounds(parsed.sounds);
const soundsOutput = renderSounds(sounds);
const playerOperationsOutput = renderPlayerOperations(supportedOperations);
const entityOperationsOutput = renderEntityOperations(supportedEntityOperations);
const gameOperationsOutput = renderGameOperations(supportedGameOperations);
const controlOperationsOutput = renderControlOperations(supportedControlOperations);
const processBindings = normalizeProcessBindings(parsed.actions);
const processSdkOutput = renderProcessSdk(processBindings);
const frontendProcessBindingsOutput = renderFrontendProcessBindings(processBindings);
const compilerProcessBindingsOutput = renderCompilerProcessBindings(processBindings);
const compilerSoundsOutput = renderCompilerSounds(sounds);
const eventsOutput = renderEvents(events);
const frontendEventBindingsOutput = renderFrontendEventBindings(events);
const compilerEventBindingsOutput = renderCompilerEventBindings(events);
const selectorBindingsOutput = renderSelectorBindings(selectors);
const targetGameValuesOutput = renderTargetGameValues(targetGameValues, internalGameValues);
const structuralBindingsOutput = renderStructuralBindings(structuralBindings);
const itemTransformBindingsOutput = renderItemTransformBindings(itemTransformBindings);
const outputUrl = new URL(
    "../../sdk/generated/player-actions.ts",
    import.meta.url,
);
const entityOutputUrl = new URL(
    "../../sdk/generated/entity-actions.ts",
    import.meta.url,
);
const gameOutputUrl = new URL(
    "../../sdk/generated/game-actions.ts",
    import.meta.url,
);
const unsupportedGameOutputUrl = new URL(
    "../../sdk/generated/unsupported-game-actions.ts",
    import.meta.url,
);
const controlOutputUrl = new URL(
    "../../sdk/generated/control-actions.ts",
    import.meta.url,
);
const unsupportedControlOutputUrl = new URL(
    "../../sdk/generated/unsupported-control-actions.ts",
    import.meta.url,
);
const processSdkOutputUrl = new URL(
    "../../sdk/generated/process.ts",
    import.meta.url,
);
const unsupportedEntityOutputUrl = new URL(
    "../../sdk/generated/unsupported-entity-actions.ts",
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
const playerIntrinsicsOutputUrl = new URL(
    "../../frontends/typescript/generated/player-intrinsics.ts",
    import.meta.url,
);
const playerOperationsOutputUrl = new URL(
    "../../compiler/generated/player-operations.ts",
    import.meta.url,
);
const entityIntrinsicsOutputUrl = new URL(
    "../../frontends/typescript/generated/entity-intrinsics.ts",
    import.meta.url,
);
const entityOperationsOutputUrl = new URL(
    "../../compiler/generated/entity-operations.ts",
    import.meta.url,
);
const gameIntrinsicsOutputUrl = new URL(
    "../../frontends/typescript/generated/game-intrinsics.ts",
    import.meta.url,
);
const gameOperationsOutputUrl = new URL(
    "../../compiler/generated/game-operations.ts",
    import.meta.url,
);
const controlIntrinsicsOutputUrl = new URL(
    "../../frontends/typescript/generated/control-intrinsics.ts",
    import.meta.url,
);
const controlOperationsOutputUrl = new URL(
    "../../compiler/generated/control-operations.ts",
    import.meta.url,
);
const frontendProcessBindingsOutputUrl = new URL(
    "../../frontends/typescript/generated/process-bindings.ts",
    import.meta.url,
);
const compilerProcessBindingsOutputUrl = new URL(
    "../../compiler/generated/process-bindings.ts",
    import.meta.url,
);
const compilerSoundsOutputUrl = new URL(
    "../../compiler/generated/sounds.ts",
    import.meta.url,
);
const eventsOutputUrl = new URL("../../sdk/events.ts", import.meta.url);
const frontendEventBindingsOutputUrl = new URL(
    "../../frontends/typescript/generated/event-bindings.ts",
    import.meta.url,
);
const compilerEventBindingsOutputUrl = new URL(
    "../../compiler/generated/event-bindings.ts",
    import.meta.url,
);
const frontendSelectorBindingsOutputUrl = new URL(
    "../../frontends/typescript/generated/selector-bindings.ts",
    import.meta.url,
);
const compilerSelectorBindingsOutputUrl = new URL(
    "../../compiler/generated/selector-bindings.ts",
    import.meta.url,
);
const playerValuesOutputUrl = new URL("../../sdk/generated/player-values.ts", import.meta.url);
const frontendGameValueBindingsOutputUrl = new URL("../../frontends/typescript/generated/game-value-bindings.ts", import.meta.url);
const compilerGameValueBindingsOutputUrl = new URL("../../compiler/generated/game-value-bindings.ts", import.meta.url);
const frontendStructuralBindingsOutputUrl = new URL(
    "../../frontends/typescript/generated/structural-bindings.ts",
    import.meta.url,
);
const compilerStructuralBindingsOutputUrl = new URL(
    "../../compiler/generated/structural-bindings.ts",
    import.meta.url,
);
const frontendItemTransformBindingsOutputUrl = new URL(
    "../../frontends/typescript/generated/item-transform-bindings.ts",
    import.meta.url,
);
const compilerItemTransformBindingsOutputUrl = new URL(
    "../../compiler/generated/item-transform-bindings.ts",
    import.meta.url,
);

await mkdir(new URL("./", playerIntrinsicsOutputUrl), { recursive: true });
await mkdir(new URL("./", playerOperationsOutputUrl), { recursive: true });
await mkdir(new URL("./", compilerSoundsOutputUrl), { recursive: true });

await Promise.all([
    writeFile(outputUrl, renderedPlayerActions.source, "utf8"),
    writeFile(entityOutputUrl, renderedEntityActions.source, "utf8"),
    writeFile(gameOutputUrl, renderedGameActions.source, "utf8"),
    writeFile(controlOutputUrl, renderedControlActions.source, "utf8"),
    writeFile(unsupportedOutputUrl, unsupportedOutput, "utf8"),
    writeFile(unsupportedEntityOutputUrl, unsupportedEntityOutput, "utf8"),
    writeFile(unsupportedGameOutputUrl, unsupportedGameOutput, "utf8"),
    writeFile(unsupportedControlOutputUrl, unsupportedControlOutput, "utf8"),
    writeFile(processSdkOutputUrl, processSdkOutput, "utf8"),
    writeFile(soundsOutputUrl, soundsOutput, "utf8"),
    writeFile(
        playerIntrinsicsOutputUrl,
        renderedPlayerActions.intrinsicSource,
        "utf8",
    ),
    writeFile(playerOperationsOutputUrl, playerOperationsOutput, "utf8"),
    writeFile(
        entityIntrinsicsOutputUrl,
        renderedEntityActions.intrinsicSource,
        "utf8",
    ),
    writeFile(entityOperationsOutputUrl, entityOperationsOutput, "utf8"),
    writeFile(gameIntrinsicsOutputUrl, renderedGameActions.intrinsicSource, "utf8"),
    writeFile(gameOperationsOutputUrl, gameOperationsOutput, "utf8"),
    writeFile(controlIntrinsicsOutputUrl, renderedControlActions.intrinsicSource, "utf8"),
    writeFile(controlOperationsOutputUrl, controlOperationsOutput, "utf8"),
    writeFile(frontendProcessBindingsOutputUrl, frontendProcessBindingsOutput, "utf8"),
    writeFile(compilerProcessBindingsOutputUrl, compilerProcessBindingsOutput, "utf8"),
    writeFile(compilerSoundsOutputUrl, compilerSoundsOutput, "utf8"),
    writeFile(eventsOutputUrl, eventsOutput, "utf8"),
    writeFile(
        frontendEventBindingsOutputUrl,
        frontendEventBindingsOutput,
        "utf8",
    ),
    writeFile(
        compilerEventBindingsOutputUrl,
        compilerEventBindingsOutput,
        "utf8",
    ),
    writeFile(frontendSelectorBindingsOutputUrl, selectorBindingsOutput, "utf8"),
    writeFile(compilerSelectorBindingsOutputUrl, selectorBindingsOutput, "utf8"),
    writeFile(playerValuesOutputUrl, renderPlayerValues(targetGameValues), "utf8"),
    writeFile(frontendGameValueBindingsOutputUrl, targetGameValuesOutput, "utf8"),
    writeFile(compilerGameValueBindingsOutputUrl, targetGameValuesOutput, "utf8"),
    writeFile(frontendStructuralBindingsOutputUrl, structuralBindingsOutput, "utf8"),
    writeFile(compilerStructuralBindingsOutputUrl, structuralBindingsOutput, "utf8"),
    writeFile(frontendItemTransformBindingsOutputUrl, itemTransformBindingsOutput, "utf8"),
    writeFile(compilerItemTransformBindingsOutputUrl, itemTransformBindingsOutput, "utf8"),
]);

console.log(
    [
        `Generated ${supportedOperations.length} player actions,`,
        `${supportedEntityOperations.length} entity actions, ${events.length} events,`,
        `${supportedGameOperations.length} game actions, ${supportedControlOperations.length} control actions,`,
        `and documented ${allUnsupportedOperations.length + allUnsupportedEntityOperations.length + allUnsupportedGameOperations.length + allUnsupportedControlOperations.length} unsupported actions.`,
    ].join(" "),
);
