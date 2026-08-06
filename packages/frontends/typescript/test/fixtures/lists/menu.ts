import { events, type Item, type List, type PlayerTarget } from "nocuft";

export function showMenu(player: PlayerTarget, items: List<Item>): void {
    player.showInv(...items);
}

export function extendMenu(player: PlayerTarget, ...items: Item[]): void {
    player.addInvRow(...items);
    player.expandInv(...items);
}

export const reopenMenu = events.player.clickMenuSlot((event) => {
    event.player.showInv(...event.player.inventoryMenuItems());
});
