// This file is generated. Do not edit manually.

export const gameIntrinsics = {
    "advanceTime": {
        "operation": "game.advance_time",
        "receiver": "game",
        "parameters": []
    },
    "advanceTimeWith": {
        "operation": "game.advance_time",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "advanceTime": {
                "tag": "advance_time",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "advanceWeather": {
        "operation": "game.advance_weather",
        "receiver": "game",
        "parameters": []
    },
    "advanceWeatherWith": {
        "operation": "game.advance_weather",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "hasWeatherCycle": {
                "tag": "has_weather_cycle",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "applyTransaction": {
        "operation": "game.apply_transaction",
        "receiver": "game",
        "parameters": []
    },
    "blockDropsOff": {
        "operation": "game.block_drops_off",
        "receiver": "game",
        "parameters": []
    },
    "blockDropsOn": {
        "operation": "game.block_drops_on",
        "receiver": "game",
        "parameters": []
    },
    "boneMeal": {
        "operation": "game.bone_meal",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_bone_meal",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "number_of_uses",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "boneMealWith": {
        "operation": "game.bone_meal",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "blocks_to_bone_meal",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "number_of_uses",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "showParticles": {
                "tag": "show_particles",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "breakBlock": {
        "operation": "game.break_block",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_break",
                "types": [
                    "location"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "changeSign": {
        "operation": "game.change_sign",
        "receiver": "game",
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
                "input": "line_number",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "new_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "changeSignWith": {
        "operation": "game.change_sign",
        "receiver": "game",
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
                "input": "line_number",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "new_text",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
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
    "clearContainer": {
        "operation": "game.clear_container",
        "receiver": "game",
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
    "clearItems": {
        "operation": "game.clear_items",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
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
    "cloneRegion": {
        "operation": "game.clone_region",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "corner_1",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "corner_2",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "position_to_copy_from",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "position_to_paste_to",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "cloneRegionWith": {
        "operation": "game.clone_region",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "corner_1",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "corner_2",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "position_to_copy_from",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
                "input": "position_to_paste_to",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "ignoreAir": {
                "tag": "ignore_air",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "cloneBlockEntities": {
                "tag": "clone_block_entities",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "debugStackTrace": {
        "operation": "game.debug_stack_trace",
        "receiver": "game",
        "parameters": []
    },
    "discordWebhook": {
        "operation": "game.discord_webhook",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "webhook_url",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "message_content",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "explosion": {
        "operation": "game.explosion",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "explosion_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "explosion_power_0_4",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "fallingBlock": {
        "operation": "game.falling_block",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "block_material",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "fallingBlockWith": {
        "operation": "game.falling_block",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 2,
                "input": "block_material",
                "types": [
                    "item"
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
        ],
        "optionTags": {
            "hurtHitEntities": {
                "tag": "hurt_hit_entities",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "reformOnImpact": {
                "tag": "reform_on_impact",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "fillContainer": {
        "operation": "game.fill_container",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "items_to_fill_with",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "fireSpreadRadius": {
        "operation": "game.fire_spread_radius",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "radius_in_blocks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "firework": {
        "operation": "game.firework",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "firework_rocket",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "fireworkWith": {
        "operation": "game.firework",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "firework_rocket",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "instant": {
                "tag": "instant",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
            "movement": {
                "tag": "movement",
                "kind": "string",
                "values": {
                    "upwards": "upwards",
                    "directional": "directional"
                }
            }
        }
    },
    "generateTree": {
        "operation": "game.generate_tree",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "tree_location_bottom_log_block",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "generateTreeWith": {
        "operation": "game.generate_tree",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "tree_location_bottom_log_block",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "treeType": {
                "tag": "tree_type",
                "kind": "string",
                "values": {
                    "oakTree": "oak_tree",
                    "bigOakTree": "big_oak_tree",
                    "swampTree": "swamp_tree",
                    "spruceTree": "spruce_tree",
                    "slightlyTallerSpruceTree": "slightly_taller_spruce_tree",
                    "bigSpruceTree": "big_spruce_tree",
                    "birchTree": "birch_tree",
                    "tallBirchTree": "tall_birch_tree",
                    "jungleTree": "jungle_tree",
                    "bigJungleTree": "big_jungle_tree",
                    "jungleBush": "jungle_bush",
                    "acaciaTree": "acacia_tree",
                    "darkOakTree": "dark_oak_tree",
                    "paleOakTree": "pale_oak_tree",
                    "creakingPaleOakTree": "creaking_pale_oak_tree",
                    "mangroveTree": "mangrove_tree",
                    "tallMangroveTree": "tall_mangrove_tree",
                    "cherryTree": "cherry_tree",
                    "azaleaTree": "azalea_tree",
                    "redMushroom": "red_mushroom",
                    "brownMushroom": "brown_mushroom",
                    "crimsonFungus": "crimson_fungus",
                    "warpedFungus": "warped_fungus",
                    "chorusPlant": "chorus_plant"
                }
            }
        }
    },
    "launchProj": {
        "operation": "game.launch_proj",
        "receiver": "game",
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
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "custom_name",
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
    "lightning": {
        "operation": "game.lightning",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "impact_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "lockContainer": {
        "operation": "game.lock_container",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "lock_key",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "mobSpawning": {
        "operation": "game.mob_spawning",
        "receiver": "game",
        "parameters": []
    },
    "mobSpawningWith": {
        "operation": "game.mob_spawning",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "mobSpawning": {
                "tag": "mob_spawning",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "randomTickSpeed": {
        "operation": "game.random_tick_speed",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "tick_speed",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "removeItems": {
        "operation": "game.remove_items",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
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
    "replaceItems": {
        "operation": "game.replace_items",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "items_to_replace",
                "types": [
                    "item"
                ],
                "kind": "array",
                "optional": true,
                "minimumLength": 0
            },
            {
                "sourceIndex": 2,
                "input": "item_to_replace_with",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
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
    "setBiome": {
        "operation": "game.set_biome",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "corner_1",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "corner_2",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "biome_to_set",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setBlock": {
        "operation": "game.set_block",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "block_locations",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "setBlockData": {
        "operation": "game.set_block_data",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "location",
                "types": [
                    "location"
                ],
                "kind": "array",
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
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setBlockDataWith": {
        "operation": "game.set_block_data",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "location",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "block_data",
                "types": [
                    "text"
                ],
                "kind": "rest",
                "optional": false,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "overwriteExistingData": {
                "tag": "overwrite_existing_data",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "setBlockGrowth": {
        "operation": "game.set_block_growth",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "growth_stage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setBlockGrowthWith": {
        "operation": "game.set_block_growth",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 2,
                "input": "growth_stage",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "growthUnit": {
                "tag": "growth_unit",
                "kind": "string",
                "values": {
                    "growthStageNumber": "growth_stage_number",
                    "growthPercentage": "growth_percentage"
                }
            }
        }
    },
    "setBrushableItem": {
        "operation": "game.set_brushable_item",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setCampfireItem": {
        "operation": "game.set_campfire_item",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "campfire_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "campfire_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "cooking_time_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setCampfireItemWith": {
        "operation": "game.set_campfire_item",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "campfire_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "campfire_item",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "cooking_time_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "campfireSlot": {
                "tag": "campfire_slot",
                "kind": "string",
                "values": {
                    "1": "1",
                    "2": "2",
                    "3": "3",
                    "4": "4"
                }
            }
        }
    },
    "setContainer": {
        "operation": "game.set_container",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
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
    "setContainerName": {
        "operation": "game.set_container_name",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setDifficulty": {
        "operation": "game.set_difficulty",
        "receiver": "game",
        "parameters": []
    },
    "setDifficultyWith": {
        "operation": "game.set_difficulty",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "difficulty": {
                "tag": "difficulty",
                "kind": "string",
                "values": {
                    "peaceful": "peaceful",
                    "easy": "easy",
                    "normal": "normal",
                    "hard": "hard"
                }
            }
        }
    },
    "setFurnaceSpeed": {
        "operation": "game.set_furnace_speed",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "furnace_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
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
    "setHead": {
        "operation": "game.set_head",
        "receiver": "game",
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
    "setItemInSlot": {
        "operation": "game.set_item_in_slot",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 2,
                "input": "slot",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "setLecternBook": {
        "operation": "game.set_lectern_book",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "lectern_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "book_to_put",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "displayed_page",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setRegion": {
        "operation": "game.set_region",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "corner_1",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "corner_2",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "block_data_comma_separated",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "setWorldTime": {
        "operation": "game.set_world_time",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "daylight_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "shulkerBullet": {
        "operation": "game.shulker_bullet",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "signColor": {
        "operation": "game.sign_color",
        "receiver": "game",
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
    "signColorWith": {
        "operation": "game.sign_color",
        "receiver": "game",
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
    "simulationDistance": {
        "operation": "game.simulation_distance",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "simulation_distance",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "sleepPercentage": {
        "operation": "game.sleep_percentage",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "percentage_of_players",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "spawnArmorStand": {
        "operation": "game.spawn_armor_stand",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "custom_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "equipment",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ]
    },
    "spawnArmorStandWith": {
        "operation": "game.spawn_armor_stand",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "custom_name",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "equipment",
                "types": [
                    "item"
                ],
                "kind": "rest",
                "optional": true,
                "minimumLength": 0
            }
        ],
        "optionTags": {
            "visibility": {
                "tag": "visibility",
                "kind": "string",
                "values": {
                    "visible": "visible",
                    "visibleNoHitbox": "visible_no_hitbox",
                    "invisible": "invisible",
                    "invisibleNoHitbox": "invisible_no_hitbox"
                }
            }
        }
    },
    "spawnBlockDisp": {
        "operation": "game.spawn_block_disp",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "displayed_block",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "spawnCrystal": {
        "operation": "game.spawn_crystal",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
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
        ]
    },
    "spawnCrystalWith": {
        "operation": "game.spawn_crystal",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
            "showBottom": {
                "tag": "show_bottom",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "spawnEnderEye": {
        "operation": "game.spawn_ender_eye",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "location_to_spawn_at",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "destination",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "lifespan_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
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
    "spawnEnderEyeWith": {
        "operation": "game.spawn_ender_eye",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "location_to_spawn_at",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "destination",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "lifespan_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 4,
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
            "endOfLifespan": {
                "tag": "end_of_lifespan",
                "kind": "string",
                "values": {
                    "dropItem": "drop_item",
                    "shatter": "shatter",
                    "random": "random"
                }
            }
        }
    },
    "spawnExpOrb": {
        "operation": "game.spawn_exp_orb",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "experience_amount",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "spawnFangs": {
        "operation": "game.spawn_fangs",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
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
        ]
    },
    "spawnInteraction": {
        "operation": "game.spawn_interaction",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "hitbox_width",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "hitbox_height",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "spawnInteractionWith": {
        "operation": "game.spawn_interaction",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "hitbox_width",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "hitbox_height",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
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
    "spawnItem": {
        "operation": "game.spawn_item",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "items_to_spawn",
                "types": [
                    "item"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "spawnItemWith": {
        "operation": "game.spawn_item",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "items_to_spawn",
                "types": [
                    "item"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
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
            "applyItemMotion": {
                "tag": "apply_item_motion",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            }
        }
    },
    "spawnItemDisp": {
        "operation": "game.spawn_item_disp",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
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
    "spawnMannequin": {
        "operation": "game.spawn_mannequin",
        "receiver": "game",
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
            },
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "spawnMannequinWith": {
        "operation": "game.spawn_mannequin",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "mannequin_player_head",
                "types": [
                    "item",
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "description",
                "types": [
                    "component"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "movable": {
                "tag": "movable",
                "kind": "boolean",
                "values": {
                    "true": "true",
                    "false": "false"
                }
            },
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
    "spawnTextDisplay": {
        "operation": "game.spawn_text_display",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
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
        ]
    },
    "spawnTextDisplayWith": {
        "operation": "game.spawn_text_display",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "spawnTnt": {
        "operation": "game.spawn_tnt",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "tnt_power_0_4",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "fuse_duration",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
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
    "spawnVehicle": {
        "operation": "game.spawn_vehicle",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "vehicle_type",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "spawn_location",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
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
    "tickBlock": {
        "operation": "game.tick_block",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "blocks_to_tick",
                "types": [
                    "location"
                ],
                "kind": "array",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "number_of_ticks",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "traderSpawning": {
        "operation": "game.trader_spawning",
        "receiver": "game",
        "parameters": []
    },
    "traderSpawningWith": {
        "operation": "game.trader_spawning",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "traderSpawning": {
                "tag": "trader_spawning",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "viewDistance": {
        "operation": "game.view_distance",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "view_distance",
                "types": [
                    "number"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            }
        ]
    },
    "vineSpreading": {
        "operation": "game.vine_spreading",
        "receiver": "game",
        "parameters": []
    },
    "vineSpreadingWith": {
        "operation": "game.vine_spreading",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [],
        "optionTags": {
            "vineSpreading": {
                "tag": "vine_spreading",
                "kind": "string",
                "values": {
                    "enable": "enable",
                    "disable": "disable"
                }
            }
        }
    },
    "webRequest": {
        "operation": "game.web_request",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "url_to_request",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "content_body",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    },
    "webRequestWith": {
        "operation": "game.web_request",
        "receiver": "game",
        "optionsIndex": 0,
        "parameters": [
            {
                "sourceIndex": 1,
                "input": "url_to_request",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "content_body",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ],
        "optionTags": {
            "requestMethod": {
                "tag": "request_method",
                "kind": "string",
                "values": {
                    "post": "post",
                    "get": "get",
                    "put": "put",
                    "delete": "delete"
                }
            },
            "contentType": {
                "tag": "content_type",
                "kind": "string",
                "values": {
                    "textPlain": "text_plain",
                    "applicationJson": "application_json"
                }
            }
        }
    },
    "writeTransaction": {
        "operation": "game.write_transaction",
        "receiver": "game",
        "parameters": [
            {
                "sourceIndex": 0,
                "input": "block_to_set",
                "types": [
                    "item"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 1,
                "input": "corner_1",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 2,
                "input": "corner_2",
                "types": [
                    "location"
                ],
                "kind": "value",
                "optional": false,
                "minimumLength": 1
            },
            {
                "sourceIndex": 3,
                "input": "block_data_comma_separated",
                "types": [
                    "text"
                ],
                "kind": "value",
                "optional": true,
                "minimumLength": 1
            }
        ]
    }
} as const;
