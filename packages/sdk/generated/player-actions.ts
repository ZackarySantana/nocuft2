// This file is generated. Do not edit manually.

import type { ComponentInput, Location } from "../values/index";

export interface ActionBarOptions {
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

export interface AttackAnimationOptions {
    /** Default: "swingMainArm" */
    readonly animationArm?: "swingMainArm" | "swingOffArm";
}

export interface BossBarOptions {
    /** Default: "slot_1" */
    readonly barSlot?: "slot_1" | "slot_2" | "slot_3" | "slot_4" | "slot_5" | "slot_6" | "slot_7" | "slot_8" | "slot_9";
    /** Default: "solid" */
    readonly barStyle?: "solid" | "6Segments" | "10Segments" | "12Segments" | "20Segments";
    /** Default: "none" */
    readonly skyEffect?: "none" | "createFog" | "darkenSky" | "both";
    /** Default: "purple" */
    readonly barColor?: "red" | "purple" | "pink" | "blue" | "green" | "yellow" | "white";
}

export interface ClearInvOptions {
    /** Default: "entireInventory" */
    readonly clearMode?: "entireInventory" | "mainInventory" | "upperInventory" | "hotbar" | "armor";
    /** Default: true */
    readonly clearCraftingAndCursor?: boolean;
}

export interface CloseInvOptions {
    /** Default: "enable" */
    readonly closePlayerInventory?: "enable" | "disable";
}

export interface CombatAttributeOptions {
    /** Default: "attackDamage" */
    readonly attribute?: "attackDamage" | "attackSpeed" | "sweepingDamageRatio";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface DamageOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface DisplayBellRingOptions {
    /** Default: "north" */
    readonly ringDirection?: "north" | "south" | "west" | "east";
}

export interface DisplayBlockOpenOptions {
    /** Default: "open" */
    readonly containerState?: "open" | "closed";
}

export interface DisplayFractureOptions {
    /** Default: true */
    readonly overwritePreviousFracture?: boolean;
}

export interface DisplayGatewayOptions {
    /** Default: "initialBeam" */
    readonly animationType?: "initialBeam" | "periodicBeam";
}

export interface DisplayPickupOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface DisplaySignTextOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
    /** Default: "black" */
    readonly textColor?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black";
    /** Default: "disable" */
    readonly glowing?: "enable" | "disable";
}

export interface FallingAttributeOptions {
    /** Default: "gravity" */
    readonly attribute?: "gravity" | "safeFallDistance" | "fallDamageMultiplier";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface ForceFlightOptions {
    /** Default: "startFlight" */
    readonly flightMode?: "startFlight" | "stopFlight";
}

export interface GiveExpOptions {
    /** Default: "points" */
    readonly giveExperience?: "points" | "levels" | "levelPercentage";
}

export interface HealthAttributeOptions {
    /** Default: "maximumHealth" */
    readonly attribute?: "maximumHealth" | "maximumAbsorptionHealth" | "armor" | "armorToughness";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface InstantRespawnOptions {
    /** Default: "enable" */
    readonly instantRespawn?: "enable" | "disable";
}

export interface KbattributeOptions {
    /** Default: "knockbackResistance" */
    readonly attribute?: "knockbackResistance" | "explosionKnockbackResistance";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface LSetHealthOptions {
    /** Default: "regularHealth" */
    readonly healType?: "regularHealth" | "absorptionHealth" | "combinedHealth";
}

export interface LaunchFwdOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
    /** Default: "pitchAndYaw" */
    readonly launchAxis?: "pitchAndYaw" | "yawOnly";
}

export interface LaunchTowardOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
    /** Default: false */
    readonly ignoreDistance?: boolean;
}

export interface LaunchUpOptions {
    /** Default: true */
    readonly addToCurrentVelocity?: boolean;
}

export interface LoadInvOptions {
    /** Default: "synchronous" */
    readonly codeFlow?: "synchronous" | "asynchronous";
}

export interface LockDisgRotationOptions {
    /** Default: "noChange" */
    readonly pitch?: "lock" | "unlock" | "noChange";
    /** Default: "noChange" */
    readonly yaw?: "lock" | "unlock" | "noChange";
}

export interface MimicOptions {
    /** Default: "enable" */
    readonly removeOriginalEntity?: "enable" | "disable";
}

export interface MiningAttributeOptions {
    /** Default: "blockBreakSpeed" */
    readonly attribute?: "blockBreakSpeed" | "miningEfficiency" | "submergedMiningSpeed";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface MiscAttributeOptions {
    /** Default: "scale" */
    readonly attribute?: "scale" | "luck" | "oxygenBonus" | "burningTime" | "cameraDistance";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface MovementAttributeOptions {
    /** Default: "walkingSpeed" */
    readonly attribute?: "walkingSpeed" | "flyingSpeed" | "jumpStrength" | "sneakingSpeed" | "stepHeight" | "movementEfficiency" | "waterMovementEfficiency";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface OpenSignOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
}

export interface OpenTradeMenuOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface ReachAttributeOptions {
    /** Default: "blockInteractionRange" */
    readonly attribute?: "blockInteractionRange" | "entityInteractionRange";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

export interface RemoveBossBarOptions {
    /** Default: "allBossBars" */
    readonly bossBarSlot?: "allBossBars" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
}

export interface RemoveInvRowOptions {
    /** Default: "bottomRow" */
    readonly rowToRemove?: "topRow" | "bottomRow";
}

export interface RideEntityOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface RngTeleportOptions {
    /** Default: false */
    readonly keepCurrentRotation?: boolean;
}

export interface ScoreDefFormatOptions {
    /** Default: "fixed" */
    readonly numberFormat?: "fixed" | "styled" | "blank" | "reset";
}

export interface ScoreLineFormatOptions {
    /** Default: "fixed" */
    readonly numberFormat?: "fixed" | "styled" | "blank" | "reset";
}

export interface SendAnimationOptions {
    /** Default: "hurtAnimation" */
    readonly animationType?: "hurtAnimation" | "wakeUpFadeEffect";
}

export interface SendMessageOptions {
    /** Default: "regular" */
    readonly alignment?: "regular" | "centered";
    /** Default: "addSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

export interface SendMessageSeqOptions {
    /** Default: "regular" */
    readonly alignment?: "regular" | "centered";
}

export interface SetAllowFlightOptions {
    /** Default: "enable" */
    readonly allowFlight?: "enable" | "disable";
}

export interface SetAllowPvpOptions {
    /** Default: "disable" */
    readonly pvp?: "enable" | "disable";
}

export interface SetCollidableOptions {
    /** Default: "disable" */
    readonly collision?: "enable" | "disable";
}

export interface SetDisguiseVisibleOptions {
    /** Default: "disable" */
    readonly disguiseVisible?: "enable" | "disable";
}

export interface SetDropsEnabledOptions {
    /** Default: "enable" */
    readonly spawnDeathDrops?: "enable" | "disable";
}

export interface SetEntityHiddenOptions {
    /** Default: "enable" */
    readonly hidden?: "enable" | "disable";
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface SetExpOptions {
    /** Default: "level" */
    readonly setExperience?: "points" | "level" | "levelPercentage";
}

export interface SetFlyingOptions {
    /** Default: "enable" */
    readonly flying?: "enable" | "disable";
}

export interface SetFreezeTicksOptions {
    /** Default: "disable" */
    readonly tickingLocked?: "enable" | "disable";
}

export interface SetGamemodeOptions {
    /** Default: "respectGamemode" */
    readonly flightMode?: "respectGamemode" | "keepOriginal";
    /** Default: "survival" */
    readonly gamemode?: "survival" | "creative" | "adventure";
}

export interface SetGlidingOptions {
    /** Default: "enable" */
    readonly gliding?: "enable" | "disable";
}

export interface SetHandCraftingOptions {
    /** Default: "disable" */
    readonly allowHandCrafting?: "enable" | "disable";
}

export interface SetInventoryKeptOptions {
    /** Default: "enable" */
    readonly inventoryKept?: "enable" | "disable";
}

export interface SetMaxHealthOptions {
    /** Default: false */
    readonly healPlayerToMaxHealth?: boolean;
}

export interface SetNamePrefixOptions {
    /** Default: "prefix" */
    readonly textType?: "prefix" | "suffix";
}

export interface SetNameVisibleOptions {
    /** Default: "disable" */
    readonly nameTagVisible?: "enable" | "disable";
}

export interface SetPlayerWeatherOptions {
    /** Default: "downfall" */
    readonly weather?: "clear" | "downfall";
}

export interface SetReducedDebugOptions {
    /** Default: "enable" */
    readonly reducedDebugInfoEnabled?: "enable" | "disable";
}

export interface SetShoulderOptions {
    /** Default: "left" */
    readonly shoulder?: "left" | "right";
    /** Default: "remove" */
    readonly type?: "remove" | "red" | "blue" | "green" | "cyan" | "gray";
}

export interface SetSidebarOptions {
    /** Default: "enable" */
    readonly sidebar?: "enable" | "disable";
}

export interface SetSpeedOptions {
    /** Default: "groundSpeed" */
    readonly speedType?: "groundSpeed" | "flightSpeed" | "both";
}

export interface SetTabListInfoOptions {
    /** Default: "header" */
    readonly playerListField?: "header" | "footer";
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

export interface SetVisualFireOptions {
    /** Default: "enable" */
    readonly onFire?: "enable" | "disable";
}

export interface SpectateTargetOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface SpectatorCollisionOptions {
    /** Default: "enable" */
    readonly spectatorCollision?: "enable" | "disable";
}

export interface TeleportOptions {
    /** Default: false */
    readonly keepCurrentRotation?: boolean;
    /** Default: false */
    readonly keepVelocity?: boolean;
}

export interface PlayerActions {
    actionBar(...messages: ComponentInput[]): void;
    actionBarWith(options: ActionBarOptions, ...messages: ComponentInput[]): void;

    adventureMode(): void;

    allowDrops(): void;

    attackAnimation(): void;
    attackAnimationWith(options: AttackAnimationOptions): void;

    bossBar(title?: string, health?: number, maximumHealth?: number): void;
    bossBarWith(options: BossBarOptions, title?: string, health?: number, maximumHealth?: number): void;

    chatStyle(newChatStyle: ComponentInput): void;

    clearChat(): void;

    clearDispBlock(blockLocationOrStartOfRegion: Location, endOfRegion?: Location): void;

    clearHighlighters(): void;

    clearInv(): void;
    clearInvWith(options: ClearInvOptions): void;

    clearPotions(): void;

    clearScoreboard(): void;

    closeInv(): void;
    closeInvWith(options: CloseInvOptions): void;

    combatAttribute(value?: number): void;
    combatAttributeWith(options: CombatAttributeOptions, value?: number): void;

    creativeMode(): void;

    damage(damageToInflict: number, uuidOfDamagerEntity?: string): void;
    damageWith(options: DamageOptions, damageToInflict: number, uuidOfDamagerEntity?: string): void;

    deathDrops(): void;

    disableFlight(): void;

    disablePvp(): void;

    disallowDrops(): void;

    disguiseShiftVert(yOffset: number): void;

    displayBellRing(blockLocation: Location): void;
    displayBellRingWith(options: DisplayBellRingOptions, blockLocation: Location): void;

    displayBlockOpen(blockLocation: Location): void;
    displayBlockOpenWith(options: DisplayBlockOpenOptions, blockLocation: Location): void;

    displayFracture(blockSToFracture: Location[], fractureLevel?: number): void;
    displayFractureWith(options: DisplayFractureOptions, blockSToFracture: Location[], fractureLevel?: number): void;

    displayGateway(gatewayLocation: Location): void;
    displayGatewayWith(options: DisplayGatewayOptions, gatewayLocation: Location): void;

    displayHighlighter(blockLocation: Location, colorHexadecimal?: string, name?: string, opacityInPercentage?: number, durationMilliseconds?: number): void;

    displayHologram(displayLocation: Location, textToDisplay: ComponentInput): void;

    displayLightning(strikeLocation: Location): void;

    displayPickup(entityUuid: string, collectorUuid: string): void;
    displayPickupWith(options: DisplayPickupOptions, entityUuid: string, collectorUuid: string): void;

    displaySignText(signLocation: Location, ...textLineS: ComponentInput[]): void;
    displaySignTextWith(options: DisplaySignTextOptions, signLocation: Location, ...textLineS: ComponentInput[]): void;

    enableFlight(): void;

    enablePvp(): void;

    faceLocation(locationToFace: Location): void;

    fallingAttribute(value?: number): void;
    fallingAttributeWith(options: FallingAttributeOptions, value?: number): void;

    forceFlight(): void;
    forceFlightWith(options: ForceFlightOptions): void;

    giveExhaustion(exhaustionToGive: number): void;

    giveExp(experienceToGive: number): void;
    giveExpWith(options: GiveExpOptions, experienceToGive: number): void;

    giveFood(foodToGive: number): void;

    giveSaturation(saturationToGive: number): void;

    heal(amountToHeal: number): void;

    healthAttribute(value?: number): void;
    healthAttributeWith(options: HealthAttributeOptions, value?: number): void;

    hideDisguise(): void;

    hurtAnimation(damageSource?: Location): void;

    instantRespawn(): void;
    instantRespawnWith(options: InstantRespawnOptions): void;

    kbattribute(value?: number): void;
    kbattributeWith(options: KbattributeOptions, value?: number): void;

    keepInv(): void;

    kick(): void;

    lSetHealth(newHealth: number): void;
    lSetHealthWith(options: LSetHealthOptions, newHealth: number): void;

    launchFwd(launchPower: number): void;
    launchFwdWith(options: LaunchFwdOptions, launchPower: number): void;

    launchToward(launchDestination: Location, launchPower?: number): void;
    launchTowardWith(options: LaunchTowardOptions, launchDestination: Location, launchPower?: number): void;

    launchUp(launchPower: number): void;
    launchUpWith(options: LaunchUpOptions, launchPower: number): void;

    loadInv(): void;
    loadInvWith(options: LoadInvOptions): void;

    lockDisgRotation(pitchToLockTo?: number, yawToLockTo?: number): void;
    lockDisgRotationWith(options: LockDisgRotationOptions, pitchToLockTo?: number, yawToLockTo?: number): void;

    mimic(uuidOfTargetToDisguiseAs: string): void;
    mimicWith(options: MimicOptions, uuidOfTargetToDisguiseAs: string): void;

    miningAttribute(value?: number): void;
    miningAttributeWith(options: MiningAttributeOptions, value?: number): void;

    miscAttribute(value?: number): void;
    miscAttributeWith(options: MiscAttributeOptions, value?: number): void;

    movementAttribute(value?: number): void;
    movementAttributeWith(options: MovementAttributeOptions, value?: number): void;

    movementFov(movementFieldOfViewPercentage_10_0_150_0?: number): void;

    natRegen(): void;

    noDeathDrops(): void;

    noKeepInv(): void;

    noNatRegen(): void;

    noProjColl(): void;

    openBlockInv(containerLocation: Location): void;

    openSign(signLocation: Location): void;
    openSignWith(options: OpenSignOptions, signLocation: Location): void;

    openTradeMenu(villagerUuid: string): void;
    openTradeMenuWith(options: OpenTradeMenuOptions, villagerUuid: string): void;

    projColl(): void;

    promptPurchase(productId: string): void;

    reachAttribute(value?: number): void;
    reachAttributeWith(options: ReachAttributeOptions, value?: number): void;

    removeBossBar(): void;
    removeBossBarWith(options: RemoveBossBarOptions): void;

    removeInvRow(rowsToRemove?: number): void;
    removeInvRowWith(options: RemoveInvRowOptions, rowsToRemove?: number): void;

    removeScore(scoreName: ComponentInput): void;

    resourcePack(resourcePackUrl: string): void;

    respawn(): void;

    rideEntity(targetUuid: string): void;
    rideEntityWith(options: RideEntityOptions, targetUuid: string): void;

    rmWorldBorder(): void;

    rngTeleport(...locationsToChooseFrom: Location[]): void;
    rngTeleportWith(options: RngTeleportOptions, ...locationsToChooseFrom: Location[]): void;

    rollbackBlocks(rollbackTime?: number): void;

    saveInv(): void;

    scoreDefFormat(contentOrStyle: ComponentInput): void;
    scoreDefFormatWith(options: ScoreDefFormatOptions, contentOrStyle: ComponentInput): void;

    scoreLineFormat(scoreName: ComponentInput, contentOrStyle: ComponentInput): void;
    scoreLineFormatWith(options: ScoreLineFormatOptions, scoreName: ComponentInput, contentOrStyle: ComponentInput): void;

    sendAnimation(): void;
    sendAnimationWith(options: SendAnimationOptions): void;

    sendHover(messageToSendInChat: string, messageToSeeOnHover: string): void;

    sendMessage(...messages: ComponentInput[]): void;
    sendMessageWith(options: SendMessageOptions, ...messages: ComponentInput[]): void;

    sendMessageSeq(messagesToSend: ComponentInput[], messageDelayTicks?: number): void;
    sendMessageSeqWith(options: SendMessageSeqOptions, messagesToSend: ComponentInput[], messageDelayTicks?: number): void;

    sendTitle(titleText: ComponentInput, subtitleText?: ComponentInput, titleDuration?: number, fadeInLength?: number, fadeOutLength?: number): void;

    sendToPlot(plotHandleOrId: string): void;

    setAbsorption(absorptionHealth: number): void;

    setAirTicks(breathTicks: number): void;

    setAllowFlight(): void;
    setAllowFlightWith(options: SetAllowFlightOptions): void;

    setAllowPvp(): void;
    setAllowPvpWith(options: SetAllowPvpOptions): void;

    setArrowsStuck(arrowCount?: number): void;

    setAtkSpeed(attackSpeed?: number): void;

    setChatTag(...chatTag: ComponentInput[]): void;

    setCollidable(): void;
    setCollidableWith(options: SetCollidableOptions): void;

    setCompass(newTarget: Location): void;

    setDisguiseVisible(): void;
    setDisguiseVisibleWith(options: SetDisguiseVisibleOptions): void;

    setDropsEnabled(): void;
    setDropsEnabledWith(options: SetDropsEnabledOptions): void;

    setEntityHidden(...entityUuids: string[]): void;
    setEntityHiddenWith(options: SetEntityHiddenOptions, ...entityUuids: string[]): void;

    setExhaustion(exhaustionLevel_0_4: number): void;

    setExp(experienceToSet: number): void;
    setExpWith(options: SetExpOptions, experienceToSet: number): void;

    setFallDistance(fallDistanceBlocks: number): void;

    setFireTicks(ticks: number): void;

    setFlying(): void;
    setFlyingWith(options: SetFlyingOptions): void;

    setFogDistance(fogDistanceInChunks_2_7: number): void;

    setFoodLevel(foodLevel_1_20: number): void;

    setFreezeTicks(ticks_0_140: number): void;
    setFreezeTicksWith(options: SetFreezeTicksOptions, ticks_0_140: number): void;

    setGamemode(): void;
    setGamemodeWith(options: SetGamemodeOptions): void;

    setGliding(): void;
    setGlidingWith(options: SetGlidingOptions): void;

    setHandCrafting(): void;
    setHandCraftingWith(options: SetHandCraftingOptions): void;

    setHealth(health: number): void;

    setInvName(...inventoryName: ComponentInput[]): void;

    setInventoryKept(): void;
    setInventoryKeptWith(options: SetInventoryKeptOptions): void;

    setInvulTicks(ticks: number): void;

    setMaxHealth(maximumHealth: number): void;
    setMaxHealthWith(options: SetMaxHealthOptions, maximumHealth: number): void;

    setNamePrefix(...prefixSuffixText: ComponentInput[]): void;
    setNamePrefixWith(options: SetNamePrefixOptions, ...prefixSuffixText: ComponentInput[]): void;

    setNameVisible(): void;
    setNameVisibleWith(options: SetNameVisibleOptions): void;

    setPlayerTime(daylightTicks: number): void;

    setPlayerWeather(): void;
    setPlayerWeatherWith(options: SetPlayerWeatherOptions): void;

    setRainLevel(rainLevel: number, stormLevel: number): void;

    setReducedDebug(): void;
    setReducedDebugWith(options: SetReducedDebugOptions): void;

    setRotation(pitch_90To_90: number, yaw_180To_180: number): void;

    setSaturation(saturationLevel_1_20: number): void;

    setScore(scoreName: ComponentInput, scoreValue?: number): void;

    setScoreObj(objectiveName: ComponentInput): void;

    setShoulder(): void;
    setShoulderWith(options: SetShoulderOptions): void;

    setSidebar(): void;
    setSidebarWith(options: SetSidebarOptions): void;

    setSlot(newSlot: number): void;

    setSpawnPoint(theNewSpawnLocation: Location): void;

    setSpeed(movementSpeedPercentage_0To_1000: number): void;
    setSpeedWith(options: SetSpeedOptions, movementSpeedPercentage_0To_1000: number): void;

    setStatus(gameStatus: ComponentInput): void;

    setStingsStuck(stingCount?: number): void;

    setTabListInfo(...headerFooterText: ComponentInput[]): void;
    setTabListInfoWith(options: SetTabListInfoOptions, ...headerFooterText: ComponentInput[]): void;

    setTickRate(ticksPerSecond_0_20?: number): void;

    setVisualFire(): void;
    setVisualFireWith(options: SetVisualFireOptions): void;

    setWorldBorder(centerPosition: Location, radiusInBlocks: number, warningDistance?: number): void;

    setXpprog(progress_0_100: number): void;

    shiftWorldBorder(newRadius: number, blocksPerSecond?: number): void;

    showDisguise(): void;

    spectateTarget(targetUuid: string): void;
    spectateTargetWith(options: SpectateTargetOptions, targetUuid: string): void;

    spectatorCollision(): void;
    spectatorCollisionWith(options: SpectatorCollisionOptions): void;

    spectatorMode(): void;

    survivalMode(): void;

    teleport(newPosition: Location): void;
    teleportWith(options: TeleportOptions, newPosition: Location): void;

    tpSequence(locationsToTeleportTo: Location[], teleportDelayTicksDefault_60?: number): void;

    undisguise(): void;

    vibration(originLocation: Location, targetLocation: Location, arrivalTime?: number): void;

    wakeUpAnimation(): void;

    walkSpeed(ofNormalWalkSpeed_0To_500: number): void;

    weatherClear(): void;

    weatherRain(): void;
}
