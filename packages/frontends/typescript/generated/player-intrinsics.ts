// This file is generated. Do not edit manually.

export const playerIntrinsics = {
    "actionBar": {
        "operation": "player.action_bar",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "message_to_send",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "actionBarWith": {
        "operation": "player.action_bar",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "message_to_send",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "merging": {
                "tag": "text_value_merging",
                "kind": "string",
                "values": {
                    "addSpaces": "add_spaces",
                    "noSpaces": "no_spaces"
                }
            },
            "inheritStyles": {
                "tag": "inherit_styles",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "addInvRow": {
        "operation": "player.add_inv_row",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_display",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "addInvRowWith": {
        "operation": "player.add_inv_row",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "items_to_display",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "newRowPosition": {
                "tag": "new_row_position",
                "kind": "string",
                "values": {
                    "topRow": "top_row",
                    "bottomRow": "bottom_row"
                }
            }
        }
    },
    "adventureMode": {
        "operation": "player.adventure_mode",
        "receiver": "player",
        "parameters": []
    },
    "attackAnimation": {
        "operation": "player.attack_animation",
        "receiver": "player",
        "parameters": []
    },
    "attackAnimationWith": {
        "operation": "player.attack_animation",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "animationArm": {
                "tag": "animation_arm",
                "kind": "string",
                "values": {
                    "swingMainArm": "swing_main_arm",
                    "swingOffArm": "swing_off_arm"
                }
            }
        }
    },
    "blockDisguise": {
        "operation": "player.block_disguise",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_disguise_as",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "display_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "boostElytra": {
        "operation": "player.boost_elytra",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "firework",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "chatStyle": {
        "operation": "player.chat_style",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_chat_style",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "clearDispBlock": {
        "operation": "player.clear_disp_block",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_location_or_start_of_region",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "end_of_region",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "clearInv": {
        "operation": "player.clear_inv",
        "receiver": "player",
        "parameters": []
    },
    "clearInvWith": {
        "operation": "player.clear_inv",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "clearMode": {
                "tag": "clear_mode",
                "kind": "string",
                "values": {
                    "entireInventory": "entire_inventory",
                    "mainInventory": "main_inventory",
                    "upperInventory": "upper_inventory",
                    "hotbar": "hotbar",
                    "armor": "armor"
                }
            },
            "clearCraftingAndCursor": {
                "tag": "clear_crafting_and_cursor",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "clearItems": {
        "operation": "player.clear_items",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_clear",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "clearPotions": {
        "operation": "player.clear_potions",
        "receiver": "player",
        "parameters": []
    },
    "clearScoreboard": {
        "operation": "player.clear_scoreboard",
        "receiver": "player",
        "parameters": []
    },
    "closeInv": {
        "operation": "player.close_inv",
        "receiver": "player",
        "parameters": []
    },
    "combatAttribute": {
        "operation": "player.combat_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "combatAttributeWith": {
        "operation": "player.combat_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "attackDamage": "attack_damage",
                    "attackSpeed": "attack_speed",
                    "sweepingDamageRatio": "sweeping_damage_ratio"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "creativeMode": {
        "operation": "player.creative_mode",
        "receiver": "player",
        "parameters": []
    },
    "damage": {
        "operation": "player.damage",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "damage_to_inflict",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "uuid_of_damager_entity",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "damageWith": {
        "operation": "player.damage",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "damage_to_inflict",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "uuid_of_damager_entity",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "disableBlocks": {
        "operation": "player.disable_blocks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_disallow",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "disguiseShiftVert": {
        "operation": "player.disguise_shift_vert",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "y_offset",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "dispHeadTexture": {
        "operation": "player.disp_head_texture",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "head_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "player_head",
                "types": [
                    "item",
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayBellRing": {
        "operation": "player.display_bell_ring",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayBellRingWith": {
        "operation": "player.display_bell_ring",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "block_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ringDirection": {
                "tag": "ring_direction",
                "kind": "string",
                "values": {
                    "north": "north",
                    "south": "south",
                    "west": "west",
                    "east": "east"
                }
            }
        }
    },
    "displayBlock": {
        "operation": "player.display_block",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_display",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "block_location_or_start_of_region",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "end_of_region",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "block_data",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "displayBlockOpen": {
        "operation": "player.display_block_open",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayBlockOpenWith": {
        "operation": "player.display_block_open",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "block_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "containerState": {
                "tag": "container_state",
                "kind": "string",
                "values": {
                    "open": "open",
                    "closed": "closed"
                }
            }
        }
    },
    "displayEquipment": {
        "operation": "player.display_equipment",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "entity_uuid_or_name",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "equipment",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayFracture": {
        "operation": "player.display_fracture",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_fracture",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "fracture_level",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayFractureWith": {
        "operation": "player.display_fracture",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "blocks_to_fracture",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "fracture_level",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "overwritePreviousFracture": {
                "tag": "overwrite_previous_fracture",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "displayGateway": {
        "operation": "player.display_gateway",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "gateway_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayGatewayWith": {
        "operation": "player.display_gateway",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "gateway_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "animationType": {
                "tag": "animation_type",
                "kind": "string",
                "values": {
                    "initialBeam": "initial_beam",
                    "periodicBeam": "periodic_beam"
                }
            }
        }
    },
    "displayHologram": {
        "operation": "player.display_hologram",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "display_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "text_to_display",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayLightning": {
        "operation": "player.display_lightning",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "strike_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayPickup": {
        "operation": "player.display_pickup",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "entity_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "collector_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "displayPickupWith": {
        "operation": "player.display_pickup",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "entity_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "collector_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "displaySignText": {
        "operation": "player.display_sign_text",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sign_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "text_lines",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "displaySignTextWith": {
        "operation": "player.display_sign_text",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sign_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "text_lines",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "signSide": {
                "tag": "sign_side",
                "kind": "string",
                "values": {
                    "front": "front",
                    "back": "back"
                }
            },
            "textColor": {
                "tag": "text_color",
                "kind": "string",
                "values": {
                    "white": "white",
                    "orange": "orange",
                    "magenta": "magenta",
                    "lightBlue": "light_blue",
                    "yellow": "yellow",
                    "lime": "lime",
                    "pink": "pink",
                    "gray": "gray",
                    "lightGray": "light_gray",
                    "cyan": "cyan",
                    "purple": "purple",
                    "blue": "blue",
                    "brown": "brown",
                    "green": "green",
                    "red": "red",
                    "black": "black"
                }
            },
            "glowing": {
                "tag": "glowing",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "enableBlocks": {
        "operation": "player.enable_blocks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_allow",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "expandInv": {
        "operation": "player.expand_inv",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_display",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "faceLocation": {
        "operation": "player.face_location",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "location_to_face",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "fallingAttribute": {
        "operation": "player.falling_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "fallingAttributeWith": {
        "operation": "player.falling_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "gravity": "gravity",
                    "safeFallDistance": "safe_fall_distance",
                    "fallDamageMultiplier": "fall_damage_multiplier"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "getTargetEntity": {
        "operation": "player.get_target_entity",
        "receiver": "player",
        "parameters": []
    },
    "getTargetEntityWith": {
        "operation": "player.get_target_entity",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "ignoreBlocks": {
                "tag": "ignore_blocks",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "giveExhaustion": {
        "operation": "player.give_exhaustion",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "exhaustion_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "giveExp": {
        "operation": "player.give_exp",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "experience_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "giveExpWith": {
        "operation": "player.give_exp",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "experience_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "giveExperience": {
                "tag": "give_experience",
                "kind": "string",
                "values": {
                    "points": "points",
                    "levels": "levels",
                    "levelPercentage": "level_percentage"
                }
            }
        }
    },
    "giveFood": {
        "operation": "player.give_food",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "food_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "giveItems": {
        "operation": "player.give_items",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_give",
                "types": [
                    "item"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "amount_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "giveSaturation": {
        "operation": "player.give_saturation",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "saturation_to_give",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "heal": {
        "operation": "player.heal",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "amount_to_heal",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "healthAttribute": {
        "operation": "player.health_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "healthAttributeWith": {
        "operation": "player.health_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "maximumHealth": "maximum_health",
                    "maximumAbsorptionHealth": "maximum_absorption_health",
                    "armor": "armor",
                    "armorToughness": "armor_toughness"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "hurtAnimation": {
        "operation": "player.hurt_animation",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "damage_source",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "instantRespawn": {
        "operation": "player.instant_respawn",
        "receiver": "player",
        "parameters": []
    },
    "instantRespawnWith": {
        "operation": "player.instant_respawn",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "instantRespawn": {
                "tag": "instant_respawn",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "kbattribute": {
        "operation": "player.kbattribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "kbattributeWith": {
        "operation": "player.kbattribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "knockbackResistance": "knockback_resistance",
                    "explosionKnockbackResistance": "explosion_knockback_resistance"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "kick": {
        "operation": "player.kick",
        "receiver": "player",
        "parameters": []
    },
    "launchFwd": {
        "operation": "player.launch_fwd",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "launchFwdWith": {
        "operation": "player.launch_fwd",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "addToCurrentVelocity": {
                "tag": "add_to_current_velocity",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "launchAxis": {
                "tag": "launch_axis",
                "kind": "string",
                "values": {
                    "pitchAndYaw": "pitch_and_yaw",
                    "yawOnly": "yaw_only"
                }
            }
        }
    },
    "launchProj": {
        "operation": "player.launch_proj",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "projectile_to_launch",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "launch_point",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "projectile_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "speed",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
                "input": "inaccuracy",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "launchToward": {
        "operation": "player.launch_toward",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "launch_destination",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "launchTowardWith": {
        "operation": "player.launch_toward",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "launch_destination",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "addToCurrentVelocity": {
                "tag": "add_to_current_velocity",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "ignoreDistance": {
                "tag": "ignore_distance",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "launchUp": {
        "operation": "player.launch_up",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "launchUpWith": {
        "operation": "player.launch_up",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "launch_power",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "addToCurrentVelocity": {
                "tag": "add_to_current_velocity",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "loadInv": {
        "operation": "player.load_inv",
        "receiver": "player",
        "parameters": []
    },
    "loadInvWith": {
        "operation": "player.load_inv",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "codeFlow": {
                "tag": "code_flow",
                "kind": "string",
                "values": {
                    "synchronous": "synchronous",
                    "asynchronous": "asynchronous"
                }
            }
        }
    },
    "lockDisgRotation": {
        "operation": "player.lock_disg_rotation",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "pitch_to_lock_to",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "yaw_to_lock_to",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "lockDisgRotationWith": {
        "operation": "player.lock_disg_rotation",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "pitch_to_lock_to",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "yaw_to_lock_to",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "pitch": {
                "tag": "pitch",
                "kind": "string",
                "values": {
                    "lock": "lock",
                    "unlock": "unlock",
                    "noChange": "no_change"
                }
            },
            "yaw": {
                "tag": "yaw",
                "kind": "string",
                "values": {
                    "lock": "lock",
                    "unlock": "unlock",
                    "noChange": "no_change"
                }
            }
        }
    },
    "mimic": {
        "operation": "player.mimic",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "uuid_of_target_to_disguise_as",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "mimicWith": {
        "operation": "player.mimic",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "uuid_of_target_to_disguise_as",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "removeOriginalEntity": {
                "tag": "remove_original_entity",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "miningAttribute": {
        "operation": "player.mining_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "miningAttributeWith": {
        "operation": "player.mining_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "blockBreakSpeed": "block_break_speed",
                    "miningEfficiency": "mining_efficiency",
                    "submergedMiningSpeed": "submerged_mining_speed"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "miscAttribute": {
        "operation": "player.misc_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "miscAttributeWith": {
        "operation": "player.misc_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "scale": "scale",
                    "luck": "luck",
                    "oxygenBonus": "oxygen_bonus",
                    "burningTime": "burning_time",
                    "cameraDistance": "camera_distance"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "mobDisguise": {
        "operation": "player.mob_disguise",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "mob_to_disguise_as",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "display_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "movementAttribute": {
        "operation": "player.movement_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "movementAttributeWith": {
        "operation": "player.movement_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "walkingSpeed": "walking_speed",
                    "flyingSpeed": "flying_speed",
                    "jumpStrength": "jump_strength",
                    "sneakingSpeed": "sneaking_speed",
                    "stepHeight": "step_height",
                    "movementEfficiency": "movement_efficiency",
                    "waterMovementEfficiency": "water_movement_efficiency"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "openBlockInv": {
        "operation": "player.open_block_inv",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "container_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "openBook": {
        "operation": "player.open_book",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "book_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "openSign": {
        "operation": "player.open_sign",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sign_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "openSignWith": {
        "operation": "player.open_sign",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sign_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "signSide": {
                "tag": "sign_side",
                "kind": "string",
                "values": {
                    "front": "front",
                    "back": "back"
                }
            }
        }
    },
    "openTradeMenu": {
        "operation": "player.open_trade_menu",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "villager_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "openTradeMenuWith": {
        "operation": "player.open_trade_menu",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "villager_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "playEntitySound": {
        "operation": "player.play_entity_sound",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sound_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "playEntitySoundWith": {
        "operation": "player.play_entity_sound",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sound_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "soundSource": {
                "tag": "sound_source",
                "kind": "string",
                "values": {
                    "master": "master",
                    "music": "music",
                    "jukeboxNoteBlocks": "jukebox_note_blocks",
                    "weather": "weather",
                    "blocks": "blocks",
                    "hostileCreatures": "hostile_creatures",
                    "friendlyCreatures": "friendly_creatures",
                    "players": "players",
                    "ambientEnvironment": "ambient_environment",
                    "voiceSpeech": "voice_speech",
                    "ui": "ui"
                }
            },
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "playSound": {
        "operation": "player.play_sound",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sound_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "playback_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "playSoundWith": {
        "operation": "player.play_sound",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sound_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "playback_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "soundSource": {
                "tag": "sound_source",
                "kind": "string",
                "values": {
                    "master": "master",
                    "music": "music",
                    "jukeboxNoteBlocks": "jukebox_note_blocks",
                    "weather": "weather",
                    "blocks": "blocks",
                    "hostileCreatures": "hostile_creatures",
                    "friendlyCreatures": "friendly_creatures",
                    "players": "players",
                    "ambientEnvironment": "ambient_environment",
                    "voiceSpeech": "voice_speech",
                    "ui": "ui"
                }
            }
        }
    },
    "playSoundSeq": {
        "operation": "player.play_sound_seq",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sounds_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "sound_delay_ticks_default_60",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "playback_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "playSoundSeqWith": {
        "operation": "player.play_sound_seq",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sounds_to_play",
                "types": [
                    "sound"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "sound_delay_ticks_default_60",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "playback_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "soundSource": {
                "tag": "sound_source",
                "kind": "string",
                "values": {
                    "master": "master",
                    "music": "music",
                    "jukeboxNoteBlocks": "jukebox_note_blocks",
                    "weather": "weather",
                    "blocks": "blocks",
                    "hostileCreatures": "hostile_creatures",
                    "friendlyCreatures": "friendly_creatures",
                    "players": "players",
                    "ambientEnvironment": "ambient_environment",
                    "voiceSpeech": "voice_speech",
                    "ui": "ui"
                }
            }
        }
    },
    "playerDisguise": {
        "operation": "player.player_disguise",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "player_name_to_disguise_as",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "display_skin",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "promptPurchase": {
        "operation": "player.prompt_purchase",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "product_id",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "reachAttribute": {
        "operation": "player.reach_attribute",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "reachAttributeWith": {
        "operation": "player.reach_attribute",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "attribute": {
                "tag": "attribute",
                "kind": "string",
                "values": {
                    "blockInteractionRange": "block_interaction_range",
                    "entityInteractionRange": "entity_interaction_range"
                }
            },
            "valueType": {
                "tag": "value_type",
                "kind": "string",
                "values": {
                    "direct": "direct",
                    "percentageBase": "percentage_base",
                    "percentageRelative": "percentage_relative"
                }
            }
        }
    },
    "removeBossBar": {
        "operation": "player.remove_boss_bar",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "boss_bar_position",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "removeInvRow": {
        "operation": "player.remove_inv_row",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "rows_to_remove",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "removeInvRowWith": {
        "operation": "player.remove_inv_row",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "rows_to_remove",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "rowToRemove": {
                "tag": "row_to_remove",
                "kind": "string",
                "values": {
                    "topRow": "top_row",
                    "bottomRow": "bottom_row"
                }
            }
        }
    },
    "removeItems": {
        "operation": "player.remove_items",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_remove",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "removeScore": {
        "operation": "player.remove_score",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "score_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "replaceItems": {
        "operation": "player.replace_items",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_replace",
                "types": [
                    "item"
                ],
                "kind": "array",
                "optional": true,
                "minimumLength": 0
            },
            {
                "sourceIndex": 1,
                "input": "item_to_replace_with",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "amount_of_items_to_replace",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "resourcePack": {
        "operation": "player.resource_pack",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "resource_pack_url",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "rideEntity": {
        "operation": "player.ride_entity",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "rideEntityWith": {
        "operation": "player.ride_entity",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "rmWorldBorder": {
        "operation": "player.rm_world_border",
        "receiver": "player",
        "parameters": []
    },
    "rollbackBlocks": {
        "operation": "player.rollback_blocks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "rollback_time",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "saveInv": {
        "operation": "player.save_inv",
        "receiver": "player",
        "parameters": []
    },
    "scoreDefFormat": {
        "operation": "player.score_def_format",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "content_or_style",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "scoreDefFormatWith": {
        "operation": "player.score_def_format",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "content_or_style",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "numberFormat": {
                "tag": "number_format",
                "kind": "string",
                "values": {
                    "fixed": "fixed",
                    "styled": "styled",
                    "blank": "blank",
                    "reset": "reset"
                }
            }
        }
    },
    "scoreLineFormat": {
        "operation": "player.score_line_format",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "score_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "content_or_style",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "scoreLineFormatWith": {
        "operation": "player.score_line_format",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "score_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "content_or_style",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "numberFormat": {
                "tag": "number_format",
                "kind": "string",
                "values": {
                    "fixed": "fixed",
                    "styled": "styled",
                    "blank": "blank",
                    "reset": "reset"
                }
            }
        }
    },
    "sendAdvancement": {
        "operation": "player.send_advancement",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "advancement_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "advancement_icon",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "sendAdvancementWith": {
        "operation": "player.send_advancement",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "advancement_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "advancement_icon",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "toastType": {
                "tag": "toast_type",
                "kind": "string",
                "values": {
                    "advancement": "advancement",
                    "goal": "goal",
                    "challenge": "challenge"
                }
            }
        }
    },
    "sendMessage": {
        "operation": "player.send_message",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "message_to_send",
                "types": [
                    "any"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "sendMessageWith": {
        "operation": "player.send_message",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "message_to_send",
                "types": [
                    "any"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "alignment": {
                "tag": "alignment_mode",
                "kind": "string",
                "values": {
                    "regular": "regular",
                    "centered": "centered"
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
            "inheritStyles": {
                "tag": "inherit_styles",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "sendMessageSeq": {
        "operation": "player.send_message_seq",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "messages_to_send",
                "types": [
                    "component"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "message_delay_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "sendMessageSeqWith": {
        "operation": "player.send_message_seq",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "messages_to_send",
                "types": [
                    "component"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "message_delay_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "alignment": {
                "tag": "alignment_mode",
                "kind": "string",
                "values": {
                    "regular": "regular",
                    "centered": "centered"
                }
            }
        }
    },
    "sendTitle": {
        "operation": "player.send_title",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "title_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "subtitle_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "title_duration",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "fade_in_length",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
                "input": "fade_out_length",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "sendToPlot": {
        "operation": "player.send_to_plot",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "plot_handle_or_id",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setAbsorption": {
        "operation": "player.set_absorption",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "absorption_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setAirTicks": {
        "operation": "player.set_air_ticks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "breath_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setAllowFlight": {
        "operation": "player.set_allow_flight",
        "receiver": "player",
        "parameters": []
    },
    "setAllowFlightWith": {
        "operation": "player.set_allow_flight",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "allowFlight": {
                "tag": "allow_flight",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setAllowPvp": {
        "operation": "player.set_allow_pvp",
        "receiver": "player",
        "parameters": []
    },
    "setAllowPvpWith": {
        "operation": "player.set_allow_pvp",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "pvp": {
                "tag": "pvp",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setArmor": {
        "operation": "player.set_armor",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "armor_to_set",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setArrowsStuck": {
        "operation": "player.set_arrows_stuck",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "arrow_count",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setBossBar": {
        "operation": "player.set_boss_bar",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "title",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "current_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "maximum_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "boss_bar_position",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setBossBarWith": {
        "operation": "player.set_boss_bar",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "title",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "current_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "maximum_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
                "input": "boss_bar_position",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "barStyle": {
                "tag": "bar_style",
                "kind": "string",
                "values": {
                    "solid": "solid",
                    "6Segments": "6_segments",
                    "10Segments": "10_segments",
                    "12Segments": "12_segments",
                    "20Segments": "20_segments"
                }
            },
            "skyEffect": {
                "tag": "sky_effect",
                "kind": "string",
                "values": {
                    "none": "none",
                    "createFog": "create_fog",
                    "darkenSky": "darken_sky",
                    "both": "both"
                }
            },
            "barColor": {
                "tag": "bar_color",
                "kind": "string",
                "values": {
                    "red": "red",
                    "purple": "purple",
                    "pink": "pink",
                    "blue": "blue",
                    "green": "green",
                    "yellow": "yellow",
                    "white": "white"
                }
            }
        }
    },
    "setChatTag": {
        "operation": "player.set_chat_tag",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "chat_tag",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "setCollidable": {
        "operation": "player.set_collidable",
        "receiver": "player",
        "parameters": []
    },
    "setCollidableWith": {
        "operation": "player.set_collidable",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "collision": {
                "tag": "collision",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setCompass": {
        "operation": "player.set_compass",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_target",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setCursorItem": {
        "operation": "player.set_cursor_item",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "item_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setDisguiseVisible": {
        "operation": "player.set_disguise_visible",
        "receiver": "player",
        "parameters": []
    },
    "setDisguiseVisibleWith": {
        "operation": "player.set_disguise_visible",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "disguiseVisible": {
                "tag": "disguise_visible",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setDropsEnabled": {
        "operation": "player.set_drops_enabled",
        "receiver": "player",
        "parameters": []
    },
    "setDropsEnabledWith": {
        "operation": "player.set_drops_enabled",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "spawnDeathDrops": {
                "tag": "spawn_death_drops",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setEntityHidden": {
        "operation": "player.set_entity_hidden",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "entity_uuids",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setEntityHiddenWith": {
        "operation": "player.set_entity_hidden",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "entity_uuids",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "hidden": {
                "tag": "hidden",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            },
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setEquipment": {
        "operation": "player.set_equipment",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "item_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setEquipmentWith": {
        "operation": "player.set_equipment",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "item_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "equipmentSlot": {
                "tag": "equipment_slot",
                "kind": "string",
                "values": {
                    "mainHand": "main_hand",
                    "offHand": "off_hand",
                    "head": "head",
                    "chest": "chest",
                    "legs": "legs",
                    "feet": "feet"
                }
            }
        }
    },
    "setExhaustion": {
        "operation": "player.set_exhaustion",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "exhaustion_level_0_4",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setExp": {
        "operation": "player.set_exp",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "experience_to_set",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setExpWith": {
        "operation": "player.set_exp",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "experience_to_set",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "setExperience": {
                "tag": "set_experience",
                "kind": "string",
                "values": {
                    "points": "points",
                    "level": "level",
                    "levelPercentage": "level_percentage"
                }
            }
        }
    },
    "setFallDistance": {
        "operation": "player.set_fall_distance",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "fall_distance_blocks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setFireTicks": {
        "operation": "player.set_fire_ticks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setFlying": {
        "operation": "player.set_flying",
        "receiver": "player",
        "parameters": []
    },
    "setFlyingWith": {
        "operation": "player.set_flying",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "flying": {
                "tag": "flying",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setFogDistance": {
        "operation": "player.set_fog_distance",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "fog_distance_in_chunks_2_7",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setFoodLevel": {
        "operation": "player.set_food_level",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "food_level_1_20",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setFreezeTicks": {
        "operation": "player.set_freeze_ticks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "ticks_0_140",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setFreezeTicksWith": {
        "operation": "player.set_freeze_ticks",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "ticks_0_140",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "tickingLocked": {
                "tag": "ticking_locked",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setGliding": {
        "operation": "player.set_gliding",
        "receiver": "player",
        "parameters": []
    },
    "setGlidingWith": {
        "operation": "player.set_gliding",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "gliding": {
                "tag": "gliding",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setHandCrafting": {
        "operation": "player.set_hand_crafting",
        "receiver": "player",
        "parameters": []
    },
    "setHandCraftingWith": {
        "operation": "player.set_hand_crafting",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "allowHandCrafting": {
                "tag": "allow_hand_crafting",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setHealth": {
        "operation": "player.set_health",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "current_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setHotbar": {
        "operation": "player.set_hotbar",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_set",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setInvName": {
        "operation": "player.set_inv_name",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "inventory_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setInvNameWith": {
        "operation": "player.set_inv_name",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "inventory_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "alignment": {
                "tag": "alignment_mode",
                "kind": "string",
                "values": {
                    "regular": "regular",
                    "centered": "centered"
                }
            }
        }
    },
    "setInventory": {
        "operation": "player.set_inventory",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_set",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setInventoryKept": {
        "operation": "player.set_inventory_kept",
        "receiver": "player",
        "parameters": []
    },
    "setInventoryKeptWith": {
        "operation": "player.set_inventory_kept",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "inventoryKept": {
                "tag": "inventory_kept",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setInvulTicks": {
        "operation": "player.set_invul_ticks",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setItemCooldown": {
        "operation": "player.set_item_cooldown",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "item_type_to_affect",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "cooldown_in_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setMaxHealth": {
        "operation": "player.set_max_health",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "maximum_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setMaxHealthWith": {
        "operation": "player.set_max_health",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "maximum_health",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "healPlayerToMaxHealth": {
                "tag": "heal_player_to_max_health",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setMenuItem": {
        "operation": "player.set_menu_item",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "slot",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "item_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setNameColor": {
        "operation": "player.set_name_color",
        "receiver": "player",
        "parameters": []
    },
    "setNameColorWith": {
        "operation": "player.set_name_color",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "nameColor": {
                "tag": "name_color",
                "kind": "string",
                "values": {
                    "black": "black",
                    "darkBlue": "dark_blue",
                    "darkGreen": "dark_green",
                    "darkAqua": "dark_aqua",
                    "darkRed": "dark_red",
                    "darkPurple": "dark_purple",
                    "gold": "gold",
                    "gray": "gray",
                    "darkGray": "dark_gray",
                    "blue": "blue",
                    "green": "green",
                    "aqua": "aqua",
                    "red": "red",
                    "lightPurple": "light_purple",
                    "yellow": "yellow",
                    "white": "white",
                    "none": "none"
                }
            }
        }
    },
    "setNamePrefix": {
        "operation": "player.set_name_prefix",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "prefix_suffix_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setNamePrefixWith": {
        "operation": "player.set_name_prefix",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "prefix_suffix_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "textType": {
                "tag": "text_type",
                "kind": "string",
                "values": {
                    "prefix": "prefix",
                    "suffix": "suffix"
                }
            }
        }
    },
    "setNameVisible": {
        "operation": "player.set_name_visible",
        "receiver": "player",
        "parameters": []
    },
    "setNameVisibleWith": {
        "operation": "player.set_name_visible",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "nameTagVisible": {
                "tag": "name_tag_visible",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setPlayerTime": {
        "operation": "player.set_player_time",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "daylight_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setPlayerWeather": {
        "operation": "player.set_player_weather",
        "receiver": "player",
        "parameters": []
    },
    "setPlayerWeatherWith": {
        "operation": "player.set_player_weather",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "weather": {
                "tag": "weather",
                "kind": "string",
                "values": {
                    "clear": "clear",
                    "downfall": "downfall"
                }
            }
        }
    },
    "setRainLevel": {
        "operation": "player.set_rain_level",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "rain_level",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "storm_level",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setReducedDebug": {
        "operation": "player.set_reduced_debug",
        "receiver": "player",
        "parameters": []
    },
    "setReducedDebugWith": {
        "operation": "player.set_reduced_debug",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "reducedDebugInfoEnabled": {
                "tag": "reduced_debug_info_enabled",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setRotation": {
        "operation": "player.set_rotation",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "pitch_90_to_90",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "yaw_180_to_180",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setSaturation": {
        "operation": "player.set_saturation",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "saturation_level_1_20",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setScore": {
        "operation": "player.set_score",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "score_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "score_value",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setScoreObj": {
        "operation": "player.set_score_obj",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "objective_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setShoulder": {
        "operation": "player.set_shoulder",
        "receiver": "player",
        "parameters": []
    },
    "setShoulderWith": {
        "operation": "player.set_shoulder",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "shoulder": {
                "tag": "shoulder",
                "kind": "string",
                "values": {
                    "left": "left",
                    "right": "right"
                }
            },
            "type": {
                "tag": "type",
                "kind": "string",
                "values": {
                    "remove": "remove",
                    "red": "red",
                    "blue": "blue",
                    "green": "green",
                    "cyan": "cyan",
                    "gray": "gray"
                }
            }
        }
    },
    "setSidebar": {
        "operation": "player.set_sidebar",
        "receiver": "player",
        "parameters": []
    },
    "setSidebarWith": {
        "operation": "player.set_sidebar",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "sidebar": {
                "tag": "sidebar",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setSkin": {
        "operation": "player.set_skin",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "player_head",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setSlot": {
        "operation": "player.set_slot",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_slot",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setSlotItem": {
        "operation": "player.set_slot_item",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "item_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "slot_to_set",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setSpawnPoint": {
        "operation": "player.set_spawn_point",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "the_new_spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setStatus": {
        "operation": "player.set_status",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "game_status",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setStingsStuck": {
        "operation": "player.set_stings_stuck",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sting_count",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setTabListInfo": {
        "operation": "player.set_tab_list_info",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "header_footer_text",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "setTabListInfoWith": {
        "operation": "player.set_tab_list_info",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "header_footer_text",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "playerListField": {
                "tag": "player_list_field",
                "kind": "string",
                "values": {
                    "header": "header",
                    "footer": "footer"
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
            "inheritStyles": {
                "tag": "inherit_styles",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setTickRate": {
        "operation": "player.set_tick_rate",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "ticks_per_second_0_20",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setVisualFire": {
        "operation": "player.set_visual_fire",
        "receiver": "player",
        "parameters": []
    },
    "setVisualFireWith": {
        "operation": "player.set_visual_fire",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "onFire": {
                "tag": "on_fire",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setWorldBorder": {
        "operation": "player.set_world_border",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "center_position",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "radius_in_blocks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "warning_distance",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "shiftWorldBorder": {
        "operation": "player.shift_world_border",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_radius",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "blocks_per_second",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "showInv": {
        "operation": "player.show_inv",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_display",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "spectateTarget": {
        "operation": "player.spectate_target",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "spectateTargetWith": {
        "operation": "player.spectate_target",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ignoreFormatting": {
                "tag": "ignore_formatting",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "spectatorCollision": {
        "operation": "player.spectator_collision",
        "receiver": "player",
        "parameters": []
    },
    "spectatorCollisionWith": {
        "operation": "player.spectator_collision",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "spectatorCollision": {
                "tag": "spectator_collision",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "spectatorMode": {
        "operation": "player.spectator_mode",
        "receiver": "player",
        "parameters": []
    },
    "stopSound": {
        "operation": "player.stop_sound",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sounds_to_stop",
                "types": [
                    "sound"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "stopSoundWith": {
        "operation": "player.stop_sound",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "sounds_to_stop",
                "types": [
                    "sound"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "soundSource": {
                "tag": "sound_source",
                "kind": "string",
                "values": {
                    "master": "master",
                    "music": "music",
                    "jukeboxNoteBlocks": "jukebox_note_blocks",
                    "weather": "weather",
                    "blocks": "blocks",
                    "hostileCreatures": "hostile_creatures",
                    "friendlyCreatures": "friendly_creatures",
                    "players": "players",
                    "ambientEnvironment": "ambient_environment",
                    "voiceSpeech": "voice_speech",
                    "ui": "ui"
                }
            }
        }
    },
    "survivalMode": {
        "operation": "player.survival_mode",
        "receiver": "player",
        "parameters": []
    },
    "teleport": {
        "operation": "player.teleport",
        "receiver": "player",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_position",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "teleportWith": {
        "operation": "player.teleport",
        "receiver": "player",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "new_position",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "keepCurrentRotation": {
                "tag": "keep_current_rotation",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "keepVelocity": {
                "tag": "keep_velocity",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "undisguise": {
        "operation": "player.undisguise",
        "receiver": "player",
        "parameters": []
    },
    "wakeUpAnimation": {
        "operation": "player.wake_up_animation",
        "receiver": "player",
        "parameters": []
    }
} as const;
