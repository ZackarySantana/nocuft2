// Defines custom values and where to import theme from.
export interface TypeScriptTypePolicy {
    name: string;
    importFrom?: string;
}

export const typescriptTypes: Readonly<Record<string, TypeScriptTypePolicy>> = {
    number: {
        name: "number",
    },
    text: {
        name: "string",
    },
    location: {
        name: "Location",
        importFrom: "../values/index",
    },
    component: {
        name: "ComponentInput",
        importFrom: "../values/index",
    },
};

export const typescriptInputNames: Readonly<Record<string, string>> = {
    message_to_send: "messages",
    current_health: "health",
};

export const typescriptTagNames: Readonly<Record<string, string>> = {
    alignment_mode: "alignment",
    text_value_merging: "merging",
    inherit_styles: "inheritStyles",
};
