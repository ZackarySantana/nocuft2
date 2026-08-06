import { players } from "nocuft";

export function invalidConst(): void {
    const value = 1;
    players.all().sendMessage(value);
}
