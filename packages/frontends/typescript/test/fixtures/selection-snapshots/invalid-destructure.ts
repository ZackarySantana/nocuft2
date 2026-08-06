import { players } from "nocuft";

export function choose(): void {
    const [selected] = [players.all()];
    selected.sendMessage("destructured");
}
