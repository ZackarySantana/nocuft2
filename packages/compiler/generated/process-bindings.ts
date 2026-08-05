// This file is generated. Do not edit manually.

export const processBindings = {
    "declaration": {
        "native": {
            "block": "process",
            "action": "dynamic"
        },
        "tags": [
            {
                "id": "is_hidden",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Is Hidden",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "start": {
        "native": {
            "block": "start_process",
            "action": "dynamic"
        },
        "tags": [
            {
                "id": "target_mode",
                "defaultOption": "with_current_targets",
                "options": [
                    "with_current_targets",
                    "with_current_selection",
                    "with_no_targets",
                    "for_each_in_selection"
                ],
                "native": {
                    "name": "Target Mode",
                    "slot": 26,
                    "options": {
                        "with_current_targets": "With current targets",
                        "with_current_selection": "With current selection",
                        "with_no_targets": "With no targets",
                        "for_each_in_selection": "For each in selection"
                    }
                }
            },
            {
                "id": "local_variables",
                "defaultOption": "dont_copy",
                "options": [
                    "dont_copy",
                    "copy",
                    "share"
                ],
                "native": {
                    "name": "Local Variables",
                    "slot": 25,
                    "options": {
                        "dont_copy": "Don't copy",
                        "copy": "Copy",
                        "share": "Share"
                    }
                }
            }
        ]
    }
} as const;
