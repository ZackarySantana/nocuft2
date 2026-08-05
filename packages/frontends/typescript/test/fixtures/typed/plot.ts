import { item, location, players, sound } from "@nocuft/diamondfire";

const spawn = location(1, 65, -2);

export function typed(): void {
    players
        .all()
        .sendMessage(
            "Count:",
            2,
            false,
            spawn,
            item("stone"),
            sound("item.trident.thunder"),
        );
    players.all().setHealth(20);
    players.all().stopSound("item.trident.thunder");
    players.all().teleport(spawn);
    players.all().giveItems([item("stone"), item("minecraft:dirt")], 2);
}
