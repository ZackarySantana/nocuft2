// This file is generated. Do not edit manually.

export const eventBindings = {
    "entity.blockFall": {
        "id": "entity.blockFall",
        "callbackParameter": "entity_event",
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
        "id": "entity.entityCombust",
        "callbackParameter": "entity_event",
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
        "id": "entity.entityDeath",
        "callbackParameter": "entity_event",
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
            "setEventSound": {
                "operation": "game.set_event_sound",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_sound",
                        "types": [
                            "sound"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            },
            "setEventXp": {
                "operation": "game.set_event_xp",
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
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDeath"
        }
    },
    "entity.entityDmg": {
        "id": "entity.entityDmg",
        "callbackParameter": "entity_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDmg"
        }
    },
    "entity.entityDmgEntity": {
        "id": "entity.entityDmgEntity",
        "callbackParameter": "entity_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "entity_event",
            "action": "EntityDmgEntity"
        }
    },
    "entity.entityExplode": {
        "id": "entity.entityExplode",
        "callbackParameter": "entity_event",
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
        "id": "entity.entityHeal",
        "callbackParameter": "entity_event",
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
        "id": "entity.entityKillEntity",
        "callbackParameter": "entity_event",
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
        "id": "entity.entityResurrect",
        "callbackParameter": "entity_event",
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
        "id": "entity.fallingBlockLand",
        "callbackParameter": "entity_event",
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
        "id": "entity.itemMerge",
        "callbackParameter": "entity_event",
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
        "id": "entity.naturallySpawn",
        "callbackParameter": "entity_event",
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
        "id": "entity.projDmgEntity",
        "callbackParameter": "entity_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "entity_event",
            "action": "ProjDmgEntity"
        }
    },
    "entity.projKillEntity": {
        "id": "entity.projKillEntity",
        "callbackParameter": "entity_event",
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
        "id": "entity.regrowWool",
        "callbackParameter": "entity_event",
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
        "id": "entity.shootBow",
        "callbackParameter": "entity_event",
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
        "id": "entity.teleport",
        "callbackParameter": "entity_event",
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
        "id": "entity.transform",
        "callbackParameter": "entity_event",
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
        "id": "entity.vehicleDamage",
        "callbackParameter": "entity_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "entity_event",
            "action": "VehicleDamage"
        }
    },
    "player.breakBlock": {
        "id": "player.breakBlock",
        "callbackParameter": "player_event",
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
        "id": "player.breakItem",
        "callbackParameter": "player_event",
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
        "id": "player.changeSign",
        "callbackParameter": "player_event",
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
        "id": "player.changeSlot",
        "callbackParameter": "player_event",
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
        "id": "player.chat",
        "callbackParameter": "player_event",
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
        "id": "player.clickContainerSlot",
        "callbackParameter": "player_event",
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
        "id": "player.clickEntity",
        "callbackParameter": "player_event",
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
        "id": "player.clickInvSlot",
        "callbackParameter": "player_event",
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
        "id": "player.clickMenuSlot",
        "callbackParameter": "player_event",
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
        "id": "player.clickPlayer",
        "callbackParameter": "player_event",
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
        "id": "player.closeInv",
        "callbackParameter": "player_event",
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
        "id": "player.cloudImbuePlayer",
        "callbackParameter": "player_event",
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
        "id": "player.command",
        "callbackParameter": "player_event",
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
        "id": "player.consume",
        "callbackParameter": "player_event",
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
        "id": "player.damageEntity",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "DamageEntity"
        }
    },
    "player.death": {
        "id": "player.death",
        "callbackParameter": "player_event",
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
            "setEventDeathMsg": {
                "operation": "game.set_event_death_msg",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_death_message",
                        "types": [
                            "component"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "Death"
        }
    },
    "player.dismount": {
        "id": "player.dismount",
        "callbackParameter": "player_event",
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
        "id": "player.dropItem",
        "callbackParameter": "player_event",
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
        "id": "player.entityDmgPlayer",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "EntityDmgPlayer"
        }
    },
    "player.exhaustion": {
        "id": "player.exhaustion",
        "callbackParameter": "player_event",
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
            "setExhaustion": {
                "operation": "game.set_exhaustion",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_exhaustion_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "Exhaustion"
        }
    },
    "player.fallDamage": {
        "id": "player.fallDamage",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "FallDamage"
        }
    },
    "player.fish": {
        "id": "player.fish",
        "callbackParameter": "player_event",
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
            "setEventXp": {
                "operation": "game.set_event_xp",
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
            }
        },
        "native": {
            "block": "event",
            "action": "Fish"
        }
    },
    "player.horseJump": {
        "id": "player.horseJump",
        "callbackParameter": "player_event",
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
        "id": "player.join",
        "callbackParameter": "player_event",
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
        "id": "player.jump",
        "callbackParameter": "player_event",
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
        "id": "player.killMob",
        "callbackParameter": "player_event",
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
        "id": "player.killPlayer",
        "callbackParameter": "player_event",
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
            "setEventDeathMsg": {
                "operation": "game.set_event_death_msg",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_death_message",
                        "types": [
                            "component"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "KillPlayer"
        }
    },
    "player.leave": {
        "id": "player.leave",
        "callbackParameter": "player_event",
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
        "id": "player.leftClick",
        "callbackParameter": "player_event",
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
        "id": "player.leftClickEntity",
        "callbackParameter": "player_event",
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
        "id": "player.leftClickPlayer",
        "callbackParameter": "player_event",
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
        "id": "player.loadCrossbow",
        "callbackParameter": "player_event",
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
        "id": "player.loopEvent",
        "callbackParameter": "player_event",
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
        "id": "player.mobKillPlayer",
        "callbackParameter": "player_event",
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
            "setEventDeathMsg": {
                "operation": "game.set_event_death_msg",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_death_message",
                        "types": [
                            "component"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "MobKillPlayer"
        }
    },
    "player.move": {
        "id": "player.move",
        "callbackParameter": "player_event",
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
        "id": "player.movementKey",
        "callbackParameter": "player_event",
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
        "id": "player.packDecline",
        "callbackParameter": "player_event",
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
        "id": "player.packLoad",
        "callbackParameter": "player_event",
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
        "id": "player.pickBlock",
        "callbackParameter": "player_event",
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
        "id": "player.pickEntity",
        "callbackParameter": "player_event",
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
        "id": "player.pickUpItem",
        "callbackParameter": "player_event",
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
        "id": "player.placeBlock",
        "callbackParameter": "player_event",
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
        "id": "player.playerCombust",
        "callbackParameter": "player_event",
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
        "id": "player.playerDmgPlayer",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerDmgPlayer"
        }
    },
    "player.playerHeal": {
        "id": "player.playerHeal",
        "callbackParameter": "player_event",
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
            "setEventHeal": {
                "operation": "game.set_event_heal",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_healing_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerHeal"
        }
    },
    "player.playerResurrect": {
        "id": "player.playerResurrect",
        "callbackParameter": "player_event",
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
        "id": "player.playerTakeDmg",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "PlayerTakeDmg"
        }
    },
    "player.projDmgPlayer": {
        "id": "player.projDmgPlayer",
        "callbackParameter": "player_event",
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
            "setEventDamage": {
                "operation": "game.set_event_damage",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_damage_amount",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "ProjDmgPlayer"
        }
    },
    "player.projHit": {
        "id": "player.projHit",
        "callbackParameter": "player_event",
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
        "id": "player.purchase",
        "callbackParameter": "player_event",
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
        "id": "player.respawn",
        "callbackParameter": "player_event",
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
        "id": "player.rightClick",
        "callbackParameter": "player_event",
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
        "id": "player.riptide",
        "callbackParameter": "player_event",
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
        "id": "player.shootBow",
        "callbackParameter": "player_event",
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
            "setEventProj": {
                "operation": "game.set_event_proj",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "projectile_to_launch",
                        "types": [
                            "item"
                        ],
                        "kind": "value",
                        "optional": true,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "event",
            "action": "ShootBow"
        }
    },
    "player.shootProjectile": {
        "id": "player.shootProjectile",
        "callbackParameter": "player_event",
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
        "id": "player.sneak",
        "callbackParameter": "player_event",
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
        "id": "player.startBreaking",
        "callbackParameter": "player_event",
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
        "id": "player.startFly",
        "callbackParameter": "player_event",
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
        "id": "player.startGlide",
        "callbackParameter": "player_event",
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
        "id": "player.startSprint",
        "callbackParameter": "player_event",
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
        "id": "player.stopBreaking",
        "callbackParameter": "player_event",
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
        "id": "player.stopFly",
        "callbackParameter": "player_event",
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
        "id": "player.stopGlide",
        "callbackParameter": "player_event",
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
        "id": "player.stopSprint",
        "callbackParameter": "player_event",
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
        "id": "player.swapHands",
        "callbackParameter": "player_event",
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
        "id": "player.tameEntity",
        "callbackParameter": "player_event",
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
        "id": "player.teleport",
        "callbackParameter": "player_event",
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
        "id": "player.unsneak",
        "callbackParameter": "player_event",
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
        "id": "player.vehicleJump",
        "callbackParameter": "player_event",
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
        "id": "player.villagerTrade",
        "callbackParameter": "player_event",
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
        "id": "player.walk",
        "callbackParameter": "player_event",
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
        "id": "plot.beaconActivated",
        "callbackParameter": "none",
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
        "id": "plot.bellRing",
        "callbackParameter": "none",
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
        "id": "plot.blockBurn",
        "callbackParameter": "none",
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
        "id": "plot.blockCook",
        "callbackParameter": "none",
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
        "id": "plot.blockDispense",
        "callbackParameter": "none",
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
        "id": "plot.blockExplode",
        "callbackParameter": "none",
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
        "id": "plot.blockFade",
        "callbackParameter": "none",
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
        "id": "plot.blockFertilize",
        "callbackParameter": "none",
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
        "id": "plot.blockForm",
        "callbackParameter": "none",
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
        "id": "plot.blockGrow",
        "callbackParameter": "none",
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
        "id": "plot.blockIgnite",
        "callbackParameter": "none",
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
        "id": "plot.blockMove",
        "callbackParameter": "none",
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
        "id": "plot.blockSpread",
        "callbackParameter": "none",
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
        "id": "plot.brew",
        "callbackParameter": "none",
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
        "id": "plot.campfireStart",
        "callbackParameter": "none",
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
        "id": "plot.cauldronChange",
        "callbackParameter": "none",
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
        "id": "plot.chunkLoad",
        "callbackParameter": "none",
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
        "id": "plot.chunkUnload",
        "callbackParameter": "none",
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
        "id": "plot.crafterCraft",
        "callbackParameter": "none",
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
        "id": "plot.fluidLevelChange",
        "callbackParameter": "none",
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
        "id": "plot.furnaceBurn",
        "callbackParameter": "none",
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
        "id": "plot.lagSlayRecover",
        "callbackParameter": "none",
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
        "id": "plot.leavesDecay",
        "callbackParameter": "none",
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
        "id": "plot.moistureChange",
        "callbackParameter": "none",
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
        "id": "plot.notePlay",
        "callbackParameter": "none",
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
        "id": "plot.pistonExtend",
        "callbackParameter": "none",
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
        "id": "plot.pistonRetract",
        "callbackParameter": "none",
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
        "id": "plot.redstone",
        "callbackParameter": "none",
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
            "redstoneStrength": {
                "operation": "game.redstone_strength",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "new_current_strength",
                        "types": [
                            "number"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "game_event",
            "action": "Redstone"
        }
    },
    "plot.sculkBloom": {
        "id": "plot.sculkBloom",
        "callbackParameter": "none",
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
        "id": "plot.shutdown",
        "callbackParameter": "none",
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
        "id": "plot.spongeAbsorb",
        "callbackParameter": "none",
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
        "id": "plot.startup",
        "callbackParameter": "none",
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
        "id": "plot.tntprime",
        "callbackParameter": "none",
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
        "id": "plot.vaultChangeState",
        "callbackParameter": "none",
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
        "id": "plot.vaultDisplayItem",
        "callbackParameter": "none",
        "cancellable": false,
        "fields": [],
        "entityRoles": [],
        "mutators": {
            "setDisplayedItem": {
                "operation": "game.set_displayed_item",
                "parameters": [
                    {
                        "sourceIndex": 0,
                        "input": "item_to_display",
                        "types": [
                            "item"
                        ],
                        "kind": "value",
                        "optional": false,
                        "minimumLength": 1
                    }
                ]
            }
        },
        "native": {
            "block": "game_event",
            "action": "VaultDisplayItem"
        }
    }
} as const;
