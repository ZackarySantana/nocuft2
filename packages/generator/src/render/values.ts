import type { SoundDefinition } from "../model.js";

export function renderSounds(sounds: readonly SoundDefinition[]): string {
    if (sounds.length === 0) {
        throw new Error("Cannot generate SoundId without sounds");
    }

    const members = sounds.map((sound) => `    | ${JSON.stringify(sound.id)}`);

    return [
        "// This file is generated. Do not edit manually.",
        "",
        "export type SoundId =",
        ...members,
        ";",
        "",
        "export type SoundInput = SoundId | (string & {});",
        "",
    ].join("\n");
}
