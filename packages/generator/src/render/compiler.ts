import type { Operation, SoundDefinition } from "../model.js";

export function renderPlayerOperations(
    operations: readonly Operation[],
): string {
    const catalog = Object.fromEntries(
        operations
            .toSorted((left, right) => left.id.localeCompare(right.id))
            .map((operation) => [operation.id, operation]),
    );

    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const playerOperations = ${JSON.stringify(
            catalog,
            null,
            4,
        )} as const;`,
        "",
    ].join("\n");
}

export function renderEntityOperations(
    operations: readonly Operation[],
): string {
    const catalog = Object.fromEntries(
        operations
            .toSorted((left, right) => left.id.localeCompare(right.id))
            .map((operation) => [operation.id, operation]),
    );
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const entityOperations = ${JSON.stringify(catalog, null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderGameOperations(
    operations: readonly Operation[],
): string {
    const catalog = Object.fromEntries(
        operations
            .toSorted((left, right) => left.id.localeCompare(right.id))
            .map((operation) => [operation.id, operation]),
    );
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const gameOperations = ${JSON.stringify(catalog, null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderControlOperations(
    operations: readonly Operation[],
): string {
    const catalog = Object.fromEntries(
        operations
            .toSorted((left, right) => left.id.localeCompare(right.id))
            .map((operation) => [operation.id, operation]),
    );
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const controlOperations = ${JSON.stringify(catalog, null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderCompilerSounds(
    sounds: readonly SoundDefinition[],
): string {
    const catalog = Object.fromEntries(
        sounds.map((sound) => [sound.id, sound.native]),
    );

    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const sounds = ${JSON.stringify(catalog, null, 4)} as const;`,
        "",
    ].join("\n");
}
