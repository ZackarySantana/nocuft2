// This file is generated. Do not edit manually.

export const selectorBindings = {
    "select.RandomPlayer": {
        "id": "select.RandomPlayer",
        "owner": "players",
        "method": "random",
        "kind": "source",
        "resultType": "player",
        "native": {
            "action": "RandomPlayer",
            "arguments": [
                {
                    "index": 0,
                    "type": "number",
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        }
    },
    "select.PlayerName": {
        "id": "select.PlayerName",
        "owner": "players",
        "method": "named",
        "kind": "source",
        "resultType": "player",
        "native": {
            "action": "PlayerName",
            "arguments": [
                {
                    "index": 0,
                    "type": "text",
                    "cardinality": "plural",
                    "optional": false
                }
            ],
            "tags": []
        }
    },
    "select.AllPlayers": {
        "id": "select.AllPlayers",
        "owner": "players",
        "method": "all",
        "kind": "source",
        "resultType": "player",
        "native": {
            "action": "AllPlayers",
            "arguments": [],
            "tags": []
        }
    },
    "select.LastEntity": {
        "id": "select.LastEntity",
        "owner": "entities",
        "method": "lastEntity",
        "kind": "source",
        "resultType": "entity",
        "native": {
            "action": "LastEntity",
            "arguments": [],
            "tags": []
        }
    },
    "select.EntityUUID": {
        "id": "select.EntityUUID",
        "owner": "entities",
        "method": "byUuid",
        "kind": "source",
        "resultType": "entity",
        "native": {
            "action": "EntityUUID",
            "arguments": [
                {
                    "index": 0,
                    "type": "text",
                    "cardinality": "plural",
                    "optional": false
                }
            ],
            "tags": []
        }
    },
    "select.EntityName": {
        "id": "select.EntityName",
        "owner": "entities",
        "method": "named",
        "kind": "source",
        "resultType": "entity",
        "native": {
            "action": "EntityName",
            "arguments": [
                {
                    "index": 2,
                    "type": "component",
                    "cardinality": "plural",
                    "optional": false
                }
            ],
            "tags": [
                {
                    "name": "Ignore Formatting",
                    "slot": 26,
                    "defaultOption": "True",
                    "options": [
                        "True",
                        "False"
                    ]
                }
            ]
        }
    },
    "select.AllEntities": {
        "id": "select.AllEntities",
        "owner": "entities",
        "method": "all",
        "kind": "source",
        "resultType": "entity",
        "native": {
            "action": "AllEntities",
            "arguments": [],
            "tags": []
        }
    },
    "select.FilterRandom": {
        "id": "select.FilterRandom",
        "owner": "selection",
        "method": "random",
        "kind": "filter",
        "resultType": "entity",
        "native": {
            "action": "FilterRandom",
            "arguments": [
                {
                    "index": 0,
                    "type": "number",
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": []
        }
    },
    "select.FilterDistance": {
        "id": "select.FilterDistance",
        "owner": "selection",
        "method": "nearest",
        "kind": "filter",
        "resultType": "entity",
        "native": {
            "action": "FilterDistance",
            "arguments": [
                {
                    "index": 0,
                    "type": "location",
                    "cardinality": "single",
                    "optional": false
                },
                {
                    "index": 1,
                    "type": "number",
                    "cardinality": "single",
                    "optional": true
                }
            ],
            "tags": [
                {
                    "name": "Ignore Y-Axis",
                    "slot": 25,
                    "defaultOption": "False",
                    "options": [
                        "True",
                        "False"
                    ]
                },
                {
                    "name": "Compare Mode",
                    "slot": 26,
                    "defaultOption": "Nearest",
                    "options": [
                        "Nearest",
                        "Farthest"
                    ]
                }
            ]
        }
    },
    "select.EventTarget": {
        "id": "select.EventTarget",
        "owner": "event",
        "method": "eventTarget",
        "kind": "source",
        "resultType": "entity",
        "native": {
            "action": "EventTarget",
            "arguments": [],
            "tags": [
                {
                    "name": "Event Target",
                    "slot": 26,
                    "defaultOption": "Default",
                    "options": [
                        "Default",
                        "Killer",
                        "Damager",
                        "Victim",
                        "Shooter",
                        "Projectile"
                    ]
                }
            ]
        }
    }
} as const;
