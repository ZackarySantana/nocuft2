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
    }
} as const;
