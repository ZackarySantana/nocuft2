// This file is generated. Do not edit manually.
import type { Item, Location } from "../values/index";

export interface PlayerValues {
    /** Gets a target's location. */
    location(): Location;
    /** Gets a target's currently held item. */
    mainHandItem(): Item;
    /** Gets a target's currently held off hand item. */
    offHandItem(): Item;
    /** Gets the item on a target's cursor (used when moving items in the inventory). */
    cursorItem(): Item;
}
