// This file is generated. Do not edit manually.
import type { ComponentInput, Item, List, Location } from "../values/index";

export interface PlayerValues {
    /** Gets a target's location. */
    location(): Location;
    /** Gets a target's currently held item. */
    mainHandItem(): Item;
    /** Gets a target's currently held off hand item. */
    offHandItem(): Item;
    /** Gets the item on a target's cursor (used when moving items in the inventory). */
    cursorItem(): Item;
    /** Gets a target's current inventory menu items. */
    inventoryMenuItems(): List<Item>;
    /** Gets a target's name. */
    name(): ComponentInput;
    /** Gets a target's universally unique identifier. */
    uuid(): string;
}
