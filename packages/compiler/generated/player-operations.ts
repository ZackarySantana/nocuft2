// This file is generated. Do not edit manually.

export const playerOperations = {
    "player.action_bar": {
        "id": "player.action_bar",
        "receiver": "player",
        "method": "actionBar",
        "description": "Displays text directly above a player's hotbar.",
        "native": {
            "block": "player_action",
            "action": "ActionBar"
        },
        "inputs": [
            {
                "id": "message_to_send",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
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
            },
            {
                "id": "inherit_styles",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Inherit Styles",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.add_inv_row": {
        "id": "player.add_inv_row",
        "receiver": "player",
        "method": "addInvRow",
        "description": "Adds a row to the bottom of a player's current inventory menu.",
        "native": {
            "block": "player_action",
            "action": "AddInvRow"
        },
        "inputs": [
            {
                "id": "items_to_display",
                "acceptedTypes": [
                    "item"
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
                "id": "new_row_position",
                "defaultOption": "bottom_row",
                "options": [
                    "top_row",
                    "bottom_row"
                ],
                "native": {
                    "name": "New Row Position",
                    "slot": 26,
                    "options": {
                        "top_row": "Top row",
                        "bottom_row": "Bottom row"
                    }
                }
            }
        ]
    },
    "player.adventure_mode": {
        "id": "player.adventure_mode",
        "receiver": "player",
        "method": "adventureMode",
        "description": "Sets a player's game mode to Adventure.",
        "native": {
            "block": "player_action",
            "action": "AdventureMode"
        },
        "inputs": [],
        "tags": []
    },
    "player.attack_animation": {
        "id": "player.attack_animation",
        "receiver": "player",
        "method": "attackAnimation",
        "description": "Makes a player perform an attack animation.",
        "native": {
            "block": "player_action",
            "action": "AttackAnimation"
        },
        "inputs": [],
        "tags": [
            {
                "id": "animation_arm",
                "defaultOption": "swing_main_arm",
                "options": [
                    "swing_main_arm",
                    "swing_off_arm"
                ],
                "native": {
                    "name": "Animation Arm",
                    "slot": 26,
                    "options": {
                        "swing_main_arm": "Swing main arm",
                        "swing_off_arm": "Swing off arm"
                    }
                }
            }
        ]
    },
    "player.block_disguise": {
        "id": "player.block_disguise",
        "receiver": "player",
        "method": "blockDisguise",
        "description": "Disguises a player as a block.",
        "native": {
            "block": "player_action",
            "action": "BlockDisguise"
        },
        "inputs": [
            {
                "id": "block_to_disguise_as",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "display_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.boost_elytra": {
        "id": "player.boost_elytra",
        "receiver": "player",
        "method": "boostElytra",
        "description": "Boosts a player's elytra using a firework rocket.",
        "native": {
            "block": "player_action",
            "action": "BoostElytra"
        },
        "inputs": [
            {
                "id": "firework",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.chat_style": {
        "id": "player.chat_style",
        "receiver": "player",
        "method": "chatStyle",
        "description": "Sets a player's chat color or decoration.",
        "native": {
            "block": "player_action",
            "action": "ChatStyle"
        },
        "inputs": [
            {
                "id": "new_chat_style",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.clear_disp_block": {
        "id": "player.clear_disp_block",
        "receiver": "player",
        "method": "clearDispBlock",
        "description": "Displays the real block at a location to a player, effectively removing any client-side blocks.",
        "native": {
            "block": "player_action",
            "action": "ClearDispBlock"
        },
        "inputs": [
            {
                "id": "block_location_or_start_of_region",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "end_of_region",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.clear_inv": {
        "id": "player.clear_inv",
        "receiver": "player",
        "method": "clearInv",
        "description": "Empties a player's inventory.",
        "native": {
            "block": "player_action",
            "action": "ClearInv"
        },
        "inputs": [],
        "tags": [
            {
                "id": "clear_mode",
                "defaultOption": "entire_inventory",
                "options": [
                    "entire_inventory",
                    "main_inventory",
                    "upper_inventory",
                    "hotbar",
                    "armor"
                ],
                "native": {
                    "name": "Clear Mode",
                    "slot": 26,
                    "options": {
                        "entire_inventory": "Entire inventory",
                        "main_inventory": "Main inventory",
                        "upper_inventory": "Upper inventory",
                        "hotbar": "Hotbar",
                        "armor": "Armor"
                    }
                }
            },
            {
                "id": "clear_crafting_and_cursor",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Clear Crafting and Cursor",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.clear_items": {
        "id": "player.clear_items",
        "receiver": "player",
        "method": "clearItems",
        "description": "Removes all of an item from a player.",
        "native": {
            "block": "player_action",
            "action": "ClearItems"
        },
        "inputs": [
            {
                "id": "items_to_clear",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "player.clear_potions": {
        "id": "player.clear_potions",
        "receiver": "player",
        "method": "clearPotions",
        "description": "Removes all active potion effects from a player.",
        "native": {
            "block": "player_action",
            "action": "ClearPotions"
        },
        "inputs": [],
        "tags": []
    },
    "player.clear_scoreboard": {
        "id": "player.clear_scoreboard",
        "receiver": "player",
        "method": "clearScoreboard",
        "description": "Removes all scores from the scoreboard.",
        "native": {
            "block": "player_action",
            "action": "ClearScoreboard"
        },
        "inputs": [],
        "tags": []
    },
    "player.close_inv": {
        "id": "player.close_inv",
        "receiver": "player",
        "method": "closeInv",
        "description": "Closes a player's inventory.",
        "native": {
            "block": "player_action",
            "action": "CloseInv"
        },
        "inputs": [],
        "tags": []
    },
    "player.combat_attribute": {
        "id": "player.combat_attribute",
        "receiver": "player",
        "method": "combatAttribute",
        "description": "Sets one of the player's combat-related attributes such as attack damage and attack speed.",
        "native": {
            "block": "player_action",
            "action": "CombatAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "attack_damage",
                "options": [
                    "attack_damage",
                    "attack_speed",
                    "sweeping_damage_ratio"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "attack_damage": "Attack damage",
                        "attack_speed": "Attack speed",
                        "sweeping_damage_ratio": "Sweeping damage ratio"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.creative_mode": {
        "id": "player.creative_mode",
        "receiver": "player",
        "method": "creativeMode",
        "description": "Sets a player's game mode to Creative.",
        "native": {
            "block": "player_action",
            "action": "CreativeMode"
        },
        "inputs": [],
        "tags": []
    },
    "player.damage": {
        "id": "player.damage",
        "receiver": "player",
        "method": "damage",
        "description": "Damages a player.",
        "native": {
            "block": "player_action",
            "action": "Damage"
        },
        "inputs": [
            {
                "id": "damage_to_inflict",
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
                "id": "uuid_of_damager_entity",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.disable_blocks": {
        "id": "player.disable_blocks",
        "receiver": "player",
        "method": "disableBlocks",
        "description": "Prevents a player from placing and breaking certain blocks.",
        "native": {
            "block": "player_action",
            "action": "DisableBlocks"
        },
        "inputs": [
            {
                "id": "blocks_to_disallow",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.disguise_shift_vert": {
        "id": "player.disguise_shift_vert",
        "receiver": "player",
        "method": "disguiseShiftVert",
        "description": "Shifts the disguise of a player up or down relative to the player.",
        "native": {
            "block": "player_action",
            "action": "DisguiseShiftVert"
        },
        "inputs": [
            {
                "id": "y_offset",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.disp_head_texture": {
        "id": "player.disp_head_texture",
        "receiver": "player",
        "method": "dispHeadTexture",
        "description": "Changes a head's texture at a location for a player.",
        "native": {
            "block": "player_action",
            "action": "DispHeadTexture"
        },
        "inputs": [
            {
                "id": "head_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "player_head",
                "acceptedTypes": [
                    "item",
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
    },
    "player.display_bell_ring": {
        "id": "player.display_bell_ring",
        "receiver": "player",
        "method": "displayBellRing",
        "description": "Displays a bell ring animation at a location to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayBellRing"
        },
        "inputs": [
            {
                "id": "block_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "ring_direction",
                "defaultOption": "north",
                "options": [
                    "north",
                    "south",
                    "west",
                    "east"
                ],
                "native": {
                    "name": "Ring Direction",
                    "slot": 26,
                    "options": {
                        "north": "North",
                        "south": "South",
                        "west": "West",
                        "east": "East"
                    }
                }
            }
        ]
    },
    "player.display_block": {
        "id": "player.display_block",
        "receiver": "player",
        "method": "displayBlock",
        "description": "Displays a block at a location to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayBlock"
        },
        "inputs": [
            {
                "id": "block_to_display",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "block_location_or_start_of_region",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "end_of_region",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "block_data",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.display_block_open": {
        "id": "player.display_block_open",
        "receiver": "player",
        "method": "displayBlockOpen",
        "description": "Displays a container block at a location as being open or closed to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayBlockOpen"
        },
        "inputs": [
            {
                "id": "block_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "container_state",
                "defaultOption": "open",
                "options": [
                    "open",
                    "closed"
                ],
                "native": {
                    "name": "Container State",
                    "slot": 26,
                    "options": {
                        "open": "Open",
                        "closed": "Closed"
                    }
                }
            }
        ]
    },
    "player.display_equipment": {
        "id": "player.display_equipment",
        "receiver": "player",
        "method": "displayEquipment",
        "description": "Displays equipment on an entity to a player. Equipment goes from slots 2-7 in order of Helmet, Chestplate, Leggings, Boots, Main Hand, Off Hand.",
        "native": {
            "block": "player_action",
            "action": "DisplayEquipment"
        },
        "inputs": [
            {
                "id": "entity_uuid_or_name",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "equipment",
                "acceptedTypes": [
                    "item"
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
    "player.display_fracture": {
        "id": "player.display_fracture",
        "receiver": "player",
        "method": "displayFracture",
        "description": "Displays a block fracture effect at a location to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayFracture"
        },
        "inputs": [
            {
                "id": "blocks_to_fracture",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "fracture_level",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "overwrite_previous_fracture",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Overwrite Previous Fracture",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.display_gateway": {
        "id": "player.display_gateway",
        "receiver": "player",
        "method": "displayGateway",
        "description": "Displays a vertical beam on an end gateway to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayGateway"
        },
        "inputs": [
            {
                "id": "gateway_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "animation_type",
                "defaultOption": "initial_beam",
                "options": [
                    "initial_beam",
                    "periodic_beam"
                ],
                "native": {
                    "name": "Animation Type",
                    "slot": 26,
                    "options": {
                        "initial_beam": "Initial beam",
                        "periodic_beam": "Periodic beam"
                    }
                }
            }
        ]
    },
    "player.display_hologram": {
        "id": "player.display_hologram",
        "receiver": "player",
        "method": "displayHologram",
        "description": "Displays a floating name tag at a location to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayHologram"
        },
        "inputs": [
            {
                "id": "display_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "text_to_display",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.display_lightning": {
        "id": "player.display_lightning",
        "receiver": "player",
        "method": "displayLightning",
        "description": "Displays a lightning strike effect to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplayLightning"
        },
        "inputs": [
            {
                "id": "strike_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.display_pickup": {
        "id": "player.display_pickup",
        "receiver": "player",
        "method": "displayPickup",
        "description": "Displays a pickup animation of one entity being collected by another entity.",
        "native": {
            "block": "player_action",
            "action": "DisplayPickup"
        },
        "inputs": [
            {
                "id": "entity_uuid",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "collector_uuid",
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
        "tags": [
            {
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.display_sign_text": {
        "id": "player.display_sign_text",
        "receiver": "player",
        "method": "displaySignText",
        "description": "Displays text on a sign to a player.",
        "native": {
            "block": "player_action",
            "action": "DisplaySignText"
        },
        "inputs": [
            {
                "id": "sign_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "text_lines",
                "acceptedTypes": [
                    "component"
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
                "id": "sign_side",
                "defaultOption": "front",
                "options": [
                    "front",
                    "back"
                ],
                "native": {
                    "name": "Sign Side",
                    "slot": 24,
                    "options": {
                        "front": "Front",
                        "back": "Back"
                    }
                }
            },
            {
                "id": "text_color",
                "defaultOption": "black",
                "options": [
                    "white",
                    "orange",
                    "magenta",
                    "light_blue",
                    "yellow",
                    "lime",
                    "pink",
                    "gray",
                    "light_gray",
                    "cyan",
                    "purple",
                    "blue",
                    "brown",
                    "green",
                    "red",
                    "black"
                ],
                "native": {
                    "name": "Text Color",
                    "slot": 25,
                    "options": {
                        "white": "White",
                        "orange": "Orange",
                        "magenta": "Magenta",
                        "light_blue": "Light blue",
                        "yellow": "Yellow",
                        "lime": "Lime",
                        "pink": "Pink",
                        "gray": "Gray",
                        "light_gray": "Light gray",
                        "cyan": "Cyan",
                        "purple": "Purple",
                        "blue": "Blue",
                        "brown": "Brown",
                        "green": "Green",
                        "red": "Red",
                        "black": "Black"
                    }
                }
            },
            {
                "id": "glowing",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Glowing",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.enable_blocks": {
        "id": "player.enable_blocks",
        "receiver": "player",
        "method": "enableBlocks",
        "description": "Allows a player to place and break certain blocks.",
        "native": {
            "block": "player_action",
            "action": "EnableBlocks"
        },
        "inputs": [
            {
                "id": "blocks_to_allow",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.expand_inv": {
        "id": "player.expand_inv",
        "receiver": "player",
        "method": "expandInv",
        "description": "Adds 3 more rows to a player's current inventory menu using the contents of the chest.",
        "native": {
            "block": "player_action",
            "action": "ExpandInv"
        },
        "inputs": [
            {
                "id": "items_to_display",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.face_location": {
        "id": "player.face_location",
        "receiver": "player",
        "method": "faceLocation",
        "description": "Rotates a player to look toward a location without teleporting them.",
        "native": {
            "block": "player_action",
            "action": "FaceLocation"
        },
        "inputs": [
            {
                "id": "location_to_face",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.falling_attribute": {
        "id": "player.falling_attribute",
        "receiver": "player",
        "method": "fallingAttribute",
        "description": "Sets one of the player's falling-related attributes, such as gravity and fall damage multiplier.",
        "native": {
            "block": "player_action",
            "action": "FallingAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "gravity",
                "options": [
                    "gravity",
                    "safe_fall_distance",
                    "fall_damage_multiplier"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "gravity": "Gravity",
                        "safe_fall_distance": "Safe fall distance",
                        "fall_damage_multiplier": "Fall damage multiplier"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.get_target_entity": {
        "id": "player.get_target_entity",
        "receiver": "player",
        "method": "getTargetEntity",
        "description": "",
        "native": {
            "block": "player_action",
            "action": "GetTargetEntity"
        },
        "inputs": [],
        "tags": [
            {
                "id": "ignore_blocks",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Blocks",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.give_exhaustion": {
        "id": "player.give_exhaustion",
        "receiver": "player",
        "method": "giveExhaustion",
        "description": "Adds exhaustion to a player.",
        "native": {
            "block": "player_action",
            "action": "GiveExhaustion"
        },
        "inputs": [
            {
                "id": "exhaustion_to_give",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.give_exp": {
        "id": "player.give_exp",
        "receiver": "player",
        "method": "giveExp",
        "description": "Adds experience points or levels to a player.",
        "native": {
            "block": "player_action",
            "action": "GiveExp"
        },
        "inputs": [
            {
                "id": "experience_to_give",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "give_experience",
                "defaultOption": "points",
                "options": [
                    "points",
                    "levels",
                    "level_percentage"
                ],
                "native": {
                    "name": "Give Experience",
                    "slot": 26,
                    "options": {
                        "points": "Points",
                        "levels": "Levels",
                        "level_percentage": "Level Percentage"
                    }
                }
            }
        ]
    },
    "player.give_food": {
        "id": "player.give_food",
        "receiver": "player",
        "method": "giveFood",
        "description": "Adds food to a player.",
        "native": {
            "block": "player_action",
            "action": "GiveFood"
        },
        "inputs": [
            {
                "id": "food_to_give",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.give_items": {
        "id": "player.give_items",
        "receiver": "player",
        "method": "giveItems",
        "description": "Gives a player all of the items in the chest.",
        "native": {
            "block": "player_action",
            "action": "GiveItems"
        },
        "inputs": [
            {
                "id": "items_to_give",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "amount_to_give",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.give_saturation": {
        "id": "player.give_saturation",
        "receiver": "player",
        "method": "giveSaturation",
        "description": "Adds saturation to a player.",
        "native": {
            "block": "player_action",
            "action": "GiveSaturation"
        },
        "inputs": [
            {
                "id": "saturation_to_give",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.heal": {
        "id": "player.heal",
        "receiver": "player",
        "method": "heal",
        "description": "Restores a player's health.",
        "native": {
            "block": "player_action",
            "action": "Heal"
        },
        "inputs": [
            {
                "id": "amount_to_heal",
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
        "tags": []
    },
    "player.health_attribute": {
        "id": "player.health_attribute",
        "receiver": "player",
        "method": "healthAttribute",
        "description": "Sets one of the player's health-related attributes such as max health and armor defense points.",
        "native": {
            "block": "player_action",
            "action": "HealthAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "maximum_health",
                "options": [
                    "maximum_health",
                    "maximum_absorption_health",
                    "armor",
                    "armor_toughness"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "maximum_health": "Maximum health",
                        "maximum_absorption_health": "Maximum absorption health",
                        "armor": "Armor",
                        "armor_toughness": "Armor toughness"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.hurt_animation": {
        "id": "player.hurt_animation",
        "receiver": "player",
        "method": "hurtAnimation",
        "description": "Makes a player perform a hurt animation.",
        "native": {
            "block": "player_action",
            "action": "HurtAnimation"
        },
        "inputs": [
            {
                "id": "damage_source",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.instant_respawn": {
        "id": "player.instant_respawn",
        "receiver": "player",
        "method": "instantRespawn",
        "description": "Sets if a player is instantly respawned upon dying.",
        "native": {
            "block": "player_action",
            "action": "InstantRespawn"
        },
        "inputs": [],
        "tags": [
            {
                "id": "instant_respawn",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Instant Respawn",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.kbattribute": {
        "id": "player.kbattribute",
        "receiver": "player",
        "method": "kbattribute",
        "description": "Sets one of the player's knockback-related attributes such as knockback resistance.",
        "native": {
            "block": "player_action",
            "action": "KBAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "knockback_resistance",
                "options": [
                    "knockback_resistance",
                    "explosion_knockback_resistance"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "knockback_resistance": "Knockback resistance",
                        "explosion_knockback_resistance": "Explosion knockback resistance"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.kick": {
        "id": "player.kick",
        "receiver": "player",
        "method": "kick",
        "description": "Kicks a player from the plot.",
        "native": {
            "block": "player_action",
            "action": "Kick"
        },
        "inputs": [],
        "tags": []
    },
    "player.launch_fwd": {
        "id": "player.launch_fwd",
        "receiver": "player",
        "method": "launchFwd",
        "description": "Launches a player forward or backward.",
        "native": {
            "block": "player_action",
            "action": "LaunchFwd"
        },
        "inputs": [
            {
                "id": "launch_power",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "add_to_current_velocity",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Add to Current Velocity",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "launch_axis",
                "defaultOption": "pitch_and_yaw",
                "options": [
                    "pitch_and_yaw",
                    "yaw_only"
                ],
                "native": {
                    "name": "Launch Axis",
                    "slot": 26,
                    "options": {
                        "pitch_and_yaw": "Pitch and Yaw",
                        "yaw_only": "Yaw Only"
                    }
                }
            }
        ]
    },
    "player.launch_proj": {
        "id": "player.launch_proj",
        "receiver": "player",
        "method": "launchProj",
        "description": "Launches a projectile from a player.",
        "native": {
            "block": "player_action",
            "action": "LaunchProj"
        },
        "inputs": [
            {
                "id": "projectile_to_launch",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "launch_point",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "projectile_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "speed",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "inaccuracy",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 4
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.launch_toward": {
        "id": "player.launch_toward",
        "receiver": "player",
        "method": "launchToward",
        "description": "Launches a player toward or away from a location.",
        "native": {
            "block": "player_action",
            "action": "LaunchToward"
        },
        "inputs": [
            {
                "id": "launch_destination",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "launch_power",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "add_to_current_velocity",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Add to Current Velocity",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "ignore_distance",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Distance",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.launch_up": {
        "id": "player.launch_up",
        "receiver": "player",
        "method": "launchUp",
        "description": "Launches a player up or down.",
        "native": {
            "block": "player_action",
            "action": "LaunchUp"
        },
        "inputs": [
            {
                "id": "launch_power",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "add_to_current_velocity",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Add to Current Velocity",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.load_inv": {
        "id": "player.load_inv",
        "receiver": "player",
        "method": "loadInv",
        "description": "Loads a player's inventory.",
        "native": {
            "block": "player_action",
            "action": "LoadInv"
        },
        "inputs": [],
        "tags": [
            {
                "id": "code_flow",
                "defaultOption": "synchronous",
                "options": [
                    "synchronous",
                    "asynchronous"
                ],
                "native": {
                    "name": "Code Flow",
                    "slot": 26,
                    "options": {
                        "synchronous": "Synchronous",
                        "asynchronous": "Asynchronous"
                    }
                }
            }
        ]
    },
    "player.lock_disg_rotation": {
        "id": "player.lock_disg_rotation",
        "receiver": "player",
        "method": "lockDisgRotation",
        "description": "Locks a disguise's pitch or yaw values.",
        "native": {
            "block": "player_action",
            "action": "LockDisgRotation"
        },
        "inputs": [
            {
                "id": "pitch_to_lock_to",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "yaw_to_lock_to",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "pitch",
                "defaultOption": "no_change",
                "options": [
                    "lock",
                    "unlock",
                    "no_change"
                ],
                "native": {
                    "name": "Pitch",
                    "slot": 25,
                    "options": {
                        "lock": "Lock",
                        "unlock": "Unlock",
                        "no_change": "No Change"
                    }
                }
            },
            {
                "id": "yaw",
                "defaultOption": "no_change",
                "options": [
                    "lock",
                    "unlock",
                    "no_change"
                ],
                "native": {
                    "name": "Yaw",
                    "slot": 26,
                    "options": {
                        "lock": "Lock",
                        "unlock": "Unlock",
                        "no_change": "No Change"
                    }
                }
            }
        ]
    },
    "player.mimic": {
        "id": "player.mimic",
        "receiver": "player",
        "method": "mimic",
        "description": "Disguises a player as another currently existing entity or player.",
        "native": {
            "block": "player_action",
            "action": "Mimic"
        },
        "inputs": [
            {
                "id": "uuid_of_target_to_disguise_as",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": [
            {
                "id": "remove_original_entity",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Remove Original Entity",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.mining_attribute": {
        "id": "player.mining_attribute",
        "receiver": "player",
        "method": "miningAttribute",
        "description": "Sets one of the player's mining-related attributes such as break speed and mining efficiency.",
        "native": {
            "block": "player_action",
            "action": "MiningAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "block_break_speed",
                "options": [
                    "block_break_speed",
                    "mining_efficiency",
                    "submerged_mining_speed"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "block_break_speed": "Block break speed",
                        "mining_efficiency": "Mining efficiency",
                        "submerged_mining_speed": "Submerged mining speed"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.misc_attribute": {
        "id": "player.misc_attribute",
        "receiver": "player",
        "method": "miscAttribute",
        "description": "Sets one of the player's miscellaneous attributes such as scale and burning time.",
        "native": {
            "block": "player_action",
            "action": "MiscAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "scale",
                "options": [
                    "scale",
                    "luck",
                    "oxygen_bonus",
                    "burning_time",
                    "camera_distance"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "scale": "Scale",
                        "luck": "Luck",
                        "oxygen_bonus": "Oxygen bonus",
                        "burning_time": "Burning time",
                        "camera_distance": "Camera distance"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.mob_disguise": {
        "id": "player.mob_disguise",
        "receiver": "player",
        "method": "mobDisguise",
        "description": "Disguises a player as a mob.",
        "native": {
            "block": "player_action",
            "action": "MobDisguise"
        },
        "inputs": [
            {
                "id": "mob_to_disguise_as",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "display_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.movement_attribute": {
        "id": "player.movement_attribute",
        "receiver": "player",
        "method": "movementAttribute",
        "description": "Sets one of the player's movement-related attributes, such as walking speed and jump height.",
        "native": {
            "block": "player_action",
            "action": "MovementAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "walking_speed",
                "options": [
                    "walking_speed",
                    "flying_speed",
                    "jump_strength",
                    "sneaking_speed",
                    "step_height",
                    "movement_efficiency",
                    "water_movement_efficiency"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "walking_speed": "Walking speed",
                        "flying_speed": "Flying speed",
                        "jump_strength": "Jump strength",
                        "sneaking_speed": "Sneaking speed",
                        "step_height": "Step height",
                        "movement_efficiency": "Movement efficiency",
                        "water_movement_efficiency": "Water movement efficiency"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.open_block_inv": {
        "id": "player.open_block_inv",
        "receiver": "player",
        "method": "openBlockInv",
        "description": "Opens a container's inventory. Also works with crafting tables.",
        "native": {
            "block": "player_action",
            "action": "OpenBlockInv"
        },
        "inputs": [
            {
                "id": "container_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.open_book": {
        "id": "player.open_book",
        "receiver": "player",
        "method": "openBook",
        "description": "Opens a written book menu for a player.",
        "native": {
            "block": "player_action",
            "action": "OpenBook"
        },
        "inputs": [
            {
                "id": "book_item",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.open_sign": {
        "id": "player.open_sign",
        "receiver": "player",
        "method": "openSign",
        "description": "Opens a sign for a player. Also works with client-side signs.",
        "native": {
            "block": "player_action",
            "action": "OpenSign"
        },
        "inputs": [
            {
                "id": "sign_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "sign_side",
                "defaultOption": "front",
                "options": [
                    "front",
                    "back"
                ],
                "native": {
                    "name": "Sign Side",
                    "slot": 26,
                    "options": {
                        "front": "Front",
                        "back": "Back"
                    }
                }
            }
        ]
    },
    "player.open_trade_menu": {
        "id": "player.open_trade_menu",
        "receiver": "player",
        "method": "openTradeMenu",
        "description": "Opens the trading menu of a villager.",
        "native": {
            "block": "player_action",
            "action": "OpenTradeMenu"
        },
        "inputs": [
            {
                "id": "villager_uuid",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.play_entity_sound": {
        "id": "player.play_entity_sound",
        "receiver": "player",
        "method": "playEntitySound",
        "description": "Plays a sound that follows a moving entity or player.",
        "native": {
            "block": "player_action",
            "action": "PlayEntitySound"
        },
        "inputs": [
            {
                "id": "sound_to_play",
                "acceptedTypes": [
                    "sound"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "target_uuid",
                "acceptedTypes": [
                    "text"
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
                "id": "sound_source",
                "defaultOption": "master",
                "options": [
                    "master",
                    "music",
                    "jukebox_note_blocks",
                    "weather",
                    "blocks",
                    "hostile_creatures",
                    "friendly_creatures",
                    "players",
                    "ambient_environment",
                    "voice_speech",
                    "ui"
                ],
                "native": {
                    "name": "Sound Source",
                    "slot": 26,
                    "options": {
                        "master": "Master",
                        "music": "Music",
                        "jukebox_note_blocks": "Jukebox/Note Blocks",
                        "weather": "Weather",
                        "blocks": "Blocks",
                        "hostile_creatures": "Hostile Creatures",
                        "friendly_creatures": "Friendly Creatures",
                        "players": "Players",
                        "ambient_environment": "Ambient/Environment",
                        "voice_speech": "Voice/Speech",
                        "ui": "UI"
                    }
                }
            },
            {
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.play_sound": {
        "id": "player.play_sound",
        "receiver": "player",
        "method": "playSound",
        "description": "Plays a sound for a player.",
        "native": {
            "block": "player_action",
            "action": "PlaySound"
        },
        "inputs": [
            {
                "id": "sound_to_play",
                "acceptedTypes": [
                    "sound"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "playback_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "sound_source",
                "defaultOption": "master",
                "options": [
                    "master",
                    "music",
                    "jukebox_note_blocks",
                    "weather",
                    "blocks",
                    "hostile_creatures",
                    "friendly_creatures",
                    "players",
                    "ambient_environment",
                    "voice_speech",
                    "ui"
                ],
                "native": {
                    "name": "Sound Source",
                    "slot": 26,
                    "options": {
                        "master": "Master",
                        "music": "Music",
                        "jukebox_note_blocks": "Jukebox/Note Blocks",
                        "weather": "Weather",
                        "blocks": "Blocks",
                        "hostile_creatures": "Hostile Creatures",
                        "friendly_creatures": "Friendly Creatures",
                        "players": "Players",
                        "ambient_environment": "Ambient/Environment",
                        "voice_speech": "Voice/Speech",
                        "ui": "UI"
                    }
                }
            }
        ]
    },
    "player.play_sound_seq": {
        "id": "player.play_sound_seq",
        "receiver": "player",
        "method": "playSoundSeq",
        "description": "Plays a sequence of sounds to a player, with a delay between each sound.",
        "native": {
            "block": "player_action",
            "action": "PlaySoundSeq"
        },
        "inputs": [
            {
                "id": "sounds_to_play",
                "acceptedTypes": [
                    "sound"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "sound_delay_ticks_default_60",
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
                "id": "playback_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "sound_source",
                "defaultOption": "master",
                "options": [
                    "master",
                    "music",
                    "jukebox_note_blocks",
                    "weather",
                    "blocks",
                    "hostile_creatures",
                    "friendly_creatures",
                    "players",
                    "ambient_environment",
                    "voice_speech",
                    "ui"
                ],
                "native": {
                    "name": "Sound Source",
                    "slot": 26,
                    "options": {
                        "master": "Master",
                        "music": "Music",
                        "jukebox_note_blocks": "Jukebox/Note Blocks",
                        "weather": "Weather",
                        "blocks": "Blocks",
                        "hostile_creatures": "Hostile Creatures",
                        "friendly_creatures": "Friendly Creatures",
                        "players": "Players",
                        "ambient_environment": "Ambient/Environment",
                        "voice_speech": "Voice/Speech",
                        "ui": "UI"
                    }
                }
            }
        ]
    },
    "player.player_disguise": {
        "id": "player.player_disguise",
        "receiver": "player",
        "method": "playerDisguise",
        "description": "Disguises a player as another player.",
        "native": {
            "block": "player_action",
            "action": "PlayerDisguise"
        },
        "inputs": [
            {
                "id": "player_name_to_disguise_as",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "display_skin",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.prompt_purchase": {
        "id": "player.prompt_purchase",
        "receiver": "player",
        "method": "promptPurchase",
        "description": "Prompts the player to purchase a plot product.",
        "native": {
            "block": "player_action",
            "action": "PromptPurchase"
        },
        "inputs": [
            {
                "id": "product_id",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.reach_attribute": {
        "id": "player.reach_attribute",
        "receiver": "player",
        "method": "reachAttribute",
        "description": "Sets one of the player's reach-related attributes such as block and entity interaction ranges.",
        "native": {
            "block": "player_action",
            "action": "ReachAttribute"
        },
        "inputs": [
            {
                "id": "value",
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
                "id": "attribute",
                "defaultOption": "block_interaction_range",
                "options": [
                    "block_interaction_range",
                    "entity_interaction_range"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "block_interaction_range": "Block interaction range",
                        "entity_interaction_range": "Entity interaction range"
                    }
                }
            },
            {
                "id": "value_type",
                "defaultOption": "direct",
                "options": [
                    "direct",
                    "percentage_base",
                    "percentage_relative"
                ],
                "native": {
                    "name": "Value Type",
                    "slot": 26,
                    "options": {
                        "direct": "Direct",
                        "percentage_base": "Percentage (Base)",
                        "percentage_relative": "Percentage (Relative)"
                    }
                }
            }
        ]
    },
    "player.remove_boss_bar": {
        "id": "player.remove_boss_bar",
        "receiver": "player",
        "method": "removeBossBar",
        "description": "Removes a boss health bar from a player's screen.",
        "native": {
            "block": "player_action",
            "action": "RemoveBossBar"
        },
        "inputs": [
            {
                "id": "boss_bar_position",
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
        "tags": []
    },
    "player.remove_inv_row": {
        "id": "player.remove_inv_row",
        "receiver": "player",
        "method": "removeInvRow",
        "description": "Removes the given number of rows from the bottom of a player's current inventory menu.",
        "native": {
            "block": "player_action",
            "action": "RemoveInvRow"
        },
        "inputs": [
            {
                "id": "rows_to_remove",
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
                "id": "row_to_remove",
                "defaultOption": "bottom_row",
                "options": [
                    "top_row",
                    "bottom_row"
                ],
                "native": {
                    "name": "Row to Remove",
                    "slot": 26,
                    "options": {
                        "top_row": "Top row",
                        "bottom_row": "Bottom row"
                    }
                }
            }
        ]
    },
    "player.remove_items": {
        "id": "player.remove_items",
        "receiver": "player",
        "method": "removeItems",
        "description": "Removes items from a player.",
        "native": {
            "block": "player_action",
            "action": "RemoveItems"
        },
        "inputs": [
            {
                "id": "items_to_remove",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "player.remove_score": {
        "id": "player.remove_score",
        "receiver": "player",
        "method": "removeScore",
        "description": "Removes a score from the scoreboard.",
        "native": {
            "block": "player_action",
            "action": "RemoveScore"
        },
        "inputs": [
            {
                "id": "score_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.replace_items": {
        "id": "player.replace_items",
        "receiver": "player",
        "method": "replaceItems",
        "description": "Replaces items in a player's inventory with the given item.",
        "native": {
            "block": "player_action",
            "action": "ReplaceItems"
        },
        "inputs": [
            {
                "id": "items_to_replace",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            },
            {
                "id": "item_to_replace_with",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "amount_of_items_to_replace",
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
    "player.resource_pack": {
        "id": "player.resource_pack",
        "receiver": "player",
        "method": "resourcePack",
        "description": "Send a resource pack to a player.",
        "native": {
            "block": "player_action",
            "action": "ResourcePack"
        },
        "inputs": [
            {
                "id": "resource_pack_url",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.ride_entity": {
        "id": "player.ride_entity",
        "receiver": "player",
        "method": "rideEntity",
        "description": "Mounts a player on top of another player or entity.",
        "native": {
            "block": "player_action",
            "action": "RideEntity"
        },
        "inputs": [
            {
                "id": "target_uuid",
                "acceptedTypes": [
                    "text"
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
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.rm_world_border": {
        "id": "player.rm_world_border",
        "receiver": "player",
        "method": "rmWorldBorder",
        "description": "Removes a player's world border.",
        "native": {
            "block": "player_action",
            "action": "RmWorldBorder"
        },
        "inputs": [],
        "tags": []
    },
    "player.rollback_blocks": {
        "id": "player.rollback_blocks",
        "receiver": "player",
        "method": "rollbackBlocks",
        "description": "Undoes the interactions with blocks by a player.",
        "native": {
            "block": "player_action",
            "action": "RollbackBlocks"
        },
        "inputs": [
            {
                "id": "rollback_time",
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
        "tags": []
    },
    "player.save_inv": {
        "id": "player.save_inv",
        "receiver": "player",
        "method": "saveInv",
        "description": "Saves a player's inventory. It can be loaded later with 'Load Saved Inventory'.",
        "native": {
            "block": "player_action",
            "action": "SaveInv"
        },
        "inputs": [],
        "tags": []
    },
    "player.score_def_format": {
        "id": "player.score_def_format",
        "receiver": "player",
        "method": "scoreDefFormat",
        "description": "Sets the default number format of the player's scoreboard.",
        "native": {
            "block": "player_action",
            "action": "ScoreDefFormat"
        },
        "inputs": [
            {
                "id": "content_or_style",
                "acceptedTypes": [
                    "component"
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
                "id": "number_format",
                "defaultOption": "fixed",
                "options": [
                    "fixed",
                    "styled",
                    "blank",
                    "reset"
                ],
                "native": {
                    "name": "Number Format",
                    "slot": 26,
                    "options": {
                        "fixed": "Fixed",
                        "styled": "Styled",
                        "blank": "Blank",
                        "reset": "Reset"
                    }
                }
            }
        ]
    },
    "player.score_line_format": {
        "id": "player.score_line_format",
        "receiver": "player",
        "method": "scoreLineFormat",
        "description": "Sets the number format of a single line in the player's scoreboard.",
        "native": {
            "block": "player_action",
            "action": "ScoreLineFormat"
        },
        "inputs": [
            {
                "id": "score_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "content_or_style",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "number_format",
                "defaultOption": "fixed",
                "options": [
                    "fixed",
                    "styled",
                    "blank",
                    "reset"
                ],
                "native": {
                    "name": "Number Format",
                    "slot": 26,
                    "options": {
                        "fixed": "Fixed",
                        "styled": "Styled",
                        "blank": "Blank",
                        "reset": "Reset"
                    }
                }
            }
        ]
    },
    "player.send_advancement": {
        "id": "player.send_advancement",
        "receiver": "player",
        "method": "sendAdvancement",
        "description": "Displays a custom advancement popup to a player.",
        "native": {
            "block": "player_action",
            "action": "SendAdvancement"
        },
        "inputs": [
            {
                "id": "advancement_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "advancement_icon",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "toast_type",
                "defaultOption": "advancement",
                "options": [
                    "advancement",
                    "goal",
                    "challenge"
                ],
                "native": {
                    "name": "Toast Type",
                    "slot": 26,
                    "options": {
                        "advancement": "Advancement",
                        "goal": "Goal",
                        "challenge": "Challenge"
                    }
                }
            }
        ]
    },
    "player.send_message": {
        "id": "player.send_message",
        "receiver": "player",
        "method": "sendMessage",
        "description": "Sends a chat message to a player.",
        "native": {
            "block": "player_action",
            "action": "SendMessage"
        },
        "inputs": [
            {
                "id": "message_to_send",
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
                "id": "alignment_mode",
                "defaultOption": "regular",
                "options": [
                    "regular",
                    "centered"
                ],
                "native": {
                    "name": "Alignment Mode",
                    "slot": 26,
                    "options": {
                        "regular": "Regular",
                        "centered": "Centered"
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
                    "slot": 25,
                    "options": {
                        "add_spaces": "Add spaces",
                        "no_spaces": "No spaces"
                    }
                }
            },
            {
                "id": "inherit_styles",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Inherit Styles",
                    "slot": 24,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.send_message_seq": {
        "id": "player.send_message_seq",
        "receiver": "player",
        "method": "sendMessageSeq",
        "description": "Sends a series of messages in chat to a player, with a delay after each message.",
        "native": {
            "block": "player_action",
            "action": "SendMessageSeq"
        },
        "inputs": [
            {
                "id": "messages_to_send",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "message_delay_ticks",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": [
            {
                "id": "alignment_mode",
                "defaultOption": "regular",
                "options": [
                    "regular",
                    "centered"
                ],
                "native": {
                    "name": "Alignment Mode",
                    "slot": 26,
                    "options": {
                        "regular": "Regular",
                        "centered": "Centered"
                    }
                }
            }
        ]
    },
    "player.send_title": {
        "id": "player.send_title",
        "receiver": "player",
        "method": "sendTitle",
        "description": "Displays text in the center of a player's screen.",
        "native": {
            "block": "player_action",
            "action": "SendTitle"
        },
        "inputs": [
            {
                "id": "title_text",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "subtitle_text",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "title_duration",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "fade_in_length",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "fade_out_length",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 4
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.send_to_plot": {
        "id": "player.send_to_plot",
        "receiver": "player",
        "method": "sendToPlot",
        "description": "Sends a player to another plot.",
        "native": {
            "block": "player_action",
            "action": "SendToPlot"
        },
        "inputs": [
            {
                "id": "plot_handle_or_id",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_absorption": {
        "id": "player.set_absorption",
        "receiver": "player",
        "method": "setAbsorption",
        "description": "Sets a player's absorption health (golden hearts).",
        "native": {
            "block": "player_action",
            "action": "SetAbsorption"
        },
        "inputs": [
            {
                "id": "absorption_health",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_air_ticks": {
        "id": "player.set_air_ticks",
        "receiver": "player",
        "method": "setAirTicks",
        "description": "Sets a player's remaining breath ticks.",
        "native": {
            "block": "player_action",
            "action": "SetAirTicks"
        },
        "inputs": [
            {
                "id": "breath_ticks",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_allow_flight": {
        "id": "player.set_allow_flight",
        "receiver": "player",
        "method": "setAllowFlight",
        "description": "Sets whether a player is able to enter and exit flight mode by double tapping jump.",
        "native": {
            "block": "player_action",
            "action": "SetAllowFlight"
        },
        "inputs": [],
        "tags": [
            {
                "id": "allow_flight",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Allow Flight",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_allow_pvp": {
        "id": "player.set_allow_pvp",
        "receiver": "player",
        "method": "setAllowPvp",
        "description": "Sets whether a player can hurt or be hurt by other players.",
        "native": {
            "block": "player_action",
            "action": "SetAllowPVP"
        },
        "inputs": [],
        "tags": [
            {
                "id": "pvp",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "PVP",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_armor": {
        "id": "player.set_armor",
        "receiver": "player",
        "method": "setArmor",
        "description": "Sets a player's armor items. Place the armor in slots 1-4 of the chest, with 1 being the helmet and 4 being the boots.",
        "native": {
            "block": "player_action",
            "action": "SetArmor"
        },
        "inputs": [
            {
                "id": "armor_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "player.set_arrows_stuck": {
        "id": "player.set_arrows_stuck",
        "receiver": "player",
        "method": "setArrowsStuck",
        "description": "Sets the amount of arrows sticking out of a player's character model.",
        "native": {
            "block": "player_action",
            "action": "SetArrowsStuck"
        },
        "inputs": [
            {
                "id": "arrow_count",
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
        "tags": []
    },
    "player.set_boss_bar": {
        "id": "player.set_boss_bar",
        "receiver": "player",
        "method": "setBossBar",
        "description": "Creates or modifies a custom boss health bar at the top of a player's screen.",
        "native": {
            "block": "player_action",
            "action": "SetBossBar"
        },
        "inputs": [
            {
                "id": "title",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "current_health",
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
                "id": "maximum_health",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "boss_bar_position",
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
        "tags": [
            {
                "id": "bar_style",
                "defaultOption": "solid",
                "options": [
                    "solid",
                    "6_segments",
                    "10_segments",
                    "12_segments",
                    "20_segments"
                ],
                "native": {
                    "name": "Bar Style",
                    "slot": 25,
                    "options": {
                        "solid": "Solid",
                        "6_segments": "6 segments",
                        "10_segments": "10 segments",
                        "12_segments": "12 segments",
                        "20_segments": "20 segments"
                    }
                }
            },
            {
                "id": "sky_effect",
                "defaultOption": "none",
                "options": [
                    "none",
                    "create_fog",
                    "darken_sky",
                    "both"
                ],
                "native": {
                    "name": "Sky Effect",
                    "slot": 24,
                    "options": {
                        "none": "None",
                        "create_fog": "Create fog",
                        "darken_sky": "Darken sky",
                        "both": "Both"
                    }
                }
            },
            {
                "id": "bar_color",
                "defaultOption": "purple",
                "options": [
                    "red",
                    "purple",
                    "pink",
                    "blue",
                    "green",
                    "yellow",
                    "white"
                ],
                "native": {
                    "name": "Bar Color",
                    "slot": 26,
                    "options": {
                        "red": "Red",
                        "purple": "Purple",
                        "pink": "Pink",
                        "blue": "Blue",
                        "green": "Green",
                        "yellow": "Yellow",
                        "white": "White"
                    }
                }
            }
        ]
    },
    "player.set_chat_tag": {
        "id": "player.set_chat_tag",
        "receiver": "player",
        "method": "setChatTag",
        "description": "Sets a player's chat tag.",
        "native": {
            "block": "player_action",
            "action": "SetChatTag"
        },
        "inputs": [
            {
                "id": "chat_tag",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.set_collidable": {
        "id": "player.set_collidable",
        "receiver": "player",
        "method": "setCollidable",
        "description": "Sets whether a player is able to collide with other entities.",
        "native": {
            "block": "player_action",
            "action": "SetCollidable"
        },
        "inputs": [],
        "tags": [
            {
                "id": "collision",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Collision",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_compass": {
        "id": "player.set_compass",
        "receiver": "player",
        "method": "setCompass",
        "description": "Sets the location compasses point to for a player.",
        "native": {
            "block": "player_action",
            "action": "SetCompass"
        },
        "inputs": [
            {
                "id": "new_target",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_cursor_item": {
        "id": "player.set_cursor_item",
        "receiver": "player",
        "method": "setCursorItem",
        "description": "Sets the item on a player's cursor.",
        "native": {
            "block": "player_action",
            "action": "SetCursorItem"
        },
        "inputs": [
            {
                "id": "item_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_disguise_visible": {
        "id": "player.set_disguise_visible",
        "receiver": "player",
        "method": "setDisguiseVisible",
        "description": "Sets a player's ability to see their own disguise. It is recommended that it is almost always hidden.",
        "native": {
            "block": "player_action",
            "action": "SetDisguiseVisible"
        },
        "inputs": [],
        "tags": [
            {
                "id": "disguise_visible",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Disguise Visible",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_drops_enabled": {
        "id": "player.set_drops_enabled",
        "receiver": "player",
        "method": "setDropsEnabled",
        "description": "Sets whether a player drops their items when dead.",
        "native": {
            "block": "player_action",
            "action": "SetDropsEnabled"
        },
        "inputs": [],
        "tags": [
            {
                "id": "spawn_death_drops",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Spawn Death Drops",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_entity_hidden": {
        "id": "player.set_entity_hidden",
        "receiver": "player",
        "method": "setEntityHidden",
        "description": "Sets if an entity is hidden to a target.",
        "native": {
            "block": "player_action",
            "action": "SetEntityHidden"
        },
        "inputs": [
            {
                "id": "entity_uuids",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": [
            {
                "id": "hidden",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Hidden",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            },
            {
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.set_equipment": {
        "id": "player.set_equipment",
        "receiver": "player",
        "method": "setEquipment",
        "description": "Sets the item in one of the equipment slots (armor and held items) of a player.",
        "native": {
            "block": "player_action",
            "action": "SetEquipment"
        },
        "inputs": [
            {
                "id": "item_to_set",
                "acceptedTypes": [
                    "item"
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
                "id": "equipment_slot",
                "defaultOption": "main_hand",
                "options": [
                    "main_hand",
                    "off_hand",
                    "head",
                    "chest",
                    "legs",
                    "feet"
                ],
                "native": {
                    "name": "Equipment Slot",
                    "slot": 26,
                    "options": {
                        "main_hand": "Main hand",
                        "off_hand": "Off hand",
                        "head": "Head",
                        "chest": "Chest",
                        "legs": "Legs",
                        "feet": "Feet"
                    }
                }
            }
        ]
    },
    "player.set_exhaustion": {
        "id": "player.set_exhaustion",
        "receiver": "player",
        "method": "setExhaustion",
        "description": "Sets a player's exhaustion level.",
        "native": {
            "block": "player_action",
            "action": "SetExhaustion"
        },
        "inputs": [
            {
                "id": "exhaustion_level_0_4",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_exp": {
        "id": "player.set_exp",
        "receiver": "player",
        "method": "setExp",
        "description": "Sets a player's experience level, points or progress.",
        "native": {
            "block": "player_action",
            "action": "SetExp"
        },
        "inputs": [
            {
                "id": "experience_to_set",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "set_experience",
                "defaultOption": "level",
                "options": [
                    "points",
                    "level",
                    "level_percentage"
                ],
                "native": {
                    "name": "Set Experience",
                    "slot": 26,
                    "options": {
                        "points": "Points",
                        "level": "Level",
                        "level_percentage": "Level Percentage"
                    }
                }
            }
        ]
    },
    "player.set_fall_distance": {
        "id": "player.set_fall_distance",
        "receiver": "player",
        "method": "setFallDistance",
        "description": "Sets a player's fall distance, affecting fall damage upon landing.",
        "native": {
            "block": "player_action",
            "action": "SetFallDistance"
        },
        "inputs": [
            {
                "id": "fall_distance_blocks",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_fire_ticks": {
        "id": "player.set_fire_ticks",
        "receiver": "player",
        "method": "setFireTicks",
        "description": "Sets the remaining time a player is on fire for.",
        "native": {
            "block": "player_action",
            "action": "SetFireTicks"
        },
        "inputs": [
            {
                "id": "ticks",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_flying": {
        "id": "player.set_flying",
        "receiver": "player",
        "method": "setFlying",
        "description": "Sets whether a player is flying.",
        "native": {
            "block": "player_action",
            "action": "SetFlying"
        },
        "inputs": [],
        "tags": [
            {
                "id": "flying",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Flying",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_fog_distance": {
        "id": "player.set_fog_distance",
        "receiver": "player",
        "method": "setFogDistance",
        "description": "Sets how far the fog is displayed to a player.",
        "native": {
            "block": "player_action",
            "action": "SetFogDistance"
        },
        "inputs": [
            {
                "id": "fog_distance_in_chunks_2_7",
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
        "tags": []
    },
    "player.set_food_level": {
        "id": "player.set_food_level",
        "receiver": "player",
        "method": "setFoodLevel",
        "description": "Sets a player's food hunger level.",
        "native": {
            "block": "player_action",
            "action": "SetFoodLevel"
        },
        "inputs": [
            {
                "id": "food_level_1_20",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_freeze_ticks": {
        "id": "player.set_freeze_ticks",
        "receiver": "player",
        "method": "setFreezeTicks",
        "description": "Sets how long a player is frozen for.",
        "native": {
            "block": "player_action",
            "action": "SetFreezeTicks"
        },
        "inputs": [
            {
                "id": "ticks_0_140",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "ticking_locked",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Ticking Locked",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_gliding": {
        "id": "player.set_gliding",
        "receiver": "player",
        "method": "setGliding",
        "description": "Sets whether a player is gliding with elytra.",
        "native": {
            "block": "player_action",
            "action": "SetGliding"
        },
        "inputs": [],
        "tags": [
            {
                "id": "gliding",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Gliding",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_hand_crafting": {
        "id": "player.set_hand_crafting",
        "receiver": "player",
        "method": "setHandCrafting",
        "description": "Sets if a player is allowed to interact with their hand-crafting menu.",
        "native": {
            "block": "player_action",
            "action": "SetHandCrafting"
        },
        "inputs": [],
        "tags": [
            {
                "id": "allow_hand_crafting",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Allow Hand Crafting",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_health": {
        "id": "player.set_health",
        "receiver": "player",
        "method": "setHealth",
        "description": "Sets a player's current health.",
        "native": {
            "block": "player_action",
            "action": "SetHealth"
        },
        "inputs": [
            {
                "id": "current_health",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_hotbar": {
        "id": "player.set_hotbar",
        "receiver": "player",
        "method": "setHotbar",
        "description": "Sets items in a player's hotbar.",
        "native": {
            "block": "player_action",
            "action": "SetHotbar"
        },
        "inputs": [
            {
                "id": "items_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "player.set_inv_name": {
        "id": "player.set_inv_name",
        "receiver": "player",
        "method": "setInvName",
        "description": "Renames a player's current inventory menu.",
        "native": {
            "block": "player_action",
            "action": "SetInvName"
        },
        "inputs": [
            {
                "id": "inventory_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "alignment_mode",
                "defaultOption": "regular",
                "options": [
                    "regular",
                    "centered"
                ],
                "native": {
                    "name": "Alignment Mode",
                    "slot": 26,
                    "options": {
                        "regular": "Regular",
                        "centered": "Centered"
                    }
                }
            }
        ]
    },
    "player.set_inventory": {
        "id": "player.set_inventory",
        "receiver": "player",
        "method": "setInventory",
        "description": "Sets items in a player's upper inventory.",
        "native": {
            "block": "player_action",
            "action": "SetInventory"
        },
        "inputs": [
            {
                "id": "items_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 1
            }
        ],
        "tags": []
    },
    "player.set_inventory_kept": {
        "id": "player.set_inventory_kept",
        "receiver": "player",
        "method": "setInventoryKept",
        "description": "Sets whether a player's inventory is kept after death.",
        "native": {
            "block": "player_action",
            "action": "SetInventoryKept"
        },
        "inputs": [],
        "tags": [
            {
                "id": "inventory_kept",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Inventory Kept",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_invul_ticks": {
        "id": "player.set_invul_ticks",
        "receiver": "player",
        "method": "setInvulTicks",
        "description": "Sets the currently remaining ticks until a player can next be hurt.",
        "native": {
            "block": "player_action",
            "action": "SetInvulTicks"
        },
        "inputs": [
            {
                "id": "ticks",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_item_cooldown": {
        "id": "player.set_item_cooldown",
        "receiver": "player",
        "method": "setItemCooldown",
        "description": "Applies a cooldown visual effect to an item type.",
        "native": {
            "block": "player_action",
            "action": "SetItemCooldown"
        },
        "inputs": [
            {
                "id": "item_type_to_affect",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "cooldown_in_ticks",
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
    "player.set_max_health": {
        "id": "player.set_max_health",
        "receiver": "player",
        "method": "setMaxHealth",
        "description": "Sets a player's maximum health.",
        "native": {
            "block": "player_action",
            "action": "SetMaxHealth"
        },
        "inputs": [
            {
                "id": "maximum_health",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "heal_player_to_max_health",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Heal Player to Max Health",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.set_menu_item": {
        "id": "player.set_menu_item",
        "receiver": "player",
        "method": "setMenuItem",
        "description": "Sets the item in a slot of a player's current inventory menu.",
        "native": {
            "block": "player_action",
            "action": "SetMenuItem"
        },
        "inputs": [
            {
                "id": "slot",
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
                "id": "item_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_name_color": {
        "id": "player.set_name_color",
        "receiver": "player",
        "method": "setNameColor",
        "description": "Sets the color a player's name tag appears in.",
        "native": {
            "block": "player_action",
            "action": "SetNameColor"
        },
        "inputs": [],
        "tags": [
            {
                "id": "name_color",
                "defaultOption": "black",
                "options": [
                    "black",
                    "dark_blue",
                    "dark_green",
                    "dark_aqua",
                    "dark_red",
                    "dark_purple",
                    "gold",
                    "gray",
                    "dark_gray",
                    "blue",
                    "green",
                    "aqua",
                    "red",
                    "light_purple",
                    "yellow",
                    "white",
                    "none"
                ],
                "native": {
                    "name": "Name Color",
                    "slot": 26,
                    "options": {
                        "black": "Black",
                        "dark_blue": "Dark blue",
                        "dark_green": "Dark green",
                        "dark_aqua": "Dark aqua",
                        "dark_red": "Dark red",
                        "dark_purple": "Dark purple",
                        "gold": "Gold",
                        "gray": "Gray",
                        "dark_gray": "Dark gray",
                        "blue": "Blue",
                        "green": "Green",
                        "aqua": "Aqua",
                        "red": "Red",
                        "light_purple": "Light purple",
                        "yellow": "Yellow",
                        "white": "White",
                        "none": "None"
                    }
                }
            }
        ]
    },
    "player.set_name_prefix": {
        "id": "player.set_name_prefix",
        "receiver": "player",
        "method": "setNamePrefix",
        "description": "Sets the prefix or suffix for the player's name.",
        "native": {
            "block": "player_action",
            "action": "SetNamePrefix"
        },
        "inputs": [
            {
                "id": "prefix_suffix_text",
                "acceptedTypes": [
                    "component"
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
                "id": "text_type",
                "defaultOption": "prefix",
                "options": [
                    "prefix",
                    "suffix"
                ],
                "native": {
                    "name": "Text Type",
                    "slot": 26,
                    "options": {
                        "prefix": "Prefix",
                        "suffix": "Suffix"
                    }
                }
            }
        ]
    },
    "player.set_name_visible": {
        "id": "player.set_name_visible",
        "receiver": "player",
        "method": "setNameVisible",
        "description": "Sets whether a player's name tag is visible.",
        "native": {
            "block": "player_action",
            "action": "SetNameVisible"
        },
        "inputs": [],
        "tags": [
            {
                "id": "name_tag_visible",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Name Tag Visible",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_player_time": {
        "id": "player.set_player_time",
        "receiver": "player",
        "method": "setPlayerTime",
        "description": "Sets the time of day visible to a player.",
        "native": {
            "block": "player_action",
            "action": "SetPlayerTime"
        },
        "inputs": [
            {
                "id": "daylight_ticks",
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
        "tags": []
    },
    "player.set_player_weather": {
        "id": "player.set_player_weather",
        "receiver": "player",
        "method": "setPlayerWeather",
        "description": "Sets the type of weather visible to a player.",
        "native": {
            "block": "player_action",
            "action": "SetPlayerWeather"
        },
        "inputs": [],
        "tags": [
            {
                "id": "weather",
                "defaultOption": "downfall",
                "options": [
                    "clear",
                    "downfall"
                ],
                "native": {
                    "name": "Weather",
                    "slot": 26,
                    "options": {
                        "clear": "Clear",
                        "downfall": "Downfall"
                    }
                }
            }
        ]
    },
    "player.set_rain_level": {
        "id": "player.set_rain_level",
        "receiver": "player",
        "method": "setRainLevel",
        "description": "Sets the heaviness of rain and storm visible to a player.",
        "native": {
            "block": "player_action",
            "action": "SetRainLevel"
        },
        "inputs": [
            {
                "id": "rain_level",
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
                "id": "storm_level",
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
    "player.set_reduced_debug": {
        "id": "player.set_reduced_debug",
        "receiver": "player",
        "method": "setReducedDebug",
        "description": "When enabled, a player won't be able to see their coordinates, block info, or other info.",
        "native": {
            "block": "player_action",
            "action": "SetReducedDebug"
        },
        "inputs": [],
        "tags": [
            {
                "id": "reduced_debug_info_enabled",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Reduced Debug Info Enabled",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_rotation": {
        "id": "player.set_rotation",
        "receiver": "player",
        "method": "setRotation",
        "description": "Changes a player's pitch and yaw.",
        "native": {
            "block": "player_action",
            "action": "SetRotation"
        },
        "inputs": [
            {
                "id": "pitch_90_to_90",
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
                "id": "yaw_180_to_180",
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
    "player.set_saturation": {
        "id": "player.set_saturation",
        "receiver": "player",
        "method": "setSaturation",
        "description": "Sets a player's saturation level.",
        "native": {
            "block": "player_action",
            "action": "SetSaturation"
        },
        "inputs": [
            {
                "id": "saturation_level_1_20",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_score": {
        "id": "player.set_score",
        "receiver": "player",
        "method": "setScore",
        "description": "Sets a score on the scoreboard.",
        "native": {
            "block": "player_action",
            "action": "SetScore"
        },
        "inputs": [
            {
                "id": "score_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "score_value",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_score_obj": {
        "id": "player.set_score_obj",
        "receiver": "player",
        "method": "setScoreObj",
        "description": "Sets the objective name of the scoreboard sidebar.",
        "native": {
            "block": "player_action",
            "action": "SetScoreObj"
        },
        "inputs": [
            {
                "id": "objective_name",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_shoulder": {
        "id": "player.set_shoulder",
        "receiver": "player",
        "method": "setShoulder",
        "description": "Displays a parrot on the targets' shoulders.",
        "native": {
            "block": "player_action",
            "action": "SetShoulder"
        },
        "inputs": [],
        "tags": [
            {
                "id": "shoulder",
                "defaultOption": "left",
                "options": [
                    "left",
                    "right"
                ],
                "native": {
                    "name": "Shoulder",
                    "slot": 26,
                    "options": {
                        "left": "Left",
                        "right": "Right"
                    }
                }
            },
            {
                "id": "type",
                "defaultOption": "remove",
                "options": [
                    "remove",
                    "red",
                    "blue",
                    "green",
                    "cyan",
                    "gray"
                ],
                "native": {
                    "name": "Type",
                    "slot": 25,
                    "options": {
                        "remove": "Remove",
                        "red": "Red",
                        "blue": "Blue",
                        "green": "Green",
                        "cyan": "Cyan",
                        "gray": "Gray"
                    }
                }
            }
        ]
    },
    "player.set_sidebar": {
        "id": "player.set_sidebar",
        "receiver": "player",
        "method": "setSidebar",
        "description": "Sets whether the scoreboard sidebar is visible to a player.",
        "native": {
            "block": "player_action",
            "action": "SetSidebar"
        },
        "inputs": [],
        "tags": [
            {
                "id": "sidebar",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Sidebar",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_skin": {
        "id": "player.set_skin",
        "receiver": "player",
        "method": "setSkin",
        "description": "Sets the player's skin.",
        "native": {
            "block": "player_action",
            "action": "SetSkin"
        },
        "inputs": [
            {
                "id": "player_head",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_slot": {
        "id": "player.set_slot",
        "receiver": "player",
        "method": "setSlot",
        "description": "Sets a player's selected hotbar slot.",
        "native": {
            "block": "player_action",
            "action": "SetSlot"
        },
        "inputs": [
            {
                "id": "new_slot",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "player.set_slot_item": {
        "id": "player.set_slot_item",
        "receiver": "player",
        "method": "setSlotItem",
        "description": "Sets the item in a slot of a player's inventory.",
        "native": {
            "block": "player_action",
            "action": "SetSlotItem"
        },
        "inputs": [
            {
                "id": "item_to_set",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "slot_to_set",
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
    "player.set_spawn_point": {
        "id": "player.set_spawn_point",
        "receiver": "player",
        "method": "setSpawnPoint",
        "description": "Sets the location a player will spawn when they die and respawn.",
        "native": {
            "block": "player_action",
            "action": "SetSpawnPoint"
        },
        "inputs": [
            {
                "id": "the_new_spawn_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_status": {
        "id": "player.set_status",
        "receiver": "player",
        "method": "setStatus",
        "description": "Sets the player's game status, which is used to display information about what the player is doing in the game.",
        "native": {
            "block": "player_action",
            "action": "SetStatus"
        },
        "inputs": [
            {
                "id": "game_status",
                "acceptedTypes": [
                    "component"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.set_stings_stuck": {
        "id": "player.set_stings_stuck",
        "receiver": "player",
        "method": "setStingsStuck",
        "description": "Sets the amount of bee stings sticking out of a player's character model.",
        "native": {
            "block": "player_action",
            "action": "SetStingsStuck"
        },
        "inputs": [
            {
                "id": "sting_count",
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
        "tags": []
    },
    "player.set_tab_list_info": {
        "id": "player.set_tab_list_info",
        "receiver": "player",
        "method": "setTabListInfo",
        "description": "Sets the text to be displayed above or below a player's player list shown when pressing Tab.",
        "native": {
            "block": "player_action",
            "action": "SetTabListInfo"
        },
        "inputs": [
            {
                "id": "header_footer_text",
                "acceptedTypes": [
                    "component"
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
                "id": "player_list_field",
                "defaultOption": "header",
                "options": [
                    "header",
                    "footer"
                ],
                "native": {
                    "name": "Player List Field",
                    "slot": 26,
                    "options": {
                        "header": "Header",
                        "footer": "Footer"
                    }
                }
            },
            {
                "id": "text_value_merging",
                "defaultOption": "no_spaces",
                "options": [
                    "add_spaces",
                    "no_spaces"
                ],
                "native": {
                    "name": "Text Value Merging",
                    "slot": 25,
                    "options": {
                        "add_spaces": "Add spaces",
                        "no_spaces": "No spaces"
                    }
                }
            },
            {
                "id": "inherit_styles",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Inherit Styles",
                    "slot": 24,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.set_tick_rate": {
        "id": "player.set_tick_rate",
        "receiver": "player",
        "method": "setTickRate",
        "description": "Changes the tick rate of a player.",
        "native": {
            "block": "player_action",
            "action": "SetTickRate"
        },
        "inputs": [
            {
                "id": "ticks_per_second_0_20",
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
        "tags": []
    },
    "player.set_visual_fire": {
        "id": "player.set_visual_fire",
        "receiver": "player",
        "method": "setVisualFire",
        "description": "Sets whether a player should appear on fire.",
        "native": {
            "block": "player_action",
            "action": "SetVisualFire"
        },
        "inputs": [],
        "tags": [
            {
                "id": "on_fire",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "On Fire",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.set_world_border": {
        "id": "player.set_world_border",
        "receiver": "player",
        "method": "setWorldBorder",
        "description": "Creates a world border only visible to a player.",
        "native": {
            "block": "player_action",
            "action": "SetWorldBorder"
        },
        "inputs": [
            {
                "id": "center_position",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "radius_in_blocks",
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
                "id": "warning_distance",
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
    "player.shift_world_border": {
        "id": "player.shift_world_border",
        "receiver": "player",
        "method": "shiftWorldBorder",
        "description": "Changes a player's world border size if they have one active.",
        "native": {
            "block": "player_action",
            "action": "ShiftWorldBorder"
        },
        "inputs": [
            {
                "id": "new_radius",
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
                "id": "blocks_per_second",
                "acceptedTypes": [
                    "number"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "player.show_inv": {
        "id": "player.show_inv",
        "receiver": "player",
        "method": "showInv",
        "description": "Opens a custom inventory for a player.",
        "native": {
            "block": "player_action",
            "action": "ShowInv"
        },
        "inputs": [
            {
                "id": "items_to_display",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "player.spectate_target": {
        "id": "player.spectate_target",
        "receiver": "player",
        "method": "spectateTarget",
        "description": "Makes a player spectate another player or entity.",
        "native": {
            "block": "player_action",
            "action": "SpectateTarget"
        },
        "inputs": [
            {
                "id": "target_uuid",
                "acceptedTypes": [
                    "text"
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
                "id": "ignore_formatting",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.spectator_collision": {
        "id": "player.spectator_collision",
        "receiver": "player",
        "method": "spectatorCollision",
        "description": "Toggles whether a player collides with blocks in spectator mode.",
        "native": {
            "block": "player_action",
            "action": "SpectatorCollision"
        },
        "inputs": [],
        "tags": [
            {
                "id": "spectator_collision",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Spectator Collision",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "player.spectator_mode": {
        "id": "player.spectator_mode",
        "receiver": "player",
        "method": "spectatorMode",
        "description": "Sets a player's game mode to Spectator.",
        "native": {
            "block": "player_action",
            "action": "SpectatorMode"
        },
        "inputs": [],
        "tags": []
    },
    "player.stop_sound": {
        "id": "player.stop_sound",
        "receiver": "player",
        "method": "stopSound",
        "description": "Stops all or specific sounds for a player.",
        "native": {
            "block": "player_action",
            "action": "StopSound"
        },
        "inputs": [
            {
                "id": "sounds_to_stop",
                "acceptedTypes": [
                    "sound"
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
                "id": "sound_source",
                "defaultOption": "master",
                "options": [
                    "master",
                    "music",
                    "jukebox_note_blocks",
                    "weather",
                    "blocks",
                    "hostile_creatures",
                    "friendly_creatures",
                    "players",
                    "ambient_environment",
                    "voice_speech",
                    "ui"
                ],
                "native": {
                    "name": "Sound Source",
                    "slot": 26,
                    "options": {
                        "master": "Master",
                        "music": "Music",
                        "jukebox_note_blocks": "Jukebox/Note Blocks",
                        "weather": "Weather",
                        "blocks": "Blocks",
                        "hostile_creatures": "Hostile Creatures",
                        "friendly_creatures": "Friendly Creatures",
                        "players": "Players",
                        "ambient_environment": "Ambient/Environment",
                        "voice_speech": "Voice/Speech",
                        "ui": "UI"
                    }
                }
            }
        ]
    },
    "player.survival_mode": {
        "id": "player.survival_mode",
        "receiver": "player",
        "method": "survivalMode",
        "description": "Sets a player's game mode to Survival.",
        "native": {
            "block": "player_action",
            "action": "SurvivalMode"
        },
        "inputs": [],
        "tags": []
    },
    "player.teleport": {
        "id": "player.teleport",
        "receiver": "player",
        "method": "teleport",
        "description": "Teleports a player to a location.",
        "native": {
            "block": "player_action",
            "action": "Teleport"
        },
        "inputs": [
            {
                "id": "new_position",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "keep_current_rotation",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Keep Current Rotation",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "keep_velocity",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Keep Velocity",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "player.undisguise": {
        "id": "player.undisguise",
        "receiver": "player",
        "method": "undisguise",
        "description": "Removes a player's disguise.",
        "native": {
            "block": "player_action",
            "action": "Undisguise"
        },
        "inputs": [],
        "tags": []
    },
    "player.wake_up_animation": {
        "id": "player.wake_up_animation",
        "receiver": "player",
        "method": "wakeUpAnimation",
        "description": "Displays the wake up (fade in) animation to a player.",
        "native": {
            "block": "player_action",
            "action": "WakeUpAnimation"
        },
        "inputs": [],
        "tags": []
    }
} as const;
