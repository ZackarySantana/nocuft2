// This file is generated. Do not edit manually.

export const itemTransformBindings = {
    "item.with_material": {
        "id": "item.with_material",
        "method": "withMaterial",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "SetItemType",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "material",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "item.with_count": {
        "id": "item.with_count",
        "method": "withCount",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "SetItemAmount",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "stack_size",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "item.with_name": {
        "id": "item.with_name",
        "method": "withName",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "SetItemName",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "item.with_enchantment": {
        "id": "item.with_enchantment",
        "method": "withEnchantment",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "AddItemEnchant",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "enchantment_name",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "enchantment_level",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "item.without_enchantment": {
        "id": "item.without_enchantment",
        "method": "withoutEnchantment",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "RemItemEnchant",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "enchantment_name",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "item.without_enchantments": {
        "id": "item.without_enchantments",
        "method": "withoutEnchantments",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "ClearEnchants",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [],
        "tags": []
    },
    "item.with_lore_appended": {
        "id": "item.with_lore_appended",
        "method": "withLoreAppended",
        "resultType": "item",
        "native": {
            "block": "set_var",
            "action": "AddItemLore",
            "destinationIndex": 0,
            "sourceIndex": 1
        },
        "inputs": [
            {
                "id": "lore_to_add",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    }
} as const;
