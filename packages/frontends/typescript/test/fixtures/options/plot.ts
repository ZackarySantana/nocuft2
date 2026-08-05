import { players } from "@nocuft/diamondfire";

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
