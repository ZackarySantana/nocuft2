// This file is generated. Do not edit manually.

import type { ComponentInput, Location, SoundInput } from "../values/index";

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

export interface PlayEntitySoundOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

export interface PlaySoundSeqOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
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

export interface StopSoundOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
}

export interface TeleportOptions {
    /** Default: false */
    readonly keepCurrentRotation?: boolean;
    /** Default: false */
    readonly keepVelocity?: boolean;
}

export interface PlayerActions {
    /** Displays text directly above a player's hotbar. */
    actionBar(...messages: ComponentInput[]): void;

    /** Displays text directly above a player's hotbar. */
    actionBarWith(options: ActionBarOptions, ...messages: ComponentInput[]): void;

    /** Sets a player's game mode to Adventure. */
    adventureMode(): void;

    /** Allows the player to drop items from their inventory. */
    allowDrops(): void;

    /** Makes a player perform an attack animation. */
    attackAnimation(): void;

    /** Makes a player perform an attack animation. */
    attackAnimationWith(options: AttackAnimationOptions): void;

    /** Creates or modifies a custom boss health bar at the top of a player's screen. */
    bossBar(title?: string, health?: number, maximumHealth?: number): void;

    /** Creates or modifies a custom boss health bar at the top of a player's screen. */
    bossBarWith(options: BossBarOptions, title?: string, health?: number, maximumHealth?: number): void;

    /** Sets a player's chat color or decoration. */
    chatStyle(newChatStyle: ComponentInput): void;

    /** Clears all messages on a player's chat window. */
    clearChat(): void;

    /** Displays the real block at a location to a player, effectively removing any client-side blocks. */
    clearDispBlock(blockLocationOrStartOfRegion: Location, endOfRegion?: Location): void;

    /** Clears all block highlighters displayed to a player. */
    clearHighlighters(): void;

    /** Empties a player's inventory. */
    clearInv(): void;

    /** Empties a player's inventory. */
    clearInvWith(options: ClearInvOptions): void;

    /** Removes all active potion effects from a player. */
    clearPotions(): void;

    /** Removes all scores from the scoreboard. */
    clearScoreboard(): void;

    /** Closes a player's inventory. */
    closeInv(): void;

    /** Closes a player's inventory. */
    closeInvWith(options: CloseInvOptions): void;

    /** Sets one of the player's combat-related attributes such as attack damage and attack speed. */
    combatAttribute(value?: number): void;

    /** Sets one of the player's combat-related attributes such as attack damage and attack speed. */
    combatAttributeWith(options: CombatAttributeOptions, value?: number): void;

    /** Sets a player's game mode to Creative. */
    creativeMode(): void;

    /** Damages a player. */
    damage(damageToInflict: number, uuidOfDamagerEntity?: string): void;

    /** Damages a player. */
    damageWith(options: DamageOptions, damageToInflict: number, uuidOfDamagerEntity?: string): void;

    /** When this code block is executed, the player will drop the contents of their inventory when they die. */
    deathDrops(): void;

    /** Prevents the player from flying. */
    disableFlight(): void;

    /** Prevents the player from damaging other players. */
    disablePvp(): void;

    /** Prevents the player from dropping items from their inventory. */
    disallowDrops(): void;

    /** Shifts the disguise of a player up or down relative to the player. */
    disguiseShiftVert(yOffset: number): void;

    /** Displays a bell ring animation at a location to a player. */
    displayBellRing(blockLocation: Location): void;

    /** Displays a bell ring animation at a location to a player. */
    displayBellRingWith(options: DisplayBellRingOptions, blockLocation: Location): void;

    /** Displays a container block at a location as being open or closed to a player. */
    displayBlockOpen(blockLocation: Location): void;

    /** Displays a container block at a location as being open or closed to a player. */
    displayBlockOpenWith(options: DisplayBlockOpenOptions, blockLocation: Location): void;

    /** Displays a block fracture effect at a location to a player. */
    displayFracture(blockSToFracture: Location[], fractureLevel?: number): void;

    /** Displays a block fracture effect at a location to a player. */
    displayFractureWith(options: DisplayFractureOptions, blockSToFracture: Location[], fractureLevel?: number): void;

    /** Displays a vertical beam on an end gateway to a player. */
    displayGateway(gatewayLocation: Location): void;

    /** Displays a vertical beam on an end gateway to a player. */
    displayGatewayWith(options: DisplayGatewayOptions, gatewayLocation: Location): void;

    /** Highlights a specific block for a player. The highlight is overlaid on a block, showing text on top if provided. */
    displayHighlighter(blockLocation: Location, colorHexadecimal?: string, name?: string, opacityInPercentage?: number, durationMilliseconds?: number): void;

    /** Displays a floating name tag at a location to a player. */
    displayHologram(displayLocation: Location, textToDisplay: ComponentInput): void;

    /** Displays a lightning strike effect to a player. */
    displayLightning(strikeLocation: Location): void;

    /** Displays a pickup animation of one entity being collected by another entity. */
    displayPickup(entityUuid: string, collectorUuid: string): void;

    /** Displays a pickup animation of one entity being collected by another entity. */
    displayPickupWith(options: DisplayPickupOptions, entityUuid: string, collectorUuid: string): void;

    /** Displays text on a sign to a player. */
    displaySignText(signLocation: Location, ...textLineS: ComponentInput[]): void;

    /** Displays text on a sign to a player. */
    displaySignTextWith(options: DisplaySignTextOptions, signLocation: Location, ...textLineS: ComponentInput[]): void;

    /** Allows the player to fly. */
    enableFlight(): void;

    /** Allows the player to damage other players. */
    enablePvp(): void;

    /** Rotates a player to look toward a location without teleporting them. */
    faceLocation(locationToFace: Location): void;

    /** Sets one of the player's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttribute(value?: number): void;

    /** Sets one of the player's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttributeWith(options: FallingAttributeOptions, value?: number): void;

    /** Forces a player to start or stop flying. */
    forceFlight(): void;

    /** Forces a player to start or stop flying. */
    forceFlightWith(options: ForceFlightOptions): void;

    /** Adds exhaustion to a player. */
    giveExhaustion(exhaustionToGive: number): void;

    /** Adds experience points or levels to a player. */
    giveExp(experienceToGive: number): void;

    /** Adds experience points or levels to a player. */
    giveExpWith(options: GiveExpOptions, experienceToGive: number): void;

    /** Adds food to a player. */
    giveFood(foodToGive: number): void;

    /** Adds saturation to a player. */
    giveSaturation(saturationToGive: number): void;

    /** Restores a player's health. */
    heal(amountToHeal: number): void;

    /** Sets one of the player's health-related attributes such as max health and armor defense points. */
    healthAttribute(value?: number): void;

    /** Sets one of the player's health-related attributes such as max health and armor defense points. */
    healthAttributeWith(options: HealthAttributeOptions, value?: number): void;

    /** Hides the player's disguise on their screen. */
    hideDisguise(): void;

    /** Makes a player perform a hurt animation. */
    hurtAnimation(damageSource?: Location): void;

    /** Sets if a player is instantly respawned upon dying. */
    instantRespawn(): void;

    /** Sets if a player is instantly respawned upon dying. */
    instantRespawnWith(options: InstantRespawnOptions): void;

    /** Sets one of the player's knockback-related attributes such as knockback resistance. */
    kbattribute(value?: number): void;

    /** Sets one of the player's knockback-related attributes such as knockback resistance. */
    kbattributeWith(options: KbattributeOptions, value?: number): void;

    /** When this code block is executed, the player will keep the contents of their inventory when they die. */
    keepInv(): void;

    /** Kicks a player from the plot. */
    kick(): void;

    /** Sets a player's regular health, absorption health, or both. */
    lSetHealth(newHealth: number): void;

    /** Sets a player's regular health, absorption health, or both. */
    lSetHealthWith(options: LSetHealthOptions, newHealth: number): void;

    /** Launches a player forward or backward. */
    launchFwd(launchPower: number): void;

    /** Launches a player forward or backward. */
    launchFwdWith(options: LaunchFwdOptions, launchPower: number): void;

    /** Launches a player toward or away from a location. */
    launchToward(launchDestination: Location, launchPower?: number): void;

    /** Launches a player toward or away from a location. */
    launchTowardWith(options: LaunchTowardOptions, launchDestination: Location, launchPower?: number): void;

    /** Launches a player up or down. */
    launchUp(launchPower: number): void;

    /** Launches a player up or down. */
    launchUpWith(options: LaunchUpOptions, launchPower: number): void;

    /** Loads a player's inventory. */
    loadInv(): void;

    /** Loads a player's inventory. */
    loadInvWith(options: LoadInvOptions): void;

    /** Locks a disguise's pitch or yaw values. */
    lockDisgRotation(pitchToLockTo?: number, yawToLockTo?: number): void;

    /** Locks a disguise's pitch or yaw values. */
    lockDisgRotationWith(options: LockDisgRotationOptions, pitchToLockTo?: number, yawToLockTo?: number): void;

    /** Disguises a player as another currently existing entity or player. */
    mimic(uuidOfTargetToDisguiseAs: string): void;

    /** Disguises a player as another currently existing entity or player. */
    mimicWith(options: MimicOptions, uuidOfTargetToDisguiseAs: string): void;

    /** Sets one of the player's mining-related attributes such as break speed and mining efficiency. */
    miningAttribute(value?: number): void;

    /** Sets one of the player's mining-related attributes such as break speed and mining efficiency. */
    miningAttributeWith(options: MiningAttributeOptions, value?: number): void;

    /** Sets one of the player's miscellaneous attributes such as scale and burning time. */
    miscAttribute(value?: number): void;

    /** Sets one of the player's miscellaneous attributes such as scale and burning time. */
    miscAttributeWith(options: MiscAttributeOptions, value?: number): void;

    /** Sets one of the player's movement-related attributes, such as walking speed and jump height. */
    movementAttribute(value?: number): void;

    /** Sets one of the player's movement-related attributes, such as walking speed and jump height. */
    movementAttributeWith(options: MovementAttributeOptions, value?: number): void;

    /** Sets the field of view caused by a player's movement speed. */
    movementFov(movementFieldOfViewPercentage_10_0_150_0?: number): void;

    /** Allows the player's health to regenerate naturally. */
    natRegen(): void;

    /** When this code block is executed, the player will no longer drop the contents of their inventory when they die. */
    noDeathDrops(): void;

    /** When this code block is executed, the player will no longer keep the contents of their inventory when they die. */
    noKeepInv(): void;

    /** Prevents the player's health from regenerating naturally. */
    noNatRegen(): void;

    /** Prevents projectiles from hitting the player. */
    noProjColl(): void;

    /** Opens a container's inventory. Also works with crafting tables. */
    openBlockInv(containerLocation: Location): void;

    /** Opens a sign for a player. Also works with client-side signs. */
    openSign(signLocation: Location): void;

    /** Opens a sign for a player. Also works with client-side signs. */
    openSignWith(options: OpenSignOptions, signLocation: Location): void;

    /** Opens the trading menu of a villager. */
    openTradeMenu(villagerUuid: string): void;

    /** Opens the trading menu of a villager. */
    openTradeMenuWith(options: OpenTradeMenuOptions, villagerUuid: string): void;

    /** Plays a sound that follows a moving entity or player. */
    playEntitySound(soundToPlay: SoundInput[], targetUuid: string): void;

    /** Plays a sound that follows a moving entity or player. */
    playEntitySoundWith(options: PlayEntitySoundOptions, soundToPlay: SoundInput[], targetUuid: string): void;

    /** Plays a sequence of sounds to a player, with a delay between each sound. */
    playSoundSeq(soundsToPlay: SoundInput[], soundDelayTicksDefault_60?: number, playbackLocation?: Location): void;

    /** Plays a sequence of sounds to a player, with a delay between each sound. */
    playSoundSeqWith(options: PlaySoundSeqOptions, soundsToPlay: SoundInput[], soundDelayTicksDefault_60?: number, playbackLocation?: Location): void;

    /** Allows projectiles to hit the player. */
    projColl(): void;

    /** Prompts the player to purchase a plot product. */
    promptPurchase(productId: string): void;

    /** Sets one of the player's reach-related attributes such as block and entity interaction ranges. */
    reachAttribute(value?: number): void;

    /** Sets one of the player's reach-related attributes such as block and entity interaction ranges. */
    reachAttributeWith(options: ReachAttributeOptions, value?: number): void;

    /** Removes a boss health bar from a player's screen. */
    removeBossBar(): void;

    /** Removes a boss health bar from a player's screen. */
    removeBossBarWith(options: RemoveBossBarOptions): void;

    /** Removes the given number of rows from the bottom of a player's current inventory menu. */
    removeInvRow(rowsToRemove?: number): void;

    /** Removes the given number of rows from the bottom of a player's current inventory menu. */
    removeInvRowWith(options: RemoveInvRowOptions, rowsToRemove?: number): void;

    /** Removes a score from the scoreboard. */
    removeScore(scoreName: ComponentInput): void;

    /** Send a resource pack to a player. */
    resourcePack(resourcePackUrl: string): void;

    /** Respawns a player if they are dead. */
    respawn(): void;

    /** Mounts a player on top of another player or entity. */
    rideEntity(targetUuid: string): void;

    /** Mounts a player on top of another player or entity. */
    rideEntityWith(options: RideEntityOptions, targetUuid: string): void;

    /** Removes a player's world border. */
    rmWorldBorder(): void;

    /** Teleports a player to a random location in the chest. */
    rngTeleport(...locationsToChooseFrom: Location[]): void;

    /** Teleports a player to a random location in the chest. */
    rngTeleportWith(options: RngTeleportOptions, ...locationsToChooseFrom: Location[]): void;

    /** Undoes the interactions with blocks by a player. */
    rollbackBlocks(rollbackTime?: number): void;

    /** Saves a player's inventory. It can be loaded later with 'Load Saved Inventory'. */
    saveInv(): void;

    /** Sets the default number format of the player's scoreboard. */
    scoreDefFormat(contentOrStyle: ComponentInput): void;

    /** Sets the default number format of the player's scoreboard. */
    scoreDefFormatWith(options: ScoreDefFormatOptions, contentOrStyle: ComponentInput): void;

    /** Sets the number format of a single line in the player's scoreboard. */
    scoreLineFormat(scoreName: ComponentInput, contentOrStyle: ComponentInput): void;

    /** Sets the number format of a single line in the player's scoreboard. */
    scoreLineFormatWith(options: ScoreLineFormatOptions, scoreName: ComponentInput, contentOrStyle: ComponentInput): void;

    /** Makes a player perform an animation. */
    sendAnimation(): void;

    /** Makes a player perform an animation. */
    sendAnimationWith(options: SendAnimationOptions): void;

    /** Sends a message to a player. When the player moves over it with their cursor, a second message appears. */
    sendHover(messageToSendInChat: string, messageToSeeOnHover: string): void;

    /** Sends a chat message to a player. */
    sendMessage(...messages: ComponentInput[]): void;

    /** Sends a chat message to a player. */
    sendMessageWith(options: SendMessageOptions, ...messages: ComponentInput[]): void;

    /** Sends a series of messages in chat to a player, with a delay after each message. */
    sendMessageSeq(messagesToSend: ComponentInput[], messageDelayTicks?: number): void;

    /** Sends a series of messages in chat to a player, with a delay after each message. */
    sendMessageSeqWith(options: SendMessageSeqOptions, messagesToSend: ComponentInput[], messageDelayTicks?: number): void;

    /** Displays text in the center of a player's screen. */
    sendTitle(titleText: ComponentInput, subtitleText?: ComponentInput, titleDuration?: number, fadeInLength?: number, fadeOutLength?: number): void;

    /** Sends a player to another plot. */
    sendToPlot(plotHandleOrId: string): void;

    /** Sets a player's absorption health (golden hearts). */
    setAbsorption(absorptionHealth: number): void;

    /** Sets a player's remaining breath ticks. */
    setAirTicks(breathTicks: number): void;

    /** Sets whether a player is able to enter and exit flight mode by double tapping jump. */
    setAllowFlight(): void;

    /** Sets whether a player is able to enter and exit flight mode by double tapping jump. */
    setAllowFlightWith(options: SetAllowFlightOptions): void;

    /** Sets whether a player can hurt or be hurt by other players. */
    setAllowPvp(): void;

    /** Sets whether a player can hurt or be hurt by other players. */
    setAllowPvpWith(options: SetAllowPvpOptions): void;

    /** Sets the amount of arrows sticking out of a player's character model. */
    setArrowsStuck(arrowCount?: number): void;

    /** Sets a player's attack speed. */
    setAtkSpeed(attackSpeed?: number): void;

    /** Sets a player's chat tag. */
    setChatTag(...chatTag: ComponentInput[]): void;

    /** Sets whether a player is able to collide with other entities. */
    setCollidable(): void;

    /** Sets whether a player is able to collide with other entities. */
    setCollidableWith(options: SetCollidableOptions): void;

    /** Sets the location compasses point to for a player. */
    setCompass(newTarget: Location): void;

    /** Sets a player's ability to see their own disguise. It is recommended that it is almost always hidden. */
    setDisguiseVisible(): void;

    /** Sets a player's ability to see their own disguise. It is recommended that it is almost always hidden. */
    setDisguiseVisibleWith(options: SetDisguiseVisibleOptions): void;

    /** Sets whether a player drops their items when dead. */
    setDropsEnabled(): void;

    /** Sets whether a player drops their items when dead. */
    setDropsEnabledWith(options: SetDropsEnabledOptions): void;

    /** Sets if an entity is hidden to a target. */
    setEntityHidden(...entityUuids: string[]): void;

    /** Sets if an entity is hidden to a target. */
    setEntityHiddenWith(options: SetEntityHiddenOptions, ...entityUuids: string[]): void;

    /** Sets a player's exhaustion level. */
    setExhaustion(exhaustionLevel_0_4: number): void;

    /** Sets a player's experience level, points or progress. */
    setExp(experienceToSet: number): void;

    /** Sets a player's experience level, points or progress. */
    setExpWith(options: SetExpOptions, experienceToSet: number): void;

    /** Sets a player's fall distance, affecting fall damage upon landing. */
    setFallDistance(fallDistanceBlocks: number): void;

    /** Sets the remaining time a player is on fire for. */
    setFireTicks(ticks: number): void;

    /** Sets whether a player is flying. */
    setFlying(): void;

    /** Sets whether a player is flying. */
    setFlyingWith(options: SetFlyingOptions): void;

    /** Sets how far the fog is displayed to a player. */
    setFogDistance(fogDistanceInChunks_2_7: number): void;

    /** Sets a player's food hunger level. */
    setFoodLevel(foodLevel_1_20: number): void;

    /** Sets how long a player is frozen for. */
    setFreezeTicks(ticks_0_140: number): void;

    /** Sets how long a player is frozen for. */
    setFreezeTicksWith(options: SetFreezeTicksOptions, ticks_0_140: number): void;

    /** Sets a player's gamemode. */
    setGamemode(): void;

    /** Sets a player's gamemode. */
    setGamemodeWith(options: SetGamemodeOptions): void;

    /** Sets whether a player is gliding with elytra. */
    setGliding(): void;

    /** Sets whether a player is gliding with elytra. */
    setGlidingWith(options: SetGlidingOptions): void;

    /** Sets if a player is allowed to interact with their hand-crafting menu. */
    setHandCrafting(): void;

    /** Sets if a player is allowed to interact with their hand-crafting menu. */
    setHandCraftingWith(options: SetHandCraftingOptions): void;

    /** Sets a player's current health. */
    setHealth(health: number): void;

    /** Renames a player's current inventory menu. */
    setInvName(...inventoryName: ComponentInput[]): void;

    /** Sets whether a player's inventory is kept after death. */
    setInventoryKept(): void;

    /** Sets whether a player's inventory is kept after death. */
    setInventoryKeptWith(options: SetInventoryKeptOptions): void;

    /** Sets the currently remaining ticks until a player can next be hurt. */
    setInvulTicks(ticks: number): void;

    /** Sets a player's maximum health. */
    setMaxHealth(maximumHealth: number): void;

    /** Sets a player's maximum health. */
    setMaxHealthWith(options: SetMaxHealthOptions, maximumHealth: number): void;

    /** Sets the prefix or suffix for the player's name. */
    setNamePrefix(...prefixSuffixText: ComponentInput[]): void;

    /** Sets the prefix or suffix for the player's name. */
    setNamePrefixWith(options: SetNamePrefixOptions, ...prefixSuffixText: ComponentInput[]): void;

    /** Sets whether a player's name tag is visible. */
    setNameVisible(): void;

    /** Sets whether a player's name tag is visible. */
    setNameVisibleWith(options: SetNameVisibleOptions): void;

    /** Sets the time of day visible to a player. */
    setPlayerTime(daylightTicks: number): void;

    /** Sets the type of weather visible to a player. */
    setPlayerWeather(): void;

    /** Sets the type of weather visible to a player. */
    setPlayerWeatherWith(options: SetPlayerWeatherOptions): void;

    /** Sets the heaviness of rain and storm visible to a player. */
    setRainLevel(rainLevel: number, stormLevel: number): void;

    /** When enabled, a player won't be able to see their coordinates, block info, or other info. */
    setReducedDebug(): void;

    /** When enabled, a player won't be able to see their coordinates, block info, or other info. */
    setReducedDebugWith(options: SetReducedDebugOptions): void;

    /** Changes a player's pitch and yaw. */
    setRotation(pitch_90To_90: number, yaw_180To_180: number): void;

    /** Sets a player's saturation level. */
    setSaturation(saturationLevel_1_20: number): void;

    /** Sets a score on the scoreboard. */
    setScore(scoreName: ComponentInput, scoreValue?: number): void;

    /** Sets the objective name of the scoreboard sidebar. */
    setScoreObj(objectiveName: ComponentInput): void;

    /** Displays a parrot on the targets' shoulders. */
    setShoulder(): void;

    /** Displays a parrot on the targets' shoulders. */
    setShoulderWith(options: SetShoulderOptions): void;

    /** Sets whether the scoreboard sidebar is visible to a player. */
    setSidebar(): void;

    /** Sets whether the scoreboard sidebar is visible to a player. */
    setSidebarWith(options: SetSidebarOptions): void;

    /** Sets a player's selected hotbar slot. */
    setSlot(newSlot: number): void;

    /** Sets the location a player will spawn when they die and respawn. */
    setSpawnPoint(theNewSpawnLocation: Location): void;

    /** Sets a player's walking and/or flight speed. */
    setSpeed(movementSpeedPercentage_0To_1000: number): void;

    /** Sets a player's walking and/or flight speed. */
    setSpeedWith(options: SetSpeedOptions, movementSpeedPercentage_0To_1000: number): void;

    /** Sets the player's game status, which is used to display information about what the player is doing in the game. */
    setStatus(gameStatus: ComponentInput): void;

    /** Sets the amount of bee stings sticking out of a player's character model. */
    setStingsStuck(stingCount?: number): void;

    /** Sets the text to be displayed above or below a player's player list shown when pressing Tab. */
    setTabListInfo(...headerFooterText: ComponentInput[]): void;

    /** Sets the text to be displayed above or below a player's player list shown when pressing Tab. */
    setTabListInfoWith(options: SetTabListInfoOptions, ...headerFooterText: ComponentInput[]): void;

    /** Changes the tick rate of a player. */
    setTickRate(ticksPerSecond_0_20?: number): void;

    /** Sets whether a player should appear on fire. */
    setVisualFire(): void;

    /** Sets whether a player should appear on fire. */
    setVisualFireWith(options: SetVisualFireOptions): void;

    /** Creates a world border only visible to a player. */
    setWorldBorder(centerPosition: Location, radiusInBlocks: number, warningDistance?: number): void;

    /** Sets the XP progress bar to a certain percentage. */
    setXpprog(progress_0_100: number): void;

    /** Changes a player's world border size if they have one active. */
    shiftWorldBorder(newRadius: number, blocksPerSecond?: number): void;

    /** Shows the player's disguise on their screen. */
    showDisguise(): void;

    /** Makes a player spectate another player or entity. */
    spectateTarget(targetUuid: string): void;

    /** Makes a player spectate another player or entity. */
    spectateTargetWith(options: SpectateTargetOptions, targetUuid: string): void;

    /** Toggles whether a player collides with blocks in spectator mode. */
    spectatorCollision(): void;

    /** Toggles whether a player collides with blocks in spectator mode. */
    spectatorCollisionWith(options: SpectatorCollisionOptions): void;

    /** Sets a player's game mode to Spectator. */
    spectatorMode(): void;

    /** Stops all or specific sounds for a player. */
    stopSound(...soundsToStop: SoundInput[]): void;

    /** Stops all or specific sounds for a player. */
    stopSoundWith(options: StopSoundOptions, ...soundsToStop: SoundInput[]): void;

    /** Sets a player's game mode to Survival. */
    survivalMode(): void;

    /** Teleports a player to a location. */
    teleport(newPosition: Location): void;

    /** Teleports a player to a location. */
    teleportWith(options: TeleportOptions, newPosition: Location): void;

    /** Teleports a player to multiple locations, with a delay between each teleport. */
    tpSequence(locationsToTeleportTo: Location[], teleportDelayTicksDefault_60?: number): void;

    /** Removes a player's disguise. */
    undisguise(): void;

    /** Displays a Sculk Sensor vibration to a player. */
    vibration(originLocation: Location, targetLocation: Location, arrivalTime?: number): void;

    /** Displays the wake up (fade in) animation to a player. */
    wakeUpAnimation(): void;

    /** Sets a player's walk speed. */
    walkSpeed(ofNormalWalkSpeed_0To_500: number): void;

    /** Sets the weather to clear weather for the target only. */
    weatherClear(): void;

    /** Sets the weather to downfall (rain) for the target only. */
    weatherRain(): void;
}
