import type { EventDefinition } from "../model.js";
import { typescriptTypes } from "../policy.js";
import { capitalize } from "../util/strings.js";
import {
    createParameterBindings,
    renderOperationParameters,
} from "./typescript.js";

function renderCallback(event: EventDefinition): string {
    return event.callbackParameter !== "none" ||
        event.cancellable ||
        event.fields.length > 0 ||
        event.mutators.length > 0
        ? `(event: ${capitalize(event.group)}${capitalize(event.method)}Event) => void`
        : "() => void";
}

const fieldTypes = {
    text: "string",
    number: "number",
    component: "ComponentInput",
    location: "Location",
    item: "Item",
    list: "readonly unknown[]",
    vector: "readonly [number, number, number]",
} as const;

export function renderEvents(events: readonly EventDefinition[]): string {
    const groups = Object.groupBy(events, (event) => event.group);
    const valueImports = new Set<string>();
    for (const event of events) {
        for (const field of event.fields) {
            const rendered = fieldTypes[field.type];
            if (!["string", "number"].includes(rendered) && !rendered.startsWith("readonly ")) {
                valueImports.add(rendered);
            }
        }
        for (const mutator of event.mutators) {
            for (const input of mutator.inputs) {
                for (const type of input.acceptedTypes) {
                    const policy = typescriptTypes[type];
                    if (policy?.importFrom) {
                        valueImports.add(policy.name);
                    }
                }
            }
        }
    }
    const eventInterfaces = events.flatMap((event) => {
        if (
            event.callbackParameter === "none" &&
            !event.cancellable &&
            event.fields.length === 0 &&
            event.mutators.length === 0
        ) {
            return [];
        }
        const members = [
            ...(event.callbackParameter === "player_event"
                ? ["    readonly player: Player;"]
                : []),
            ...event.fields.map(
                (field) =>
                    `    /** ${field.description} */\n    readonly ${field.name}: ${fieldTypes[field.type]};`,
            ),
            ...event.entityRoles.map(
                (role) =>
                    `    readonly ${role.name}: ${role.type === "player" ? "Player" : "Entity"};`,
            ),
            ...event.mutators.map(
                (mutator) =>
                    `    /** ${mutator.description} */\n    ${mutator.method}(${renderOperationParameters(mutator)}): void;`,
            ),
            ...(event.cancellable ? ["    cancel(): void;"] : []),
        ];
        return [
            `export interface ${capitalize(event.group)}${capitalize(event.method)}Event {\n${members.join("\n")}\n}`,
        ];
    });
    const interfaces = Object.entries(groups).map(([group, definitions]) => {
        const methods = definitions
            .map(
                (event) =>
                    `    /** ${event.description} */\n    ${event.method}(callback: ${renderCallback(event)}): void;`,
            )
            .join("\n");
        return `export interface ${capitalize(group)}Events {\n${methods}\n}`;
    });
    const properties = Object.keys(groups)
        .map(
            (group) =>
                `    readonly ${group}: ${capitalize(group)}Events;`,
        )
        .join("\n");

    return `${[
        "// This file is generated. Do not edit manually.",
        'import type { Entity } from "./entities";',
        'import type { Player } from "./players";',
        `import type { ${[...valueImports].sort().join(", ")} } from "./values/index";`,
        ...interfaces,
        ...eventInterfaces,
        `export interface Events {\n${properties}\n}`,
        "export declare const events: Events;",
    ].join("\n\n")}\n`;
}

function catalog(events: readonly EventDefinition[], frontend: boolean) {
    return Object.fromEntries(
        events.map((event) => [
            event.id,
            frontend
                ? {
                      id: event.id,
                      callbackParameter: event.callbackParameter,
                      cancellable: event.cancellable,
                      fields: event.fields,
                      entityRoles: event.entityRoles,
                      mutators: Object.fromEntries(
                          event.mutators.map((mutator) => [
                              mutator.method,
                              {
                                  operation: mutator.id,
                                  parameters: createParameterBindings(mutator),
                              },
                          ]),
                      ),
                      native: event.native,
                  }
                : {
                      cancellable: event.cancellable,
                      fields: event.fields,
                      entityRoles: event.entityRoles,
                      mutators: Object.fromEntries(
                          event.mutators.map((mutator) => [
                              mutator.id,
                              {
                                  native: mutator.native,
                                  inputs: mutator.inputs,
                                  tags: mutator.tags,
                              },
                          ]),
                      ),
                      native: event.native,
                  },
        ]),
    );
}

export function renderFrontendEventBindings(
    events: readonly EventDefinition[],
): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const eventBindings = ${JSON.stringify(catalog(events, true), null, 4)} as const;`,
        "",
    ].join("\n");
}

export function renderCompilerEventBindings(
    events: readonly EventDefinition[],
): string {
    return [
        "// This file is generated. Do not edit manually.",
        "",
        `export const eventBindings = ${JSON.stringify(catalog(events, false), null, 4)} as const;`,
        "",
    ].join("\n");
}
