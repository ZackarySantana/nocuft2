// This file is generated. Do not edit manually.

export const entityIntrinsics = {
    "addVillagerTrade": {
        "operation": "entity.add_villager_trade",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "result_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "first_ingredient",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "second_ingredient",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "maximum_uses",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "armorStandParts": {
        "operation": "entity.armor_stand_parts",
        "receiver": "entity",
        "parameters": []
    },
    "armorStandPartsWith": {
        "operation": "entity.armor_stand_parts",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "arms": {
                "tag": "arms",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable",
                    "dontChange": "dont_change"
                }
            },
            "basePlate": {
                "tag": "base_plate",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable",
                    "dontChange": "dont_change"
                }
            }
        }
    },
    "armorStandSlots": {
        "operation": "entity.armor_stand_slots",
        "receiver": "entity",
        "parameters": []
    },
    "armorStandSlotsWith": {
        "operation": "entity.armor_stand_slots",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "interactions": {
                "tag": "interactions",
                "kind": "string",
                "values": {
                    "takeSwapOrPlaceItem": "take_swap_or_place_item",
                    "takeOrSwapItem": "take_or_swap_item",
                    "takeItem": "take_item",
                    "placeItem": "place_item",
                    "none": "none"
                }
            },
            "equipmentSlot": {
                "tag": "equipment_slot",
                "kind": "string",
                "values": {
                    "all": "all",
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
    "attachLead": {
        "operation": "entity.attach_lead",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "lead_holder_uuid",
                "types": [
                    "location",
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "attachLeadWith": {
        "operation": "entity.attach_lead",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "lead_holder_uuid",
                "types": [
                    "location",
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
    "attackAnimation": {
        "operation": "entity.attack_animation",
        "receiver": "entity",
        "parameters": []
    },
    "attackAnimationWith": {
        "operation": "entity.attack_animation",
        "receiver": "entity",
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
    "bdisplayBlock": {
        "operation": "entity.bdisplay_block",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "displayed_block",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
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
    "blockDisguise": {
        "operation": "entity.block_disguise",
        "receiver": "entity",
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
    "clearPotions": {
        "operation": "entity.clear_potions",
        "receiver": "entity",
        "parameters": []
    },
    "clrVillagerTrades": {
        "operation": "entity.clr_villager_trades",
        "receiver": "entity",
        "parameters": []
    },
    "combatAttribute": {
        "operation": "entity.combat_attribute",
        "receiver": "entity",
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
        "operation": "entity.combat_attribute",
        "receiver": "entity",
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
                    "attackKnockback": "attack_knockback"
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
    "creeperCharged": {
        "operation": "entity.creeper_charged",
        "receiver": "entity",
        "parameters": []
    },
    "creeperChargedWith": {
        "operation": "entity.creeper_charged",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "charged": {
                "tag": "charged",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "damage": {
        "operation": "entity.damage",
        "receiver": "entity",
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
        "operation": "entity.damage",
        "receiver": "entity",
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
    "disguiseShiftVert": {
        "operation": "entity.disguise_shift_vert",
        "receiver": "entity",
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
    "dispInterpolation": {
        "operation": "entity.disp_interpolation",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "interpolation_duration_in_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "interpolation_delay_in_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "dispTpduration": {
        "operation": "entity.disp_tpduration",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "teleport_duration_in_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayBillboard": {
        "operation": "entity.display_billboard",
        "receiver": "entity",
        "parameters": []
    },
    "displayBillboardWith": {
        "operation": "entity.display_billboard",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "billboardType": {
                "tag": "billboard_type",
                "kind": "string",
                "values": {
                    "fixed": "fixed",
                    "vertical": "vertical",
                    "horizontal": "horizontal",
                    "center": "center"
                }
            }
        }
    },
    "displayBrightness": {
        "operation": "entity.display_brightness",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_light_level_0_15",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "sky_light_level_0_15",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayCullingSize": {
        "operation": "entity.display_culling_size",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "width",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "height",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayGlowColor": {
        "operation": "entity.display_glow_color",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "color_hexadecimal",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayShadow": {
        "operation": "entity.display_shadow",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "shadow_radius_in_blocks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "shadow_opacity_in_percentage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "displayViewRange": {
        "operation": "entity.display_view_range",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "view_range_in_blocks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "endCrystalBeam": {
        "operation": "entity.end_crystal_beam",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "explode": {
        "operation": "entity.explode",
        "receiver": "entity",
        "parameters": []
    },
    "faceLocation": {
        "operation": "entity.face_location",
        "receiver": "entity",
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
    "faceLocationWith": {
        "operation": "entity.face_location",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "location_to_face",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "faceDirection": {
                "tag": "face_direction",
                "kind": "string",
                "values": {
                    "towardLocation": "toward_location",
                    "awayFromLocation": "away_from_location"
                }
            }
        }
    },
    "fallingAttribute": {
        "operation": "entity.falling_attribute",
        "receiver": "entity",
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
        "operation": "entity.falling_attribute",
        "receiver": "entity",
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
    "foxSleeping": {
        "operation": "entity.fox_sleeping",
        "receiver": "entity",
        "parameters": []
    },
    "foxSleepingWith": {
        "operation": "entity.fox_sleeping",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "sleeping": {
                "tag": "sleeping",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "frogEat": {
        "operation": "entity.frog_eat",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "frogEatWith": {
        "operation": "entity.frog_eat",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "target_uuid",
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
    "heal": {
        "operation": "entity.heal",
        "receiver": "entity",
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
        "operation": "entity.health_attribute",
        "receiver": "entity",
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
        "operation": "entity.health_attribute",
        "receiver": "entity",
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
    "idisplayItem": {
        "operation": "entity.idisplay_item",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "displayed_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "idisplayModelType": {
        "operation": "entity.idisplay_model_type",
        "receiver": "entity",
        "parameters": []
    },
    "idisplayModelTypeWith": {
        "operation": "entity.idisplay_model_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "modelType": {
                "tag": "model_type",
                "kind": "string",
                "values": {
                    "none": "none",
                    "firstPersonLeftHand": "first_person_left_hand",
                    "firstPersonRightHand": "first_person_right_hand",
                    "thirdPersonLeftHand": "third_person_left_hand",
                    "thirdPersonRightHand": "third_person_right_hand",
                    "head": "head",
                    "gui": "gui",
                    "ground": "ground",
                    "fixed": "fixed"
                }
            }
        }
    },
    "igniteCreeper": {
        "operation": "entity.ignite_creeper",
        "receiver": "entity",
        "parameters": []
    },
    "interactResponse": {
        "operation": "entity.interact_response",
        "receiver": "entity",
        "parameters": []
    },
    "interactResponseWith": {
        "operation": "entity.interact_response",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "responsive": {
                "tag": "responsive",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "interactionSize": {
        "operation": "entity.interaction_size",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "width",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "height",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "jump": {
        "operation": "entity.jump",
        "receiver": "entity",
        "parameters": []
    },
    "kbattribute": {
        "operation": "entity.kbattribute",
        "receiver": "entity",
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
        "operation": "entity.kbattribute",
        "receiver": "entity",
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
    "launchFwd": {
        "operation": "entity.launch_fwd",
        "receiver": "entity",
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
        "operation": "entity.launch_fwd",
        "receiver": "entity",
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
        "operation": "entity.launch_proj",
        "receiver": "entity",
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
        "operation": "entity.launch_toward",
        "receiver": "entity",
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
        "operation": "entity.launch_toward",
        "receiver": "entity",
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
        "operation": "entity.launch_up",
        "receiver": "entity",
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
        "operation": "entity.launch_up",
        "receiver": "entity",
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
    "lockDisgRotation": {
        "operation": "entity.lock_disg_rotation",
        "receiver": "entity",
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
        "operation": "entity.lock_disg_rotation",
        "receiver": "entity",
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
    "mannequinDesc": {
        "operation": "entity.mannequin_desc",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "description",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "mannequinHand": {
        "operation": "entity.mannequin_hand",
        "receiver": "entity",
        "parameters": []
    },
    "mannequinHandWith": {
        "operation": "entity.mannequin_hand",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "mainHand": {
                "tag": "main_hand",
                "kind": "string",
                "values": {
                    "leftHand": "left_hand",
                    "rightHand": "right_hand"
                }
            }
        }
    },
    "mannequinLayers": {
        "operation": "entity.mannequin_layers",
        "receiver": "entity",
        "parameters": []
    },
    "mannequinLayersWith": {
        "operation": "entity.mannequin_layers",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "capeLayer": {
                "tag": "cape_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "jacketLayer": {
                "tag": "jacket_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "leftSleeveLayer": {
                "tag": "left_sleeve_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "rightSleeveLayer": {
                "tag": "right_sleeve_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "leftPantsLayer": {
                "tag": "left_pants_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "rightPantsLayer": {
                "tag": "right_pants_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            },
            "hatLayer": {
                "tag": "hat_layer",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "hidden": "hidden"
                }
            }
        }
    },
    "mannequinMovable": {
        "operation": "entity.mannequin_movable",
        "receiver": "entity",
        "parameters": []
    },
    "mannequinMovableWith": {
        "operation": "entity.mannequin_movable",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "movable": {
                "tag": "movable",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "mannequinSkin": {
        "operation": "entity.mannequin_skin",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "mannequin_player_head",
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
    "mimic": {
        "operation": "entity.mimic",
        "receiver": "entity",
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
        "operation": "entity.mimic",
        "receiver": "entity",
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
    "miscAttribute": {
        "operation": "entity.misc_attribute",
        "receiver": "entity",
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
        "operation": "entity.misc_attribute",
        "receiver": "entity",
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
                    "followRange": "follow_range",
                    "zombieSpawnReinforcements": "zombie_spawn_reinforcements",
                    "oxygenBonus": "oxygen_bonus",
                    "burningTime": "burning_time",
                    "cameraDistance": "camera_distance",
                    "temptRange": "tempt_range"
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
        "operation": "entity.mob_disguise",
        "receiver": "entity",
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
    "mooshroomType": {
        "operation": "entity.mooshroom_type",
        "receiver": "entity",
        "parameters": []
    },
    "mooshroomTypeWith": {
        "operation": "entity.mooshroom_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "mooshroomVariant": {
                "tag": "mooshroom_variant",
                "kind": "string",
                "values": {
                    "red": "red",
                    "brown": "brown"
                }
            }
        }
    },
    "moveToLoc": {
        "operation": "entity.move_to_loc",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "walk_speed",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "movementAttribute": {
        "operation": "entity.movement_attribute",
        "receiver": "entity",
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
        "operation": "entity.movement_attribute",
        "receiver": "entity",
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
    "oxidizeTicksLeft": {
        "operation": "entity.oxidize_ticks_left",
        "receiver": "entity",
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
    "playerDisguise": {
        "operation": "entity.player_disguise",
        "receiver": "entity",
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
    "projectileItem": {
        "operation": "entity.projectile_item",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "display_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "ram": {
        "operation": "entity.ram",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "target_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "ramWith": {
        "operation": "entity.ram",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "target_uuid",
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
    "remVillagerTrade": {
        "operation": "entity.rem_villager_trade",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "trade_index",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "remove": {
        "operation": "entity.remove",
        "receiver": "entity",
        "parameters": []
    },
    "removeCustomTag": {
        "operation": "entity.remove_custom_tag",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "tag_name",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "restockTrades": {
        "operation": "entity.restock_trades",
        "receiver": "entity",
        "parameters": []
    },
    "rideEntity": {
        "operation": "entity.ride_entity",
        "receiver": "entity",
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
        "operation": "entity.ride_entity",
        "receiver": "entity",
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
    "sendAnimation": {
        "operation": "entity.send_animation",
        "receiver": "entity",
        "parameters": []
    },
    "sendAnimationWith": {
        "operation": "entity.send_animation",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "animationType": {
                "tag": "animation_type",
                "kind": "string",
                "values": {
                    "hurtAnimation": "hurt_animation",
                    "critParticles": "crit_particles",
                    "enchantedHitParticles": "enchanted_hit_particles"
                }
            }
        }
    },
    "setAbsorption": {
        "operation": "entity.set_absorption",
        "receiver": "entity",
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
    "setAge": {
        "operation": "entity.set_age",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "age",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setAgeWith": {
        "operation": "entity.set_age",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "age",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ageLock": {
                "tag": "age_lock",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable",
                    "dontChange": "dont_change"
                }
            }
        }
    },
    "setAi": {
        "operation": "entity.set_ai",
        "receiver": "entity",
        "parameters": []
    },
    "setAiWith": {
        "operation": "entity.set_ai",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "ai": {
                "tag": "ai",
                "kind": "string",
                "values": {
                    "sentient": "sentient",
                    "insentient": "insentient",
                    "none": "none"
                }
            }
        }
    },
    "setAllayDancing": {
        "operation": "entity.set_allay_dancing",
        "receiver": "entity",
        "parameters": []
    },
    "setAllayDancingWith": {
        "operation": "entity.set_allay_dancing",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "dancing": {
                "tag": "dancing",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setAngry": {
        "operation": "entity.set_angry",
        "receiver": "entity",
        "parameters": []
    },
    "setAngryWith": {
        "operation": "entity.set_angry",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "angry": {
                "tag": "angry",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setArmor": {
        "operation": "entity.set_armor",
        "receiver": "entity",
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
    "setArmsRaised": {
        "operation": "entity.set_arms_raised",
        "receiver": "entity",
        "parameters": []
    },
    "setArmsRaisedWith": {
        "operation": "entity.set_arms_raised",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "armsRaised": {
                "tag": "arms_raised",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setArrowDamage": {
        "operation": "entity.set_arrow_damage",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "base_damage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setArrowHitSound": {
        "operation": "entity.set_arrow_hit_sound",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "sound_to_play",
                "types": [
                    "sound"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setArrowNoClip": {
        "operation": "entity.set_arrow_no_clip",
        "receiver": "entity",
        "parameters": []
    },
    "setArrowNoClipWith": {
        "operation": "entity.set_arrow_no_clip",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hasNoClip": {
                "tag": "has_no_clip",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setArrowPierce": {
        "operation": "entity.set_arrow_pierce",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "targets_to_pierce",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setAxolotlColor": {
        "operation": "entity.set_axolotl_color",
        "receiver": "entity",
        "parameters": []
    },
    "setAxolotlColorWith": {
        "operation": "entity.set_axolotl_color",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "axolotlColor": {
                "tag": "axolotl_color",
                "kind": "string",
                "values": {
                    "pink": "pink",
                    "brown": "brown",
                    "yellow": "yellow",
                    "cyan": "cyan",
                    "blue": "blue"
                }
            }
        }
    },
    "setBaby": {
        "operation": "entity.set_baby",
        "receiver": "entity",
        "parameters": []
    },
    "setBabyWith": {
        "operation": "entity.set_baby",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "baby": {
                "tag": "baby",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setBeeNectar": {
        "operation": "entity.set_bee_nectar",
        "receiver": "entity",
        "parameters": []
    },
    "setBeeNectarWith": {
        "operation": "entity.set_bee_nectar",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hasNectar": {
                "tag": "has_nectar",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setBeeStinger": {
        "operation": "entity.set_bee_stinger",
        "receiver": "entity",
        "parameters": []
    },
    "setBeeStingerWith": {
        "operation": "entity.set_bee_stinger",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hasStinger": {
                "tag": "has_stinger",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setBulletTarget": {
        "operation": "entity.set_bullet_target",
        "receiver": "entity",
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
    "setBulletTargetWith": {
        "operation": "entity.set_bullet_target",
        "receiver": "entity",
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
    "setCarryingChest": {
        "operation": "entity.set_carrying_chest",
        "receiver": "entity",
        "parameters": []
    },
    "setCarryingChestWith": {
        "operation": "entity.set_carrying_chest",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "carryingChest": {
                "tag": "carrying_chest",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setCatResting": {
        "operation": "entity.set_cat_resting",
        "receiver": "entity",
        "parameters": []
    },
    "setCatRestingWith": {
        "operation": "entity.set_cat_resting",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "resting": {
                "tag": "resting",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setCatType": {
        "operation": "entity.set_cat_type",
        "receiver": "entity",
        "parameters": []
    },
    "setCatTypeWith": {
        "operation": "entity.set_cat_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "skinType": {
                "tag": "skin_type",
                "kind": "string",
                "values": {
                    "tabby": "tabby",
                    "tuxedo": "tuxedo",
                    "red": "red",
                    "siamese": "siamese",
                    "britishShorthair": "british_shorthair",
                    "calico": "calico",
                    "persian": "persian",
                    "ragdoll": "ragdoll",
                    "white": "white",
                    "jellie": "jellie",
                    "black": "black"
                }
            }
        }
    },
    "setCelebrating": {
        "operation": "entity.set_celebrating",
        "receiver": "entity",
        "parameters": []
    },
    "setCelebratingWith": {
        "operation": "entity.set_celebrating",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "celebrate": {
                "tag": "celebrate",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setCloudRadius": {
        "operation": "entity.set_cloud_radius",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "radius",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "shrinking_speed_blocks_per_second",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setCollidable": {
        "operation": "entity.set_collidable",
        "receiver": "entity",
        "parameters": []
    },
    "setCollidableWith": {
        "operation": "entity.set_collidable",
        "receiver": "entity",
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
    "setCreeperFuse": {
        "operation": "entity.set_creeper_fuse",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "fuse_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setCreeperPower": {
        "operation": "entity.set_creeper_power",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "power_0_25",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setCustomTag": {
        "operation": "entity.set_custom_tag",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "tag_name",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "tag_value",
                "types": [
                    "number",
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setDeathDrops": {
        "operation": "entity.set_death_drops",
        "receiver": "entity",
        "parameters": []
    },
    "setDeathDropsWith": {
        "operation": "entity.set_death_drops",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hasDeathDrops": {
                "tag": "has_death_drops",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setDigging": {
        "operation": "entity.set_digging",
        "receiver": "entity",
        "parameters": []
    },
    "setDiggingWith": {
        "operation": "entity.set_digging",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "diggingType": {
                "tag": "digging_type",
                "kind": "string",
                "values": {
                    "emerge": "emerge",
                    "digDown": "dig_down"
                }
            }
        }
    },
    "setDragonPhase": {
        "operation": "entity.set_dragon_phase",
        "receiver": "entity",
        "parameters": []
    },
    "setDragonPhaseWith": {
        "operation": "entity.set_dragon_phase",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "phase": {
                "tag": "phase",
                "kind": "string",
                "values": {
                    "flying": "flying",
                    "hovering": "hovering",
                    "breathAttack": "breath_attack",
                    "dying": "dying"
                }
            }
        }
    },
    "setDyeColor": {
        "operation": "entity.set_dye_color",
        "receiver": "entity",
        "parameters": []
    },
    "setDyeColorWith": {
        "operation": "entity.set_dye_color",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "dye": {
                "tag": "dye",
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
            }
        }
    },
    "setEndermanBlock": {
        "operation": "entity.set_enderman_block",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_hold",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setEquipment": {
        "operation": "entity.set_equipment",
        "receiver": "entity",
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
        "operation": "entity.set_equipment",
        "receiver": "entity",
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
                    "body": "body",
                    "legs": "legs",
                    "feet": "feet",
                    "saddle": "saddle",
                    "horseArmor": "horse_armor",
                    "decor": "decor",
                    "harness": "harness"
                }
            }
        }
    },
    "setFallDistance": {
        "operation": "entity.set_fall_distance",
        "receiver": "entity",
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
        "operation": "entity.set_fire_ticks",
        "receiver": "entity",
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
    "setFishPattern": {
        "operation": "entity.set_fish_pattern",
        "receiver": "entity",
        "parameters": []
    },
    "setFishPatternWith": {
        "operation": "entity.set_fish_pattern",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "patternColor": {
                "tag": "pattern_color",
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
                    "black": "black",
                    "dontChange": "dont_change"
                }
            },
            "bodyColor": {
                "tag": "body_color",
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
                    "black": "black",
                    "dontChange": "dont_change"
                }
            },
            "pattern": {
                "tag": "pattern",
                "kind": "string",
                "values": {
                    "kob": "kob",
                    "sunstreak": "sunstreak",
                    "snooper": "snooper",
                    "dasher": "dasher",
                    "brinely": "brinely",
                    "spotty": "spotty",
                    "flopper": "flopper",
                    "stripey": "stripey",
                    "glitter": "glitter",
                    "blockfish": "blockfish",
                    "betty": "betty",
                    "clayfish": "clayfish",
                    "dontChange": "dont_change"
                }
            }
        }
    },
    "setFishingTime": {
        "operation": "entity.set_fishing_time",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "wait_time_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setFoxLeaping": {
        "operation": "entity.set_fox_leaping",
        "receiver": "entity",
        "parameters": []
    },
    "setFoxLeapingWith": {
        "operation": "entity.set_fox_leaping",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "leaping": {
                "tag": "leaping",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setFoxType": {
        "operation": "entity.set_fox_type",
        "receiver": "entity",
        "parameters": []
    },
    "setFoxTypeWith": {
        "operation": "entity.set_fox_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "foxType": {
                "tag": "fox_type",
                "kind": "string",
                "values": {
                    "red": "red",
                    "snow": "snow"
                }
            }
        }
    },
    "setFreezeTicks": {
        "operation": "entity.set_freeze_ticks",
        "receiver": "entity",
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
        "operation": "entity.set_freeze_ticks",
        "receiver": "entity",
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
    "setFriction": {
        "operation": "entity.set_friction",
        "receiver": "entity",
        "parameters": []
    },
    "setFrictionWith": {
        "operation": "entity.set_friction",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "frictionType": {
                "tag": "friction_type",
                "kind": "string",
                "values": {
                    "normal": "normal",
                    "noFriction": "no_friction"
                }
            }
        }
    },
    "setGliding": {
        "operation": "entity.set_gliding",
        "receiver": "entity",
        "parameters": []
    },
    "setGlidingWith": {
        "operation": "entity.set_gliding",
        "receiver": "entity",
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
    "setGlowSquidDark": {
        "operation": "entity.set_glow_squid_dark",
        "receiver": "entity",
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
    "setGlowing": {
        "operation": "entity.set_glowing",
        "receiver": "entity",
        "parameters": []
    },
    "setGlowingWith": {
        "operation": "entity.set_glowing",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
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
    "setGoatHorns": {
        "operation": "entity.set_goat_horns",
        "receiver": "entity",
        "parameters": []
    },
    "setGoatHornsWith": {
        "operation": "entity.set_goat_horns",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "leftHorn": {
                "tag": "left_horn",
                "kind": "string",
                "values": {
                    "show": "show",
                    "hide": "hide",
                    "noChange": "no_change"
                }
            },
            "rightHorn": {
                "tag": "right_horn",
                "kind": "string",
                "values": {
                    "show": "show",
                    "hide": "hide",
                    "noChange": "no_change"
                }
            }
        }
    },
    "setGoatScreaming": {
        "operation": "entity.set_goat_screaming",
        "receiver": "entity",
        "parameters": []
    },
    "setGoatScreamingWith": {
        "operation": "entity.set_goat_screaming",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "screams": {
                "tag": "screams",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setGravity": {
        "operation": "entity.set_gravity",
        "receiver": "entity",
        "parameters": []
    },
    "setGravityWith": {
        "operation": "entity.set_gravity",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "gravity": {
                "tag": "gravity",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setHealth": {
        "operation": "entity.set_health",
        "receiver": "entity",
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
    "setHorseJump": {
        "operation": "entity.set_horse_jump",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "strength",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setHorsePattern": {
        "operation": "entity.set_horse_pattern",
        "receiver": "entity",
        "parameters": []
    },
    "setHorsePatternWith": {
        "operation": "entity.set_horse_pattern",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "horseColor": {
                "tag": "horse_color",
                "kind": "string",
                "values": {
                    "white": "white",
                    "buckskin": "buckskin",
                    "flaxenChestnut": "flaxen_chestnut",
                    "bay": "bay",
                    "black": "black",
                    "dappleGray": "dapple_gray",
                    "darkBay": "dark_bay",
                    "dontChange": "dont_change"
                }
            },
            "horseMarkings": {
                "tag": "horse_markings",
                "kind": "string",
                "values": {
                    "noMarkings": "no_markings",
                    "stockingsAndBlaze": "stockings_and_blaze",
                    "paint": "paint",
                    "snowflakeAppaloosa": "snowflake_appaloosa",
                    "sooty": "sooty",
                    "dontChange": "dont_change"
                }
            }
        }
    },
    "setInvisible": {
        "operation": "entity.set_invisible",
        "receiver": "entity",
        "parameters": []
    },
    "setInvisibleWith": {
        "operation": "entity.set_invisible",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "invisible": {
                "tag": "invisible",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setInvulTicks": {
        "operation": "entity.set_invul_ticks",
        "receiver": "entity",
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
    "setInvulnerable": {
        "operation": "entity.set_invulnerable",
        "receiver": "entity",
        "parameters": []
    },
    "setInvulnerableWith": {
        "operation": "entity.set_invulnerable",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "invulnerable": {
                "tag": "invulnerable",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setItem": {
        "operation": "entity.set_item",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "new_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setLlamaColor": {
        "operation": "entity.set_llama_color",
        "receiver": "entity",
        "parameters": []
    },
    "setLlamaColorWith": {
        "operation": "entity.set_llama_color",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "llamaColor": {
                "tag": "llama_color",
                "kind": "string",
                "values": {
                    "brown": "brown",
                    "creamy": "creamy",
                    "white": "white",
                    "gray": "gray"
                }
            }
        }
    },
    "setMarker": {
        "operation": "entity.set_marker",
        "receiver": "entity",
        "parameters": []
    },
    "setMarkerWith": {
        "operation": "entity.set_marker",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "marker": {
                "tag": "marker",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setMaxHealth": {
        "operation": "entity.set_max_health",
        "receiver": "entity",
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
        "operation": "entity.set_max_health",
        "receiver": "entity",
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
            "healMobToMaxHealth": {
                "tag": "heal_mob_to_max_health",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setMinecartBlock": {
        "operation": "entity.set_minecart_block",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_show",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "block_offset",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setMobSitting": {
        "operation": "entity.set_mob_sitting",
        "receiver": "entity",
        "parameters": []
    },
    "setMobSittingWith": {
        "operation": "entity.set_mob_sitting",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "isSitting": {
                "tag": "is_sitting",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setName": {
        "operation": "entity.set_name",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "custom_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setNameWith": {
        "operation": "entity.set_name",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "custom_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "nameTagVisibility": {
                "tag": "name_tag_visibility",
                "kind": "string",
                "values": {
                    "always": "always",
                    "default": "default",
                    "never": "never",
                    "dontChange": "dont_change"
                }
            }
        }
    },
    "setNameColor": {
        "operation": "entity.set_name_color",
        "receiver": "entity",
        "parameters": []
    },
    "setNameColorWith": {
        "operation": "entity.set_name_color",
        "receiver": "entity",
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
    "setNameVisible": {
        "operation": "entity.set_name_visible",
        "receiver": "entity",
        "parameters": []
    },
    "setNameVisibleWith": {
        "operation": "entity.set_name_visible",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "nameTagVisibility": {
                "tag": "name_tag_visibility",
                "kind": "string",
                "values": {
                    "always": "always",
                    "default": "default",
                    "never": "never"
                }
            }
        }
    },
    "setOxidization": {
        "operation": "entity.set_oxidization",
        "receiver": "entity",
        "parameters": []
    },
    "setOxidizationWith": {
        "operation": "entity.set_oxidization",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "oxidization": {
                "tag": "oxidization",
                "kind": "string",
                "values": {
                    "unaffected": "unaffected",
                    "exposed": "exposed",
                    "weathered": "weathered",
                    "oxidized": "oxidized"
                }
            }
        }
    },
    "setPandaGene": {
        "operation": "entity.set_panda_gene",
        "receiver": "entity",
        "parameters": []
    },
    "setPandaGeneWith": {
        "operation": "entity.set_panda_gene",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "setGene": {
                "tag": "set_gene",
                "kind": "string",
                "values": {
                    "mainGene": "main_gene",
                    "hiddenGene": "hidden_gene",
                    "both": "both"
                }
            },
            "geneType": {
                "tag": "gene_type",
                "kind": "string",
                "values": {
                    "aggressive": "aggressive",
                    "lazy": "lazy",
                    "weak": "weak",
                    "worried": "worried",
                    "playful": "playful",
                    "normal": "normal",
                    "brown": "brown"
                }
            }
        }
    },
    "setPandaOnBack": {
        "operation": "entity.set_panda_on_back",
        "receiver": "entity",
        "parameters": []
    },
    "setPandaOnBackWith": {
        "operation": "entity.set_panda_on_back",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "onItsBack": {
                "tag": "on_its_back",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setPandaRolling": {
        "operation": "entity.set_panda_rolling",
        "receiver": "entity",
        "parameters": []
    },
    "setPandaRollingWith": {
        "operation": "entity.set_panda_rolling",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "rollType": {
                "tag": "roll_type",
                "kind": "string",
                "values": {
                    "roll": "roll",
                    "stopRolling": "stop_rolling"
                }
            }
        }
    },
    "setPandaSadTicks": {
        "operation": "entity.set_panda_sad_ticks",
        "receiver": "entity",
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
    "setParrotColor": {
        "operation": "entity.set_parrot_color",
        "receiver": "entity",
        "parameters": []
    },
    "setParrotColorWith": {
        "operation": "entity.set_parrot_color",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "parrotColor": {
                "tag": "parrot_color",
                "kind": "string",
                "values": {
                    "red": "red",
                    "blue": "blue",
                    "green": "green",
                    "cyan": "cyan",
                    "gray": "gray"
                }
            }
        }
    },
    "setPersistent": {
        "operation": "entity.set_persistent",
        "receiver": "entity",
        "parameters": []
    },
    "setPersistentWith": {
        "operation": "entity.set_persistent",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "persistent": {
                "tag": "persistent",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setPickupDelay": {
        "operation": "entity.set_pickup_delay",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "delay",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setPose": {
        "operation": "entity.set_pose",
        "receiver": "entity",
        "parameters": []
    },
    "setPoseWith": {
        "operation": "entity.set_pose",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "pose": {
                "tag": "pose",
                "kind": "string",
                "values": {
                    "standing": "standing",
                    "sleeping": "sleeping",
                    "swimming": "swimming",
                    "sneaking": "sneaking"
                }
            }
        }
    },
    "setProfession": {
        "operation": "entity.set_profession",
        "receiver": "entity",
        "parameters": []
    },
    "setProfessionWith": {
        "operation": "entity.set_profession",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "retainTrades": {
                "tag": "retain_trades",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "profession": {
                "tag": "profession",
                "kind": "string",
                "values": {
                    "unemployed": "unemployed",
                    "armorer": "armorer",
                    "butcher": "butcher",
                    "cartographer": "cartographer",
                    "cleric": "cleric",
                    "farmer": "farmer",
                    "fisherman": "fisherman",
                    "fletcher": "fletcher",
                    "leatherworker": "leatherworker",
                    "librarian": "librarian",
                    "mason": "mason",
                    "nitwit": "nitwit",
                    "shepherd": "shepherd",
                    "toolsmith": "toolsmith",
                    "weaponsmith": "weaponsmith"
                }
            }
        }
    },
    "setProjSource": {
        "operation": "entity.set_proj_source",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "shooter_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setProjSourceWith": {
        "operation": "entity.set_proj_source",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "shooter_uuid",
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
    "setRabbitType": {
        "operation": "entity.set_rabbit_type",
        "receiver": "entity",
        "parameters": []
    },
    "setRabbitTypeWith": {
        "operation": "entity.set_rabbit_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "skinType": {
                "tag": "skin_type",
                "kind": "string",
                "values": {
                    "brown": "brown",
                    "white": "white",
                    "black": "black",
                    "blackAndWhite": "black_and_white",
                    "gold": "gold",
                    "saltAndPepper": "salt_and_pepper",
                    "killer": "killer"
                }
            }
        }
    },
    "setRearing": {
        "operation": "entity.set_rearing",
        "receiver": "entity",
        "parameters": []
    },
    "setRearingWith": {
        "operation": "entity.set_rearing",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "rearing": {
                "tag": "rearing",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setRiptiding": {
        "operation": "entity.set_riptiding",
        "receiver": "entity",
        "parameters": []
    },
    "setRiptidingWith": {
        "operation": "entity.set_riptiding",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "riptiding": {
                "tag": "riptiding",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setRotation": {
        "operation": "entity.set_rotation",
        "receiver": "entity",
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
    "setSaddle": {
        "operation": "entity.set_saddle",
        "receiver": "entity",
        "parameters": []
    },
    "setSaddleWith": {
        "operation": "entity.set_saddle",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "saddle": {
                "tag": "saddle",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setSalmonType": {
        "operation": "entity.set_salmon_type",
        "receiver": "entity",
        "parameters": []
    },
    "setSalmonTypeWith": {
        "operation": "entity.set_salmon_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "salmonType": {
                "tag": "salmon_type",
                "kind": "string",
                "values": {
                    "small": "small",
                    "medium": "medium",
                    "large": "large"
                }
            }
        }
    },
    "setSheepSheared": {
        "operation": "entity.set_sheep_sheared",
        "receiver": "entity",
        "parameters": []
    },
    "setSheepShearedWith": {
        "operation": "entity.set_sheep_sheared",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "sheared": {
                "tag": "sheared",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setShulkerPeek": {
        "operation": "entity.set_shulker_peek",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "peek_percentage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setShulkerPeekWith": {
        "operation": "entity.set_shulker_peek",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "peek_percentage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "isSilent": {
                "tag": "is_silent",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setSilenced": {
        "operation": "entity.set_silenced",
        "receiver": "entity",
        "parameters": []
    },
    "setSilencedWith": {
        "operation": "entity.set_silenced",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "silenced": {
                "tag": "silenced",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setSize": {
        "operation": "entity.set_size",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "size",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setTarget": {
        "operation": "entity.set_target",
        "receiver": "entity",
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
    "setTargetWith": {
        "operation": "entity.set_target",
        "receiver": "entity",
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
    "setTemperature": {
        "operation": "entity.set_temperature",
        "receiver": "entity",
        "parameters": []
    },
    "setTemperatureWith": {
        "operation": "entity.set_temperature",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "temperatureType": {
                "tag": "temperature_type",
                "kind": "string",
                "values": {
                    "cold": "cold",
                    "temperate": "temperate",
                    "warm": "warm"
                }
            }
        }
    },
    "setTradeUses": {
        "operation": "entity.set_trade_uses",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "trade_index",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "remaining_uses",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "maximum_uses",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setVexCharging": {
        "operation": "entity.set_vex_charging",
        "receiver": "entity",
        "parameters": []
    },
    "setVexChargingWith": {
        "operation": "entity.set_vex_charging",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "charging": {
                "tag": "charging",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "setVillagerBiome": {
        "operation": "entity.set_villager_biome",
        "receiver": "entity",
        "parameters": []
    },
    "setVillagerBiomeWith": {
        "operation": "entity.set_villager_biome",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "biome": {
                "tag": "biome",
                "kind": "string",
                "values": {
                    "desert": "desert",
                    "jungle": "jungle",
                    "plains": "plains",
                    "savanna": "savanna",
                    "snow": "snow",
                    "swamp": "swamp",
                    "taiga": "taiga"
                }
            }
        }
    },
    "setVillagerExp": {
        "operation": "entity.set_villager_exp",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "experience",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setVillagerTrade": {
        "operation": "entity.set_villager_trade",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "trade_index",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "result_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "first_ingredient",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "second_ingredient",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
                "input": "maximum_uses",
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
        "operation": "entity.set_visual_fire",
        "receiver": "entity",
        "parameters": []
    },
    "setVisualFireWith": {
        "operation": "entity.set_visual_fire",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "onFire": {
                "tag": "on_fire",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setWardenAnger": {
        "operation": "entity.set_warden_anger",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "anger_level_0_150",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "entity_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setWardenAngerWith": {
        "operation": "entity.set_warden_anger",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "anger_level_0_150",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "entity_uuid",
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
    "setWaxed": {
        "operation": "entity.set_waxed",
        "receiver": "entity",
        "parameters": []
    },
    "setWaxedWith": {
        "operation": "entity.set_waxed",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "waxed": {
                "tag": "waxed",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setWitherInvul": {
        "operation": "entity.set_wither_invul",
        "receiver": "entity",
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
    "setWolfSoundType": {
        "operation": "entity.set_wolf_sound_type",
        "receiver": "entity",
        "parameters": []
    },
    "setWolfSoundTypeWith": {
        "operation": "entity.set_wolf_sound_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "wolfSoundType": {
                "tag": "wolf_sound_type",
                "kind": "string",
                "values": {
                    "angry": "angry",
                    "big": "big",
                    "classic": "classic",
                    "cute": "cute",
                    "grumpy": "grumpy",
                    "puglin": "puglin",
                    "sad": "sad"
                }
            }
        }
    },
    "setWolfType": {
        "operation": "entity.set_wolf_type",
        "receiver": "entity",
        "parameters": []
    },
    "setWolfTypeWith": {
        "operation": "entity.set_wolf_type",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "wolfType": {
                "tag": "wolf_type",
                "kind": "string",
                "values": {
                    "ashen": "ashen",
                    "black": "black",
                    "chestnut": "chestnut",
                    "pale": "pale",
                    "rusty": "rusty",
                    "snowy": "snowy",
                    "spotted": "spotted",
                    "striped": "striped",
                    "woods": "woods"
                }
            }
        }
    },
    "shear": {
        "operation": "entity.shear",
        "receiver": "entity",
        "parameters": []
    },
    "shearSheep": {
        "operation": "entity.shear_sheep",
        "receiver": "entity",
        "parameters": []
    },
    "sheepEat": {
        "operation": "entity.sheep_eat",
        "receiver": "entity",
        "parameters": []
    },
    "snifferState": {
        "operation": "entity.sniffer_state",
        "receiver": "entity",
        "parameters": []
    },
    "snifferStateWith": {
        "operation": "entity.sniffer_state",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "behavior": {
                "tag": "behavior",
                "kind": "string",
                "values": {
                    "idle": "idle",
                    "feelingHappy": "feeling_happy",
                    "scenting": "scenting",
                    "sniffing": "sniffing",
                    "searching": "searching",
                    "digging": "digging"
                }
            }
        }
    },
    "snowmanPumpkin": {
        "operation": "entity.snowman_pumpkin",
        "receiver": "entity",
        "parameters": []
    },
    "snowmanPumpkinWith": {
        "operation": "entity.snowman_pumpkin",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "pumpkin": {
                "tag": "pumpkin",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "tame": {
        "operation": "entity.tame",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "owner_uuid",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "tdispBackground": {
        "operation": "entity.tdisp_background",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "color_hexadecimal",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "opacity_in_percentage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "tdisplayAlign": {
        "operation": "entity.tdisplay_align",
        "receiver": "entity",
        "parameters": []
    },
    "tdisplayAlignWith": {
        "operation": "entity.tdisplay_align",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "textAlignment": {
                "tag": "text_alignment",
                "kind": "string",
                "values": {
                    "center": "center",
                    "left": "left",
                    "right": "right"
                }
            }
        }
    },
    "tdisplayLineWidth": {
        "operation": "entity.tdisplay_line_width",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "line_width",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "tdisplayOpacity": {
        "operation": "entity.tdisplay_opacity",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "text_opacity",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "tdisplaySeeThru": {
        "operation": "entity.tdisplay_see_thru",
        "receiver": "entity",
        "parameters": []
    },
    "tdisplaySeeThruWith": {
        "operation": "entity.tdisplay_see_thru",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "seeThrough": {
                "tag": "see_through",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "tdisplayShadow": {
        "operation": "entity.tdisplay_shadow",
        "receiver": "entity",
        "parameters": []
    },
    "tdisplayShadowWith": {
        "operation": "entity.tdisplay_shadow",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "textShadow": {
                "tag": "text_shadow",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "tdisplayText": {
        "operation": "entity.tdisplay_text",
        "receiver": "entity",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "displayed_text",
                "types": [
                    "component"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "tdisplayTextWith": {
        "operation": "entity.tdisplay_text",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "displayed_text",
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
    "teleport": {
        "operation": "entity.teleport",
        "receiver": "entity",
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
        "operation": "entity.teleport",
        "receiver": "entity",
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
            }
        }
    },
    "undisguise": {
        "operation": "entity.undisguise",
        "receiver": "entity",
        "parameters": []
    },
    "useItem": {
        "operation": "entity.use_item",
        "receiver": "entity",
        "parameters": []
    },
    "useItemWith": {
        "operation": "entity.use_item",
        "receiver": "entity",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hand": {
                "tag": "hand",
                "kind": "string",
                "values": {
                    "mainHand": "main_hand",
                    "offHand": "off_hand"
                }
            },
            "useItem": {
                "tag": "use_item",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "villagerHeadAnim": {
        "operation": "entity.villager_head_anim",
        "receiver": "entity",
        "parameters": []
    }
} as const;
