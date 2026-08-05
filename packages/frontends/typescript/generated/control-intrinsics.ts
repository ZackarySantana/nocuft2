// This file is generated. Do not edit manually.

export const controlIntrinsics = {
    "end": {
        "operation": "control.end",
        "receiver": "control",
        "parameters": []
    },
    "endAllThreads": {
        "operation": "control.end_all_threads",
        "receiver": "control",
        "parameters": []
    },
    "endAllThreadsWith": {
        "operation": "control.end_all_threads",
        "receiver": "control",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "endCurrentThread": {
                "tag": "end_current_thread",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "printDebug": {
        "operation": "control.print_debug",
        "receiver": "control",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "message_to_format",
                "types": [
                    "any"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "printDebugWith": {
        "operation": "control.print_debug",
        "receiver": "control",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "message_to_format",
                "types": [
                    "any"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "permission": {
                "tag": "permission",
                "kind": "string",
                "values": {
                    "owner": "owner",
                    "developer": "developer",
                    "builder": "builder",
                    "developerOrBuilder": "developer_or_builder",
                    "whitelisted": "whitelisted",
                    "all": "all"
                }
            },
            "merging": {
                "tag": "text_value_merging",
                "kind": "string",
                "values": {
                    "addSpaces": "add_spaces",
                    "noSpaces": "no_spaces"
                }
            },
            "highlighting": {
                "tag": "highlighting",
                "kind": "string",
                "values": {
                    "none": "none",
                    "error": "error",
                    "warning": "warning",
                    "other": "other"
                }
            },
            "sound": {
                "tag": "sound",
                "kind": "string",
                "values": {
                    "none": "none",
                    "default": "default",
                    "success": "success",
                    "error": "error",
                    "warning": "warning",
                    "lagSlayer": "lag_slayer"
                }
            },
            "messageStyle": {
                "tag": "message_style",
                "kind": "string",
                "values": {
                    "custom": "custom",
                    "debug": "debug",
                    "error": "error",
                    "warning": "warning",
                    "info": "info",
                    "lagSlayer": "lag_slayer"
                }
            }
        }
    },
    "return": {
        "operation": "control.return",
        "receiver": "control",
        "parameters": []
    },
    "returnNtimes": {
        "operation": "control.return_ntimes",
        "receiver": "control",
        "parameters": []
    },
    "skip": {
        "operation": "control.skip",
        "receiver": "control",
        "parameters": []
    },
    "stopRepeat": {
        "operation": "control.stop_repeat",
        "receiver": "control",
        "parameters": []
    },
    "wait": {
        "operation": "control.wait",
        "receiver": "control",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "wait_duration",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "waitWith": {
        "operation": "control.wait",
        "receiver": "control",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "wait_duration",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "timeUnit": {
                "tag": "time_unit",
                "kind": "string",
                "values": {
                    "ticks": "ticks",
                    "seconds": "seconds",
                    "minutes": "minutes"
                }
            }
        }
    }
} as const;
