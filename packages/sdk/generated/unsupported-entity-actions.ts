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

export interface UnsupportedEntityActions {
    /**
     * DiamondFire entity_action/ArmorStandPose.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly armorStandPose: UnsupportedAction<
        "ArmorStandPose",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire entity_action/DispRotAxisAngle.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly dispRotAxisAngle: UnsupportedAction<
        "DispRotAxisAngle",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire entity_action/DispRotationEuler.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly dispRotationEuler: UnsupportedAction<
        "DispRotationEuler",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire entity_action/DispTranslation.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly dispTranslation: UnsupportedAction<
        "DispTranslation",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire entity_action/DisplayMatrix.
     * Unsupported: unsupported_type.
     * Unsupported input type: list
     */
    readonly displayMatrix: UnsupportedAction<
        "DisplayMatrix",
        "unsupported_type",
        "Unsupported input type: list"
    >;
    /**
     * DiamondFire entity_action/DisplayScale.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly displayScale: UnsupportedAction<
        "DisplayScale",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire entity_action/GetAllEntityTags.
     * Unsupported: unsupported_type.
     * Unsupported input type: variable
     */
    readonly getAllEntityTags: UnsupportedAction<
        "GetAllEntityTags",
        "unsupported_type",
        "Unsupported input type: variable"
    >;
    /**
     * DiamondFire entity_action/GetCustomTag.
     * Unsupported: unsupported_type.
     * Unsupported input type: variable
     */
    readonly getCustomTag: UnsupportedAction<
        "GetCustomTag",
        "unsupported_type",
        "Unsupported input type: variable"
    >;
    /**
     * DiamondFire entity_action/GivePotion.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly givePotion: UnsupportedAction<
        "GivePotion",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
    /**
     * DiamondFire entity_action/RemovePotion.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly removePotion: UnsupportedAction<
        "RemovePotion",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
    /**
     * DiamondFire entity_action/SetVelocity.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly setVelocity: UnsupportedAction<
        "SetVelocity",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
}
