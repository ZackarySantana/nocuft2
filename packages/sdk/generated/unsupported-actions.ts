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

export interface UnsupportedPlayerActions {
    /**
     * DiamondFire player_action/AddInvRow.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly addInvRow: UnsupportedAction<
        "AddInvRow",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/BlockDisguise.
     * Unsupported: unsupported_type.
     * Unsupported input type: block
     */
    readonly blockDisguise: UnsupportedAction<
        "BlockDisguise",
        "unsupported_type",
        "Unsupported input type: block"
    >;
    /**
     * DiamondFire player_action/BoostElytra.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly boostElytra: UnsupportedAction<
        "BoostElytra",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/ClearItems.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly clearItems: UnsupportedAction<
        "ClearItems",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/DisableBlocks.
     * Unsupported: unsupported_type.
     * Unsupported input type: block
     */
    readonly disableBlocks: UnsupportedAction<
        "DisableBlocks",
        "unsupported_type",
        "Unsupported input type: block"
    >;
    /**
     * DiamondFire player_action/DispHeadTexture.
     * Unsupported: unsupported_shape.
     * DispHeadTexture: or-slot 1 variants have different public argument shapes
     */
    readonly dispHeadTexture: UnsupportedAction<
        "DispHeadTexture",
        "unsupported_shape",
        "DispHeadTexture: or-slot 1 variants have different public argument shapes"
    >;
    /**
     * DiamondFire player_action/DisplayBlock.
     * Unsupported: unsupported_type.
     * Unsupported input type: block
     */
    readonly displayBlock: UnsupportedAction<
        "DisplayBlock",
        "unsupported_type",
        "Unsupported input type: block"
    >;
    /**
     * DiamondFire player_action/DisplayEquipment.
     * Unsupported: unsupported_shape.
     * DisplayEquipment: or-slot 1 variant 1 has 6 nested slots
     */
    readonly displayEquipment: UnsupportedAction<
        "DisplayEquipment",
        "unsupported_shape",
        "DisplayEquipment: or-slot 1 variant 1 has 6 nested slots"
    >;
    /**
     * DiamondFire player_action/EnableBlocks.
     * Unsupported: unsupported_type.
     * Unsupported input type: block
     */
    readonly enableBlocks: UnsupportedAction<
        "EnableBlocks",
        "unsupported_type",
        "Unsupported input type: block"
    >;
    /**
     * DiamondFire player_action/ExpandInv.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly expandInv: UnsupportedAction<
        "ExpandInv",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/GetItemCooldown.
     * Unsupported: unsupported_type.
     * Unsupported input type: variable
     */
    readonly getItemCooldown: UnsupportedAction<
        "GetItemCooldown",
        "unsupported_type",
        "Unsupported input type: variable"
    >;
    /**
     * DiamondFire player_action/GetTargetEntity.
     * Unsupported: missing_public_metadata.
     * The action has placeholder slots and no public icon argument metadata.
     */
    readonly getTargetEntity: UnsupportedAction<
        "GetTargetEntity",
        "missing_public_metadata",
        "The action has placeholder slots and no public icon argument metadata."
    >;
    /**
     * DiamondFire player_action/GiveItems.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly giveItems: UnsupportedAction<
        "GiveItems",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/GivePotion.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly givePotion: UnsupportedAction<
        "GivePotion",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
    /**
     * DiamondFire player_action/GiveRngItem.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly giveRngItem: UnsupportedAction<
        "GiveRngItem",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/LaunchProj.
     * Unsupported: unsupported_type.
     * Unsupported input type: projectile
     */
    readonly launchProj: UnsupportedAction<
        "LaunchProj",
        "unsupported_type",
        "Unsupported input type: projectile"
    >;
    /**
     * DiamondFire player_action/MobDisguise.
     * Unsupported: unsupported_type.
     * Unsupported input type: spawn_egg
     */
    readonly mobDisguise: UnsupportedAction<
        "MobDisguise",
        "unsupported_type",
        "Unsupported input type: spawn_egg"
    >;
    /**
     * DiamondFire player_action/OpenBook.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly openBook: UnsupportedAction<
        "OpenBook",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/Particle.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particle: UnsupportedAction<
        "Particle",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleCircle.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleCircle: UnsupportedAction<
        "ParticleCircle",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleCircleA.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleCircleA: UnsupportedAction<
        "ParticleCircleA",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleCuboid.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleCuboid: UnsupportedAction<
        "ParticleCuboid",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleCuboidA.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleCuboidA: UnsupportedAction<
        "ParticleCuboidA",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleEffect.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleEffect: UnsupportedAction<
        "ParticleEffect",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleLine.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleLine: UnsupportedAction<
        "ParticleLine",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleLineA.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleLineA: UnsupportedAction<
        "ParticleLineA",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleRay.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleRay: UnsupportedAction<
        "ParticleRay",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleSphere.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleSphere: UnsupportedAction<
        "ParticleSphere",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleSpiral.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleSpiral: UnsupportedAction<
        "ParticleSpiral",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/ParticleSpiralA.
     * Unsupported: unsupported_type.
     * Unsupported input type: particle
     */
    readonly particleSpiralA: UnsupportedAction<
        "ParticleSpiralA",
        "unsupported_type",
        "Unsupported input type: particle"
    >;
    /**
     * DiamondFire player_action/PlayerDisguise.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly playerDisguise: UnsupportedAction<
        "PlayerDisguise",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/RemoveItems.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly removeItems: UnsupportedAction<
        "RemoveItems",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/RemovePotion.
     * Unsupported: unsupported_type.
     * Unsupported input type: potion
     */
    readonly removePotion: UnsupportedAction<
        "RemovePotion",
        "unsupported_type",
        "Unsupported input type: potion"
    >;
    /**
     * DiamondFire player_action/ReplaceItems.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly replaceItems: UnsupportedAction<
        "ReplaceItems",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/ReplaceProj.
     * Unsupported: unsupported_type.
     * Unsupported input type: projectile
     */
    readonly replaceProj: UnsupportedAction<
        "ReplaceProj",
        "unsupported_type",
        "Unsupported input type: projectile"
    >;
    /**
     * DiamondFire player_action/SendAdvancement.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly sendAdvancement: UnsupportedAction<
        "SendAdvancement",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetArmor.
     * Unsupported: unsupported_shape.
     * SetArmor: or-slot 0 variant 1 has 4 nested slots
     */
    readonly setArmor: UnsupportedAction<
        "SetArmor",
        "unsupported_shape",
        "SetArmor: or-slot 0 variant 1 has 4 nested slots"
    >;
    /**
     * DiamondFire player_action/SetCursorItem.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setCursorItem: UnsupportedAction<
        "SetCursorItem",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetEquipment.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setEquipment: UnsupportedAction<
        "SetEquipment",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetHandItem.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setHandItem: UnsupportedAction<
        "SetHandItem",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetHotbar.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setHotbar: UnsupportedAction<
        "SetHotbar",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetInventory.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setInventory: UnsupportedAction<
        "SetInventory",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetItemCooldown.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setItemCooldown: UnsupportedAction<
        "SetItemCooldown",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetItems.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setItems: UnsupportedAction<
        "SetItems",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetMenuItem.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setMenuItem: UnsupportedAction<
        "SetMenuItem",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetSkin.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setSkin: UnsupportedAction<
        "SetSkin",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetSlotItem.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly setSlotItem: UnsupportedAction<
        "SetSlotItem",
        "unsupported_type",
        "Unsupported input type: item"
    >;
    /**
     * DiamondFire player_action/SetVelocity.
     * Unsupported: unsupported_type.
     * Unsupported input type: vector
     */
    readonly setVelocity: UnsupportedAction<
        "SetVelocity",
        "unsupported_type",
        "Unsupported input type: vector"
    >;
    /**
     * DiamondFire player_action/ShowInv.
     * Unsupported: unsupported_type.
     * Unsupported input type: item
     */
    readonly showInv: UnsupportedAction<
        "ShowInv",
        "unsupported_type",
        "Unsupported input type: item"
    >;
}
