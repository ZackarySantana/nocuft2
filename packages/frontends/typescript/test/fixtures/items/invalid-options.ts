import { item, line } from "nocuft";

export function invalid(): void {
    const invalid = line.item(item("stone", { count: 0 }));
    void invalid;
}
