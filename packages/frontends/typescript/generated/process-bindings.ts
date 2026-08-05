// This file is generated. Do not edit manually.

export const processBindings = {
    "declaration": {
        "optionTags": {
            "isHidden": {
                "tag": "is_hidden",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "start": {
        "optionTags": {
            "targetMode": {
                "tag": "target_mode",
                "kind": "string",
                "values": {
                    "withCurrentTargets": "with_current_targets",
                    "withCurrentSelection": "with_current_selection",
                    "withNoTargets": "with_no_targets",
                    "forEachInSelection": "for_each_in_selection"
                }
            },
            "localVariables": {
                "tag": "local_variables",
                "kind": "string",
                "values": {
                    "dontCopy": "dont_copy",
                    "copy": "copy",
                    "share": "share"
                }
            }
        }
    }
} as const;
