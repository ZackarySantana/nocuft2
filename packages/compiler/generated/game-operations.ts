// This file is generated. Do not edit manually.

export const gameOperations = {
    "game.advance_time": {
        "id": "game.advance_time",
        "receiver": "game",
        "method": "advanceTime",
        "description": "Sets if the world has a natural time cycle.",
        "native": {
            "block": "game_action",
            "action": "AdvanceTime"
        },
        "inputs": [],
        "tags": [
            {
                "id": "advance_time",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Advance Time",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "game.advance_weather": {
        "id": "game.advance_weather",
        "receiver": "game",
        "method": "advanceWeather",
        "description": "Sets if the world has a natural weather cycle.",
        "native": {
            "block": "game_action",
            "action": "AdvanceWeather"
        },
        "inputs": [],
        "tags": [
            {
                "id": "has_weather_cycle",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Has Weather Cycle",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "game.apply_transaction": {
        "id": "game.apply_transaction",
        "receiver": "game",
        "method": "applyTransaction",
        "description": "Applies the current transaction and generates a new one.",
        "native": {
            "block": "game_action",
            "action": "ApplyTransaction"
        },
        "inputs": [],
        "tags": []
    },
    "game.block_drops_off": {
        "id": "game.block_drops_off",
        "receiver": "game",
        "method": "blockDropsOff",
        "description": "Disables blocks dropping as items when broken.",
        "native": {
            "block": "game_action",
            "action": "BlockDropsOff"
        },
        "inputs": [],
        "tags": []
    },
    "game.block_drops_on": {
        "id": "game.block_drops_on",
        "receiver": "game",
        "method": "blockDropsOn",
        "description": "Enables blocks dropping as items when broken.",
        "native": {
            "block": "game_action",
            "action": "BlockDropsOn"
        },
        "inputs": [],
        "tags": []
    },
    "game.bone_meal": {
        "id": "game.bone_meal",
        "receiver": "game",
        "method": "boneMeal",
        "description": "Applies bone meal to a block.",
        "native": {
            "block": "game_action",
            "action": "BoneMeal"
        },
        "inputs": [
            {
                "id": "blocks_to_bone_meal",
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
                "id": "number_of_uses",
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
                "id": "show_particles",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Show Particles",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.break_block": {
        "id": "game.break_block",
        "receiver": "game",
        "method": "breakBlock",
        "description": "Breaks the block at a location as if it was broken by a player.",
        "native": {
            "block": "game_action",
            "action": "BreakBlock"
        },
        "inputs": [
            {
                "id": "blocks_to_break",
                "acceptedTypes": [
                    "location"
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
    "game.change_sign": {
        "id": "game.change_sign",
        "receiver": "game",
        "method": "changeSign",
        "description": "Changes a line of text on a sign.",
        "native": {
            "block": "game_action",
            "action": "ChangeSign"
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
                "id": "line_number",
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
                "id": "new_text",
                "acceptedTypes": [
                    "component"
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
    "game.clear_container": {
        "id": "game.clear_container",
        "receiver": "game",
        "method": "clearContainer",
        "description": "Empties a container at a location.",
        "native": {
            "block": "game_action",
            "action": "ClearContainer"
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
    "game.clear_items": {
        "id": "game.clear_items",
        "receiver": "game",
        "method": "clearItems",
        "description": "Removes all of an item from the container at a location.",
        "native": {
            "block": "game_action",
            "action": "ClearItems"
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
            },
            {
                "id": "items_to_clear",
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
    "game.clone_region": {
        "id": "game.clone_region",
        "receiver": "game",
        "method": "cloneRegion",
        "description": "Copies a region of blocks to another region, including air.",
        "native": {
            "block": "game_action",
            "action": "CloneRegion"
        },
        "inputs": [
            {
                "id": "corner_1",
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
                "id": "corner_2",
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
                "id": "position_to_copy_from",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "position_to_paste_to",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": false
            }
        ],
        "tags": [
            {
                "id": "ignore_air",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Ignore Air",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "clone_block_entities",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Clone Block Entities",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.debug_stack_trace": {
        "id": "game.debug_stack_trace",
        "receiver": "game",
        "method": "debugStackTrace",
        "description": "",
        "native": {
            "block": "game_action",
            "action": "DebugStackTrace"
        },
        "inputs": [],
        "tags": []
    },
    "game.discord_webhook": {
        "id": "game.discord_webhook",
        "receiver": "game",
        "method": "discordWebhook",
        "description": "Sends a message to a Discord webhook.",
        "native": {
            "block": "game_action",
            "action": "DiscordWebhook"
        },
        "inputs": [
            {
                "id": "webhook_url",
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
                "id": "message_content",
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
    },
    "game.explosion": {
        "id": "game.explosion",
        "receiver": "game",
        "method": "explosion",
        "description": "Creates an explosion at a location.",
        "native": {
            "block": "game_action",
            "action": "Explosion"
        },
        "inputs": [
            {
                "id": "explosion_location",
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
                "id": "explosion_power_0_4",
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
    "game.falling_block": {
        "id": "game.falling_block",
        "receiver": "game",
        "method": "fallingBlock",
        "description": "Spawns a falling block at a location.",
        "native": {
            "block": "game_action",
            "action": "FallingBlock"
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
            },
            {
                "id": "block_material",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
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
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": [
            {
                "id": "hurt_hit_entities",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Hurt Hit Entities",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "reform_on_impact",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Reform on Impact",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.fill_container": {
        "id": "game.fill_container",
        "receiver": "game",
        "method": "fillContainer",
        "description": "Fills the container at a location with items.",
        "native": {
            "block": "game_action",
            "action": "FillContainer"
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
            },
            {
                "id": "items_to_fill_with",
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
    "game.fire_spread_radius": {
        "id": "game.fire_spread_radius",
        "receiver": "game",
        "method": "fireSpreadRadius",
        "description": "Sets the radius fire spreads around a player.",
        "native": {
            "block": "game_action",
            "action": "FireSpreadRadius"
        },
        "inputs": [
            {
                "id": "radius_in_blocks",
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
    "game.firework": {
        "id": "game.firework",
        "receiver": "game",
        "method": "firework",
        "description": "Launches a firework rocket at a location.",
        "native": {
            "block": "game_action",
            "action": "Firework"
        },
        "inputs": [
            {
                "id": "firework_rocket",
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
                "id": "spawn_location",
                "acceptedTypes": [
                    "location"
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
                "id": "instant",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Instant",
                    "slot": 25,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "movement",
                "defaultOption": "upwards",
                "options": [
                    "upwards",
                    "directional"
                ],
                "native": {
                    "name": "Movement",
                    "slot": 26,
                    "options": {
                        "upwards": "Upwards",
                        "directional": "Directional"
                    }
                }
            }
        ]
    },
    "game.generate_tree": {
        "id": "game.generate_tree",
        "receiver": "game",
        "method": "generateTree",
        "description": "Generates a tree at a location.",
        "native": {
            "block": "game_action",
            "action": "GenerateTree"
        },
        "inputs": [
            {
                "id": "tree_location_bottom_log_block",
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
                "id": "tree_type",
                "defaultOption": "oak_tree",
                "options": [
                    "oak_tree",
                    "big_oak_tree",
                    "swamp_tree",
                    "spruce_tree",
                    "slightly_taller_spruce_tree",
                    "big_spruce_tree",
                    "birch_tree",
                    "tall_birch_tree",
                    "jungle_tree",
                    "big_jungle_tree",
                    "jungle_bush",
                    "acacia_tree",
                    "dark_oak_tree",
                    "pale_oak_tree",
                    "creaking_pale_oak_tree",
                    "mangrove_tree",
                    "tall_mangrove_tree",
                    "cherry_tree",
                    "azalea_tree",
                    "red_mushroom",
                    "brown_mushroom",
                    "crimson_fungus",
                    "warped_fungus",
                    "chorus_plant"
                ],
                "native": {
                    "name": "Tree Type",
                    "slot": 26,
                    "options": {
                        "oak_tree": "Oak Tree",
                        "big_oak_tree": "Big Oak Tree",
                        "swamp_tree": "Swamp Tree",
                        "spruce_tree": "Spruce Tree",
                        "slightly_taller_spruce_tree": "Slightly Taller Spruce Tree",
                        "big_spruce_tree": "Big Spruce Tree",
                        "birch_tree": "Birch Tree",
                        "tall_birch_tree": "Tall Birch Tree",
                        "jungle_tree": "Jungle Tree",
                        "big_jungle_tree": "Big Jungle Tree",
                        "jungle_bush": "Jungle Bush",
                        "acacia_tree": "Acacia Tree",
                        "dark_oak_tree": "Dark Oak Tree",
                        "pale_oak_tree": "Pale Oak Tree",
                        "creaking_pale_oak_tree": "Creaking Pale Oak Tree",
                        "mangrove_tree": "Mangrove Tree",
                        "tall_mangrove_tree": "Tall Mangrove Tree",
                        "cherry_tree": "Cherry Tree",
                        "azalea_tree": "Azalea Tree",
                        "red_mushroom": "Red Mushroom",
                        "brown_mushroom": "Brown Mushroom",
                        "crimson_fungus": "Crimson Fungus",
                        "warped_fungus": "Warped Fungus",
                        "chorus_plant": "Chorus Plant"
                    }
                }
            }
        ]
    },
    "game.launch_proj": {
        "id": "game.launch_proj",
        "receiver": "game",
        "method": "launchProj",
        "description": "Launches a projectile.",
        "native": {
            "block": "game_action",
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
                "optional": false
            },
            {
                "id": "custom_name",
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
    "game.lightning": {
        "id": "game.lightning",
        "receiver": "game",
        "method": "lightning",
        "description": "Strikes lightning at a location.",
        "native": {
            "block": "game_action",
            "action": "Lightning"
        },
        "inputs": [
            {
                "id": "impact_location",
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
    "game.lock_container": {
        "id": "game.lock_container",
        "receiver": "game",
        "method": "lockContainer",
        "description": "Sets the lock key of the container at a location.",
        "native": {
            "block": "game_action",
            "action": "LockContainer"
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
            },
            {
                "id": "lock_key",
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
        "tags": []
    },
    "game.mob_spawning": {
        "id": "game.mob_spawning",
        "receiver": "game",
        "method": "mobSpawning",
        "description": "Sets if the world spawns mobs.",
        "native": {
            "block": "game_action",
            "action": "MobSpawning"
        },
        "inputs": [],
        "tags": [
            {
                "id": "mob_spawning",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Mob Spawning",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "game.random_tick_speed": {
        "id": "game.random_tick_speed",
        "receiver": "game",
        "method": "randomTickSpeed",
        "description": "Sets the random tick speed in the world.",
        "native": {
            "block": "game_action",
            "action": "RandomTickSpeed"
        },
        "inputs": [
            {
                "id": "tick_speed",
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
    "game.remove_items": {
        "id": "game.remove_items",
        "receiver": "game",
        "method": "removeItems",
        "description": "Removes items from the container at a location.",
        "native": {
            "block": "game_action",
            "action": "RemoveItems"
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
            },
            {
                "id": "items_to_remove",
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
    "game.replace_items": {
        "id": "game.replace_items",
        "receiver": "game",
        "method": "replaceItems",
        "description": "Replaces items in the container at a location with the given item.",
        "native": {
            "block": "game_action",
            "action": "ReplaceItems"
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
            },
            {
                "id": "items_to_replace",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
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
                    "index": 2
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
                    "index": 3
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    },
    "game.set_biome": {
        "id": "game.set_biome",
        "receiver": "game",
        "method": "setBiome",
        "description": "Sets the biome of a region.",
        "native": {
            "block": "game_action",
            "action": "SetBiome"
        },
        "inputs": [
            {
                "id": "corner_1",
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
                "id": "corner_2",
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
                "id": "biome_to_set",
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
    "game.set_block": {
        "id": "game.set_block",
        "receiver": "game",
        "method": "setBlock",
        "description": "Sets the block at a location.",
        "native": {
            "block": "game_action",
            "action": "SetBlock"
        },
        "inputs": [
            {
                "id": "block_to_set",
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
                "id": "block_locations",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "plural",
                "minimumLength": 1
            },
            {
                "id": "block_data",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "game.set_block_data": {
        "id": "game.set_block_data",
        "receiver": "game",
        "method": "setBlockData",
        "description": "Sets a data tag value of the block at a location.",
        "native": {
            "block": "game_action",
            "action": "SetBlockData"
        },
        "inputs": [
            {
                "id": "location",
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
                "id": "block_data",
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
                "id": "overwrite_existing_data",
                "defaultOption": "false",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Overwrite Existing Data",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.set_block_growth": {
        "id": "game.set_block_growth",
        "receiver": "game",
        "method": "setBlockGrowth",
        "description": "Sets the growth stage of the block (eg. carrots) at a location.",
        "native": {
            "block": "game_action",
            "action": "SetBlockGrowth"
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
            },
            {
                "id": "growth_stage",
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
                "id": "growth_unit",
                "defaultOption": "growth_stage_number",
                "options": [
                    "growth_stage_number",
                    "growth_percentage"
                ],
                "native": {
                    "name": "Growth Unit",
                    "slot": 26,
                    "options": {
                        "growth_stage_number": "Growth Stage Number",
                        "growth_percentage": "Growth Percentage"
                    }
                }
            }
        ]
    },
    "game.set_brushable_item": {
        "id": "game.set_brushable_item",
        "receiver": "game",
        "method": "setBrushableItem",
        "description": "Sets the item buried in a suspicious sand or gravel.",
        "native": {
            "block": "game_action",
            "action": "SetBrushableItem"
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
            },
            {
                "id": "item",
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
    "game.set_campfire_item": {
        "id": "game.set_campfire_item",
        "receiver": "game",
        "method": "setCampfireItem",
        "description": "Sets the item being cooked in one of a campfire's slots.",
        "native": {
            "block": "game_action",
            "action": "SetCampfireItem"
        },
        "inputs": [
            {
                "id": "campfire_location",
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
                "id": "campfire_item",
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
                "id": "cooking_time_ticks",
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
        "tags": [
            {
                "id": "campfire_slot",
                "defaultOption": "1",
                "options": [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                "native": {
                    "name": "Campfire Slot",
                    "slot": 26,
                    "options": {
                        "1": "1",
                        "2": "2",
                        "3": "3",
                        "4": "4"
                    }
                }
            }
        ]
    },
    "game.set_container": {
        "id": "game.set_container",
        "receiver": "game",
        "method": "setContainer",
        "description": "Sets the contents of the container at a location.",
        "native": {
            "block": "game_action",
            "action": "SetContainer"
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
            },
            {
                "id": "items_to_set",
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
    "game.set_container_name": {
        "id": "game.set_container_name",
        "receiver": "game",
        "method": "setContainerName",
        "description": "Sets the name of the container at a location.",
        "native": {
            "block": "game_action",
            "action": "SetContainerName"
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
            },
            {
                "id": "name",
                "acceptedTypes": [
                    "component"
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
    "game.set_difficulty": {
        "id": "game.set_difficulty",
        "receiver": "game",
        "method": "setDifficulty",
        "description": "Sets the world's difficulty.",
        "native": {
            "block": "game_action",
            "action": "SetDifficulty"
        },
        "inputs": [],
        "tags": [
            {
                "id": "difficulty",
                "defaultOption": "peaceful",
                "options": [
                    "peaceful",
                    "easy",
                    "normal",
                    "hard"
                ],
                "native": {
                    "name": "Difficulty",
                    "slot": 26,
                    "options": {
                        "peaceful": "Peaceful",
                        "easy": "Easy",
                        "normal": "Normal",
                        "hard": "Hard"
                    }
                }
            }
        ]
    },
    "game.set_furnace_speed": {
        "id": "game.set_furnace_speed",
        "receiver": "game",
        "method": "setFurnaceSpeed",
        "description": "Sets the amount of ticks it takes for a furnace block to cook an item.",
        "native": {
            "block": "game_action",
            "action": "SetFurnaceSpeed"
        },
        "inputs": [
            {
                "id": "furnace_location",
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
                "id": "ticks",
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
    "game.set_head": {
        "id": "game.set_head",
        "receiver": "game",
        "method": "setHead",
        "description": "Sets the block at a location to a player head.",
        "native": {
            "block": "game_action",
            "action": "SetHead"
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
    "game.set_item_in_slot": {
        "id": "game.set_item_in_slot",
        "receiver": "game",
        "method": "setItemInSlot",
        "description": "Sets the item in a slot of the container at a location.",
        "native": {
            "block": "game_action",
            "action": "SetItemInSlot"
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
            },
            {
                "id": "slot",
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
    "game.set_lectern_book": {
        "id": "game.set_lectern_book",
        "receiver": "game",
        "method": "setLecternBook",
        "description": "Sets the book and the displayed page of a Lectern.",
        "native": {
            "block": "game_action",
            "action": "SetLecternBook"
        },
        "inputs": [
            {
                "id": "lectern_location",
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
                "id": "book_to_put",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 1
                },
                "cardinality": "single",
                "optional": true
            },
            {
                "id": "displayed_page",
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
    "game.set_region": {
        "id": "game.set_region",
        "receiver": "game",
        "method": "setRegion",
        "description": "Fills a region with a type of block.",
        "native": {
            "block": "game_action",
            "action": "SetRegion"
        },
        "inputs": [
            {
                "id": "block_to_set",
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
                "id": "corner_1",
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
                "id": "corner_2",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "block_data_comma_separated",
                "acceptedTypes": [
                    "text"
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
    "game.set_world_time": {
        "id": "game.set_world_time",
        "receiver": "game",
        "method": "setWorldTime",
        "description": "Sets the time in the world.",
        "native": {
            "block": "game_action",
            "action": "SetWorldTime"
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
                "optional": false
            }
        ],
        "tags": []
    },
    "game.shulker_bullet": {
        "id": "game.shulker_bullet",
        "receiver": "game",
        "method": "shulkerBullet",
        "description": "Spawns a shulker bullet at a location.",
        "native": {
            "block": "game_action",
            "action": "ShulkerBullet"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
    "game.sign_color": {
        "id": "game.sign_color",
        "receiver": "game",
        "method": "signColor",
        "description": "Changes the text color of a sign.",
        "native": {
            "block": "game_action",
            "action": "SignColor"
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
    "game.simulation_distance": {
        "id": "game.simulation_distance",
        "receiver": "game",
        "method": "simulationDistance",
        "description": "Sets the simulation distance in the world.",
        "native": {
            "block": "game_action",
            "action": "SimulationDistance"
        },
        "inputs": [
            {
                "id": "simulation_distance",
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
    "game.sleep_percentage": {
        "id": "game.sleep_percentage",
        "receiver": "game",
        "method": "sleepPercentage",
        "description": "Sets the percentage of players that must sleep in order to skip the night.",
        "native": {
            "block": "game_action",
            "action": "SleepPercentage"
        },
        "inputs": [
            {
                "id": "percentage_of_players",
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
    "game.spawn_armor_stand": {
        "id": "game.spawn_armor_stand",
        "receiver": "game",
        "method": "spawnArmorStand",
        "description": "Spawns an armor stand at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnArmorStand"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "custom_name",
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
                "id": "equipment",
                "acceptedTypes": [
                    "item"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": [
            {
                "id": "visibility",
                "defaultOption": "visible",
                "options": [
                    "visible",
                    "visible_no_hitbox",
                    "invisible",
                    "invisible_no_hitbox"
                ],
                "native": {
                    "name": "Visibility",
                    "slot": 26,
                    "options": {
                        "visible": "Visible",
                        "visible_no_hitbox": "Visible (No hitbox)",
                        "invisible": "Invisible",
                        "invisible_no_hitbox": "Invisible (No hitbox)"
                    }
                }
            }
        ]
    },
    "game.spawn_block_disp": {
        "id": "game.spawn_block_disp",
        "receiver": "game",
        "method": "spawnBlockDisp",
        "description": "Spawns a block display entity.",
        "native": {
            "block": "game_action",
            "action": "SpawnBlockDisp"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "displayed_block",
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
                "id": "block_data",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "plural",
                "minimumLength": 0
            }
        ],
        "tags": []
    },
    "game.spawn_crystal": {
        "id": "game.spawn_crystal",
        "receiver": "game",
        "method": "spawnCrystal",
        "description": "Spawns an end crystal at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnCrystal"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "custom_name",
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
                "id": "show_bottom",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Show Bottom",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.spawn_ender_eye": {
        "id": "game.spawn_ender_eye",
        "receiver": "game",
        "method": "spawnEnderEye",
        "description": "Spawns an eye of ender at a location, which (if specified) will float towards its destination.",
        "native": {
            "block": "game_action",
            "action": "SpawnEnderEye"
        },
        "inputs": [
            {
                "id": "location_to_spawn_at",
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
                "id": "destination",
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
                "id": "lifespan_ticks",
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
                "id": "custom_name",
                "acceptedTypes": [
                    "component"
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
                "id": "end_of_lifespan",
                "defaultOption": "random",
                "options": [
                    "drop_item",
                    "shatter",
                    "random"
                ],
                "native": {
                    "name": "End of Lifespan",
                    "slot": 26,
                    "options": {
                        "drop_item": "Drop item",
                        "shatter": "Shatter",
                        "random": "Random"
                    }
                }
            }
        ]
    },
    "game.spawn_exp_orb": {
        "id": "game.spawn_exp_orb",
        "receiver": "game",
        "method": "spawnExpOrb",
        "description": "Spawns an experience orb at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnExpOrb"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "experience_amount",
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
                "id": "custom_name",
                "acceptedTypes": [
                    "component"
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
    "game.spawn_fangs": {
        "id": "game.spawn_fangs",
        "receiver": "game",
        "method": "spawnFangs",
        "description": "Spawns evoker fangs at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnFangs"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "custom_name",
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
    "game.spawn_interaction": {
        "id": "game.spawn_interaction",
        "receiver": "game",
        "method": "spawnInteraction",
        "description": "Spawns an invisible hitbox with the specified size.",
        "native": {
            "block": "game_action",
            "action": "SpawnInteraction"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "hitbox_width",
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
                "id": "hitbox_height",
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
        "tags": [
            {
                "id": "responsive",
                "defaultOption": "disable",
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
    "game.spawn_item": {
        "id": "game.spawn_item",
        "receiver": "game",
        "method": "spawnItem",
        "description": "Spawns an item at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnItem"
        },
        "inputs": [
            {
                "id": "items_to_spawn",
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
                "id": "spawn_location",
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
                "id": "custom_name",
                "acceptedTypes": [
                    "component"
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
                "id": "apply_item_motion",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Apply Item Motion",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            }
        ]
    },
    "game.spawn_item_disp": {
        "id": "game.spawn_item_disp",
        "receiver": "game",
        "method": "spawnItemDisp",
        "description": "Spawns an item display entity.",
        "native": {
            "block": "game_action",
            "action": "SpawnItemDisp"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "displayed_item",
                "acceptedTypes": [
                    "item"
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
    "game.spawn_mannequin": {
        "id": "game.spawn_mannequin",
        "receiver": "game",
        "method": "spawnMannequin",
        "description": "Spawns a mannequin at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnMannequin"
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
            },
            {
                "id": "spawn_location",
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
                "id": "description",
                "acceptedTypes": [
                    "component"
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
                "id": "movable",
                "defaultOption": "true",
                "options": [
                    "true",
                    "false"
                ],
                "native": {
                    "name": "Movable",
                    "slot": 26,
                    "options": {
                        "true": "True",
                        "false": "False"
                    }
                }
            },
            {
                "id": "main_hand",
                "defaultOption": "left_hand",
                "options": [
                    "left_hand",
                    "right_hand"
                ],
                "native": {
                    "name": "Main Hand",
                    "slot": 25,
                    "options": {
                        "left_hand": "Left Hand",
                        "right_hand": "Right Hand"
                    }
                }
            }
        ]
    },
    "game.spawn_text_display": {
        "id": "game.spawn_text_display",
        "receiver": "game",
        "method": "spawnTextDisplay",
        "description": "Spawns a text display entity.",
        "native": {
            "block": "game_action",
            "action": "SpawnTextDisplay"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "displayed_text",
                "acceptedTypes": [
                    "component"
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
    "game.spawn_tnt": {
        "id": "game.spawn_tnt",
        "receiver": "game",
        "method": "spawnTnt",
        "description": "Spawns primed TNT at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnTNT"
        },
        "inputs": [
            {
                "id": "spawn_location",
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
                "id": "tnt_power_0_4",
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
                "id": "fuse_duration",
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
                "id": "custom_name",
                "acceptedTypes": [
                    "component"
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
    "game.spawn_vehicle": {
        "id": "game.spawn_vehicle",
        "receiver": "game",
        "method": "spawnVehicle",
        "description": "Spawns a vehicle at a location.",
        "native": {
            "block": "game_action",
            "action": "SpawnVehicle"
        },
        "inputs": [
            {
                "id": "vehicle_type",
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
                "id": "spawn_location",
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
                "id": "custom_name",
                "acceptedTypes": [
                    "component"
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
    "game.tick_block": {
        "id": "game.tick_block",
        "receiver": "game",
        "method": "tickBlock",
        "description": "Causes a block to get \"random ticked\", which could cause a block update.",
        "native": {
            "block": "game_action",
            "action": "TickBlock"
        },
        "inputs": [
            {
                "id": "blocks_to_tick",
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
                "id": "number_of_ticks",
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
    "game.trader_spawning": {
        "id": "game.trader_spawning",
        "receiver": "game",
        "method": "traderSpawning",
        "description": "Sets if the world spawns wandering traders.",
        "native": {
            "block": "game_action",
            "action": "TraderSpawning"
        },
        "inputs": [],
        "tags": [
            {
                "id": "trader_spawning",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Trader Spawning",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "game.view_distance": {
        "id": "game.view_distance",
        "receiver": "game",
        "method": "viewDistance",
        "description": "Sets the view distance in the world.",
        "native": {
            "block": "game_action",
            "action": "ViewDistance"
        },
        "inputs": [
            {
                "id": "view_distance",
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
    "game.vine_spreading": {
        "id": "game.vine_spreading",
        "receiver": "game",
        "method": "vineSpreading",
        "description": "Sets if the world spreads vines.",
        "native": {
            "block": "game_action",
            "action": "VineSpreading"
        },
        "inputs": [],
        "tags": [
            {
                "id": "vine_spreading",
                "defaultOption": "enable",
                "options": [
                    "enable",
                    "disable"
                ],
                "native": {
                    "name": "Vine Spreading",
                    "slot": 26,
                    "options": {
                        "enable": "Enable",
                        "disable": "Disable"
                    }
                }
            }
        ]
    },
    "game.web_request": {
        "id": "game.web_request",
        "receiver": "game",
        "method": "webRequest",
        "description": "Sends a web request to a URL.",
        "native": {
            "block": "game_action",
            "action": "WebRequest"
        },
        "inputs": [
            {
                "id": "url_to_request",
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
                "id": "content_body",
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
                "id": "request_method",
                "defaultOption": "post",
                "options": [
                    "post",
                    "get",
                    "put",
                    "delete"
                ],
                "native": {
                    "name": "Request Method",
                    "slot": 25,
                    "options": {
                        "post": "Post",
                        "get": "Get",
                        "put": "Put",
                        "delete": "Delete"
                    }
                }
            },
            {
                "id": "content_type",
                "defaultOption": "text_plain",
                "options": [
                    "text_plain",
                    "application_json"
                ],
                "native": {
                    "name": "Content Type",
                    "slot": 26,
                    "options": {
                        "text_plain": "text/plain",
                        "application_json": "application/json"
                    }
                }
            }
        ]
    },
    "game.write_transaction": {
        "id": "game.write_transaction",
        "receiver": "game",
        "method": "writeTransaction",
        "description": "Adds blocks to the next transaction; a method of queuing up block operations so that they can be sent simultaneously.",
        "native": {
            "block": "game_action",
            "action": "WriteTransaction"
        },
        "inputs": [
            {
                "id": "block_to_set",
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
                "id": "corner_1",
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
                "id": "corner_2",
                "acceptedTypes": [
                    "location"
                ],
                "native": {
                    "index": 2
                },
                "cardinality": "single",
                "optional": false
            },
            {
                "id": "block_data_comma_separated",
                "acceptedTypes": [
                    "text"
                ],
                "native": {
                    "index": 3
                },
                "cardinality": "single",
                "optional": true
            }
        ],
        "tags": []
    }
} as const;
