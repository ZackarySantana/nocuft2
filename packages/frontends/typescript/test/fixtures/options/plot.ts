import { players } from "nocuft";

export function configured(): void {
    players.all().sendMessageWith(
        {
            alignment: "centered",
            merging: "noSpaces",
            inheritStyles: false,
        },
        "Hello!",
    );
}
