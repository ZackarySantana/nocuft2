// This file is generated. Do not edit manually.

export const targetGameValues = {
    "location": {
        "id": "target.location",
        "method": "location",
        "receiver": "player",
        "valueType": "location",
        "description": "Gets a target's location.",
        "native": {
            "name": "Location"
        }
    },
    "mainHandItem": {
        "id": "target.main_hand_item",
        "method": "mainHandItem",
        "receiver": "player",
        "valueType": "item",
        "description": "Gets a target's currently held item.",
        "native": {
            "name": "Main Hand Item"
        }
    },
    "offHandItem": {
        "id": "target.off_hand_item",
        "method": "offHandItem",
        "receiver": "player",
        "valueType": "item",
        "description": "Gets a target's currently held off hand item.",
        "native": {
            "name": "Off Hand Item"
        }
    },
    "cursorItem": {
        "id": "target.cursor_item",
        "method": "cursorItem",
        "receiver": "player",
        "valueType": "item",
        "description": "Gets the item on a target's cursor (used when moving items in the inventory).",
        "native": {
            "name": "Cursor Item"
        }
    },
    "inventoryMenuItems": {
        "id": "target.inventory_menu_items",
        "method": "inventoryMenuItems",
        "receiver": "player",
        "valueType": {
            "kind": "list",
            "elementType": "item"
        },
        "description": "Gets a target's current inventory menu items.",
        "native": {
            "name": "Inventory Menu Items"
        }
    },
    "name": {
        "id": "target.name",
        "method": "name",
        "receiver": "player",
        "valueType": "component",
        "description": "Gets a target's name.",
        "native": {
            "name": "Name "
        }
    },
    "uuid": {
        "id": "target.uuid",
        "method": "uuid",
        "receiver": "player",
        "valueType": "text",
        "description": "Gets a target's universally unique identifier.",
        "native": {
            "name": "UUID"
        }
    }
} as const;

export const internalGameValues = {
    "selection_target_uuids": {
        "id": "selection_target_uuids",
        "valueType": {
            "kind": "list",
            "elementType": "text"
        },
        "description": "Gets the UUID of each target in the selection.",
        "native": {
            "name": "Selection Target UUIDs"
        }
    },
    "selection_size": {
        "id": "selection_size",
        "valueType": "number",
        "description": "Gets the amount of targets in the selection.",
        "native": {
            "name": "Selection Size"
        }
    }
} as const;
