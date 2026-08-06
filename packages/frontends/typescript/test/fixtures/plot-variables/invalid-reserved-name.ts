import { plot } from "nocuft";

const plotValue = plot.var.saved.number("%uuid shared");

export function invalidReservedName(): void {
    plotValue.clear();
}
