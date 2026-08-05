// This file is generated. Do not edit manually.

export const eventBindings = {
    "entity.blockFall": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "BlockFall"
        }
    },
    "entity.entityCombust": {
        "cancellable": true,
        "fields": [
            {
                "name": "blockLocation",
                "description": "Gets the location of the block in this event.",
                "type": "location",
                "native": "Event Block Location"
            },
            {
                "name": "combustDuration",
                "description": "Gets the duration of fire inflicted in this event.",
                "type": "number",
                "native": "Combust Event Duration"
            },
            {
                "name": "combustCause",
                "description": "Gets the reason the target caught on fire in this event.",
                "type": "text",
                "native": "Combust Event Cause"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "EntityCombust"
        }
    },
    "entity.entityDeath": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {
            "game.set_event_sound": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventSound"
                },
                "inputs": [
                    {
                        "id": "new_sound",
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
            "game.set_event_xp": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventXP"
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDeath"
        }
    },
    "entity.entityDmg": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDmg"
        }
    },
    "entity.entityDmgEntity": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            },
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            },
            {
                "name": "damager",
                "type": "entity",
                "native": "Damager"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDmgEntity"
        }
    },
    "entity.entityExplode": {
        "cancellable": true,
        "fields": [
            {
                "name": "affectedBlocks",
                "description": "Gets the locations of blocks affected in this event.",
                "type": "list",
                "native": "Event Affected Blocks"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "EntityExplode"
        }
    },
    "entity.entityHeal": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "EntityHeal"
        }
    },
    "entity.entityKillEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            },
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            },
            {
                "name": "killer",
                "type": "entity",
                "native": "Killer"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "EntityKillEntity"
        }
    },
    "entity.entityResurrect": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "EntityResurrect"
        }
    },
    "entity.fallingBlockLand": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "FallingBlockLand"
        }
    },
    "entity.itemMerge": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "ItemMerge"
        }
    },
    "entity.naturallySpawn": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "NaturallySpawn"
        }
    },
    "entity.projDmgEntity": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            },
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            },
            {
                "name": "shooter",
                "type": "entity",
                "native": "Shooter"
            },
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "ProjDmgEntity"
        }
    },
    "entity.projKillEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            },
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            },
            {
                "name": "shooter",
                "type": "entity",
                "native": "Shooter"
            },
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "ProjKillEntity"
        }
    },
    "entity.regrowWool": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "RegrowWool"
        }
    },
    "entity.shootBow": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            },
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "ShootBow"
        }
    },
    "entity.teleport": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "Teleport"
        }
    },
    "entity.transform": {
        "cancellable": true,
        "fields": [
            {
                "name": "transformCause",
                "description": "Gets the reason the target transformed in this event.",
                "type": "text",
                "native": "Transform Event Cause"
            },
            {
                "name": "transformEntities",
                "description": "Gets the entities an entity transforms into.",
                "type": "list",
                "native": "Event Transform Entities"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {},
        "native": {
            "block": "entity_event",
            "action": "Transform"
        }
    },
    "entity.vehicleDamage": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "entity",
                "type": "entity",
                "native": "Default"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "VehicleDamage"
        }
    },
    "player.breakBlock": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "BreakBlock"
        }
    },
    "player.breakItem": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "BreakItem"
        }
    },
    "player.changeSign": {
        "cancellable": true,
        "fields": [
            {
                "name": "signText",
                "description": "Gets the sign text in this event.",
                "type": "list",
                "native": "Event Sign Text"
            },
            {
                "name": "signSide",
                "description": "Gets the sign side modified in this event.",
                "type": "text",
                "native": "Event Sign Side"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ChangeSign"
        }
    },
    "player.changeSlot": {
        "cancellable": true,
        "fields": [
            {
                "name": "hotbarSlot",
                "description": "Gets the hotbar slot being changed to in this event.",
                "type": "number",
                "native": "Event Hotbar Slot"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ChangeSlot"
        }
    },
    "player.chat": {
        "cancellable": true,
        "fields": [
            {
                "name": "message",
                "description": "The message sent in this event",
                "type": "text",
                "native": "Event Message"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Chat"
        }
    },
    "player.clickContainerSlot": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ClickContainerSlot"
        }
    },
    "player.clickEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ClickEntity"
        }
    },
    "player.clickInvSlot": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ClickInvSlot"
        }
    },
    "player.clickMenuSlot": {
        "cancellable": false,
        "fields": [
            {
                "name": "clickedSlotIndex",
                "description": "Gets the index of the clicked inventory slot in this event.",
                "type": "number",
                "native": "Event Clicked Slot Index"
            },
            {
                "name": "clickedSlotItem",
                "description": "Gets the inventory item clicked on in this event.",
                "type": "item",
                "native": "Event Clicked Slot Item"
            },
            {
                "name": "clickedSlotNewItem",
                "description": "Gets the inventory item clicked with in this event.",
                "type": "item",
                "native": "Event Clicked Slot New Item"
            },
            {
                "name": "inventoryClickType",
                "description": "Gets the click type in this inventory click event.",
                "type": "text",
                "native": "Inventory Event Click Type"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ClickMenuSlot"
        }
    },
    "player.clickPlayer": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            }
        ],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ClickPlayer"
        }
    },
    "player.closeInv": {
        "cancellable": false,
        "fields": [
            {
                "name": "closeInventoryCause",
                "description": "Gets the reason the target's inventory was closed in this event.",
                "type": "text",
                "native": "Close Inventory Event Cause"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "CloseInv"
        }
    },
    "player.cloudImbuePlayer": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "CloudImbuePlayer"
        }
    },
    "player.command": {
        "cancellable": false,
        "fields": [
            {
                "name": "command",
                "description": "Gets the entire command line entered in this event.",
                "type": "text",
                "native": "Event Command"
            },
            {
                "name": "commandArguments",
                "description": "Gets the separated parts of the event command.",
                "type": "list",
                "native": "Event Command Arguments"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Command"
        }
    },
    "player.consume": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Consume"
        }
    },
    "player.damageEntity": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "DamageEntity"
        }
    },
    "player.death": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            },
            {
                "name": "deathMessage",
                "description": "Gets the death message for this death event.",
                "type": "component",
                "native": "Event Death Message"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_event_death_msg": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDeathMsg"
                },
                "inputs": [
                    {
                        "id": "new_death_message",
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
            }
        },
        "native": {
            "block": "event",
            "action": "Death"
        }
    },
    "player.dismount": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Dismount"
        }
    },
    "player.dropItem": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "DropItem"
        }
    },
    "player.entityDmgPlayer": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            },
            {
                "name": "damager",
                "type": "entity",
                "native": "Damager"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "EntityDmgPlayer"
        }
    },
    "player.exhaustion": {
        "cancellable": true,
        "fields": [
            {
                "name": "exhaustionCause",
                "description": "Gets the reason the target became exhausted in this event.",
                "type": "text",
                "native": "Exhaustion Event Cause"
            },
            {
                "name": "exhaustion",
                "description": "Gets the amount of exhaustion gained in this event.",
                "type": "number",
                "native": "Event Exhaustion"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_exhaustion": {
                "native": {
                    "block": "game_action",
                    "action": "SetExhaustion"
                },
                "inputs": [
                    {
                        "id": "new_exhaustion_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "Exhaustion"
        }
    },
    "player.fallDamage": {
        "cancellable": false,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "FallDamage"
        }
    },
    "player.fish": {
        "cancellable": true,
        "fields": [
            {
                "name": "fishCause",
                "description": "Gets the cause of this fish event.",
                "type": "text",
                "native": "Fish Event Cause"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_event_xp": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventXP"
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
            }
        },
        "native": {
            "block": "event",
            "action": "Fish"
        }
    },
    "player.horseJump": {
        "cancellable": false,
        "fields": [
            {
                "name": "power",
                "description": "Gets the percentage of power this event was executed with.",
                "type": "number",
                "native": "Event Power"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "HorseJump"
        }
    },
    "player.join": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Join"
        }
    },
    "player.jump": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Jump"
        }
    },
    "player.killMob": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "victim",
                "type": "entity",
                "native": "Victim"
            }
        ],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "KillMob"
        }
    },
    "player.killPlayer": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            },
            {
                "name": "deathMessage",
                "description": "Gets the death message for this death event.",
                "type": "component",
                "native": "Event Death Message"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            }
        ],
        "mutators": {
            "game.set_event_death_msg": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDeathMsg"
                },
                "inputs": [
                    {
                        "id": "new_death_message",
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
            }
        },
        "native": {
            "block": "event",
            "action": "KillPlayer"
        }
    },
    "player.leave": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Leave"
        }
    },
    "player.leftClick": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "LeftClick"
        }
    },
    "player.leftClickEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "LeftClickEntity"
        }
    },
    "player.leftClickPlayer": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            }
        ],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "LeftClickPlayer"
        }
    },
    "player.loadCrossbow": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "LoadCrossbow"
        }
    },
    "player.loopEvent": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "LoopEvent"
        }
    },
    "player.mobKillPlayer": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            },
            {
                "name": "deathMessage",
                "description": "Gets the death message for this death event.",
                "type": "component",
                "native": "Event Death Message"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            },
            {
                "name": "killer",
                "type": "entity",
                "native": "Killer"
            }
        ],
        "mutators": {
            "game.set_event_death_msg": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDeathMsg"
                },
                "inputs": [
                    {
                        "id": "new_death_message",
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
            }
        },
        "native": {
            "block": "event",
            "action": "MobKillPlayer"
        }
    },
    "player.move": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Move"
        }
    },
    "player.movementKey": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "MovementKey"
        }
    },
    "player.packDecline": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PackDecline"
        }
    },
    "player.packLoad": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PackLoad"
        }
    },
    "player.pickBlock": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PickBlock"
        }
    },
    "player.pickEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PickEntity"
        }
    },
    "player.pickUpItem": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PickUpItem"
        }
    },
    "player.placeBlock": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PlaceBlock"
        }
    },
    "player.playerCombust": {
        "cancellable": true,
        "fields": [
            {
                "name": "blockLocation",
                "description": "Gets the location of the block in this event.",
                "type": "location",
                "native": "Event Block Location"
            },
            {
                "name": "combustDuration",
                "description": "Gets the duration of fire inflicted in this event.",
                "type": "number",
                "native": "Combust Event Duration"
            },
            {
                "name": "combustCause",
                "description": "Gets the reason the target caught on fire in this event.",
                "type": "text",
                "native": "Combust Event Cause"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PlayerCombust"
        }
    },
    "player.playerDmgPlayer": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerDmgPlayer"
        }
    },
    "player.playerHeal": {
        "cancellable": true,
        "fields": [
            {
                "name": "healAmount",
                "description": "Gets the amount of health regained in this event.",
                "type": "number",
                "native": "Event Heal Amount"
            },
            {
                "name": "healCause",
                "description": "Gets the reason the target regained health in this event.",
                "type": "text",
                "native": "Heal Event Cause"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_event_heal": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventHeal"
                },
                "inputs": [
                    {
                        "id": "new_healing_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerHeal"
        }
    },
    "player.playerResurrect": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "PlayerResurrect"
        }
    },
    "player.playerTakeDmg": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerTakeDmg"
        }
    },
    "player.projDmgPlayer": {
        "cancellable": true,
        "fields": [
            {
                "name": "damage",
                "description": "Gets the amount of damage dealt in this event. Includes damage reduction.",
                "type": "number",
                "native": "Event Damage"
            },
            {
                "name": "damageCause",
                "description": "Gets the type of damage taken or dealt in this event.",
                "type": "text",
                "native": "Damage Event Cause"
            },
            {
                "name": "rawDamage",
                "description": "Gets the amount of damage dealt in this event before any damage reductions.",
                "type": "number",
                "native": "Raw Event Damage"
            }
        ],
        "entityRoles": [
            {
                "name": "victim",
                "type": "player",
                "native": "Victim"
            },
            {
                "name": "shooter",
                "type": "entity",
                "native": "Shooter"
            },
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {
            "game.set_event_damage": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventDamage"
                },
                "inputs": [
                    {
                        "id": "new_damage_amount",
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
            }
        },
        "native": {
            "block": "event",
            "action": "ProjDmgPlayer"
        }
    },
    "player.projHit": {
        "cancellable": false,
        "fields": [
            {
                "name": "blockLocation",
                "description": "Gets the location of the block in this event.",
                "type": "location",
                "native": "Event Block Location"
            },
            {
                "name": "blockSide",
                "description": "Gets the side of the block that was hit in this event as a direction.",
                "type": "vector",
                "native": "Event Block Side"
            },
            {
                "name": "hitType",
                "description": "Gets the type of object that the projectile collided with",
                "type": "text",
                "native": "Event Hit Type"
            }
        ],
        "entityRoles": [
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ProjHit"
        }
    },
    "player.purchase": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Purchase"
        }
    },
    "player.respawn": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Respawn"
        }
    },
    "player.rightClick": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "RightClick"
        }
    },
    "player.riptide": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Riptide"
        }
    },
    "player.shootBow": {
        "cancellable": true,
        "fields": [
            {
                "name": "power",
                "description": "Gets the percentage of power this event was executed with.",
                "type": "number",
                "native": "Event Power"
            }
        ],
        "entityRoles": [
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {
            "game.set_event_proj": {
                "native": {
                    "block": "game_action",
                    "action": "SetEventProj"
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
                        "optional": true
                    }
                ],
                "tags": []
            }
        },
        "native": {
            "block": "event",
            "action": "ShootBow"
        }
    },
    "player.shootProjectile": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [
            {
                "name": "projectile",
                "type": "entity",
                "native": "Projectile"
            }
        ],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "ShootProjectile"
        }
    },
    "player.sneak": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Sneak"
        }
    },
    "player.startBreaking": {
        "cancellable": false,
        "fields": [
            {
                "name": "blockSide",
                "description": "Gets the side of the block that was hit in this event as a direction.",
                "type": "vector",
                "native": "Event Block Side"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StartBreaking"
        }
    },
    "player.startFly": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StartFly"
        }
    },
    "player.startGlide": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StartGlide"
        }
    },
    "player.startSprint": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StartSprint"
        }
    },
    "player.stopBreaking": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StopBreaking"
        }
    },
    "player.stopFly": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StopFly"
        }
    },
    "player.stopGlide": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StopGlide"
        }
    },
    "player.stopSprint": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "StopSprint"
        }
    },
    "player.swapHands": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "SwapHands"
        }
    },
    "player.tameEntity": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "TameEntity"
        }
    },
    "player.teleport": {
        "cancellable": true,
        "fields": [
            {
                "name": "teleportCause",
                "description": "Gets the reason the player was teleported in this event.",
                "type": "text",
                "native": "Teleport Event Cause"
            },
            {
                "name": "teleportLocation",
                "description": "Gets the location that will be teleported to in this event.",
                "type": "location",
                "native": "Teleport Location"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Teleport"
        }
    },
    "player.unsneak": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Unsneak"
        }
    },
    "player.vehicleJump": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "VehicleJump"
        }
    },
    "player.villagerTrade": {
        "cancellable": true,
        "fields": [
            {
                "name": "tradeIngredients",
                "description": "Gets the items given to a villager in a trade.",
                "type": "list",
                "native": "Trade Ingredients"
            },
            {
                "name": "tradeResult",
                "description": "Gets the result item of a villager trade.",
                "type": "item",
                "native": "Trade Result"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "VillagerTrade"
        }
    },
    "player.walk": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "event",
            "action": "Walk"
        }
    },
    "plot.beaconActivated": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BeaconActivated"
        }
    },
    "plot.bellRing": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BellRing"
        }
    },
    "plot.blockBurn": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockBurn"
        }
    },
    "plot.blockCook": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockCook"
        }
    },
    "plot.blockDispense": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockDispense"
        }
    },
    "plot.blockExplode": {
        "cancellable": false,
        "fields": [
            {
                "name": "affectedBlocks",
                "description": "Gets the locations of blocks affected in this event.",
                "type": "list",
                "native": "Event Affected Blocks"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockExplode"
        }
    },
    "plot.blockFade": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockFade"
        }
    },
    "plot.blockFertilize": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockFertilize"
        }
    },
    "plot.blockForm": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockForm"
        }
    },
    "plot.blockGrow": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockGrow"
        }
    },
    "plot.blockIgnite": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockIgnite"
        }
    },
    "plot.blockMove": {
        "cancellable": false,
        "fields": [
            {
                "name": "destinationBlockLocation",
                "description": "Gets the location of the destination block in this event.",
                "type": "location",
                "native": "Event Destination Block Location"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockMove"
        }
    },
    "plot.blockSpread": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "BlockSpread"
        }
    },
    "plot.brew": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "Brew"
        }
    },
    "plot.campfireStart": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "CampfireStart"
        }
    },
    "plot.cauldronChange": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "CauldronChange"
        }
    },
    "plot.chunkLoad": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "ChunkLoad"
        }
    },
    "plot.chunkUnload": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "ChunkUnload"
        }
    },
    "plot.crafterCraft": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "CrafterCraft"
        }
    },
    "plot.fluidLevelChange": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "FluidLevelChange"
        }
    },
    "plot.furnaceBurn": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "FurnaceBurn"
        }
    },
    "plot.lagSlayRecover": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "LagSlayRecover"
        }
    },
    "plot.leavesDecay": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "LeavesDecay"
        }
    },
    "plot.moistureChange": {
        "cancellable": true,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "MoistureChange"
        }
    },
    "plot.notePlay": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "NotePlay"
        }
    },
    "plot.pistonExtend": {
        "cancellable": true,
        "fields": [
            {
                "name": "affectedBlocks",
                "description": "Gets the locations of blocks affected in this event.",
                "type": "list",
                "native": "Event Affected Blocks"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "PistonExtend"
        }
    },
    "plot.pistonRetract": {
        "cancellable": true,
        "fields": [
            {
                "name": "affectedBlocks",
                "description": "Gets the locations of blocks affected in this event.",
                "type": "list",
                "native": "Event Affected Blocks"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "PistonRetract"
        }
    },
    "plot.redstone": {
        "cancellable": false,
        "fields": [
            {
                "name": "redstoneCurrentStrength",
                "description": "Gets the strength of the redstone current before this event.",
                "type": "number",
                "native": "Event Redstone Current Strength"
            },
            {
                "name": "newRedstoneCurrentStrength",
                "description": "Gets the strength of the redstone current after this event.",
                "type": "number",
                "native": "Event New Redstone Current Strength"
            }
        ],
        "entityRoles": [],
        "mutators": {
            "game.redstone_strength": {
                "native": {
                    "block": "game_action",
                    "action": "RedstoneStrength"
                },
                "inputs": [
                    {
                        "id": "new_current_strength",
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
            }
        },
        "native": {
            "block": "game_event",
            "action": "Redstone"
        }
    },
    "plot.sculkBloom": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "SculkBloom"
        }
    },
    "plot.shutdown": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "PlotShutdown"
        }
    },
    "plot.spongeAbsorb": {
        "cancellable": true,
        "fields": [
            {
                "name": "affectedBlocks",
                "description": "Gets the locations of blocks affected in this event.",
                "type": "list",
                "native": "Event Affected Blocks"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "SpongeAbsorb"
        }
    },
    "plot.startup": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "PlotStartup"
        }
    },
    "plot.tntprime": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "TNTPrime"
        }
    },
    "plot.vaultChangeState": {
        "cancellable": false,
        "fields": [
            {
                "name": "vaultState",
                "description": "Gets the state of the vault before this event.",
                "type": "text",
                "native": "Event Vault State"
            },
            {
                "name": "newVaultState",
                "description": "Gets the state of the vault after this event.",
                "type": "text",
                "native": "Event New Vault State"
            }
        ],
        "entityRoles": [],
        "mutators": {},
        "native": {
            "block": "game_event",
            "action": "VaultChangeState"
        }
    },
    "plot.vaultDisplayItem": {
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {
            "game.set_displayed_item": {
                "native": {
                    "block": "game_action",
                    "action": "SetDisplayedItem"
                },
                "inputs": [
                    {
                        "id": "item_to_display",
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
            }
        },
        "native": {
            "block": "game_event",
            "action": "VaultDisplayItem"
        }
    }
} as const;
