import { players } from "nocuft";

export function choose(): void {
    const selected = players.all();
    // @ts-expect-error Scalar values require an at-most-one player.
    selected.sendMessage(selected.name());
}
