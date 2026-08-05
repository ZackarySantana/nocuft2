export function normalizeName(value: string): string {
    return value
        .trim()
        .replace(/\(s\)/gi, "s")
        .replace(/['’]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase();
}

export function camelCase(value: string): string {
    const normalized = normalizeName(value);
    return normalized.replace(/_([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
    );
}

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
