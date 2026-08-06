// This file is generated. Do not edit manually.

export const structuralBindings = {
    "setVariable": {
        "=": {
            "native": {
                "block": "set_var",
                "action": "="
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "value",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "+": {
            "native": {
                "block": "set_var",
                "action": "+"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_add",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "-": {
            "native": {
                "block": "set_var",
                "action": "-"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_subtract",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "x": {
            "native": {
                "block": "set_var",
                "action": "x"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_multiply",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "/": {
            "native": {
                "block": "set_var",
                "action": "/"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_divide",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": [
                {
                    "id": "division_mode",
                    "defaultOption": "default",
                    "options": [
                        "default",
                        "floor_result"
                    ],
                    "native": {
                        "name": "Division Mode",
                        "slot": 26,
                        "options": {
                            "default": "Default",
                            "floor_result": "Floor result"
                        }
                    }
                }
            ]
        },
        "%": {
            "native": {
                "block": "set_var",
                "action": "%"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dividend",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "divisor",
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
            "tags": [
                {
                    "id": "remainder_mode",
                    "defaultOption": "remainder",
                    "options": [
                        "remainder",
                        "modulo"
                    ],
                    "native": {
                        "name": "Remainder Mode",
                        "slot": 26,
                        "options": {
                            "remainder": "Remainder",
                            "modulo": "Modulo"
                        }
                    }
                }
            ]
        },
        "Exponent": {
            "native": {
                "block": "set_var",
                "action": "Exponent"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "number_input",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": true
                },
                {
                    "id": "exponent",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        },
        "+=": {
            "native": {
                "block": "set_var",
                "action": "+="
            },
            "inputs": [
                {
                    "id": "variable_to_increment",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_increment_by",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 0
                }
            ],
            "tags": []
        },
        "-=": {
            "native": {
                "block": "set_var",
                "action": "-="
            },
            "inputs": [
                {
                    "id": "variable_to_decrement",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "numbers_to_decrement_by",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 0
                }
            ],
            "tags": []
        },
        "String": {
            "native": {
                "block": "set_var",
                "action": "String"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "string_to_set_to",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 0
                }
            ],
            "tags": [
                {
                    "id": "text_value_merging",
                    "defaultOption": "no_spaces",
                    "options": [
                        "add_spaces",
                        "no_spaces"
                    ],
                    "native": {
                        "name": "Text Value Merging",
                        "slot": 26,
                        "options": {
                            "add_spaces": "Add spaces",
                            "no_spaces": "No spaces"
                        }
                    }
                }
            ]
        },
        "CreateList": {
            "native": {
                "block": "set_var",
                "action": "CreateList"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "value_list",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 0
                }
            ],
            "tags": []
        },
        "GetListValue": {
            "native": {
                "block": "set_var",
                "action": "GetListValue"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "list_to_get_value_of",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "index",
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
        "SetListValue": {
            "native": {
                "block": "set_var",
                "action": "SetListValue"
            },
            "inputs": [
                {
                    "id": "list_to_change",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "index",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "value_to_set",
                    "acceptedTypes": [
                        "any"
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
        "AppendValue": {
            "native": {
                "block": "set_var",
                "action": "AppendValue"
            },
            "inputs": [
                {
                    "id": "list_to_append_to",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "values_to_append",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "AppendList": {
            "native": {
                "block": "set_var",
                "action": "AppendList"
            },
            "inputs": [
                {
                    "id": "list_to_append_to",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "lists_to_append",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "TrimList": {
            "native": {
                "block": "set_var",
                "action": "TrimList"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "list_to_trim",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": true
                },
                {
                    "id": "start_index",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "end_index",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 3
                    },
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        },
        "ListLength": {
            "native": {
                "block": "set_var",
                "action": "ListLength"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "list_to_measure",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "CreateDict": {
            "native": {
                "block": "set_var",
                "action": "CreateDict"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "key_list",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": true
                },
                {
                    "id": "value_list",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        },
        "GetDictValue": {
            "native": {
                "block": "set_var",
                "action": "GetDictValue"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_pull_from",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "key",
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
        "SetDictValue": {
            "native": {
                "block": "set_var",
                "action": "SetDictValue"
            },
            "inputs": [
                {
                    "id": "dictionary_to_add_to",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "key",
                    "acceptedTypes": [
                        "text"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "value",
                    "acceptedTypes": [
                        "any"
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
        "GetDictSize": {
            "native": {
                "block": "set_var",
                "action": "GetDictSize"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_measure",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "GetDictKeys": {
            "native": {
                "block": "set_var",
                "action": "GetDictKeys"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_pull_from",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "GetDictValues": {
            "native": {
                "block": "set_var",
                "action": "GetDictValues"
            },
            "inputs": [
                {
                    "id": "variable_to_set",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_pull_from",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "AppendDict": {
            "native": {
                "block": "set_var",
                "action": "AppendDict"
            },
            "inputs": [
                {
                    "id": "dictionary_to_add_to",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_append",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "RemoveDictEntry": {
            "native": {
                "block": "set_var",
                "action": "RemoveDictEntry"
            },
            "inputs": [
                {
                    "id": "dictionary_to_change",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "key_to_remove",
                    "acceptedTypes": [
                        "text"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "expected_values",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "plural",
                    "minimumLength": 0
                }
            ],
            "tags": []
        }
    },
    "ifVariable": {
        "=": {
            "native": {
                "block": "if_var",
                "action": "="
            },
            "inputs": [
                {
                    "id": "value_to_check",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "values_to_compare_to",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "!=": {
            "native": {
                "block": "if_var",
                "action": "!="
            },
            "inputs": [
                {
                    "id": "value_to_check",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "values_to_compare_to",
                    "acceptedTypes": [
                        "any"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "plural",
                    "minimumLength": 1
                }
            ],
            "tags": []
        },
        "<": {
            "native": {
                "block": "if_var",
                "action": "<"
            },
            "inputs": [
                {
                    "id": "number_to_check",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "number_to_compare_to",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "<=": {
            "native": {
                "block": "if_var",
                "action": "<="
            },
            "inputs": [
                {
                    "id": "number_to_check",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "number_to_compare_to",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        ">": {
            "native": {
                "block": "if_var",
                "action": ">"
            },
            "inputs": [
                {
                    "id": "number_to_check",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "number_to_compare_to",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        ">=": {
            "native": {
                "block": "if_var",
                "action": ">="
            },
            "inputs": [
                {
                    "id": "number_to_check",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "number_to_compare_to",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        },
        "DictHasKey": {
            "native": {
                "block": "if_var",
                "action": "DictHasKey"
            },
            "inputs": [
                {
                    "id": "dictionary_to_check",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "key_to_look_for",
                    "acceptedTypes": [
                        "text"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        }
    },
    "repeat": {
        "Range": {
            "native": {
                "block": "repeat",
                "action": "Range"
            },
            "inputs": [
                {
                    "id": "gets_the_current_number_each_iteration",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": true
                },
                {
                    "id": "start_of_range",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "end_of_range",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "step",
                    "acceptedTypes": [
                        "number"
                    ],
                    "native": {
                        "index": 3
                    },
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        },
        "While": {
            "native": {
                "block": "repeat",
                "action": "While"
            },
            "inputs": [],
            "tags": []
        },
        "DoWhile": {
            "native": {
                "block": "repeat",
                "action": "DoWhile"
            },
            "inputs": [],
            "tags": []
        },
        "Forever": {
            "native": {
                "block": "repeat",
                "action": "Forever"
            },
            "inputs": [],
            "tags": []
        },
        "ForEach": {
            "native": {
                "block": "repeat",
                "action": "ForEach"
            },
            "inputs": [
                {
                    "id": "gets_the_current_value_each_iteration",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "list_to_repeat_through",
                    "acceptedTypes": [
                        "list"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": [
                {
                    "id": "allow_list_changes",
                    "defaultOption": "true",
                    "options": [
                        "true",
                        "false_copy_list"
                    ],
                    "native": {
                        "name": "Allow List Changes",
                        "slot": 26,
                        "options": {
                            "true": "True",
                            "false_copy_list": "False (copy list)"
                        }
                    }
                }
            ]
        },
        "ForEachEntry": {
            "native": {
                "block": "repeat",
                "action": "ForEachEntry"
            },
            "inputs": [
                {
                    "id": "gets_the_current_key_each_iteration",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 0
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "gets_the_current_value_each_iteration",
                    "acceptedTypes": [
                        "variable"
                    ],
                    "native": {
                        "index": 1
                    },
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "id": "dictionary_to_repeat_through",
                    "acceptedTypes": [
                        "dict"
                    ],
                    "native": {
                        "index": 2
                    },
                    "cardinality": "single",
                    "optional": false
                }
            ],
            "tags": []
        }
    },
    "else": {
        "native": {
            "block": "else"
        }
    }
} as const;
