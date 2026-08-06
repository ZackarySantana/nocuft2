import { item, line, players } from "nocuft";

export function buildItems(material: string, count: number): void {
    const literal = line.item(item("diamond", { count: 3 }));
    const dynamic = line.item(item(material, { count }));
    let sword = line.item(item("diamond_sword"));
    sword = sword.withCount(count);
    sword = sword.withName("Sword", " of Doom");
    sword = sword.withEnchantment("minecraft:sharpness", 5);
    sword = sword.withoutEnchantment("minecraft:sharpness");
    sword = sword.withoutEnchantments();
    sword = sword.withLoreAppended("First", "Second");
    sword = sword.withMaterial(material);
    players.all().giveItems([literal, dynamic, sword]);
}
