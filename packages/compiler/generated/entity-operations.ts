// This file is generated. Do not edit manually.

export const entityOperations = {
    "entity.add_villager_trade": {
        "id": "entity.add_villager_trade",
        "receiver": "entity",
        "method": "addVillagerTrade",
        "description": "Adds a trade to a villager.",
        "native": {
            "block": "entity_action",
            "action": "AddVillagerTrade"
        },
        "inputs": [
            {
                "id": "result_item",
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
                "id": "first_ingredient",
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
                "id": "second_ingredient",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "maximum_uses",
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
    "entity.armor_stand_parts": {
        "id": "entity.armor_stand_parts",
        "receiver": "entity",
        "method": "armorStandParts",
        "description": "Sets whether an armor stand has arms and a base plate.",
        "native": {
            "block": "entity_action",
            "action": "ArmorStandParts"
        },
        "inputs": [],
        "tags": [
            {
                "id": "arms",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable",
                    "dont_change"
                ],
                "native": {
                    "name": "Arms",
                    "slot": 25,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable",
                        "dont_change": "Don't change"
                    }
                }
            },
            {
                "id": "base_plate",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable",
                    "dont_change"
                ],
                "native": {
                    "name": "Base Plate",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable",
                        "dont_change": "Don't change"
                    }
                }
            }
        ]
    },
    "entity.armor_stand_slots": {
        "id": "entity.armor_stand_slots",
        "receiver": "entity",
        "method": "armorStandSlots",
        "description": "Sets the possible interactions, such as adding or removing items, of an armor stand's slot(s).",
        "native": {
            "block": "entity_action",
            "action": "ArmorStandSlots"
        },
        "inputs": [],
        "tags": [
            {
                "id": "interactions",
                "defaultOption": "take_swap_or_place_item",
                "options": [
                    "take_swap_or_place_item",
                    "take_or_swap_item",
                    "take_item",
                    "place_item",
                    "none"
                ],
                "native": {
                    "name": "Interactions",
                    "slot": 25,
                    "options": {
                        "take_swap_or_place_item": "Take, swap or place item",
                        "take_or_swap_item": "Take or swap item",
                        "take_item": "Take item",
                        "place_item": "Place item",
                        "none": "None"
                    }
                }
            },
            {
                "id": "equipment_slot",
                "defaultOption": "all",
                "options": [
                    "all",
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
                        "all": "All",
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
    "entity.attach_lead": {
        "id": "entity.attach_lead",
        "receiver": "entity",
        "method": "attachLead",
        "description": "Attaches a lead to the target, held by an entity or lead knot.",
        "native": {
            "block": "entity_action",
            "action": "AttachLead"
        },
        "inputs": [
            {
                "id": "lead_holder_uuid",
                "acceptedTypes": [
                    "location",
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
    "entity.attack_animation": {
        "id": "entity.attack_animation",
        "receiver": "entity",
        "method": "attackAnimation",
        "description": "Makes a mob perform an attack animation.",
        "native": {
            "block": "entity_action",
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
    "entity.bdisplay_block": {
        "id": "entity.bdisplay_block",
        "receiver": "entity",
        "method": "bdisplayBlock",
        "description": "Sets the displayed block of a block display.",
        "native": {
            "block": "entity_action",
            "action": "BDisplayBlock"
        },
        "inputs": [
            {
                "id": "displayed_block",
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
                "id": "block_data",
                "acceptedTypes": [
                    "text"
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
    "entity.block_disguise": {
        "id": "entity.block_disguise",
        "receiver": "entity",
        "method": "blockDisguise",
        "description": "Disguises an entity as a block.",
        "native": {
            "block": "entity_action",
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
    "entity.clear_potions": {
        "id": "entity.clear_potions",
        "receiver": "entity",
        "method": "clearPotions",
        "description": "Removes all active potion effects from an entity.",
        "native": {
            "block": "entity_action",
            "action": "ClearPotions"
        },
        "inputs": [],
        "tags": []
    },
    "entity.clr_villager_trades": {
        "id": "entity.clr_villager_trades",
        "receiver": "entity",
        "method": "clrVillagerTrades",
        "description": "Removes all trades from a villager.",
        "native": {
            "block": "entity_action",
            "action": "ClrVillagerTrades"
        },
        "inputs": [],
        "tags": []
    },
    "entity.combat_attribute": {
        "id": "entity.combat_attribute",
        "receiver": "entity",
        "method": "combatAttribute",
        "description": "Sets one of the entity's combat-related attributes such as attack damage and attack speed.",
        "native": {
            "block": "entity_action",
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
                    "attack_knockback"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "attack_damage": "Attack damage",
                        "attack_knockback": "Attack knockback"
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
    "entity.creeper_charged": {
        "id": "entity.creeper_charged",
        "receiver": "entity",
        "method": "creeperCharged",
        "description": "Sets whether a creeper has the charged effect.",
        "native": {
            "block": "entity_action",
            "action": "CreeperCharged"
        },
        "inputs": [],
        "tags": [
            {
                "id": "charged",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Charged",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.damage": {
        "id": "entity.damage",
        "receiver": "entity",
        "method": "damage",
        "description": "Damages a mob.",
        "native": {
            "block": "entity_action",
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
    "entity.disguise_shift_vert": {
        "id": "entity.disguise_shift_vert",
        "receiver": "entity",
        "method": "disguiseShiftVert",
        "description": "Shifts the disguise of an entity up or down relative to the entity itself.",
        "native": {
            "block": "entity_action",
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
    "entity.disp_interpolation": {
        "id": "entity.disp_interpolation",
        "receiver": "entity",
        "method": "dispInterpolation",
        "description": "Sets the interpolation properties of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DispInterpolation"
        },
        "inputs": [
            {
                "id": "interpolation_duration_in_ticks",
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
                "id": "interpolation_delay_in_ticks",
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
    "entity.disp_tpduration": {
        "id": "entity.disp_tpduration",
        "receiver": "entity",
        "method": "dispTpduration",
        "description": "Sets how long a display entity takes to visually move to its destination when it teleports.",
        "native": {
            "block": "entity_action",
            "action": "DispTPDuration"
        },
        "inputs": [
            {
                "id": "teleport_duration_in_ticks",
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
    "entity.display_billboard": {
        "id": "entity.display_billboard",
        "receiver": "entity",
        "method": "displayBillboard",
        "description": "Sets how a display entity is rotated with a player's view.",
        "native": {
            "block": "entity_action",
            "action": "DisplayBillboard"
        },
        "inputs": [],
        "tags": [
            {
                "id": "billboard_type",
                "defaultOption": "fixed",
                "options": [
                    "fixed",
                    "vertical",
                    "horizontal",
                    "center"
                ],
                "native": {
                    "name": "Billboard Type",
                    "slot": 26,
                    "options": {
                        "fixed": "Fixed",
                        "vertical": "Vertical",
                        "horizontal": "Horizontal",
                        "center": "Center"
                    }
                }
            }
        ]
    },
    "entity.display_brightness": {
        "id": "entity.display_brightness",
        "receiver": "entity",
        "method": "displayBrightness",
        "description": "Sets the brightness of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DisplayBrightness"
        },
        "inputs": [
            {
                "id": "block_light_level_0_15",
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
                "id": "sky_light_level_0_15",
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
    "entity.display_culling_size": {
        "id": "entity.display_culling_size",
        "receiver": "entity",
        "method": "displayCullingSize",
        "description": "Sets the culling width and height of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DisplayCullingSize"
        },
        "inputs": [
            {
                "id": "width",
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
                "id": "height",
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
    "entity.display_glow_color": {
        "id": "entity.display_glow_color",
        "receiver": "entity",
        "method": "displayGlowColor",
        "description": "Sets the glowing color of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DisplayGlowColor"
        },
        "inputs": [
            {
                "id": "color_hexadecimal",
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
        "tags": []
    },
    "entity.display_shadow": {
        "id": "entity.display_shadow",
        "receiver": "entity",
        "method": "displayShadow",
        "description": "Sets the shadow properties of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DisplayShadow"
        },
        "inputs": [
            {
                "id": "shadow_radius_in_blocks",
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
                "id": "shadow_opacity_in_percentage",
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
    "entity.display_view_range": {
        "id": "entity.display_view_range",
        "receiver": "entity",
        "method": "displayViewRange",
        "description": "Sets the view range of a display entity.",
        "native": {
            "block": "entity_action",
            "action": "DisplayViewRange"
        },
        "inputs": [
            {
                "id": "view_range_in_blocks",
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
    "entity.end_crystal_beam": {
        "id": "entity.end_crystal_beam",
        "receiver": "entity",
        "method": "endCrystalBeam",
        "description": "Sets the location an end crystal points its beam at.",
        "native": {
            "block": "entity_action",
            "action": "EndCrystalBeam"
        },
        "inputs": [
            {
                "id": "target",
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
    "entity.explode": {
        "id": "entity.explode",
        "receiver": "entity",
        "method": "explode",
        "description": "Causes an entity to explode.",
        "native": {
            "block": "entity_action",
            "action": "Explode"
        },
        "inputs": [],
        "tags": []
    },
    "entity.face_location": {
        "id": "entity.face_location",
        "receiver": "entity",
        "method": "faceLocation",
        "description": "Rotates an entity to look toward a location without teleporting them.",
        "native": {
            "block": "entity_action",
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
        "tags": [
            {
                "id": "face_direction",
                "defaultOption": "toward_location",
                "options": [
                    "toward_location",
                    "away_from_location"
                ],
                "native": {
                    "name": "Face Direction",
                    "slot": 26,
                    "options": {
                        "toward_location": "Toward location",
                        "away_from_location": "Away from location"
                    }
                }
            }
        ]
    },
    "entity.falling_attribute": {
        "id": "entity.falling_attribute",
        "receiver": "entity",
        "method": "fallingAttribute",
        "description": "Sets one of the entity's falling-related attributes, such as gravity and fall damage multiplier.",
        "native": {
            "block": "entity_action",
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
    "entity.fox_sleeping": {
        "id": "entity.fox_sleeping",
        "receiver": "entity",
        "method": "foxSleeping",
        "description": "Causes a fox to start or stop sleeping.",
        "native": {
            "block": "entity_action",
            "action": "FoxSleeping"
        },
        "inputs": [],
        "tags": [
            {
                "id": "sleeping",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Sleeping",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.frog_eat": {
        "id": "entity.frog_eat",
        "receiver": "entity",
        "method": "frogEat",
        "description": "Makes a frog try to eat the specified mob or player.",
        "native": {
            "block": "entity_action",
            "action": "FrogEat"
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
    "entity.heal": {
        "id": "entity.heal",
        "receiver": "entity",
        "method": "heal",
        "description": "Restores a mob's health.",
        "native": {
            "block": "entity_action",
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
    "entity.health_attribute": {
        "id": "entity.health_attribute",
        "receiver": "entity",
        "method": "healthAttribute",
        "description": "Sets one of the entity's health-related attributes such as max health and armor defense points.",
        "native": {
            "block": "entity_action",
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
    "entity.idisplay_item": {
        "id": "entity.idisplay_item",
        "receiver": "entity",
        "method": "idisplayItem",
        "description": "Sets the displayed item of an item display.",
        "native": {
            "block": "entity_action",
            "action": "IDisplayItem"
        },
        "inputs": [
            {
                "id": "displayed_item",
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
    "entity.idisplay_model_type": {
        "id": "entity.idisplay_model_type",
        "receiver": "entity",
        "method": "idisplayModelType",
        "description": "Sets the model type of an item display.",
        "native": {
            "block": "entity_action",
            "action": "IDisplayModelType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "model_type",
                "defaultOption": "none",
                "options": [
                    "none",
                    "first_person_left_hand",
                    "first_person_right_hand",
                    "third_person_left_hand",
                    "third_person_right_hand",
                    "head",
                    "gui",
                    "ground",
                    "fixed"
                ],
                "native": {
                    "name": "Model Type",
                    "slot": 26,
                    "options": {
                        "none": "None",
                        "first_person_left_hand": "First Person Left Hand",
                        "first_person_right_hand": "First Person Right Hand",
                        "third_person_left_hand": "Third Person Left Hand",
                        "third_person_right_hand": "Third Person Right Hand",
                        "head": "Head",
                        "gui": "GUI",
                        "ground": "Ground",
                        "fixed": "Fixed"
                    }
                }
            }
        ]
    },
    "entity.ignite_creeper": {
        "id": "entity.ignite_creeper",
        "receiver": "entity",
        "method": "igniteCreeper",
        "description": "Ignites a creeper, causing it to explode after a fuse period.",
        "native": {
            "block": "entity_action",
            "action": "IgniteCreeper"
        },
        "inputs": [],
        "tags": []
    },
    "entity.interact_response": {
        "id": "entity.interact_response",
        "receiver": "entity",
        "method": "interactResponse",
        "description": "Sets whether an interaction entity has response when interacting with it.",
        "native": {
            "block": "entity_action",
            "action": "InteractResponse"
        },
        "inputs": [],
        "tags": [
            {
                "id": "responsive",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Responsive",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.interaction_size": {
        "id": "entity.interaction_size",
        "receiver": "entity",
        "method": "interactionSize",
        "description": "Sets the hitbox size of an interaction entity.",
        "native": {
            "block": "entity_action",
            "action": "InteractionSize"
        },
        "inputs": [
            {
                "id": "width",
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
                "id": "height",
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
    "entity.jump": {
        "id": "entity.jump",
        "receiver": "entity",
        "method": "jump",
        "description": "Causes a mob to jump.",
        "native": {
            "block": "entity_action",
            "action": "Jump"
        },
        "inputs": [],
        "tags": []
    },
    "entity.kbattribute": {
        "id": "entity.kbattribute",
        "receiver": "entity",
        "method": "kbattribute",
        "description": "Sets one of the entity's knockback-related attributes such as knockback resistance.",
        "native": {
            "block": "entity_action",
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
    "entity.launch_fwd": {
        "id": "entity.launch_fwd",
        "receiver": "entity",
        "method": "launchFwd",
        "description": "Launches an entity forward or backward.",
        "native": {
            "block": "entity_action",
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
    "entity.launch_proj": {
        "id": "entity.launch_proj",
        "receiver": "entity",
        "method": "launchProj",
        "description": "Launches a projectile from a mob.",
        "native": {
            "block": "entity_action",
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
    "entity.launch_toward": {
        "id": "entity.launch_toward",
        "receiver": "entity",
        "method": "launchToward",
        "description": "Launches an entity toward or away from a location.",
        "native": {
            "block": "entity_action",
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
    "entity.launch_up": {
        "id": "entity.launch_up",
        "receiver": "entity",
        "method": "launchUp",
        "description": "Launches an entity up or down.",
        "native": {
            "block": "entity_action",
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
    "entity.lock_disg_rotation": {
        "id": "entity.lock_disg_rotation",
        "receiver": "entity",
        "method": "lockDisgRotation",
        "description": "Locks a disguise's pitch or yaw values.",
        "native": {
            "block": "entity_action",
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
    "entity.mannequin_desc": {
        "id": "entity.mannequin_desc",
        "receiver": "entity",
        "method": "mannequinDesc",
        "description": "Sets a mannequin's description.",
        "native": {
            "block": "entity_action",
            "action": "MannequinDesc"
        },
        "inputs": [
            {
                "id": "description",
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
    "entity.mannequin_hand": {
        "id": "entity.mannequin_hand",
        "receiver": "entity",
        "method": "mannequinHand",
        "description": "Sets a mannequin's main hand.",
        "native": {
            "block": "entity_action",
            "action": "MannequinHand"
        },
        "inputs": [],
        "tags": [
            {
                "id": "main_hand",
                "defaultOption": "left_hand",
                "options": [
                    "left_hand",
                    "right_hand"
                ],
                "native": {
                    "name": "Main Hand",
                    "slot": 26,
                    "options": {
                        "left_hand": "Left Hand",
                        "right_hand": "Right Hand"
                    }
                }
            }
        ]
    },
    "entity.mannequin_layers": {
        "id": "entity.mannequin_layers",
        "receiver": "entity",
        "method": "mannequinLayers",
        "description": "Sets a mannequin's skin layers.",
        "native": {
            "block": "entity_action",
            "action": "MannequinLayers"
        },
        "inputs": [],
        "tags": [
            {
                "id": "cape_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Cape Layer",
                    "slot": 26,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "jacket_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Jacket Layer",
                    "slot": 25,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "left_sleeve_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Left Sleeve Layer",
                    "slot": 24,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "right_sleeve_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Right Sleeve Layer",
                    "slot": 23,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "left_pants_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Left Pants Layer",
                    "slot": 22,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "right_pants_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Right Pants Layer",
                    "slot": 21,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            },
            {
                "id": "hat_layer",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "hidden"
                ],
                "native": {
                    "name": "Hat Layer",
                    "slot": 20,
                    "options": {
                        "visible": "Visible",
                        "hidden": "Hidden"
                    }
                }
            }
        ]
    },
    "entity.mannequin_movable": {
        "id": "entity.mannequin_movable",
        "receiver": "entity",
        "method": "mannequinMovable",
        "description": "Sets whether a mannequin is movable.",
        "native": {
            "block": "entity_action",
            "action": "MannequinMovable"
        },
        "inputs": [],
        "tags": [
            {
                "id": "movable",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Movable",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.mannequin_skin": {
        "id": "entity.mannequin_skin",
        "receiver": "entity",
        "method": "mannequinSkin",
        "description": "Sets a mannequin's skin avatar.",
        "native": {
            "block": "entity_action",
            "action": "MannequinSkin"
        },
        "inputs": [
            {
                "id": "mannequin_player_head",
                "acceptedTypes": [
                    "item",
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
    "entity.mimic": {
        "id": "entity.mimic",
        "receiver": "entity",
        "method": "mimic",
        "description": "Disguises an entity as another currently existing entity or player.",
        "native": {
            "block": "entity_action",
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
    "entity.misc_attribute": {
        "id": "entity.misc_attribute",
        "receiver": "entity",
        "method": "miscAttribute",
        "description": "Sets one of the entity's miscellaneous attributes such as scale and burning time.",
        "native": {
            "block": "entity_action",
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
                    "follow_range",
                    "zombie_spawn_reinforcements",
                    "oxygen_bonus",
                    "burning_time",
                    "camera_distance",
                    "tempt_range"
                ],
                "native": {
                    "name": "Attribute",
                    "slot": 25,
                    "options": {
                        "scale": "Scale",
                        "follow_range": "Follow range",
                        "zombie_spawn_reinforcements": "Zombie spawn reinforcements",
                        "oxygen_bonus": "Oxygen bonus",
                        "burning_time": "Burning time",
                        "camera_distance": "Camera distance",
                        "tempt_range": "Tempt range"
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
    "entity.mob_disguise": {
        "id": "entity.mob_disguise",
        "receiver": "entity",
        "method": "mobDisguise",
        "description": "Disguises an entity as a mob.",
        "native": {
            "block": "entity_action",
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
    "entity.mooshroom_type": {
        "id": "entity.mooshroom_type",
        "receiver": "entity",
        "method": "mooshroomType",
        "description": "Sets a mooshroom's skin type.",
        "native": {
            "block": "entity_action",
            "action": "MooshroomType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "mooshroom_variant",
                "defaultOption": "red",
                "options": [
                    "red",
                    "brown"
                ],
                "native": {
                    "name": "Mooshroom Variant",
                    "slot": 26,
                    "options": {
                        "red": "Red",
                        "brown": "Brown"
                    }
                }
            }
        ]
    },
    "entity.move_to_loc": {
        "id": "entity.move_to_loc",
        "receiver": "entity",
        "method": "moveToLoc",
        "description": "Instructs a mob's AI to always pathfind to a certain location at a certain speed.",
        "native": {
            "block": "entity_action",
            "action": "MoveToLoc"
        },
        "inputs": [
            {
                "id": "target_location",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "walk_speed",
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
    "entity.movement_attribute": {
        "id": "entity.movement_attribute",
        "receiver": "entity",
        "method": "movementAttribute",
        "description": "Sets one of the entity's movement-related attributes, such as walking speed and jump height.",
        "native": {
            "block": "entity_action",
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
    "entity.oxidize_ticks_left": {
        "id": "entity.oxidize_ticks_left",
        "receiver": "entity",
        "method": "oxidizeTicksLeft",
        "description": "Sets the amount of ticks until a copper golem will next oxidize.",
        "native": {
            "block": "entity_action",
            "action": "OxidizeTicksLeft"
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
    "entity.player_disguise": {
        "id": "entity.player_disguise",
        "receiver": "entity",
        "method": "playerDisguise",
        "description": "Disguises an entity as a player.",
        "native": {
            "block": "entity_action",
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
    "entity.projectile_item": {
        "id": "entity.projectile_item",
        "receiver": "entity",
        "method": "projectileItem",
        "description": "Sets the item a projectile displays as.",
        "native": {
            "block": "entity_action",
            "action": "ProjectileItem"
        },
        "inputs": [
            {
                "id": "display_item",
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
    "entity.ram": {
        "id": "entity.ram",
        "receiver": "entity",
        "method": "ram",
        "description": "Makes a goat ram the specified mob or player.",
        "native": {
            "block": "entity_action",
            "action": "Ram"
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
    "entity.rem_villager_trade": {
        "id": "entity.rem_villager_trade",
        "receiver": "entity",
        "method": "remVillagerTrade",
        "description": "Removes a trade from a villager",
        "native": {
            "block": "entity_action",
            "action": "RemVillagerTrade"
        },
        "inputs": [
            {
                "id": "trade_index",
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
    "entity.remove": {
        "id": "entity.remove",
        "receiver": "entity",
        "method": "remove",
        "description": "Deletes an entity.",
        "native": {
            "block": "entity_action",
            "action": "Remove"
        },
        "inputs": [],
        "tags": []
    },
    "entity.remove_custom_tag": {
        "id": "entity.remove_custom_tag",
        "receiver": "entity",
        "method": "removeCustomTag",
        "description": "Removes a custom tag from an entity.",
        "native": {
            "block": "entity_action",
            "action": "RemoveCustomTag"
        },
        "inputs": [
            {
                "id": "tag_name",
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
    "entity.restock_trades": {
        "id": "entity.restock_trades",
        "receiver": "entity",
        "method": "restockTrades",
        "description": "Restocks all of a villager's trades.",
        "native": {
            "block": "entity_action",
            "action": "RestockTrades"
        },
        "inputs": [],
        "tags": []
    },
    "entity.ride_entity": {
        "id": "entity.ride_entity",
        "receiver": "entity",
        "method": "rideEntity",
        "description": "Mounts an entity on top of another entity or player.",
        "native": {
            "block": "entity_action",
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
    "entity.send_animation": {
        "id": "entity.send_animation",
        "receiver": "entity",
        "method": "sendAnimation",
        "description": "Makes a mob perform an animation.",
        "native": {
            "block": "entity_action",
            "action": "SendAnimation"
        },
        "inputs": [],
        "tags": [
            {
                "id": "animation_type",
                "defaultOption": "hurt_animation",
                "options": [
                    "hurt_animation",
                    "crit_particles",
                    "enchanted_hit_particles"
                ],
                "native": {
                    "name": "Animation Type",
                    "slot": 26,
                    "options": {
                        "hurt_animation": "Hurt animation",
                        "crit_particles": "Crit particles",
                        "enchanted_hit_particles": "Enchanted hit particles"
                    }
                }
            }
        ]
    },
    "entity.set_absorption": {
        "id": "entity.set_absorption",
        "receiver": "entity",
        "method": "setAbsorption",
        "description": "Sets an entity's absorption health (golden hearts).",
        "native": {
            "block": "entity_action",
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
    "entity.set_age": {
        "id": "entity.set_age",
        "receiver": "entity",
        "method": "setAge",
        "description": "Sets an animal's age.",
        "native": {
            "block": "entity_action",
            "action": "SetAge"
        },
        "inputs": [
            {
                "id": "age",
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
                "id": "age_lock",
                "defaultOption": "dont_change",
                "options": [
                    "enable",
                    "disable",
                    "dont_change"
                ],
                "native": {
                    "name": "Age Lock",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable",
                        "dont_change": "Don't change"
                    }
                }
            }
        ]
    },
    "entity.set_ai": {
        "id": "entity.set_ai",
        "receiver": "entity",
        "method": "setAi",
        "description": "Sets whether an entity is sentient and/or affected by physics.",
        "native": {
            "block": "entity_action",
            "action": "SetAI"
        },
        "inputs": [],
        "tags": [
            {
                "id": "ai",
                "defaultOption": "none",
                "options": [
                    "sentient",
                    "insentient",
                    "none"
                ],
                "native": {
                    "name": "AI",
                    "slot": 26,
                    "options": {
                        "sentient": "Sentient",
                        "insentient": "Insentient",
                        "none": "None"
                    }
                }
            }
        ]
    },
    "entity.set_allay_dancing": {
        "id": "entity.set_allay_dancing",
        "receiver": "entity",
        "method": "setAllayDancing",
        "description": "Sets whether an allay is dancing or not.",
        "native": {
            "block": "entity_action",
            "action": "SetAllayDancing"
        },
        "inputs": [],
        "tags": [
            {
                "id": "dancing",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Dancing",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_angry": {
        "id": "entity.set_angry",
        "receiver": "entity",
        "method": "setAngry",
        "description": "Sets whether a mob is angry at players.",
        "native": {
            "block": "entity_action",
            "action": "SetAngry"
        },
        "inputs": [],
        "tags": [
            {
                "id": "angry",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Angry",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_armor": {
        "id": "entity.set_armor",
        "receiver": "entity",
        "method": "setArmor",
        "description": "Sets a mob's armor items. Place the armor in slots 1-4 of the chest, with 1 being the helmet and 4 being the boots.",
        "native": {
            "block": "entity_action",
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
    "entity.set_arms_raised": {
        "id": "entity.set_arms_raised",
        "receiver": "entity",
        "method": "setArmsRaised",
        "description": "Sets whether a mob has its arms raised.",
        "native": {
            "block": "entity_action",
            "action": "SetArmsRaised"
        },
        "inputs": [],
        "tags": [
            {
                "id": "arms_raised",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Arms Raised",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_arrow_damage": {
        "id": "entity.set_arrow_damage",
        "receiver": "entity",
        "method": "setArrowDamage",
        "description": "Sets the base damage dealt by an arrow or trident.",
        "native": {
            "block": "entity_action",
            "action": "SetArrowDamage"
        },
        "inputs": [
            {
                "id": "base_damage",
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
    "entity.set_arrow_hit_sound": {
        "id": "entity.set_arrow_hit_sound",
        "receiver": "entity",
        "method": "setArrowHitSound",
        "description": "Sets the sound an arrow plays whenever it lands.",
        "native": {
            "block": "entity_action",
            "action": "SetArrowHitSound"
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
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": []
    },
    "entity.set_arrow_no_clip": {
        "id": "entity.set_arrow_no_clip",
        "receiver": "entity",
        "method": "setArrowNoClip",
        "description": "Sets whether an arrow will pass through blocks and through entities.",
        "native": {
            "block": "entity_action",
            "action": "SetArrowNoClip"
        },
        "inputs": [],
        "tags": [
            {
                "id": "has_no_clip",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Has NoClip",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_arrow_pierce": {
        "id": "entity.set_arrow_pierce",
        "receiver": "entity",
        "method": "setArrowPierce",
        "description": "Sets how many targets an arrow can pierce through. A pierce of 1 can hit up to 2 entities.",
        "native": {
            "block": "entity_action",
            "action": "SetArrowPierce"
        },
        "inputs": [
            {
                "id": "targets_to_pierce",
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
    "entity.set_axolotl_color": {
        "id": "entity.set_axolotl_color",
        "receiver": "entity",
        "method": "setAxolotlColor",
        "description": "Sets an axolotl's color.",
        "native": {
            "block": "entity_action",
            "action": "SetAxolotlColor"
        },
        "inputs": [],
        "tags": [
            {
                "id": "axolotl_color",
                "defaultOption": "pink",
                "options": [
                    "pink",
                    "brown",
                    "yellow",
                    "cyan",
                    "blue"
                ],
                "native": {
                    "name": "Axolotl Color",
                    "slot": 26,
                    "options": {
                        "pink": "Pink",
                        "brown": "Brown",
                        "yellow": "Yellow",
                        "cyan": "Cyan",
                        "blue": "Blue"
                    }
                }
            }
        ]
    },
    "entity.set_baby": {
        "id": "entity.set_baby",
        "receiver": "entity",
        "method": "setBaby",
        "description": "Sets whether an entity is a baby (permanently).",
        "native": {
            "block": "entity_action",
            "action": "SetBaby"
        },
        "inputs": [],
        "tags": [
            {
                "id": "baby",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Baby",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_bee_nectar": {
        "id": "entity.set_bee_nectar",
        "receiver": "entity",
        "method": "setBeeNectar",
        "description": "Sets if a bee has nectar on its body.",
        "native": {
            "block": "entity_action",
            "action": "SetBeeNectar"
        },
        "inputs": [],
        "tags": [
            {
                "id": "has_nectar",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Has Nectar",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_bee_stinger": {
        "id": "entity.set_bee_stinger",
        "receiver": "entity",
        "method": "setBeeStinger",
        "description": "Sets whether a bee has its stinger.",
        "native": {
            "block": "entity_action",
            "action": "SetBeeStinger"
        },
        "inputs": [],
        "tags": [
            {
                "id": "has_stinger",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Has Stinger",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_bullet_target": {
        "id": "entity.set_bullet_target",
        "receiver": "entity",
        "method": "setBulletTarget",
        "description": "Causes a shulker bullet to start targeting the provided entity.",
        "native": {
            "block": "entity_action",
            "action": "SetBulletTarget"
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
    "entity.set_carrying_chest": {
        "id": "entity.set_carrying_chest",
        "receiver": "entity",
        "method": "setCarryingChest",
        "description": "Sets whether a mob carries a chest, which allows its inventory to be accessed.",
        "native": {
            "block": "entity_action",
            "action": "SetCarryingChest"
        },
        "inputs": [],
        "tags": [
            {
                "id": "carrying_chest",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Carrying Chest",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_cat_resting": {
        "id": "entity.set_cat_resting",
        "receiver": "entity",
        "method": "setCatResting",
        "description": "Sets whether a cat appears to be lying down.",
        "native": {
            "block": "entity_action",
            "action": "SetCatResting"
        },
        "inputs": [],
        "tags": [
            {
                "id": "resting",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Resting",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_cat_type": {
        "id": "entity.set_cat_type",
        "receiver": "entity",
        "method": "setCatType",
        "description": "Sets a cat's skin type.",
        "native": {
            "block": "entity_action",
            "action": "SetCatType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "skin_type",
                "defaultOption": "tabby",
                "options": [
                    "tabby",
                    "tuxedo",
                    "red",
                    "siamese",
                    "british_shorthair",
                    "calico",
                    "persian",
                    "ragdoll",
                    "white",
                    "jellie",
                    "black"
                ],
                "native": {
                    "name": "Skin Type",
                    "slot": 26,
                    "options": {
                        "tabby": "Tabby",
                        "tuxedo": "Tuxedo",
                        "red": "Red",
                        "siamese": "Siamese",
                        "british_shorthair": "British Shorthair",
                        "calico": "Calico",
                        "persian": "Persian",
                        "ragdoll": "Ragdoll",
                        "white": "White",
                        "jellie": "Jellie",
                        "black": "Black"
                    }
                }
            }
        ]
    },
    "entity.set_celebrating": {
        "id": "entity.set_celebrating",
        "receiver": "entity",
        "method": "setCelebrating",
        "description": "Causes a mob to start or stop celebrating.",
        "native": {
            "block": "entity_action",
            "action": "SetCelebrating"
        },
        "inputs": [],
        "tags": [
            {
                "id": "celebrate",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Celebrate",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_cloud_radius": {
        "id": "entity.set_cloud_radius",
        "receiver": "entity",
        "method": "setCloudRadius",
        "description": "Sets an area of effect cloud's radius and shrinking speed.",
        "native": {
            "block": "entity_action",
            "action": "SetCloudRadius"
        },
        "inputs": [
            {
                "id": "radius",
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
                "id": "shrinking_speed_blocks_per_second",
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
    "entity.set_collidable": {
        "id": "entity.set_collidable",
        "receiver": "entity",
        "method": "setCollidable",
        "description": "Sets whether a mob is able to collide with other entities.",
        "native": {
            "block": "entity_action",
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
    "entity.set_creeper_fuse": {
        "id": "entity.set_creeper_fuse",
        "receiver": "entity",
        "method": "setCreeperFuse",
        "description": "Sets the starting amount of ticks it takes for a creeper to explode.",
        "native": {
            "block": "entity_action",
            "action": "SetCreeperFuse"
        },
        "inputs": [
            {
                "id": "fuse_ticks",
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
    "entity.set_creeper_power": {
        "id": "entity.set_creeper_power",
        "receiver": "entity",
        "method": "setCreeperPower",
        "description": "Sets a creeper's explosion power. This affects the damage and area of effect.",
        "native": {
            "block": "entity_action",
            "action": "SetCreeperPower"
        },
        "inputs": [
            {
                "id": "power_0_25",
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
    "entity.set_custom_tag": {
        "id": "entity.set_custom_tag",
        "receiver": "entity",
        "method": "setCustomTag",
        "description": "Sets the value of or creates a custom tag value.",
        "native": {
            "block": "entity_action",
            "action": "SetCustomTag"
        },
        "inputs": [
            {
                "id": "tag_name",
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
                "id": "tag_value",
                "acceptedTypes": [
                    "number",
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
    "entity.set_death_drops": {
        "id": "entity.set_death_drops",
        "receiver": "entity",
        "method": "setDeathDrops",
        "description": "Sets whether a mob drops their items when dead.",
        "native": {
            "block": "entity_action",
            "action": "SetDeathDrops"
        },
        "inputs": [],
        "tags": [
            {
                "id": "has_death_drops",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Has Death Drops",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_digging": {
        "id": "entity.set_digging",
        "receiver": "entity",
        "method": "setDigging",
        "description": "Makes a warden emerge or dig into the ground.",
        "native": {
            "block": "entity_action",
            "action": "SetDigging"
        },
        "inputs": [],
        "tags": [
            {
                "id": "digging_type",
                "defaultOption": "emerge",
                "options": [
                    "emerge",
                    "dig_down"
                ],
                "native": {
                    "name": "Digging Type",
                    "slot": 26,
                    "options": {
                        "emerge": "Emerge",
                        "dig_down": "Dig Down"
                    }
                }
            }
        ]
    },
    "entity.set_dragon_phase": {
        "id": "entity.set_dragon_phase",
        "receiver": "entity",
        "method": "setDragonPhase",
        "description": "Sets the behavior phase of an Ender Dragon.",
        "native": {
            "block": "entity_action",
            "action": "SetDragonPhase"
        },
        "inputs": [],
        "tags": [
            {
                "id": "phase",
                "defaultOption": "flying",
                "options": [
                    "flying",
                    "hovering",
                    "breath_attack",
                    "dying"
                ],
                "native": {
                    "name": "Phase",
                    "slot": 26,
                    "options": {
                        "flying": "Flying",
                        "hovering": "Hovering",
                        "breath_attack": "Breath attack",
                        "dying": "Dying"
                    }
                }
            }
        ]
    },
    "entity.set_dye_color": {
        "id": "entity.set_dye_color",
        "receiver": "entity",
        "method": "setDyeColor",
        "description": "Sets a mob's dye color.",
        "native": {
            "block": "entity_action",
            "action": "SetDyeColor"
        },
        "inputs": [],
        "tags": [
            {
                "id": "dye",
                "defaultOption": "white",
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
                    "name": "Dye",
                    "slot": 26,
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
            }
        ]
    },
    "entity.set_enderman_block": {
        "id": "entity.set_enderman_block",
        "receiver": "entity",
        "method": "setEndermanBlock",
        "description": "Set an enderman's held block.",
        "native": {
            "block": "entity_action",
            "action": "SetEndermanBlock"
        },
        "inputs": [
            {
                "id": "block_to_hold",
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
    "entity.set_equipment": {
        "id": "entity.set_equipment",
        "receiver": "entity",
        "method": "setEquipment",
        "description": "Sets the item in one of the equipment slots (including horse items) of an entity.",
        "native": {
            "block": "entity_action",
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
                    "body",
                    "legs",
                    "feet",
                    "saddle",
                    "horse_armor",
                    "decor",
                    "harness"
                ],
                "native": {
                    "name": "Equipment Slot",
                    "slot": 26,
                    "options": {
                        "main_hand": "Main hand",
                        "off_hand": "Off hand",
                        "head": "Head",
                        "body": "Body",
                        "legs": "Legs",
                        "feet": "Feet",
                        "saddle": "Saddle",
                        "horse_armor": "Horse armor",
                        "decor": "Decor",
                        "harness": "Harness"
                    }
                }
            }
        ]
    },
    "entity.set_fall_distance": {
        "id": "entity.set_fall_distance",
        "receiver": "entity",
        "method": "setFallDistance",
        "description": "Sets an entity's fall distance, affecting fall damage upon landing.",
        "native": {
            "block": "entity_action",
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
    "entity.set_fire_ticks": {
        "id": "entity.set_fire_ticks",
        "receiver": "entity",
        "method": "setFireTicks",
        "description": "Sets the remaining time an entity is on fire for.",
        "native": {
            "block": "entity_action",
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
    "entity.set_fish_pattern": {
        "id": "entity.set_fish_pattern",
        "receiver": "entity",
        "method": "setFishPattern",
        "description": "Sets a tropical fish's color and pattern.",
        "native": {
            "block": "entity_action",
            "action": "SetFishPattern"
        },
        "inputs": [],
        "tags": [
            {
                "id": "pattern_color",
                "defaultOption": "white",
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
                    "black",
                    "dont_change"
                ],
                "native": {
                    "name": "Pattern Color",
                    "slot": 24,
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
                        "black": "Black",
                        "dont_change": "Don't change"
                    }
                }
            },
            {
                "id": "body_color",
                "defaultOption": "white",
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
                    "black",
                    "dont_change"
                ],
                "native": {
                    "name": "Body Color",
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
                        "black": "Black",
                        "dont_change": "Don't change"
                    }
                }
            },
            {
                "id": "pattern",
                "defaultOption": "kob",
                "options": [
                    "kob",
                    "sunstreak",
                    "snooper",
                    "dasher",
                    "brinely",
                    "spotty",
                    "flopper",
                    "stripey",
                    "glitter",
                    "blockfish",
                    "betty",
                    "clayfish",
                    "dont_change"
                ],
                "native": {
                    "name": "Pattern",
                    "slot": 26,
                    "options": {
                        "kob": "Kob",
                        "sunstreak": "Sunstreak",
                        "snooper": "Snooper",
                        "dasher": "Dasher",
                        "brinely": "Brinely",
                        "spotty": "Spotty",
                        "flopper": "Flopper",
                        "stripey": "Stripey",
                        "glitter": "Glitter",
                        "blockfish": "Blockfish",
                        "betty": "Betty",
                        "clayfish": "Clayfish",
                        "dont_change": "Don't change"
                    }
                }
            }
        ]
    },
    "entity.set_fishing_time": {
        "id": "entity.set_fishing_time",
        "receiver": "entity",
        "method": "setFishingTime",
        "description": "Sets the time until a fish starts to approach a fishing hook.",
        "native": {
            "block": "entity_action",
            "action": "SetFishingTime"
        },
        "inputs": [
            {
                "id": "wait_time_ticks",
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
    "entity.set_fox_leaping": {
        "id": "entity.set_fox_leaping",
        "receiver": "entity",
        "method": "setFoxLeaping",
        "description": "Sets whether a fox appears to be leaping.",
        "native": {
            "block": "entity_action",
            "action": "SetFoxLeaping"
        },
        "inputs": [],
        "tags": [
            {
                "id": "leaping",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Leaping",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_fox_type": {
        "id": "entity.set_fox_type",
        "receiver": "entity",
        "method": "setFoxType",
        "description": "Sets a fox's fur type.",
        "native": {
            "block": "entity_action",
            "action": "SetFoxType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "fox_type",
                "defaultOption": "red",
                "options": [
                    "red",
                    "snow"
                ],
                "native": {
                    "name": "Fox Type",
                    "slot": 26,
                    "options": {
                        "red": "Red",
                        "snow": "Snow"
                    }
                }
            }
        ]
    },
    "entity.set_freeze_ticks": {
        "id": "entity.set_freeze_ticks",
        "receiver": "entity",
        "method": "setFreezeTicks",
        "description": "Sets an entity's current freeze ticks.",
        "native": {
            "block": "entity_action",
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
    "entity.set_friction": {
        "id": "entity.set_friction",
        "receiver": "entity",
        "method": "setFriction",
        "description": "Changes the type of friction an entity experiences.",
        "native": {
            "block": "entity_action",
            "action": "SetFriction"
        },
        "inputs": [],
        "tags": [
            {
                "id": "friction_type",
                "defaultOption": "no_friction",
                "options": [
                    "normal",
                    "no_friction"
                ],
                "native": {
                    "name": "Friction Type",
                    "slot": 26,
                    "options": {
                        "normal": "Normal",
                        "no_friction": "No Friction"
                    }
                }
            }
        ]
    },
    "entity.set_gliding": {
        "id": "entity.set_gliding",
        "receiver": "entity",
        "method": "setGliding",
        "description": "Sets whether an entity is gliding.",
        "native": {
            "block": "entity_action",
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
    "entity.set_glow_squid_dark": {
        "id": "entity.set_glow_squid_dark",
        "receiver": "entity",
        "method": "setGlowSquidDark",
        "description": "Sets the number of ticks a glow squid will stop glowing for.",
        "native": {
            "block": "entity_action",
            "action": "SetGlowSquidDark"
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
    "entity.set_glowing": {
        "id": "entity.set_glowing",
        "receiver": "entity",
        "method": "setGlowing",
        "description": "Sets whether this entity has a glowing outline that can be seen through blocks.",
        "native": {
            "block": "entity_action",
            "action": "SetGlowing"
        },
        "inputs": [],
        "tags": [
            {
                "id": "glowing",
                "defaultOption": "enable",
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
    "entity.set_goat_horns": {
        "id": "entity.set_goat_horns",
        "receiver": "entity",
        "method": "setGoatHorns",
        "description": "Sets which goat horns are shown or hidden.",
        "native": {
            "block": "entity_action",
            "action": "SetGoatHorns"
        },
        "inputs": [],
        "tags": [
            {
                "id": "left_horn",
                "defaultOption": "no_change",
                "options": [
                    "show",
                    "hide",
                    "no_change"
                ],
                "native": {
                    "name": "Left Horn",
                    "slot": 25,
                    "options": {
                        "show": "Show",
                        "hide": "Hide",
                        "no_change": "No Change"
                    }
                }
            },
            {
                "id": "right_horn",
                "defaultOption": "no_change",
                "options": [
                    "show",
                    "hide",
                    "no_change"
                ],
                "native": {
                    "name": "Right Horn",
                    "slot": 26,
                    "options": {
                        "show": "Show",
                        "hide": "Hide",
                        "no_change": "No Change"
                    }
                }
            }
        ]
    },
    "entity.set_goat_screaming": {
        "id": "entity.set_goat_screaming",
        "receiver": "entity",
        "method": "setGoatScreaming",
        "description": "Sets whether a goat screams or not.",
        "native": {
            "block": "entity_action",
            "action": "SetGoatScreaming"
        },
        "inputs": [],
        "tags": [
            {
                "id": "screams",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Screams",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_gravity": {
        "id": "entity.set_gravity",
        "receiver": "entity",
        "method": "setGravity",
        "description": "Sets whether an entity is affected by gravity.",
        "native": {
            "block": "entity_action",
            "action": "SetGravity"
        },
        "inputs": [],
        "tags": [
            {
                "id": "gravity",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Gravity",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_health": {
        "id": "entity.set_health",
        "receiver": "entity",
        "method": "setHealth",
        "description": "Sets an entity's current health.",
        "native": {
            "block": "entity_action",
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
    "entity.set_horse_jump": {
        "id": "entity.set_horse_jump",
        "receiver": "entity",
        "method": "setHorseJump",
        "description": "Sets a horse's jump strength.",
        "native": {
            "block": "entity_action",
            "action": "SetHorseJump"
        },
        "inputs": [
            {
                "id": "strength",
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
    "entity.set_horse_pattern": {
        "id": "entity.set_horse_pattern",
        "receiver": "entity",
        "method": "setHorsePattern",
        "description": "Sets a horse's color and pattern.",
        "native": {
            "block": "entity_action",
            "action": "SetHorsePattern"
        },
        "inputs": [],
        "tags": [
            {
                "id": "horse_color",
                "defaultOption": "flaxen_chestnut",
                "options": [
                    "white",
                    "buckskin",
                    "flaxen_chestnut",
                    "bay",
                    "black",
                    "dapple_gray",
                    "dark_bay",
                    "dont_change"
                ],
                "native": {
                    "name": "Horse Color",
                    "slot": 25,
                    "options": {
                        "white": "White",
                        "buckskin": "Buckskin",
                        "flaxen_chestnut": "Flaxen chestnut",
                        "bay": "Bay",
                        "black": "Black",
                        "dapple_gray": "Dapple gray",
                        "dark_bay": "Dark bay",
                        "dont_change": "Don't change"
                    }
                }
            },
            {
                "id": "horse_markings",
                "defaultOption": "stockings_and_blaze",
                "options": [
                    "no_markings",
                    "stockings_and_blaze",
                    "paint",
                    "snowflake_appaloosa",
                    "sooty",
                    "dont_change"
                ],
                "native": {
                    "name": "Horse Markings",
                    "slot": 26,
                    "options": {
                        "no_markings": "No markings",
                        "stockings_and_blaze": "Stockings and blaze",
                        "paint": "Paint",
                        "snowflake_appaloosa": "Snowflake appaloosa",
                        "sooty": "Sooty",
                        "dont_change": "Don't change"
                    }
                }
            }
        ]
    },
    "entity.set_invisible": {
        "id": "entity.set_invisible",
        "receiver": "entity",
        "method": "setInvisible",
        "description": "Sets whether an entity is invisible.",
        "native": {
            "block": "entity_action",
            "action": "SetInvisible"
        },
        "inputs": [],
        "tags": [
            {
                "id": "invisible",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Invisible",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_invul_ticks": {
        "id": "entity.set_invul_ticks",
        "receiver": "entity",
        "method": "setInvulTicks",
        "description": "Sets the currently remaining ticks until an entity can next be hurt.",
        "native": {
            "block": "entity_action",
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
    "entity.set_invulnerable": {
        "id": "entity.set_invulnerable",
        "receiver": "entity",
        "method": "setInvulnerable",
        "description": "Sets whether an entity is invulnerable to damage.",
        "native": {
            "block": "entity_action",
            "action": "SetInvulnerable"
        },
        "inputs": [],
        "tags": [
            {
                "id": "invulnerable",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Invulnerable",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_item": {
        "id": "entity.set_item",
        "receiver": "entity",
        "method": "setItem",
        "description": "Sets the item of an item entity.",
        "native": {
            "block": "entity_action",
            "action": "SetItem"
        },
        "inputs": [
            {
                "id": "new_item",
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
    "entity.set_llama_color": {
        "id": "entity.set_llama_color",
        "receiver": "entity",
        "method": "setLlamaColor",
        "description": "Sets a llama's fur color.",
        "native": {
            "block": "entity_action",
            "action": "SetLlamaColor"
        },
        "inputs": [],
        "tags": [
            {
                "id": "llama_color",
                "defaultOption": "brown",
                "options": [
                    "brown",
                    "creamy",
                    "white",
                    "gray"
                ],
                "native": {
                    "name": "Llama Color",
                    "slot": 26,
                    "options": {
                        "brown": "Brown",
                        "creamy": "Creamy",
                        "white": "White",
                        "gray": "Gray"
                    }
                }
            }
        ]
    },
    "entity.set_marker": {
        "id": "entity.set_marker",
        "receiver": "entity",
        "method": "setMarker",
        "description": "Sets whether an armor stand is a marker.",
        "native": {
            "block": "entity_action",
            "action": "SetMarker"
        },
        "inputs": [],
        "tags": [
            {
                "id": "marker",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Marker",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_max_health": {
        "id": "entity.set_max_health",
        "receiver": "entity",
        "method": "setMaxHealth",
        "description": "Sets an entity's maximum health.",
        "native": {
            "block": "entity_action",
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
                "id": "heal_mob_to_max_health",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Heal Mob to Max Health",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "entity.set_minecart_block": {
        "id": "entity.set_minecart_block",
        "receiver": "entity",
        "method": "setMinecartBlock",
        "description": "Sets the block shown inside a minecart. This does not affect its functionality.",
        "native": {
            "block": "entity_action",
            "action": "SetMinecartBlock"
        },
        "inputs": [
            {
                "id": "block_to_show",
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
                "id": "block_offset",
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
    "entity.set_mob_sitting": {
        "id": "entity.set_mob_sitting",
        "receiver": "entity",
        "method": "setMobSitting",
        "description": "Sets whether an entity is sitting.",
        "native": {
            "block": "entity_action",
            "action": "SetMobSitting"
        },
        "inputs": [],
        "tags": [
            {
                "id": "is_sitting",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Is Sitting",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_name": {
        "id": "entity.set_name",
        "receiver": "entity",
        "method": "setName",
        "description": "Sets an entity's custom name.",
        "native": {
            "block": "entity_action",
            "action": "SetName"
        },
        "inputs": [
            {
                "id": "custom_name",
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
                "id": "name_tag_visibility",
                "defaultOption": "always",
                "options": [
                    "always",
                    "default",
                    "never",
                    "dont_change"
                ],
                "native": {
                    "name": "Name Tag Visibility",
                    "slot": 26,
                    "options": {
                        "always": "Always",
                        "default": "Default",
                        "never": "Never",
                        "dont_change": "Don't change"
                    }
                }
            }
        ]
    },
    "entity.set_name_color": {
        "id": "entity.set_name_color",
        "receiver": "entity",
        "method": "setNameColor",
        "description": "Sets the color an entity's name tag appears in.",
        "native": {
            "block": "entity_action",
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
    "entity.set_name_visible": {
        "id": "entity.set_name_visible",
        "receiver": "entity",
        "method": "setNameVisible",
        "description": "Sets whether an entity's custom name is always displayed above them.",
        "native": {
            "block": "entity_action",
            "action": "SetNameVisible"
        },
        "inputs": [],
        "tags": [
            {
                "id": "name_tag_visibility",
                "defaultOption": "always",
                "options": [
                    "always",
                    "default",
                    "never"
                ],
                "native": {
                    "name": "Name Tag Visibility",
                    "slot": 26,
                    "options": {
                        "always": "Always",
                        "default": "Default",
                        "never": "Never"
                    }
                }
            }
        ]
    },
    "entity.set_oxidization": {
        "id": "entity.set_oxidization",
        "receiver": "entity",
        "method": "setOxidization",
        "description": "Sets the oxidization level of a copper golem.",
        "native": {
            "block": "entity_action",
            "action": "SetOxidization"
        },
        "inputs": [],
        "tags": [
            {
                "id": "oxidization",
                "defaultOption": "unaffected",
                "options": [
                    "unaffected",
                    "exposed",
                    "weathered",
                    "oxidized"
                ],
                "native": {
                    "name": "Oxidization",
                    "slot": 26,
                    "options": {
                        "unaffected": "Unaffected",
                        "exposed": "Exposed",
                        "weathered": "Weathered",
                        "oxidized": "Oxidized"
                    }
                }
            }
        ]
    },
    "entity.set_panda_gene": {
        "id": "entity.set_panda_gene",
        "receiver": "entity",
        "method": "setPandaGene",
        "description": "Sets the gene of a panda. This affects their behavior and appearance.",
        "native": {
            "block": "entity_action",
            "action": "SetPandaGene"
        },
        "inputs": [],
        "tags": [
            {
                "id": "set_gene",
                "defaultOption": "both",
                "options": [
                    "main_gene",
                    "hidden_gene",
                    "both"
                ],
                "native": {
                    "name": "Set Gene",
                    "slot": 25,
                    "options": {
                        "main_gene": "Main gene",
                        "hidden_gene": "Hidden gene",
                        "both": "Both"
                    }
                }
            },
            {
                "id": "gene_type",
                "defaultOption": "aggressive",
                "options": [
                    "aggressive",
                    "lazy",
                    "weak",
                    "worried",
                    "playful",
                    "normal",
                    "brown"
                ],
                "native": {
                    "name": "Gene Type",
                    "slot": 26,
                    "options": {
                        "aggressive": "Aggressive",
                        "lazy": "Lazy",
                        "weak": "Weak",
                        "worried": "Worried",
                        "playful": "Playful",
                        "normal": "Normal",
                        "brown": "Brown"
                    }
                }
            }
        ]
    },
    "entity.set_panda_on_back": {
        "id": "entity.set_panda_on_back",
        "receiver": "entity",
        "method": "setPandaOnBack",
        "description": "Sets whether a panda is laying on its back or not.",
        "native": {
            "block": "entity_action",
            "action": "SetPandaOnBack"
        },
        "inputs": [],
        "tags": [
            {
                "id": "on_its_back",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "On Its Back",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_panda_rolling": {
        "id": "entity.set_panda_rolling",
        "receiver": "entity",
        "method": "setPandaRolling",
        "description": "Sets whether a panda is rolling or not.",
        "native": {
            "block": "entity_action",
            "action": "SetPandaRolling"
        },
        "inputs": [],
        "tags": [
            {
                "id": "roll_type",
                "defaultOption": "roll",
                "options": [
                    "roll",
                    "stop_rolling"
                ],
                "native": {
                    "name": "Roll Type",
                    "slot": 26,
                    "options": {
                        "roll": "Roll",
                        "stop_rolling": "Stop Rolling"
                    }
                }
            }
        ]
    },
    "entity.set_panda_sad_ticks": {
        "id": "entity.set_panda_sad_ticks",
        "receiver": "entity",
        "method": "setPandaSadTicks",
        "description": "Makes a panda sad for the specified duration.",
        "native": {
            "block": "entity_action",
            "action": "SetPandaSadTicks"
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
    "entity.set_parrot_color": {
        "id": "entity.set_parrot_color",
        "receiver": "entity",
        "method": "setParrotColor",
        "description": "Sets a parrot's color.",
        "native": {
            "block": "entity_action",
            "action": "SetParrotColor"
        },
        "inputs": [],
        "tags": [
            {
                "id": "parrot_color",
                "defaultOption": "red",
                "options": [
                    "red",
                    "blue",
                    "green",
                    "cyan",
                    "gray"
                ],
                "native": {
                    "name": "Parrot Color",
                    "slot": 26,
                    "options": {
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
    "entity.set_persistent": {
        "id": "entity.set_persistent",
        "receiver": "entity",
        "method": "setPersistent",
        "description": "Sets whether an item or a falling block will never despawn.",
        "native": {
            "block": "entity_action",
            "action": "SetPersistent"
        },
        "inputs": [],
        "tags": [
            {
                "id": "persistent",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Persistent",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_pickup_delay": {
        "id": "entity.set_pickup_delay",
        "receiver": "entity",
        "method": "setPickupDelay",
        "description": "Sets the number of ticks a dropped item cannot be picked up for.",
        "native": {
            "block": "entity_action",
            "action": "SetPickupDelay"
        },
        "inputs": [
            {
                "id": "delay",
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
    "entity.set_pose": {
        "id": "entity.set_pose",
        "receiver": "entity",
        "method": "setPose",
        "description": "Changes the pose of an entity. This affects their animations and/or hitbox, depending on the pose and entity type.",
        "native": {
            "block": "entity_action",
            "action": "SetPose"
        },
        "inputs": [],
        "tags": [
            {
                "id": "pose",
                "defaultOption": "standing",
                "options": [
                    "standing",
                    "sleeping",
                    "swimming",
                    "sneaking"
                ],
                "native": {
                    "name": "Pose",
                    "slot": 26,
                    "options": {
                        "standing": "Standing",
                        "sleeping": "Sleeping",
                        "swimming": "Swimming",
                        "sneaking": "Sneaking"
                    }
                }
            }
        ]
    },
    "entity.set_profession": {
        "id": "entity.set_profession",
        "receiver": "entity",
        "method": "setProfession",
        "description": "Sets a villager's profession.",
        "native": {
            "block": "entity_action",
            "action": "SetProfession"
        },
        "inputs": [],
        "tags": [
            {
                "id": "retain_trades",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Retain Trades",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "profession",
                "defaultOption": "armorer",
                "options": [
                    "unemployed",
                    "armorer",
                    "butcher",
                    "cartographer",
                    "cleric",
                    "farmer",
                    "fisherman",
                    "fletcher",
                    "leatherworker",
                    "librarian",
                    "mason",
                    "nitwit",
                    "shepherd",
                    "toolsmith",
                    "weaponsmith"
                ],
                "native": {
                    "name": "Profession",
                    "slot": 26,
                    "options": {
                        "unemployed": "Unemployed",
                        "armorer": "Armorer",
                        "butcher": "Butcher",
                        "cartographer": "Cartographer",
                        "cleric": "Cleric",
                        "farmer": "Farmer",
                        "fisherman": "Fisherman",
                        "fletcher": "Fletcher",
                        "leatherworker": "Leatherworker",
                        "librarian": "Librarian",
                        "mason": "Mason",
                        "nitwit": "Nitwit",
                        "shepherd": "Shepherd",
                        "toolsmith": "Toolsmith",
                        "weaponsmith": "Weaponsmith"
                    }
                }
            }
        ]
    },
    "entity.set_proj_source": {
        "id": "entity.set_proj_source",
        "receiver": "entity",
        "method": "setProjSource",
        "description": "Sets the projectile source of a projectile (or removes it).",
        "native": {
            "block": "entity_action",
            "action": "SetProjSource"
        },
        "inputs": [
            {
                "id": "shooter_uuid",
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
    "entity.set_rabbit_type": {
        "id": "entity.set_rabbit_type",
        "receiver": "entity",
        "method": "setRabbitType",
        "description": "Sets a rabbit's skin type.",
        "native": {
            "block": "entity_action",
            "action": "SetRabbitType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "skin_type",
                "defaultOption": "brown",
                "options": [
                    "brown",
                    "white",
                    "black",
                    "black_and_white",
                    "gold",
                    "salt_and_pepper",
                    "killer"
                ],
                "native": {
                    "name": "Skin Type",
                    "slot": 26,
                    "options": {
                        "brown": "Brown",
                        "white": "White",
                        "black": "Black",
                        "black_and_white": "Black and White",
                        "gold": "Gold",
                        "salt_and_pepper": "Salt and Pepper",
                        "killer": "Killer"
                    }
                }
            }
        ]
    },
    "entity.set_rearing": {
        "id": "entity.set_rearing",
        "receiver": "entity",
        "method": "setRearing",
        "description": "Sets whether a horse is standing on its hind legs.",
        "native": {
            "block": "entity_action",
            "action": "SetRearing"
        },
        "inputs": [],
        "tags": [
            {
                "id": "rearing",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Rearing",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_riptiding": {
        "id": "entity.set_riptiding",
        "receiver": "entity",
        "method": "setRiptiding",
        "description": "Sets whether an entity is riptiding.",
        "native": {
            "block": "entity_action",
            "action": "SetRiptiding"
        },
        "inputs": [],
        "tags": [
            {
                "id": "riptiding",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Riptiding",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_rotation": {
        "id": "entity.set_rotation",
        "receiver": "entity",
        "method": "setRotation",
        "description": "Changes an entity's pitch and yaw without teleporting it.",
        "native": {
            "block": "entity_action",
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
    "entity.set_saddle": {
        "id": "entity.set_saddle",
        "receiver": "entity",
        "method": "setSaddle",
        "description": "Sets whether a mob wears a saddle.",
        "native": {
            "block": "entity_action",
            "action": "SetSaddle"
        },
        "inputs": [],
        "tags": [
            {
                "id": "saddle",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Saddle",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_salmon_type": {
        "id": "entity.set_salmon_type",
        "receiver": "entity",
        "method": "setSalmonType",
        "description": "Sets a salmon's variant.",
        "native": {
            "block": "entity_action",
            "action": "SetSalmonType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "salmon_type",
                "defaultOption": "medium",
                "options": [
                    "small",
                    "medium",
                    "large"
                ],
                "native": {
                    "name": "Salmon Type",
                    "slot": 26,
                    "options": {
                        "small": "Small",
                        "medium": "Medium",
                        "large": "Large"
                    }
                }
            }
        ]
    },
    "entity.set_sheep_sheared": {
        "id": "entity.set_sheep_sheared",
        "receiver": "entity",
        "method": "setSheepSheared",
        "description": "Sets whether a sheep has its wool.",
        "native": {
            "block": "entity_action",
            "action": "SetSheepSheared"
        },
        "inputs": [],
        "tags": [
            {
                "id": "sheared",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Sheared",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_shulker_peek": {
        "id": "entity.set_shulker_peek",
        "receiver": "entity",
        "method": "setShulkerPeek",
        "description": "Sets how far a shulker should peek up to.",
        "native": {
            "block": "entity_action",
            "action": "SetShulkerPeek"
        },
        "inputs": [
            {
                "id": "peek_percentage",
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
                "id": "is_silent",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Is Silent",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_silenced": {
        "id": "entity.set_silenced",
        "receiver": "entity",
        "method": "setSilenced",
        "description": "Sets whether an entity will produce sound effects.",
        "native": {
            "block": "entity_action",
            "action": "SetSilenced"
        },
        "inputs": [],
        "tags": [
            {
                "id": "silenced",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Silenced",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_size": {
        "id": "entity.set_size",
        "receiver": "entity",
        "method": "setSize",
        "description": "Sets the size of an entity. This may also affect its health and strength.",
        "native": {
            "block": "entity_action",
            "action": "SetSize"
        },
        "inputs": [
            {
                "id": "size",
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
    "entity.set_target": {
        "id": "entity.set_target",
        "receiver": "entity",
        "method": "setTarget",
        "description": "Instructs a mob's AI to target a specific mob or player.",
        "native": {
            "block": "entity_action",
            "action": "SetTarget"
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
    "entity.set_temperature": {
        "id": "entity.set_temperature",
        "receiver": "entity",
        "method": "setTemperature",
        "description": "Sets a mob's temperature variant.",
        "native": {
            "block": "entity_action",
            "action": "SetTemperature"
        },
        "inputs": [],
        "tags": [
            {
                "id": "temperature_type",
                "defaultOption": "temperate",
                "options": [
                    "cold",
                    "temperate",
                    "warm"
                ],
                "native": {
                    "name": "Temperature Type",
                    "slot": 26,
                    "options": {
                        "cold": "Cold",
                        "temperate": "Temperate",
                        "warm": "Warm"
                    }
                }
            }
        ]
    },
    "entity.set_trade_uses": {
        "id": "entity.set_trade_uses",
        "receiver": "entity",
        "method": "setTradeUses",
        "description": "Sets the amount of times a trade can be made before the villager has to restock.",
        "native": {
            "block": "entity_action",
            "action": "SetTradeUses"
        },
        "inputs": [
            {
                "id": "trade_index",
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
                "id": "remaining_uses",
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
                "id": "maximum_uses",
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
    "entity.set_vex_charging": {
        "id": "entity.set_vex_charging",
        "receiver": "entity",
        "method": "setVexCharging",
        "description": "Sets whether a vex is charging or not.",
        "native": {
            "block": "entity_action",
            "action": "SetVexCharging"
        },
        "inputs": [],
        "tags": [
            {
                "id": "charging",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Charging",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.set_villager_biome": {
        "id": "entity.set_villager_biome",
        "receiver": "entity",
        "method": "setVillagerBiome",
        "description": "Sets the biome type of a villager. This affects their appearance only.",
        "native": {
            "block": "entity_action",
            "action": "SetVillagerBiome"
        },
        "inputs": [],
        "tags": [
            {
                "id": "biome",
                "defaultOption": "desert",
                "options": [
                    "desert",
                    "jungle",
                    "plains",
                    "savanna",
                    "snow",
                    "swamp",
                    "taiga"
                ],
                "native": {
                    "name": "Biome",
                    "slot": 26,
                    "options": {
                        "desert": "Desert",
                        "jungle": "Jungle",
                        "plains": "Plains",
                        "savanna": "Savanna",
                        "snow": "Snow",
                        "swamp": "Swamp",
                        "taiga": "Taiga"
                    }
                }
            }
        ]
    },
    "entity.set_villager_exp": {
        "id": "entity.set_villager_exp",
        "receiver": "entity",
        "method": "setVillagerExp",
        "description": "Sets a villager's experience points, which affects their level.",
        "native": {
            "block": "entity_action",
            "action": "SetVillagerExp"
        },
        "inputs": [
            {
                "id": "experience",
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
    "entity.set_villager_trade": {
        "id": "entity.set_villager_trade",
        "receiver": "entity",
        "method": "setVillagerTrade",
        "description": "Sets the villager trade at an index.",
        "native": {
            "block": "entity_action",
            "action": "SetVillagerTrade"
        },
        "inputs": [
            {
                "id": "trade_index",
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
                "id": "result_item",
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
                "id": "first_ingredient",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "second_ingredient",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "maximum_uses",
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
    "entity.set_visual_fire": {
        "id": "entity.set_visual_fire",
        "receiver": "entity",
        "method": "setVisualFire",
        "description": "Sets whether an entity should appear on fire.",
        "native": {
            "block": "entity_action",
            "action": "SetVisualFire"
        },
        "inputs": [],
        "tags": [
            {
                "id": "on_fire",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "On Fire",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "entity.set_warden_anger": {
        "id": "entity.set_warden_anger",
        "receiver": "entity",
        "method": "setWardenAnger",
        "description": "Sets the anger level of a Warden.",
        "native": {
            "block": "entity_action",
            "action": "SetWardenAnger"
        },
        "inputs": [
            {
                "id": "anger_level_0_150",
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
                "id": "entity_uuid",
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
    "entity.set_waxed": {
        "id": "entity.set_waxed",
        "receiver": "entity",
        "method": "setWaxed",
        "description": "Sets whether a copper golem is waxed.",
        "native": {
            "block": "entity_action",
            "action": "SetWaxed"
        },
        "inputs": [],
        "tags": [
            {
                "id": "waxed",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Waxed",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "entity.set_wither_invul": {
        "id": "entity.set_wither_invul",
        "receiver": "entity",
        "method": "setWitherInvul",
        "description": "Sets the remaining ticks of invulnerability a wither has.",
        "native": {
            "block": "entity_action",
            "action": "SetWitherInvul"
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
    "entity.set_wolf_sound_type": {
        "id": "entity.set_wolf_sound_type",
        "receiver": "entity",
        "method": "setWolfSoundType",
        "description": "Sets a wolf's sound variant.",
        "native": {
            "block": "entity_action",
            "action": "SetWolfSoundType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "wolf_sound_type",
                "defaultOption": "angry",
                "options": [
                    "angry",
                    "big",
                    "classic",
                    "cute",
                    "grumpy",
                    "puglin",
                    "sad"
                ],
                "native": {
                    "name": "Wolf Sound Type",
                    "slot": 26,
                    "options": {
                        "angry": "Angry",
                        "big": "Big",
                        "classic": "Classic",
                        "cute": "Cute",
                        "grumpy": "Grumpy",
                        "puglin": "Puglin",
                        "sad": "Sad"
                    }
                }
            }
        ]
    },
    "entity.set_wolf_type": {
        "id": "entity.set_wolf_type",
        "receiver": "entity",
        "method": "setWolfType",
        "description": "Sets a wolf's variant.",
        "native": {
            "block": "entity_action",
            "action": "SetWolfType"
        },
        "inputs": [],
        "tags": [
            {
                "id": "wolf_type",
                "defaultOption": "ashen",
                "options": [
                    "ashen",
                    "black",
                    "chestnut",
                    "pale",
                    "rusty",
                    "snowy",
                    "spotted",
                    "striped",
                    "woods"
                ],
                "native": {
                    "name": "Wolf Type",
                    "slot": 26,
                    "options": {
                        "ashen": "Ashen",
                        "black": "Black",
                        "chestnut": "Chestnut",
                        "pale": "Pale",
                        "rusty": "Rusty",
                        "snowy": "Snowy",
                        "spotted": "Spotted",
                        "striped": "Striped",
                        "woods": "Woods"
                    }
                }
            }
        ]
    },
    "entity.shear": {
        "id": "entity.shear",
        "receiver": "entity",
        "method": "shear",
        "description": "Sets a mob in the sheared state.",
        "native": {
            "block": "entity_action",
            "action": "Shear"
        },
        "inputs": [],
        "tags": []
    },
    "entity.shear_sheep": {
        "id": "entity.shear_sheep",
        "receiver": "entity",
        "method": "shearSheep",
        "description": "Causes a sheep to be sheared.",
        "native": {
            "block": "entity_action",
            "action": "ShearSheep"
        },
        "inputs": [],
        "tags": []
    },
    "entity.sheep_eat": {
        "id": "entity.sheep_eat",
        "receiver": "entity",
        "method": "sheepEat",
        "description": "Causes a sheep to eat grass.",
        "native": {
            "block": "entity_action",
            "action": "SheepEat"
        },
        "inputs": [],
        "tags": []
    },
    "entity.sniffer_state": {
        "id": "entity.sniffer_state",
        "receiver": "entity",
        "method": "snifferState",
        "description": "Forces a sniffer to perform a specific action.",
        "native": {
            "block": "entity_action",
            "action": "SnifferState"
        },
        "inputs": [],
        "tags": [
            {
                "id": "behavior",
                "defaultOption": "idle",
                "options": [
                    "idle",
                    "feeling_happy",
                    "scenting",
                    "sniffing",
                    "searching",
                    "digging"
                ],
                "native": {
                    "name": "Behavior",
                    "slot": 26,
                    "options": {
                        "idle": "Idle",
                        "feeling_happy": "Feeling Happy",
                        "scenting": "Scenting",
                        "sniffing": "Sniffing",
                        "searching": "Searching",
                        "digging": "Digging"
                    }
                }
            }
        ]
    },
    "entity.snowman_pumpkin": {
        "id": "entity.snowman_pumpkin",
        "receiver": "entity",
        "method": "snowmanPumpkin",
        "description": "Sets whether a snow golem is wearing a pumpkin.",
        "native": {
            "block": "entity_action",
            "action": "SnowmanPumpkin"
        },
        "inputs": [],
        "tags": [
            {
                "id": "pumpkin",
                "defaultOption": "disable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Pumpkin",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.tame": {
        "id": "entity.tame",
        "receiver": "entity",
        "method": "tame",
        "description": "Tames and sets the owner of a tameable mob.",
        "native": {
            "block": "entity_action",
            "action": "Tame"
        },
        "inputs": [
            {
                "id": "owner_uuid",
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
        "tags": []
    },
    "entity.tdisp_background": {
        "id": "entity.tdisp_background",
        "receiver": "entity",
        "method": "tdispBackground",
        "description": "Sets the background color and opacity of a text display.",
        "native": {
            "block": "entity_action",
            "action": "TDispBackground"
        },
        "inputs": [
            {
                "id": "color_hexadecimal",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 0
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "opacity_in_percentage",
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
    "entity.tdisplay_align": {
        "id": "entity.tdisplay_align",
        "receiver": "entity",
        "method": "tdisplayAlign",
        "description": "Sets the text alignment of a text display.",
        "native": {
            "block": "entity_action",
            "action": "TDisplayAlign"
        },
        "inputs": [],
        "tags": [
            {
                "id": "text_alignment",
                "defaultOption": "center",
                "options": [
                    "center",
                    "left",
                    "right"
                ],
                "native": {
                    "name": "Text Alignment",
                    "slot": 26,
                    "options": {
                        "center": "Center",
                        "left": "Left",
                        "right": "Right"
                    }
                }
            }
        ]
    },
    "entity.tdisplay_line_width": {
        "id": "entity.tdisplay_line_width",
        "receiver": "entity",
        "method": "tdisplayLineWidth",
        "description": "Sets the maximum line width of a text display.",
        "native": {
            "block": "entity_action",
            "action": "TDisplayLineWidth"
        },
        "inputs": [
            {
                "id": "line_width",
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
    "entity.tdisplay_opacity": {
        "id": "entity.tdisplay_opacity",
        "receiver": "entity",
        "method": "tdisplayOpacity",
        "description": "Sets the text opacity of a text display.",
        "native": {
            "block": "entity_action",
            "action": "TDisplayOpacity"
        },
        "inputs": [
            {
                "id": "text_opacity",
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
    "entity.tdisplay_see_thru": {
        "id": "entity.tdisplay_see_thru",
        "receiver": "entity",
        "method": "tdisplaySeeThru",
        "description": "Sets whether a text display is visible through walls or not.",
        "native": {
            "block": "entity_action",
            "action": "TDisplaySeeThru"
        },
        "inputs": [],
        "tags": [
            {
                "id": "see_through",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "See-through",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.tdisplay_shadow": {
        "id": "entity.tdisplay_shadow",
        "receiver": "entity",
        "method": "tdisplayShadow",
        "description": "Sets whether the text in a text display has shadow or not.",
        "native": {
            "block": "entity_action",
            "action": "TDisplayShadow"
        },
        "inputs": [],
        "tags": [
            {
                "id": "text_shadow",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Text Shadow",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.tdisplay_text": {
        "id": "entity.tdisplay_text",
        "receiver": "entity",
        "method": "tdisplayText",
        "description": "Sets the displayed text of a text display.",
        "native": {
            "block": "entity_action",
            "action": "TDisplayText"
        },
        "inputs": [
            {
                "id": "displayed_text",
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
    "entity.teleport": {
        "id": "entity.teleport",
        "receiver": "entity",
        "method": "teleport",
        "description": "Teleports an entity to a specified location.",
        "native": {
            "block": "entity_action",
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
            }
        ]
    },
    "entity.undisguise": {
        "id": "entity.undisguise",
        "receiver": "entity",
        "method": "undisguise",
        "description": "Removes an entity's disguise.",
        "native": {
            "block": "entity_action",
            "action": "Undisguise"
        },
        "inputs": [],
        "tags": []
    },
    "entity.use_item": {
        "id": "entity.use_item",
        "receiver": "entity",
        "method": "useItem",
        "description": "Forces a mob to use held items such as bow or spyglass.",
        "native": {
            "block": "entity_action",
            "action": "UseItem"
        },
        "inputs": [],
        "tags": [
            {
                "id": "hand",
                "defaultOption": "main_hand",
                "options": [
                    "main_hand",
                    "off_hand"
                ],
                "native": {
                    "name": "Hand",
                    "slot": 25,
                    "options": {
                        "main_hand": "Main Hand",
                        "off_hand": "Off Hand"
                    }
                }
            },
            {
                "id": "use_item",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Use Item",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "entity.villager_head_anim": {
        "id": "entity.villager_head_anim",
        "receiver": "entity",
        "method": "villagerHeadAnim",
        "description": "Makes a villager perform a head shake animation.",
        "native": {
            "block": "entity_action",
            "action": "VillagerHeadAnim"
        },
        "inputs": [],
        "tags": []
    }
} as const;
