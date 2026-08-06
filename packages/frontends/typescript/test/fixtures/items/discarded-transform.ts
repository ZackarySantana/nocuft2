import { item, line } from "nocuft";

export function invalid(): void {
    const value = line.item(item("stone"));
    value.withCount(2);
}
