// This file is generated. Do not edit manually.

import type { ComponentInput, Item, Location, SoundInput } from "../values/index";

/** Options for armorStandParts. */
export interface ArmorStandPartsOptions {
    /** Default: "enable" */
    readonly arms?: "enable" | "disable" | "dontChange";
    /** Default: "enable" */
    readonly basePlate?: "enable" | "disable" | "dontChange";
}

/** Options for armorStandSlots. */
export interface ArmorStandSlotsOptions {
    /** Default: "takeSwapOrPlaceItem" */
    readonly interactions?: "takeSwapOrPlaceItem" | "takeOrSwapItem" | "takeItem" | "placeItem" | "none";
    /** Default: "all" */
    readonly equipmentSlot?: "all" | "mainHand" | "offHand" | "head" | "chest" | "legs" | "feet";
}

/** Options for attachLead. */
export interface AttachLeadOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for attackAnimation. */
export interface AttackAnimationOptions {
    /** Default: "swingMainArm" */
    readonly animationArm?: "swingMainArm" | "swingOffArm";
}

/** Options for combatAttribute. */
export interface CombatAttributeOptions {
    /** Default: "attackDamage" */
    readonly attribute?: "attackDamage" | "attackKnockback";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for creeperCharged. */
export interface CreeperChargedOptions {
    /** Default: "enable" */
    readonly charged?: "enable" | "disable";
}

/** Options for damage. */
export interface DamageOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for displayBillboard. */
export interface DisplayBillboardOptions {
    /** Default: "fixed" */
    readonly billboardType?: "fixed" | "vertical" | "horizontal" | "center";
}

/** Options for faceLocation. */
export interface FaceLocationOptions {
    /** Default: "towardLocation" */
    readonly faceDirection?: "towardLocation" | "awayFromLocation";
}

/** Options for fallingAttribute. */
export interface FallingAttributeOptions {
    /** Default: "gravity" */
    readonly attribute?: "gravity" | "safeFallDistance" | "fallDamageMultiplier";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for foxSleeping. */
export interface FoxSleepingOptions {
    /** Default: "enable" */
    readonly sleeping?: "enable" | "disable";
}

/** Options for frogEat. */
export interface FrogEatOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for healthAttribute. */
export interface HealthAttributeOptions {
    /** Default: "maximumHealth" */
    readonly attribute?: "maximumHealth" | "maximumAbsorptionHealth" | "armor" | "armorToughness";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for idisplayModelType. */
export interface IdisplayModelTypeOptions {
    /** Default: "none" */
    readonly modelType?: "none" | "firstPersonLeftHand" | "firstPersonRightHand" | "thirdPersonLeftHand" | "thirdPersonRightHand" | "head" | "gui" | "ground" | "fixed";
}

/** Options for interactResponse. */
export interface InteractResponseOptions {
    /** Default: "enable" */
    readonly responsive?: "enable" | "disable";
}

/** Options for kbattribute. */
export interface KbattributeOptions {
    /** Default: "knockbackResistance" */
    readonly attribute?: "knockbackResistance" | "explosionKnockbackResistance";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for launchFwd. */
export interface LaunchFwdOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
    /** Default: "pitchAndYaw" */
    readonly launchAxis?: "pitchAndYaw" | "yawOnly";
}

/** Options for launchToward. */
export interface LaunchTowardOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
    /** Default: false */
    readonly ignoreDistance?: boolean;
}

/** Options for launchUp. */
export interface LaunchUpOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
}

/** Options for lockDisgRotation. */
export interface LockDisgRotationOptions {
    /** Default: "noChange" */
    readonly pitch?: "lock" | "unlock" | "noChange";
    /** Default: "noChange" */
    readonly yaw?: "lock" | "unlock" | "noChange";
}

/** Options for mannequinHand. */
export interface MannequinHandOptions {
    /** Default: "leftHand" */
    readonly mainHand?: "leftHand" | "rightHand";
}

/** Options for mannequinLayers. */
export interface MannequinLayersOptions {
    /** Default: "visible" */
    readonly capeLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly jacketLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly leftSleeveLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly rightSleeveLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly leftPantsLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly rightPantsLayer?: "visible" | "hidden";
    /** Default: "visible" */
    readonly hatLayer?: "visible" | "hidden";
}

/** Options for mannequinMovable. */
export interface MannequinMovableOptions {
    /** Default: "enable" */
    readonly movable?: "enable" | "disable";
}

/** Options for mimic. */
export interface MimicOptions {
    /** Default: "enable" */
    readonly removeOriginalEntity?: "enable" | "disable";
}

/** Options for miscAttribute. */
export interface MiscAttributeOptions {
    /** Default: "scale" */
    readonly attribute?: "scale" | "followRange" | "zombieSpawnReinforcements" | "oxygenBonus" | "burningTime" | "cameraDistance" | "temptRange";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for mooshroomType. */
export interface MooshroomTypeOptions {
    /** Default: "red" */
    readonly mooshroomVariant?: "red" | "brown";
}

/** Options for movementAttribute. */
export interface MovementAttributeOptions {
    /** Default: "walkingSpeed" */
    readonly attribute?: "walkingSpeed" | "flyingSpeed" | "jumpStrength" | "stepHeight" | "movementEfficiency" | "waterMovementEfficiency";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for ram. */
export interface RamOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for rideEntity. */
export interface RideEntityOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for sendAnimation. */
export interface SendAnimationOptions {
    /** Default: "hurtAnimation" */
    readonly animationType?: "hurtAnimation" | "critParticles" | "enchantedHitParticles";
}

/** Options for setAge. */
export interface SetAgeOptions {
    /** Default: "dontChange" */
    readonly ageLock?: "enable" | "disable" | "dontChange";
}

/** Options for setAi. */
export interface SetAiOptions {
    /** Default: "none" */
    readonly ai?: "sentient" | "insentient" | "none";
}

/** Options for setAllayDancing. */
export interface SetAllayDancingOptions {
    /** Default: "enable" */
    readonly dancing?: "enable" | "disable";
}

/** Options for setAngry. */
export interface SetAngryOptions {
    /** Default: "enable" */
    readonly angry?: "enable" | "disable";
}

/** Options for setArmsRaised. */
export interface SetArmsRaisedOptions {
    /** Default: "enable" */
    readonly armsRaised?: "enable" | "disable";
}

/** Options for setArrowNoClip. */
export interface SetArrowNoClipOptions {
    /** Default: "enable" */
    readonly hasNoClip?: "enable" | "disable";
}

/** Options for setAxolotlColor. */
export interface SetAxolotlColorOptions {
    /** Default: "pink" */
    readonly axolotlColor?: "pink" | "brown" | "yellow" | "cyan" | "blue";
}

/** Options for setBaby. */
export interface SetBabyOptions {
    /** Default: "enable" */
    readonly baby?: "enable" | "disable";
}

/** Options for setBeeNectar. */
export interface SetBeeNectarOptions {
    /** Default: "enable" */
    readonly hasNectar?: "enable" | "disable";
}

/** Options for setBeeStinger. */
export interface SetBeeStingerOptions {
    /** Default: "enable" */
    readonly hasStinger?: "enable" | "disable";
}

/** Options for setBulletTarget. */
export interface SetBulletTargetOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for setCarryingChest. */
export interface SetCarryingChestOptions {
    /** Default: "enable" */
    readonly carryingChest?: "enable" | "disable";
}

/** Options for setCatResting. */
export interface SetCatRestingOptions {
    /** Default: "enable" */
    readonly resting?: "enable" | "disable";
}

/** Options for setCatType. */
export interface SetCatTypeOptions {
    /** Default: "tabby" */
    readonly skinType?: "tabby" | "tuxedo" | "red" | "siamese" | "britishShorthair" | "calico" | "persian" | "ragdoll" | "white" | "jellie" | "black";
}

/** Options for setCelebrating. */
export interface SetCelebratingOptions {
    /** Default: "enable" */
    readonly celebrate?: "enable" | "disable";
}

/** Options for setCollidable. */
export interface SetCollidableOptions {
    /** Default: "disable" */
    readonly collision?: "enable" | "disable";
}

/** Options for setDeathDrops. */
export interface SetDeathDropsOptions {
    /** Default: "enable" */
    readonly hasDeathDrops?: "enable" | "disable";
}

/** Options for setDigging. */
export interface SetDiggingOptions {
    /** Default: "emerge" */
    readonly diggingType?: "emerge" | "digDown";
}

/** Options for setDragonPhase. */
export interface SetDragonPhaseOptions {
    /** Default: "flying" */
    readonly phase?: "flying" | "hovering" | "breathAttack" | "dying";
}

/** Options for setDyeColor. */
export interface SetDyeColorOptions {
    /** Default: "white" */
    readonly dye?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black";
}

/** Options for setEquipment. */
export interface SetEquipmentOptions {
    /** Default: "mainHand" */
    readonly equipmentSlot?: "mainHand" | "offHand" | "head" | "body" | "legs" | "feet" | "saddle" | "horseArmor" | "decor" | "harness";
}

/** Options for setFishPattern. */
export interface SetFishPatternOptions {
    /** Default: "white" */
    readonly patternColor?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black" | "dontChange";
    /** Default: "white" */
    readonly bodyColor?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black" | "dontChange";
    /** Default: "kob" */
    readonly pattern?: "kob" | "sunstreak" | "snooper" | "dasher" | "brinely" | "spotty" | "flopper" | "stripey" | "glitter" | "blockfish" | "betty" | "clayfish" | "dontChange";
}

/** Options for setFoxLeaping. */
export interface SetFoxLeapingOptions {
    /** Default: "enable" */
    readonly leaping?: "enable" | "disable";
}

/** Options for setFoxType. */
export interface SetFoxTypeOptions {
    /** Default: "red" */
    readonly foxType?: "red" | "snow";
}

/** Options for setFreezeTicks. */
export interface SetFreezeTicksOptions {
    /** Default: "disable" */
    readonly tickingLocked?: "enable" | "disable";
}

/** Options for setFriction. */
export interface SetFrictionOptions {
    /** Default: "noFriction" */
    readonly frictionType?: "normal" | "noFriction";
}

/** Options for setGliding. */
export interface SetGlidingOptions {
    /** Default: "enable" */
    readonly gliding?: "enable" | "disable";
}

/** Options for setGlowing. */
export interface SetGlowingOptions {
    /** Default: "enable" */
    readonly glowing?: "enable" | "disable";
}

/** Options for setGoatHorns. */
export interface SetGoatHornsOptions {
    /** Default: "noChange" */
    readonly leftHorn?: "show" | "hide" | "noChange";
    /** Default: "noChange" */
    readonly rightHorn?: "show" | "hide" | "noChange";
}

/** Options for setGoatScreaming. */
export interface SetGoatScreamingOptions {
    /** Default: "enable" */
    readonly screams?: "enable" | "disable";
}

/** Options for setGravity. */
export interface SetGravityOptions {
    /** Default: "disable" */
    readonly gravity?: "enable" | "disable";
}

/** Options for setHorsePattern. */
export interface SetHorsePatternOptions {
    /** Default: "flaxenChestnut" */
    readonly horseColor?: "white" | "buckskin" | "flaxenChestnut" | "bay" | "black" | "dappleGray" | "darkBay" | "dontChange";
    /** Default: "stockingsAndBlaze" */
    readonly horseMarkings?: "noMarkings" | "stockingsAndBlaze" | "paint" | "snowflakeAppaloosa" | "sooty" | "dontChange";
}

/** Options for setInvisible. */
export interface SetInvisibleOptions {
    /** Default: "enable" */
    readonly invisible?: "enable" | "disable";
}

/** Options for setInvulnerable. */
export interface SetInvulnerableOptions {
    /** Default: "enable" */
    readonly invulnerable?: "enable" | "disable";
}

/** Options for setLlamaColor. */
export interface SetLlamaColorOptions {
    /** Default: "brown" */
    readonly llamaColor?: "brown" | "creamy" | "white" | "gray";
}

/** Options for setMarker. */
export interface SetMarkerOptions {
    /** Default: "enable" */
    readonly marker?: "enable" | "disable";
}

/** Options for setMaxHealth. */
export interface SetMaxHealthOptions {
    /** Default: false */
    readonly healMobToMaxHealth?: boolean;
}

/** Options for setMobSitting. */
export interface SetMobSittingOptions {
    /** Default: "enable" */
    readonly isSitting?: "enable" | "disable";
}

/** Options for setName. */
export interface SetNameOptions {
    /** Default: "always" */
    readonly nameTagVisibility?: "always" | "default" | "never" | "dontChange";
}

/** Options for setNameColor. */
export interface SetNameColorOptions {
    /** Default: "black" */
    readonly nameColor?: "black" | "darkBlue" | "darkGreen" | "darkAqua" | "darkRed" | "darkPurple" | "gold" | "gray" | "darkGray" | "blue" | "green" | "aqua" | "red" | "lightPurple" | "yellow" | "white" | "none";
}

/** Options for setNameVisible. */
export interface SetNameVisibleOptions {
    /** Default: "always" */
    readonly nameTagVisibility?: "always" | "default" | "never";
}

/** Options for setOxidization. */
export interface SetOxidizationOptions {
    /** Default: "unaffected" */
    readonly oxidization?: "unaffected" | "exposed" | "weathered" | "oxidized";
}

/** Options for setPandaGene. */
export interface SetPandaGeneOptions {
    /** Default: "both" */
    readonly setGene?: "mainGene" | "hiddenGene" | "both";
    /** Default: "aggressive" */
    readonly geneType?: "aggressive" | "lazy" | "weak" | "worried" | "playful" | "normal" | "brown";
}

/** Options for setPandaOnBack. */
export interface SetPandaOnBackOptions {
    /** Default: "enable" */
    readonly onItsBack?: "enable" | "disable";
}

/** Options for setPandaRolling. */
export interface SetPandaRollingOptions {
    /** Default: "roll" */
    readonly rollType?: "roll" | "stopRolling";
}

/** Options for setParrotColor. */
export interface SetParrotColorOptions {
    /** Default: "red" */
    readonly parrotColor?: "red" | "blue" | "green" | "cyan" | "gray";
}

/** Options for setPersistent. */
export interface SetPersistentOptions {
    /** Default: "enable" */
    readonly persistent?: "enable" | "disable";
}

/** Options for setPose. */
export interface SetPoseOptions {
    /** Default: "standing" */
    readonly pose?: "standing" | "sleeping" | "swimming" | "sneaking";
}

/** Options for setProfession. */
export interface SetProfessionOptions {
    /** Default: false */
    readonly retainTrades?: boolean;
    /** Default: "armorer" */
    readonly profession?: "unemployed" | "armorer" | "butcher" | "cartographer" | "cleric" | "farmer" | "fisherman" | "fletcher" | "leatherworker" | "librarian" | "mason" | "nitwit" | "shepherd" | "toolsmith" | "weaponsmith";
}

/** Options for setProjSource. */
export interface SetProjSourceOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for setRabbitType. */
export interface SetRabbitTypeOptions {
    /** Default: "brown" */
    readonly skinType?: "brown" | "white" | "black" | "blackAndWhite" | "gold" | "saltAndPepper" | "killer";
}

/** Options for setRearing. */
export interface SetRearingOptions {
    /** Default: "enable" */
    readonly rearing?: "enable" | "disable";
}

/** Options for setRiptiding. */
export interface SetRiptidingOptions {
    /** Default: "enable" */
    readonly riptiding?: "enable" | "disable";
}

/** Options for setSaddle. */
export interface SetSaddleOptions {
    /** Default: "enable" */
    readonly saddle?: "enable" | "disable";
}

/** Options for setSalmonType. */
export interface SetSalmonTypeOptions {
    /** Default: "medium" */
    readonly salmonType?: "small" | "medium" | "large";
}

/** Options for setSheepSheared. */
export interface SetSheepShearedOptions {
    /** Default: "enable" */
    readonly sheared?: "enable" | "disable";
}

/** Options for setShulkerPeek. */
export interface SetShulkerPeekOptions {
    /** Default: "enable" */
    readonly isSilent?: "enable" | "disable";
}

/** Options for setSilenced. */
export interface SetSilencedOptions {
    /** Default: "enable" */
    readonly silenced?: "enable" | "disable";
}

/** Options for setTarget. */
export interface SetTargetOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for setTemperature. */
export interface SetTemperatureOptions {
    /** Default: "temperate" */
    readonly temperatureType?: "cold" | "temperate" | "warm";
}

/** Options for setVexCharging. */
export interface SetVexChargingOptions {
    /** Default: "enable" */
    readonly charging?: "enable" | "disable";
}

/** Options for setVillagerBiome. */
export interface SetVillagerBiomeOptions {
    /** Default: "desert" */
    readonly biome?: "desert" | "jungle" | "plains" | "savanna" | "snow" | "swamp" | "taiga";
}

/** Options for setVisualFire. */
export interface SetVisualFireOptions {
    /** Default: true */
    readonly onFire?: boolean;
}

/** Options for setWardenAnger. */
export interface SetWardenAngerOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for setWaxed. */
export interface SetWaxedOptions {
    /** Default: true */
    readonly waxed?: boolean;
}

/** Options for setWolfSoundType. */
export interface SetWolfSoundTypeOptions {
    /** Default: "angry" */
    readonly wolfSoundType?: "angry" | "big" | "classic" | "cute" | "grumpy" | "puglin" | "sad";
}

/** Options for setWolfType. */
export interface SetWolfTypeOptions {
    /** Default: "ashen" */
    readonly wolfType?: "ashen" | "black" | "chestnut" | "pale" | "rusty" | "snowy" | "spotted" | "striped" | "woods";
}

/** Options for snifferState. */
export interface SnifferStateOptions {
    /** Default: "idle" */
    readonly behavior?: "idle" | "feelingHappy" | "scenting" | "sniffing" | "searching" | "digging";
}

/** Options for snowmanPumpkin. */
export interface SnowmanPumpkinOptions {
    /** Default: "disable" */
    readonly pumpkin?: "enable" | "disable";
}

/** Options for tdisplayAlign. */
export interface TdisplayAlignOptions {
    /** Default: "center" */
    readonly textAlignment?: "center" | "left" | "right";
}

/** Options for tdisplaySeeThru. */
export interface TdisplaySeeThruOptions {
    /** Default: "enable" */
    readonly seeThrough?: "enable" | "disable";
}

/** Options for tdisplayShadow. */
export interface TdisplayShadowOptions {
    /** Default: "enable" */
    readonly textShadow?: "enable" | "disable";
}

/** Options for tdisplayText. */
export interface TdisplayTextOptions {
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

/** Options for teleport. */
export interface TeleportOptions {
    /** Default: false */
    readonly keepCurrentRotation?: boolean;
}

/** Options for useItem. */
export interface UseItemOptions {
    /** Default: "mainHand" */
    readonly hand?: "mainHand" | "offHand";
    /** Default: "enable" */
    readonly useItem?: "enable" | "disable";
}

export interface EntityActions {
    /** Adds a trade to a villager. */
    addVillagerTrade(resultItem: Item, firstIngredient: Item, secondIngredient?: Item, maximumUses?: number): void;

    /** Sets whether an armor stand has arms and a base plate. */
    armorStandParts(): void;

    /** Sets whether an armor stand has arms and a base plate. */
    armorStandPartsWith(options: ArmorStandPartsOptions): void;

    /** Sets the possible interactions, such as adding or removing items, of an armor stand's slot(s). */
    armorStandSlots(): void;

    /** Sets the possible interactions, such as adding or removing items, of an armor stand's slot(s). */
    armorStandSlotsWith(options: ArmorStandSlotsOptions): void;

    /** Attaches a lead to the target, held by an entity or lead knot. */
    attachLead(leadHolderUuid: Location | string): void;

    /** Attaches a lead to the target, held by an entity or lead knot. */
    attachLeadWith(options: AttachLeadOptions, leadHolderUuid: Location | string): void;

    /** Makes a mob perform an attack animation. */
    attackAnimation(): void;

    /** Makes a mob perform an attack animation. */
    attackAnimationWith(options: AttackAnimationOptions): void;

    /** Sets the displayed block of a block display. */
    bdisplayBlock(displayedBlock: Item, ...blockData: string[]): void;

    /** Disguises an entity as a block. */
    blockDisguise(blockToDisguiseAs: Item, displayName?: ComponentInput): void;

    /** Removes all active potion effects from an entity. */
    clearPotions(): void;

    /** Removes all trades from a villager. */
    clrVillagerTrades(): void;

    /** Sets one of the entity's combat-related attributes such as attack damage and attack speed. */
    combatAttribute(value?: number): void;

    /** Sets one of the entity's combat-related attributes such as attack damage and attack speed. */
    combatAttributeWith(options: CombatAttributeOptions, value?: number): void;

    /** Sets whether a creeper has the charged effect. */
    creeperCharged(): void;

    /** Sets whether a creeper has the charged effect. */
    creeperChargedWith(options: CreeperChargedOptions): void;

    /** Damages a mob. */
    damage(damageToInflict: number, uuidOfDamagerEntity?: string): void;

    /** Damages a mob. */
    damageWith(options: DamageOptions, damageToInflict: number, uuidOfDamagerEntity?: string): void;

    /** Shifts the disguise of an entity up or down relative to the entity itself. */
    disguiseShiftVert(yOffset: number): void;

    /** Sets the interpolation properties of a display entity. */
    dispInterpolation(interpolationDurationInTicks?: number, interpolationDelayInTicks?: number): void;

    /** Sets how long a display entity takes to visually move to its destination when it teleports. */
    dispTpduration(teleportDurationInTicks?: number): void;

    /** Sets how a display entity is rotated with a player's view. */
    displayBillboard(): void;

    /** Sets how a display entity is rotated with a player's view. */
    displayBillboardWith(options: DisplayBillboardOptions): void;

    /** Sets the brightness of a display entity. */
    displayBrightness(blockLightLevel_0_15?: number, skyLightLevel_0_15?: number): void;

    /** Sets the culling width and height of a display entity. */
    displayCullingSize(width?: number, height?: number): void;

    /** Sets the glowing color of a display entity. */
    displayGlowColor(colorHexadecimal?: string): void;

    /** Sets the shadow properties of a display entity. */
    displayShadow(shadowRadiusInBlocks?: number, shadowOpacityInPercentage?: number): void;

    /** Sets the view range of a display entity. */
    displayViewRange(viewRangeInBlocks?: number): void;

    /** Sets the location an end crystal points its beam at. */
    endCrystalBeam(target?: Location): void;

    /** Causes an entity to explode. */
    explode(): void;

    /** Rotates an entity to look toward a location without teleporting them. */
    faceLocation(locationToFace: Location): void;

    /** Rotates an entity to look toward a location without teleporting them. */
    faceLocationWith(options: FaceLocationOptions, locationToFace: Location): void;

    /** Sets one of the entity's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttribute(value?: number): void;

    /** Sets one of the entity's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttributeWith(options: FallingAttributeOptions, value?: number): void;

    /** Causes a fox to start or stop sleeping. */
    foxSleeping(): void;

    /** Causes a fox to start or stop sleeping. */
    foxSleepingWith(options: FoxSleepingOptions): void;

    /** Makes a frog try to eat the specified mob or player. */
    frogEat(targetUuid: string): void;

    /** Makes a frog try to eat the specified mob or player. */
    frogEatWith(options: FrogEatOptions, targetUuid: string): void;

    /** Restores a mob's health. */
    heal(amountToHeal?: number): void;

    /** Sets one of the entity's health-related attributes such as max health and armor defense points. */
    healthAttribute(value?: number): void;

    /** Sets one of the entity's health-related attributes such as max health and armor defense points. */
    healthAttributeWith(options: HealthAttributeOptions, value?: number): void;

    /** Sets the displayed item of an item display. */
    idisplayItem(displayedItem: Item): void;

    /** Sets the model type of an item display. */
    idisplayModelType(): void;

    /** Sets the model type of an item display. */
    idisplayModelTypeWith(options: IdisplayModelTypeOptions): void;

    /** Ignites a creeper, causing it to explode after a fuse period. */
    igniteCreeper(): void;

    /** Sets whether an interaction entity has response when interacting with it. */
    interactResponse(): void;

    /** Sets whether an interaction entity has response when interacting with it. */
    interactResponseWith(options: InteractResponseOptions): void;

    /** Sets the hitbox size of an interaction entity. */
    interactionSize(width?: number, height?: number): void;

    /** Causes a mob to jump. */
    jump(): void;

    /** Sets one of the entity's knockback-related attributes such as knockback resistance. */
    kbattribute(value?: number): void;

    /** Sets one of the entity's knockback-related attributes such as knockback resistance. */
    kbattributeWith(options: KbattributeOptions, value?: number): void;

    /** Launches an entity forward or backward. */
    launchFwd(launchPower: number): void;

    /** Launches an entity forward or backward. */
    launchFwdWith(options: LaunchFwdOptions, launchPower: number): void;

    /** Launches a projectile from a mob. */
    launchProj(projectileToLaunch: Item, launchPoint?: Location, projectileName?: ComponentInput, speed?: number, inaccuracy?: number): void;

    /** Launches an entity toward or away from a location. */
    launchToward(launchDestination: Location, launchPower?: number): void;

    /** Launches an entity toward or away from a location. */
    launchTowardWith(options: LaunchTowardOptions, launchDestination: Location, launchPower?: number): void;

    /** Launches an entity up or down. */
    launchUp(launchPower: number): void;

    /** Launches an entity up or down. */
    launchUpWith(options: LaunchUpOptions, launchPower: number): void;

    /** Locks a disguise's pitch or yaw values. */
    lockDisgRotation(pitchToLockTo?: number, yawToLockTo?: number): void;

    /** Locks a disguise's pitch or yaw values. */
    lockDisgRotationWith(options: LockDisgRotationOptions, pitchToLockTo?: number, yawToLockTo?: number): void;

    /** Sets a mannequin's description. */
    mannequinDesc(description?: ComponentInput): void;

    /** Sets a mannequin's main hand. */
    mannequinHand(): void;

    /** Sets a mannequin's main hand. */
    mannequinHandWith(options: MannequinHandOptions): void;

    /** Sets a mannequin's skin layers. */
    mannequinLayers(): void;

    /** Sets a mannequin's skin layers. */
    mannequinLayersWith(options: MannequinLayersOptions): void;

    /** Sets whether a mannequin is movable. */
    mannequinMovable(): void;

    /** Sets whether a mannequin is movable. */
    mannequinMovableWith(options: MannequinMovableOptions): void;

    /** Sets a mannequin's skin avatar. */
    mannequinSkin(mannequinPlayerHead: Item | string): void;

    /** Disguises an entity as another currently existing entity or player. */
    mimic(...uuidOfTargetToDisguiseAs: [string, ...string[]]): void;

    /** Disguises an entity as another currently existing entity or player. */
    mimicWith(options: MimicOptions, ...uuidOfTargetToDisguiseAs: [string, ...string[]]): void;

    /** Sets one of the entity's miscellaneous attributes such as scale and burning time. */
    miscAttribute(value?: number): void;

    /** Sets one of the entity's miscellaneous attributes such as scale and burning time. */
    miscAttributeWith(options: MiscAttributeOptions, value?: number): void;

    /** Disguises an entity as a mob. */
    mobDisguise(mobToDisguiseAs: Item, displayName?: ComponentInput): void;

    /** Sets a mooshroom's skin type. */
    mooshroomType(): void;

    /** Sets a mooshroom's skin type. */
    mooshroomTypeWith(options: MooshroomTypeOptions): void;

    /** Instructs a mob's AI to always pathfind to a certain location at a certain speed. */
    moveToLoc(targetLocation?: Location, walkSpeed?: number): void;

    /** Sets one of the entity's movement-related attributes, such as walking speed and jump height. */
    movementAttribute(value?: number): void;

    /** Sets one of the entity's movement-related attributes, such as walking speed and jump height. */
    movementAttributeWith(options: MovementAttributeOptions, value?: number): void;

    /** Sets the amount of ticks until a copper golem will next oxidize. */
    oxidizeTicksLeft(ticks: number): void;

    /** Disguises an entity as a player. */
    playerDisguise(playerNameToDisguiseAs: ComponentInput, displaySkin?: Item): void;

    /** Sets the item a projectile displays as. */
    projectileItem(displayItem: Item): void;

    /** Makes a goat ram the specified mob or player. */
    ram(targetUuid: string): void;

    /** Makes a goat ram the specified mob or player. */
    ramWith(options: RamOptions, targetUuid: string): void;

    /** Removes a trade from a villager */
    remVillagerTrade(tradeIndex: number): void;

    /** Deletes an entity. */
    remove(): void;

    /** Removes a custom tag from an entity. */
    removeCustomTag(tagName: string): void;

    /** Restocks all of a villager's trades. */
    restockTrades(): void;

    /** Mounts an entity on top of another entity or player. */
    rideEntity(...targetUuid: string[]): void;

    /** Mounts an entity on top of another entity or player. */
    rideEntityWith(options: RideEntityOptions, ...targetUuid: string[]): void;

    /** Makes a mob perform an animation. */
    sendAnimation(): void;

    /** Makes a mob perform an animation. */
    sendAnimationWith(options: SendAnimationOptions): void;

    /** Sets an entity's absorption health (golden hearts). */
    setAbsorption(absorptionHealth: number): void;

    /** Sets an animal's age. */
    setAge(age: number): void;

    /** Sets an animal's age. */
    setAgeWith(options: SetAgeOptions, age: number): void;

    /** Sets whether an entity is sentient and/or affected by physics. */
    setAi(): void;

    /** Sets whether an entity is sentient and/or affected by physics. */
    setAiWith(options: SetAiOptions): void;

    /** Sets whether an allay is dancing or not. */
    setAllayDancing(): void;

    /** Sets whether an allay is dancing or not. */
    setAllayDancingWith(options: SetAllayDancingOptions): void;

    /** Sets whether a mob is angry at players. */
    setAngry(): void;

    /** Sets whether a mob is angry at players. */
    setAngryWith(options: SetAngryOptions): void;

    /** Sets a mob's armor items. Place the armor in slots 1-4 of the chest, with 1 being the helmet and 4 being the boots. */
    setArmor(...armorToSet: [Item, ...Item[]]): void;

    /** Sets whether a mob has its arms raised. */
    setArmsRaised(): void;

    /** Sets whether a mob has its arms raised. */
    setArmsRaisedWith(options: SetArmsRaisedOptions): void;

    /** Sets the base damage dealt by an arrow or trident. */
    setArrowDamage(baseDamage: number): void;

    /** Sets the sound an arrow plays whenever it lands. */
    setArrowHitSound(soundToPlay: SoundInput): void;

    /** Sets whether an arrow will pass through blocks and through entities. */
    setArrowNoClip(): void;

    /** Sets whether an arrow will pass through blocks and through entities. */
    setArrowNoClipWith(options: SetArrowNoClipOptions): void;

    /** Sets how many targets an arrow can pierce through. A pierce of 1 can hit up to 2 entities. */
    setArrowPierce(targetsToPierce: number): void;

    /** Sets an axolotl's color. */
    setAxolotlColor(): void;

    /** Sets an axolotl's color. */
    setAxolotlColorWith(options: SetAxolotlColorOptions): void;

    /** Sets whether an entity is a baby (permanently). */
    setBaby(): void;

    /** Sets whether an entity is a baby (permanently). */
    setBabyWith(options: SetBabyOptions): void;

    /** Sets if a bee has nectar on its body. */
    setBeeNectar(): void;

    /** Sets if a bee has nectar on its body. */
    setBeeNectarWith(options: SetBeeNectarOptions): void;

    /** Sets whether a bee has its stinger. */
    setBeeStinger(): void;

    /** Sets whether a bee has its stinger. */
    setBeeStingerWith(options: SetBeeStingerOptions): void;

    /** Causes a shulker bullet to start targeting the provided entity. */
    setBulletTarget(targetUuid?: string): void;

    /** Causes a shulker bullet to start targeting the provided entity. */
    setBulletTargetWith(options: SetBulletTargetOptions, targetUuid?: string): void;

    /** Sets whether a mob carries a chest, which allows its inventory to be accessed. */
    setCarryingChest(): void;

    /** Sets whether a mob carries a chest, which allows its inventory to be accessed. */
    setCarryingChestWith(options: SetCarryingChestOptions): void;

    /** Sets whether a cat appears to be lying down. */
    setCatResting(): void;

    /** Sets whether a cat appears to be lying down. */
    setCatRestingWith(options: SetCatRestingOptions): void;

    /** Sets a cat's skin type. */
    setCatType(): void;

    /** Sets a cat's skin type. */
    setCatTypeWith(options: SetCatTypeOptions): void;

    /** Causes a mob to start or stop celebrating. */
    setCelebrating(): void;

    /** Causes a mob to start or stop celebrating. */
    setCelebratingWith(options: SetCelebratingOptions): void;

    /** Sets an area of effect cloud's radius and shrinking speed. */
    setCloudRadius(radius: number, shrinkingSpeedBlocksPerSecond?: number): void;

    /** Sets whether a mob is able to collide with other entities. */
    setCollidable(): void;

    /** Sets whether a mob is able to collide with other entities. */
    setCollidableWith(options: SetCollidableOptions): void;

    /** Sets the starting amount of ticks it takes for a creeper to explode. */
    setCreeperFuse(fuseTicks: number): void;

    /** Sets a creeper's explosion power. This affects the damage and area of effect. */
    setCreeperPower(power_0_25: number): void;

    /** Sets the value of or creates a custom tag value. */
    setCustomTag(tagName: string, tagValue: number | string): void;

    /** Sets whether a mob drops their items when dead. */
    setDeathDrops(): void;

    /** Sets whether a mob drops their items when dead. */
    setDeathDropsWith(options: SetDeathDropsOptions): void;

    /** Makes a warden emerge or dig into the ground. */
    setDigging(): void;

    /** Makes a warden emerge or dig into the ground. */
    setDiggingWith(options: SetDiggingOptions): void;

    /** Sets the behavior phase of an Ender Dragon. */
    setDragonPhase(): void;

    /** Sets the behavior phase of an Ender Dragon. */
    setDragonPhaseWith(options: SetDragonPhaseOptions): void;

    /** Sets a mob's dye color. */
    setDyeColor(): void;

    /** Sets a mob's dye color. */
    setDyeColorWith(options: SetDyeColorOptions): void;

    /** Set an enderman's held block. */
    setEndermanBlock(blockToHold: Item): void;

    /** Sets the item in one of the equipment slots (including horse items) of an entity. */
    setEquipment(itemToSet?: Item): void;

    /** Sets the item in one of the equipment slots (including horse items) of an entity. */
    setEquipmentWith(options: SetEquipmentOptions, itemToSet?: Item): void;

    /** Sets an entity's fall distance, affecting fall damage upon landing. */
    setFallDistance(fallDistanceBlocks: number): void;

    /** Sets the remaining time an entity is on fire for. */
    setFireTicks(ticks: number): void;

    /** Sets a tropical fish's color and pattern. */
    setFishPattern(): void;

    /** Sets a tropical fish's color and pattern. */
    setFishPatternWith(options: SetFishPatternOptions): void;

    /** Sets the time until a fish starts to approach a fishing hook. */
    setFishingTime(waitTimeTicks: number): void;

    /** Sets whether a fox appears to be leaping. */
    setFoxLeaping(): void;

    /** Sets whether a fox appears to be leaping. */
    setFoxLeapingWith(options: SetFoxLeapingOptions): void;

    /** Sets a fox's fur type. */
    setFoxType(): void;

    /** Sets a fox's fur type. */
    setFoxTypeWith(options: SetFoxTypeOptions): void;

    /** Sets an entity's current freeze ticks. */
    setFreezeTicks(ticks_0_140: number): void;

    /** Sets an entity's current freeze ticks. */
    setFreezeTicksWith(options: SetFreezeTicksOptions, ticks_0_140: number): void;

    /** Changes the type of friction an entity experiences. */
    setFriction(): void;

    /** Changes the type of friction an entity experiences. */
    setFrictionWith(options: SetFrictionOptions): void;

    /** Sets whether an entity is gliding. */
    setGliding(): void;

    /** Sets whether an entity is gliding. */
    setGlidingWith(options: SetGlidingOptions): void;

    /** Sets the number of ticks a glow squid will stop glowing for. */
    setGlowSquidDark(ticks: number): void;

    /** Sets whether this entity has a glowing outline that can be seen through blocks. */
    setGlowing(): void;

    /** Sets whether this entity has a glowing outline that can be seen through blocks. */
    setGlowingWith(options: SetGlowingOptions): void;

    /** Sets which goat horns are shown or hidden. */
    setGoatHorns(): void;

    /** Sets which goat horns are shown or hidden. */
    setGoatHornsWith(options: SetGoatHornsOptions): void;

    /** Sets whether a goat screams or not. */
    setGoatScreaming(): void;

    /** Sets whether a goat screams or not. */
    setGoatScreamingWith(options: SetGoatScreamingOptions): void;

    /** Sets whether an entity is affected by gravity. */
    setGravity(): void;

    /** Sets whether an entity is affected by gravity. */
    setGravityWith(options: SetGravityOptions): void;

    /** Sets an entity's current health. */
    setHealth(health: number): void;

    /** Sets a horse's jump strength. */
    setHorseJump(strength: number): void;

    /** Sets a horse's color and pattern. */
    setHorsePattern(): void;

    /** Sets a horse's color and pattern. */
    setHorsePatternWith(options: SetHorsePatternOptions): void;

    /** Sets whether an entity is invisible. */
    setInvisible(): void;

    /** Sets whether an entity is invisible. */
    setInvisibleWith(options: SetInvisibleOptions): void;

    /** Sets the currently remaining ticks until an entity can next be hurt. */
    setInvulTicks(ticks: number): void;

    /** Sets whether an entity is invulnerable to damage. */
    setInvulnerable(): void;

    /** Sets whether an entity is invulnerable to damage. */
    setInvulnerableWith(options: SetInvulnerableOptions): void;

    /** Sets the item of an item entity. */
    setItem(newItem: Item): void;

    /** Sets a llama's fur color. */
    setLlamaColor(): void;

    /** Sets a llama's fur color. */
    setLlamaColorWith(options: SetLlamaColorOptions): void;

    /** Sets whether an armor stand is a marker. */
    setMarker(): void;

    /** Sets whether an armor stand is a marker. */
    setMarkerWith(options: SetMarkerOptions): void;

    /** Sets an entity's maximum health. */
    setMaxHealth(maximumHealth: number): void;

    /** Sets an entity's maximum health. */
    setMaxHealthWith(options: SetMaxHealthOptions, maximumHealth: number): void;

    /** Sets the block shown inside a minecart. This does not affect its functionality. */
    setMinecartBlock(blockToShow: Item, blockOffset?: number): void;

    /** Sets whether an entity is sitting. */
    setMobSitting(): void;

    /** Sets whether an entity is sitting. */
    setMobSittingWith(options: SetMobSittingOptions): void;

    /** Sets an entity's custom name. */
    setName(customName?: ComponentInput): void;

    /** Sets an entity's custom name. */
    setNameWith(options: SetNameOptions, customName?: ComponentInput): void;

    /** Sets the color an entity's name tag appears in. */
    setNameColor(): void;

    /** Sets the color an entity's name tag appears in. */
    setNameColorWith(options: SetNameColorOptions): void;

    /** Sets whether an entity's custom name is always displayed above them. */
    setNameVisible(): void;

    /** Sets whether an entity's custom name is always displayed above them. */
    setNameVisibleWith(options: SetNameVisibleOptions): void;

    /** Sets the oxidization level of a copper golem. */
    setOxidization(): void;

    /** Sets the oxidization level of a copper golem. */
    setOxidizationWith(options: SetOxidizationOptions): void;

    /** Sets the gene of a panda. This affects their behavior and appearance. */
    setPandaGene(): void;

    /** Sets the gene of a panda. This affects their behavior and appearance. */
    setPandaGeneWith(options: SetPandaGeneOptions): void;

    /** Sets whether a panda is laying on its back or not. */
    setPandaOnBack(): void;

    /** Sets whether a panda is laying on its back or not. */
    setPandaOnBackWith(options: SetPandaOnBackOptions): void;

    /** Sets whether a panda is rolling or not. */
    setPandaRolling(): void;

    /** Sets whether a panda is rolling or not. */
    setPandaRollingWith(options: SetPandaRollingOptions): void;

    /** Makes a panda sad for the specified duration. */
    setPandaSadTicks(ticks: number): void;

    /** Sets a parrot's color. */
    setParrotColor(): void;

    /** Sets a parrot's color. */
    setParrotColorWith(options: SetParrotColorOptions): void;

    /** Sets whether an item or a falling block will never despawn. */
    setPersistent(): void;

    /** Sets whether an item or a falling block will never despawn. */
    setPersistentWith(options: SetPersistentOptions): void;

    /** Sets the number of ticks a dropped item cannot be picked up for. */
    setPickupDelay(delay: number): void;

    /** Changes the pose of an entity. This affects their animations and/or hitbox, depending on the pose and entity type. */
    setPose(): void;

    /** Changes the pose of an entity. This affects their animations and/or hitbox, depending on the pose and entity type. */
    setPoseWith(options: SetPoseOptions): void;

    /** Sets a villager's profession. */
    setProfession(): void;

    /** Sets a villager's profession. */
    setProfessionWith(options: SetProfessionOptions): void;

    /** Sets the projectile source of a projectile (or removes it). */
    setProjSource(shooterUuid?: string): void;

    /** Sets the projectile source of a projectile (or removes it). */
    setProjSourceWith(options: SetProjSourceOptions, shooterUuid?: string): void;

    /** Sets a rabbit's skin type. */
    setRabbitType(): void;

    /** Sets a rabbit's skin type. */
    setRabbitTypeWith(options: SetRabbitTypeOptions): void;

    /** Sets whether a horse is standing on its hind legs. */
    setRearing(): void;

    /** Sets whether a horse is standing on its hind legs. */
    setRearingWith(options: SetRearingOptions): void;

    /** Sets whether an entity is riptiding. */
    setRiptiding(): void;

    /** Sets whether an entity is riptiding. */
    setRiptidingWith(options: SetRiptidingOptions): void;

    /** Changes an entity's pitch and yaw without teleporting it. */
    setRotation(pitch_90To_90: number, yaw_180To_180: number): void;

    /** Sets whether a mob wears a saddle. */
    setSaddle(): void;

    /** Sets whether a mob wears a saddle. */
    setSaddleWith(options: SetSaddleOptions): void;

    /** Sets a salmon's variant. */
    setSalmonType(): void;

    /** Sets a salmon's variant. */
    setSalmonTypeWith(options: SetSalmonTypeOptions): void;

    /** Sets whether a sheep has its wool. */
    setSheepSheared(): void;

    /** Sets whether a sheep has its wool. */
    setSheepShearedWith(options: SetSheepShearedOptions): void;

    /** Sets how far a shulker should peek up to. */
    setShulkerPeek(peekPercentage: number): void;

    /** Sets how far a shulker should peek up to. */
    setShulkerPeekWith(options: SetShulkerPeekOptions, peekPercentage: number): void;

    /** Sets whether an entity will produce sound effects. */
    setSilenced(): void;

    /** Sets whether an entity will produce sound effects. */
    setSilencedWith(options: SetSilencedOptions): void;

    /** Sets the size of an entity. This may also affect its health and strength. */
    setSize(size: number): void;

    /** Instructs a mob's AI to target a specific mob or player. */
    setTarget(...targetUuid: string[]): void;

    /** Instructs a mob's AI to target a specific mob or player. */
    setTargetWith(options: SetTargetOptions, ...targetUuid: string[]): void;

    /** Sets a mob's temperature variant. */
    setTemperature(): void;

    /** Sets a mob's temperature variant. */
    setTemperatureWith(options: SetTemperatureOptions): void;

    /** Sets the amount of times a trade can be made before the villager has to restock. */
    setTradeUses(tradeIndex: number, remainingUses?: number, maximumUses?: number): void;

    /** Sets whether a vex is charging or not. */
    setVexCharging(): void;

    /** Sets whether a vex is charging or not. */
    setVexChargingWith(options: SetVexChargingOptions): void;

    /** Sets the biome type of a villager. This affects their appearance only. */
    setVillagerBiome(): void;

    /** Sets the biome type of a villager. This affects their appearance only. */
    setVillagerBiomeWith(options: SetVillagerBiomeOptions): void;

    /** Sets a villager's experience points, which affects their level. */
    setVillagerExp(experience: number): void;

    /** Sets the villager trade at an index. */
    setVillagerTrade(tradeIndex: number, resultItem: Item, firstIngredient: Item, secondIngredient?: Item, maximumUses?: number): void;

    /** Sets whether an entity should appear on fire. */
    setVisualFire(): void;

    /** Sets whether an entity should appear on fire. */
    setVisualFireWith(options: SetVisualFireOptions): void;

    /** Sets the anger level of a Warden. */
    setWardenAnger(angerLevel_0_150: number, entityUuid: string): void;

    /** Sets the anger level of a Warden. */
    setWardenAngerWith(options: SetWardenAngerOptions, angerLevel_0_150: number, entityUuid: string): void;

    /** Sets whether a copper golem is waxed. */
    setWaxed(): void;

    /** Sets whether a copper golem is waxed. */
    setWaxedWith(options: SetWaxedOptions): void;

    /** Sets the remaining ticks of invulnerability a wither has. */
    setWitherInvul(ticks: number): void;

    /** Sets a wolf's sound variant. */
    setWolfSoundType(): void;

    /** Sets a wolf's sound variant. */
    setWolfSoundTypeWith(options: SetWolfSoundTypeOptions): void;

    /** Sets a wolf's variant. */
    setWolfType(): void;

    /** Sets a wolf's variant. */
    setWolfTypeWith(options: SetWolfTypeOptions): void;

    /** Sets a mob in the sheared state. */
    shear(): void;

    /** Causes a sheep to be sheared. */
    shearSheep(): void;

    /** Causes a sheep to eat grass. */
    sheepEat(): void;

    /** Forces a sniffer to perform a specific action. */
    snifferState(): void;

    /** Forces a sniffer to perform a specific action. */
    snifferStateWith(options: SnifferStateOptions): void;

    /** Sets whether a snow golem is wearing a pumpkin. */
    snowmanPumpkin(): void;

    /** Sets whether a snow golem is wearing a pumpkin. */
    snowmanPumpkinWith(options: SnowmanPumpkinOptions): void;

    /** Tames and sets the owner of a tameable mob. */
    tame(ownerUuid?: string): void;

    /** Sets the background color and opacity of a text display. */
    tdispBackground(colorHexadecimal?: string, opacityInPercentage?: number): void;

    /** Sets the text alignment of a text display. */
    tdisplayAlign(): void;

    /** Sets the text alignment of a text display. */
    tdisplayAlignWith(options: TdisplayAlignOptions): void;

    /** Sets the maximum line width of a text display. */
    tdisplayLineWidth(lineWidth?: number): void;

    /** Sets the text opacity of a text display. */
    tdisplayOpacity(textOpacity?: number): void;

    /** Sets whether a text display is visible through walls or not. */
    tdisplaySeeThru(): void;

    /** Sets whether a text display is visible through walls or not. */
    tdisplaySeeThruWith(options: TdisplaySeeThruOptions): void;

    /** Sets whether the text in a text display has shadow or not. */
    tdisplayShadow(): void;

    /** Sets whether the text in a text display has shadow or not. */
    tdisplayShadowWith(options: TdisplayShadowOptions): void;

    /** Sets the displayed text of a text display. */
    tdisplayText(...displayedText: [ComponentInput, ...ComponentInput[]]): void;

    /** Sets the displayed text of a text display. */
    tdisplayTextWith(options: TdisplayTextOptions, ...displayedText: [ComponentInput, ...ComponentInput[]]): void;

    /** Teleports an entity to a specified location. */
    teleport(newPosition: Location): void;

    /** Teleports an entity to a specified location. */
    teleportWith(options: TeleportOptions, newPosition: Location): void;

    /** Removes an entity's disguise. */
    undisguise(): void;

    /** Forces a mob to use held items such as bow or spyglass. */
    useItem(): void;

    /** Forces a mob to use held items such as bow or spyglass. */
    useItemWith(options: UseItemOptions): void;

    /** Makes a villager perform a head shake animation. */
    villagerHeadAnim(): void;
}
