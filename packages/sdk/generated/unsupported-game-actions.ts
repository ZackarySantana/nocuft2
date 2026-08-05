// This file is generated. Do not edit manually.

export interface UnsupportedAction<
    NativeName extends string,
    Reason extends string,
    Detail extends string,
> {
    readonly nativeName: NativeName;
    readonly reason: Reason;
    readonly detail: Detail;
}

export interface UnsupportedGameActions {
    /**
     * DiamondFire game_action/SpawnMob.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly spawnMob: UnsupportedAction<
        "SpawnMob",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
    /**
     * DiamondFire game_action/SpawnPotionCloud.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly spawnPotionCloud: UnsupportedAction<
        "SpawnPotionCloud",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
}
