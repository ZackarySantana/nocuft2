// This file is generated. Do not edit manually.

export const controlOperations = {
    "control.end": {
        "id": "control.end",
        "receiver": "control",
        "method": "end",
        "description": "Stops the current event thread. Any code after this block will not be executed.",
        "native": {
            "block": "control",
            "action": "End"
        },
        "inputs": [],
        "tags": []
    },
    "control.end_all_threads": {
        "id": "control.end_all_threads",
        "receiver": "control",
        "method": "endAllThreads",
        "description": "Ends all currently active threads, including active lines, loops, etc.",
        "native": {
            "block": "control",
            "action": "EndAllThreads"
        },
        "inputs": [],
        "tags": [
            {
                "id": "end_current_thread",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "End Current Thread",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "control.print_debug": {
        "id": "control.print_debug",
        "receiver": "control",
        "method": "printDebug",
        "description": "Sends a formatted message to the specified plot staff group regardless of which mode they're currently in. Clicking on the message will teleport you to this block.",
        "native": {
            "block": "control",
            "action": "PrintDebug"
        },
        "inputs": [
            {
                "id": "message_to_format",
                "acceptedTypes": [
                    "any"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": [
            {
                "id": "permission",
                "defaultOption": "developer",
                "options": [
                    "owner",
                    "developer",
                    "builder",
                    "developer_or_builder",
                    "whitelisted",
                    "all"
                ],
                "native": {
                    "name": "Permission",
                    "slot": 22,
                    "options": {
                        "owner": "Owner",
                        "developer": "Developer",
                        "builder": "Builder",
                        "developer_or_builder": "Developer or builder",
                        "whitelisted": "Whitelisted",
                        "all": "All"
                    }
                }
            },
            {
                "id": "text_value_merging",
                "defaultOption": "add_spaces",
                "options": [
                    "add_spaces",
                    "no_spaces"
                ],
                "native": {
                    "name": "Text Value Merging",
                    "slot": 23,
                    "options": {
                        "add_spaces": "Add Spaces",
                        "no_spaces": "No Spaces"
                    }
                }
            },
            {
                "id": "highlighting",
                "defaultOption": "none",
                "options": [
                    "none",
                    "error",
                    "warning",
                    "other"
                ],
                "native": {
                    "name": "Highlighting",
                    "slot": 24,
                    "options": {
                        "none": "None",
                        "error": "Error",
                        "warning": "Warning",
                        "other": "Other"
                    }
                }
            },
            {
                "id": "sound",
                "defaultOption": "default",
                "options": [
                    "none",
                    "default",
                    "success",
                    "error",
                    "warning",
                    "lag_slayer"
                ],
                "native": {
                    "name": "Sound",
                    "slot": 25,
                    "options": {
                        "none": "None",
                        "default": "Default",
                        "success": "Success",
                        "error": "Error",
                        "warning": "Warning",
                        "lag_slayer": "LagSlayer"
                    }
                }
            },
            {
                "id": "message_style",
                "defaultOption": "debug",
                "options": [
                    "custom",
                    "debug",
                    "error",
                    "warning",
                    "info",
                    "lag_slayer"
                ],
                "native": {
                    "name": "Message Style",
                    "slot": 26,
                    "options": {
                        "custom": "Custom",
                        "debug": "Debug",
                        "error": "Error",
                        "warning": "Warning",
                        "info": "Info",
                        "lag_slayer": "LagSlayer"
                    }
                }
            }
        ]
    },
    "control.return": {
        "id": "control.return",
        "receiver": "control",
        "method": "return",
        "description": "Skips the rest of a Function sequence and returns to the block it was called from.",
        "native": {
            "block": "control",
            "action": "Return"
        },
        "inputs": [],
        "tags": []
    },
    "control.return_ntimes": {
        "id": "control.return_ntimes",
        "receiver": "control",
        "method": "returnNtimes",
        "description": "",
        "native": {
            "block": "control",
            "action": "ReturnNTimes"
        },
        "inputs": [],
        "tags": []
    },
    "control.skip": {
        "id": "control.skip",
        "receiver": "control",
        "method": "skip",
        "description": "Skips the rest of this repeat statement's code and continues to the next repetition.",
        "native": {
            "block": "control",
            "action": "Skip"
        },
        "inputs": [],
        "tags": []
    },
    "control.stop_repeat": {
        "id": "control.stop_repeat",
        "receiver": "control",
        "method": "stopRepeat",
        "description": "Stops a Repeat sequence and continues to the next code block.",
        "native": {
            "block": "control",
            "action": "StopRepeat"
        },
        "inputs": [],
        "tags": []
    },
    "control.wait": {
        "id": "control.wait",
        "receiver": "control",
        "method": "wait",
        "description": "Pauses the current code sequence for a duration of ticks, seconds, or minutes.",
        "native": {
            "block": "control",
            "action": "Wait"
        },
        "inputs": [
            {
                "id": "wait_duration",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "time_unit",
                "defaultOption": "ticks",
                "options": [
                    "ticks",
                    "seconds",
                    "minutes"
                ],
                "native": {
                    "name": "Time Unit",
                    "slot": 26,
                    "options": {
                        "ticks": "Ticks",
                        "seconds": "Seconds",
                        "minutes": "Minutes"
                    }
                }
            }
        ]
    }
} as const;
