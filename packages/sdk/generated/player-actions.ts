// This file is generated. Do not edit manually.

import type { AnyValueInput, ComponentInput, Item, Location, SoundInput } from "../values/index";

/** Options for actionBar. */
export interface ActionBarOptions {
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

/** Options for addInvRow. */
export interface AddInvRowOptions {
    /** Default: "bottomRow" */
    readonly newRowPosition?: "topRow" | "bottomRow";
}

/** Options for attackAnimation. */
export interface AttackAnimationOptions {
    /** Default: "swingMainArm" */
    readonly animationArm?: "swingMainArm" | "swingOffArm";
}

/** Options for clearInv. */
export interface ClearInvOptions {
    /** Default: "entireInventory" */
    readonly clearMode?: "entireInventory" | "mainInventory" | "upperInventory" | "hotbar" | "armor";
    /** Default: true */
    readonly clearCraftingAndCursor?: boolean;
}

/** Options for combatAttribute. */
export interface CombatAttributeOptions {
    /** Default: "attackDamage" */
    readonly attribute?: "attackDamage" | "attackSpeed" | "sweepingDamageRatio";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for damage. */
export interface DamageOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for displayBellRing. */
export interface DisplayBellRingOptions {
    /** Default: "north" */
    readonly ringDirection?: "north" | "south" | "west" | "east";
}

/** Options for displayBlockOpen. */
export interface DisplayBlockOpenOptions {
    /** Default: "open" */
    readonly containerState?: "open" | "closed";
}

/** Options for displayFracture. */
export interface DisplayFractureOptions {
    /** Default: true */
    readonly overwritePreviousFracture?: boolean;
}

/** Options for displayGateway. */
export interface DisplayGatewayOptions {
    /** Default: "initialBeam" */
    readonly animationType?: "initialBeam" | "periodicBeam";
}

/** Options for displayPickup. */
export interface DisplayPickupOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for displaySignText. */
export interface DisplaySignTextOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
    /** Default: "black" */
    readonly textColor?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black";
    /** Default: "disable" */
    readonly glowing?: "enable" | "disable";
}

/** Options for fallingAttribute. */
export interface FallingAttributeOptions {
    /** Default: "gravity" */
    readonly attribute?: "gravity" | "safeFallDistance" | "fallDamageMultiplier";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for getTargetEntity. */
export interface GetTargetEntityOptions {
    /** Default: false */
    readonly ignoreBlocks?: boolean;
}

/** Options for giveExp. */
export interface GiveExpOptions {
    /** Default: "points" */
    readonly giveExperience?: "points" | "levels" | "levelPercentage";
}

/** Options for healthAttribute. */
export interface HealthAttributeOptions {
    /** Default: "maximumHealth" */
    readonly attribute?: "maximumHealth" | "maximumAbsorptionHealth" | "armor" | "armorToughness";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for instantRespawn. */
export interface InstantRespawnOptions {
    /** Default: "enable" */
    readonly instantRespawn?: "enable" | "disable";
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

/** Options for loadInv. */
export interface LoadInvOptions {
    /** Default: "synchronous" */
    readonly codeFlow?: "synchronous" | "asynchronous";
}

/** Options for lockDisgRotation. */
export interface LockDisgRotationOptions {
    /** Default: "noChange" */
    readonly pitch?: "lock" | "unlock" | "noChange";
    /** Default: "noChange" */
    readonly yaw?: "lock" | "unlock" | "noChange";
}

/** Options for mimic. */
export interface MimicOptions {
    /** Default: "enable" */
    readonly removeOriginalEntity?: "enable" | "disable";
}

/** Options for miningAttribute. */
export interface MiningAttributeOptions {
    /** Default: "blockBreakSpeed" */
    readonly attribute?: "blockBreakSpeed" | "miningEfficiency" | "submergedMiningSpeed";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for miscAttribute. */
export interface MiscAttributeOptions {
    /** Default: "scale" */
    readonly attribute?: "scale" | "luck" | "oxygenBonus" | "burningTime" | "cameraDistance";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for movementAttribute. */
export interface MovementAttributeOptions {
    /** Default: "walkingSpeed" */
    readonly attribute?: "walkingSpeed" | "flyingSpeed" | "jumpStrength" | "sneakingSpeed" | "stepHeight" | "movementEfficiency" | "waterMovementEfficiency";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for openSign. */
export interface OpenSignOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
}

/** Options for openTradeMenu. */
export interface OpenTradeMenuOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for playEntitySound. */
export interface PlayEntitySoundOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for playSound. */
export interface PlaySoundOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
}

/** Options for playSoundSeq. */
export interface PlaySoundSeqOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
}

/** Options for reachAttribute. */
export interface ReachAttributeOptions {
    /** Default: "blockInteractionRange" */
    readonly attribute?: "blockInteractionRange" | "entityInteractionRange";
    /** Default: "direct" */
    readonly valueType?: "direct" | "percentageBase" | "percentageRelative";
}

/** Options for removeInvRow. */
export interface RemoveInvRowOptions {
    /** Default: "bottomRow" */
    readonly rowToRemove?: "topRow" | "bottomRow";
}

/** Options for rideEntity. */
export interface RideEntityOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for scoreDefFormat. */
export interface ScoreDefFormatOptions {
    /** Default: "fixed" */
    readonly numberFormat?: "fixed" | "styled" | "blank" | "reset";
}

/** Options for scoreLineFormat. */
export interface ScoreLineFormatOptions {
    /** Default: "fixed" */
    readonly numberFormat?: "fixed" | "styled" | "blank" | "reset";
}

/** Options for sendAdvancement. */
export interface SendAdvancementOptions {
    /** Default: "advancement" */
    readonly toastType?: "advancement" | "goal" | "challenge";
}

/** Options for sendMessage. */
export interface SendMessageOptions {
    /** Default: "regular" */
    readonly alignment?: "regular" | "centered";
    /** Default: "addSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

/** Options for sendMessageSeq. */
export interface SendMessageSeqOptions {
    /** Default: "regular" */
    readonly alignment?: "regular" | "centered";
}

/** Options for setAllowFlight. */
export interface SetAllowFlightOptions {
    /** Default: "enable" */
    readonly allowFlight?: "enable" | "disable";
}

/** Options for setAllowPvp. */
export interface SetAllowPvpOptions {
    /** Default: "disable" */
    readonly pvp?: "enable" | "disable";
}

/** Options for setBossBar. */
export interface SetBossBarOptions {
    /** Default: "solid" */
    readonly barStyle?: "solid" | "6Segments" | "10Segments" | "12Segments" | "20Segments";
    /** Default: "none" */
    readonly skyEffect?: "none" | "createFog" | "darkenSky" | "both";
    /** Default: "purple" */
    readonly barColor?: "red" | "purple" | "pink" | "blue" | "green" | "yellow" | "white";
}

/** Options for setCollidable. */
export interface SetCollidableOptions {
    /** Default: "disable" */
    readonly collision?: "enable" | "disable";
}

/** Options for setDisguiseVisible. */
export interface SetDisguiseVisibleOptions {
    /** Default: "disable" */
    readonly disguiseVisible?: "enable" | "disable";
}

/** Options for setDropsEnabled. */
export interface SetDropsEnabledOptions {
    /** Default: "enable" */
    readonly spawnDeathDrops?: "enable" | "disable";
}

/** Options for setEntityHidden. */
export interface SetEntityHiddenOptions {
    /** Default: "enable" */
    readonly hidden?: "enable" | "disable";
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for setEquipment. */
export interface SetEquipmentOptions {
    /** Default: "mainHand" */
    readonly equipmentSlot?: "mainHand" | "offHand" | "head" | "chest" | "legs" | "feet";
}

/** Options for setExp. */
export interface SetExpOptions {
    /** Default: "level" */
    readonly setExperience?: "points" | "level" | "levelPercentage";
}

/** Options for setFlying. */
export interface SetFlyingOptions {
    /** Default: "enable" */
    readonly flying?: "enable" | "disable";
}

/** Options for setFreezeTicks. */
export interface SetFreezeTicksOptions {
    /** Default: "disable" */
    readonly tickingLocked?: "enable" | "disable";
}

/** Options for setGliding. */
export interface SetGlidingOptions {
    /** Default: "enable" */
    readonly gliding?: "enable" | "disable";
}

/** Options for setHandCrafting. */
export interface SetHandCraftingOptions {
    /** Default: "disable" */
    readonly allowHandCrafting?: "enable" | "disable";
}

/** Options for setInvName. */
export interface SetInvNameOptions {
    /** Default: "regular" */
    readonly alignment?: "regular" | "centered";
}

/** Options for setInventoryKept. */
export interface SetInventoryKeptOptions {
    /** Default: "enable" */
    readonly inventoryKept?: "enable" | "disable";
}

/** Options for setMaxHealth. */
export interface SetMaxHealthOptions {
    /** Default: false */
    readonly healPlayerToMaxHealth?: boolean;
}

/** Options for setNameColor. */
export interface SetNameColorOptions {
    /** Default: "black" */
    readonly nameColor?: "black" | "darkBlue" | "darkGreen" | "darkAqua" | "darkRed" | "darkPurple" | "gold" | "gray" | "darkGray" | "blue" | "green" | "aqua" | "red" | "lightPurple" | "yellow" | "white" | "none";
}

/** Options for setNamePrefix. */
export interface SetNamePrefixOptions {
    /** Default: "prefix" */
    readonly textType?: "prefix" | "suffix";
}

/** Options for setNameVisible. */
export interface SetNameVisibleOptions {
    /** Default: "disable" */
    readonly nameTagVisible?: "enable" | "disable";
}

/** Options for setPlayerWeather. */
export interface SetPlayerWeatherOptions {
    /** Default: "downfall" */
    readonly weather?: "clear" | "downfall";
}

/** Options for setReducedDebug. */
export interface SetReducedDebugOptions {
    /** Default: "enable" */
    readonly reducedDebugInfoEnabled?: "enable" | "disable";
}

/** Options for setShoulder. */
export interface SetShoulderOptions {
    /** Default: "left" */
    readonly shoulder?: "left" | "right";
    /** Default: "remove" */
    readonly type?: "remove" | "red" | "blue" | "green" | "cyan" | "gray";
}

/** Options for setSidebar. */
export interface SetSidebarOptions {
    /** Default: "enable" */
    readonly sidebar?: "enable" | "disable";
}

/** Options for setTabListInfo. */
export interface SetTabListInfoOptions {
    /** Default: "header" */
    readonly playerListField?: "header" | "footer";
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

/** Options for setVisualFire. */
export interface SetVisualFireOptions {
    /** Default: "enable" */
    readonly onFire?: "enable" | "disable";
}

/** Options for spectateTarget. */
export interface SpectateTargetOptions {
    /** Default: true */
    readonly ignoreFormatting?: boolean;
}

/** Options for spectatorCollision. */
export interface SpectatorCollisionOptions {
    /** Default: "enable" */
    readonly spectatorCollision?: "enable" | "disable";
}

/** Options for stopSound. */
export interface StopSoundOptions {
    /** Default: "master" */
    readonly soundSource?: "master" | "music" | "jukeboxNoteBlocks" | "weather" | "blocks" | "hostileCreatures" | "friendlyCreatures" | "players" | "ambientEnvironment" | "voiceSpeech" | "ui";
}

/** Options for teleport. */
export interface TeleportOptions {
    /** Default: false */
    readonly keepCurrentRotation?: boolean;
    /** Default: false */
    readonly keepVelocity?: boolean;
}

export interface PlayerActions {
    /** Displays text directly above a player's hotbar. */
    actionBar(...messages: [ComponentInput, ...ComponentInput[]]): void;

    /** Displays text directly above a player's hotbar. */
    actionBarWith(options: ActionBarOptions, ...messages: [ComponentInput, ...ComponentInput[]]): void;

    /** Adds a row to the bottom of a player's current inventory menu. */
    addInvRow(...itemsToDisplay: Item[]): void;

    /** Adds a row to the bottom of a player's current inventory menu. */
    addInvRowWith(options: AddInvRowOptions, ...itemsToDisplay: Item[]): void;

    /** Sets a player's game mode to Adventure. */
    adventureMode(): void;

    /** Makes a player perform an attack animation. */
    attackAnimation(): void;

    /** Makes a player perform an attack animation. */
    attackAnimationWith(options: AttackAnimationOptions): void;

    /** Disguises a player as a block. */
    blockDisguise(blockToDisguiseAs: Item, displayName?: ComponentInput): void;

    /** Boosts a player's elytra using a firework rocket. */
    boostElytra(firework: Item): void;

    /** Sets a player's chat color or decoration. */
    chatStyle(newChatStyle?: ComponentInput): void;

    /** Displays the real block at a location to a player, effectively removing any client-side blocks. */
    clearDispBlock(blockLocationOrStartOfRegion: Location, endOfRegion?: Location): void;

    /** Empties a player's inventory. */
    clearInv(): void;

    /** Empties a player's inventory. */
    clearInvWith(options: ClearInvOptions): void;

    /** Removes all of an item from a player. */
    clearItems(...itemsToClear: [Item, ...Item[]]): void;

    /** Removes all active potion effects from a player. */
    clearPotions(): void;

    /** Removes all scores from the scoreboard. */
    clearScoreboard(): void;

    /** Closes a player's inventory. */
    closeInv(): void;

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

    /** Prevents a player from placing and breaking certain blocks. */
    disableBlocks(...blocksToDisallow: Item[]): void;

    /** Shifts the disguise of a player up or down relative to the player. */
    disguiseShiftVert(yOffset: number): void;

    /** Changes a head's texture at a location for a player. */
    dispHeadTexture(headLocation: Location, playerHead: Item | string): void;

    /** Displays a bell ring animation at a location to a player. */
    displayBellRing(blockLocation: Location): void;

    /** Displays a bell ring animation at a location to a player. */
    displayBellRingWith(options: DisplayBellRingOptions, blockLocation: Location): void;

    /** Displays a block at a location to a player. */
    displayBlock(blockToDisplay: Item, blockLocationOrStartOfRegion: Location, endOfRegion?: Location, ...blockData: string[]): void;

    /** Displays a container block at a location as being open or closed to a player. */
    displayBlockOpen(blockLocation: Location): void;

    /** Displays a container block at a location as being open or closed to a player. */
    displayBlockOpenWith(options: DisplayBlockOpenOptions, blockLocation: Location): void;

    /** Displays equipment on an entity to a player. Equipment goes from slots 2-7 in order of Helmet, Chestplate, Leggings, Boots, Main Hand, Off Hand. */
    displayEquipment(entityUuidOrName: string, ...equipment: [Item, ...Item[]]): void;

    /** Displays a block fracture effect at a location to a player. */
    displayFracture(blocksToFracture: [Location, ...Location[]], fractureLevel?: number): void;

    /** Displays a block fracture effect at a location to a player. */
    displayFractureWith(options: DisplayFractureOptions, blocksToFracture: [Location, ...Location[]], fractureLevel?: number): void;

    /** Displays a vertical beam on an end gateway to a player. */
    displayGateway(gatewayLocation: Location): void;

    /** Displays a vertical beam on an end gateway to a player. */
    displayGatewayWith(options: DisplayGatewayOptions, gatewayLocation: Location): void;

    /** Displays a floating name tag at a location to a player. */
    displayHologram(displayLocation: Location, textToDisplay?: ComponentInput): void;

    /** Displays a lightning strike effect to a player. */
    displayLightning(strikeLocation: Location): void;

    /** Displays a pickup animation of one entity being collected by another entity. */
    displayPickup(entityUuid: string, collectorUuid: string): void;

    /** Displays a pickup animation of one entity being collected by another entity. */
    displayPickupWith(options: DisplayPickupOptions, entityUuid: string, collectorUuid: string): void;

    /** Displays text on a sign to a player. */
    displaySignText(signLocation: Location, ...textLines: ComponentInput[]): void;

    /** Displays text on a sign to a player. */
    displaySignTextWith(options: DisplaySignTextOptions, signLocation: Location, ...textLines: ComponentInput[]): void;

    /** Allows a player to place and break certain blocks. */
    enableBlocks(...blocksToAllow: Item[]): void;

    /** Adds 3 more rows to a player's current inventory menu using the contents of the chest. */
    expandInv(...itemsToDisplay: Item[]): void;

    /** Rotates a player to look toward a location without teleporting them. */
    faceLocation(locationToFace: Location): void;

    /** Sets one of the player's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttribute(value?: number): void;

    /** Sets one of the player's falling-related attributes, such as gravity and fall damage multiplier. */
    fallingAttributeWith(options: FallingAttributeOptions, value?: number): void;

    getTargetEntity(): void;

    getTargetEntityWith(options: GetTargetEntityOptions): void;

    /** Adds exhaustion to a player. */
    giveExhaustion(exhaustionToGive: number): void;

    /** Adds experience points or levels to a player. */
    giveExp(experienceToGive: number): void;

    /** Adds experience points or levels to a player. */
    giveExpWith(options: GiveExpOptions, experienceToGive: number): void;

    /** Adds food to a player. */
    giveFood(foodToGive: number): void;

    /** Gives a player all of the items in the chest. */
    giveItems(itemsToGive: [Item, ...Item[]], amountToGive?: number): void;

    /** Adds saturation to a player. */
    giveSaturation(saturationToGive: number): void;

    /** Restores a player's health. */
    heal(amountToHeal?: number): void;

    /** Sets one of the player's health-related attributes such as max health and armor defense points. */
    healthAttribute(value?: number): void;

    /** Sets one of the player's health-related attributes such as max health and armor defense points. */
    healthAttributeWith(options: HealthAttributeOptions, value?: number): void;

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

    /** Kicks a player from the plot. */
    kick(): void;

    /** Launches a player forward or backward. */
    launchFwd(launchPower: number): void;

    /** Launches a player forward or backward. */
    launchFwdWith(options: LaunchFwdOptions, launchPower: number): void;

    /** Launches a projectile from a player. */
    launchProj(projectileToLaunch: Item, launchPoint?: Location, projectileName?: ComponentInput, speed?: number, inaccuracy?: number): void;

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
    mimic(...uuidOfTargetToDisguiseAs: [string, ...string[]]): void;

    /** Disguises a player as another currently existing entity or player. */
    mimicWith(options: MimicOptions, ...uuidOfTargetToDisguiseAs: [string, ...string[]]): void;

    /** Sets one of the player's mining-related attributes such as break speed and mining efficiency. */
    miningAttribute(value?: number): void;

    /** Sets one of the player's mining-related attributes such as break speed and mining efficiency. */
    miningAttributeWith(options: MiningAttributeOptions, value?: number): void;

    /** Sets one of the player's miscellaneous attributes such as scale and burning time. */
    miscAttribute(value?: number): void;

    /** Sets one of the player's miscellaneous attributes such as scale and burning time. */
    miscAttributeWith(options: MiscAttributeOptions, value?: number): void;

    /** Disguises a player as a mob. */
    mobDisguise(mobToDisguiseAs: Item, displayName?: ComponentInput): void;

    /** Sets one of the player's movement-related attributes, such as walking speed and jump height. */
    movementAttribute(value?: number): void;

    /** Sets one of the player's movement-related attributes, such as walking speed and jump height. */
    movementAttributeWith(options: MovementAttributeOptions, value?: number): void;

    /** Opens a container's inventory. Also works with crafting tables. */
    openBlockInv(containerLocation: Location): void;

    /** Opens a written book menu for a player. */
    openBook(bookItem: Item): void;

    /** Opens a sign for a player. Also works with client-side signs. */
    openSign(signLocation: Location): void;

    /** Opens a sign for a player. Also works with client-side signs. */
    openSignWith(options: OpenSignOptions, signLocation: Location): void;

    /** Opens the trading menu of a villager. */
    openTradeMenu(villagerUuid: string): void;

    /** Opens the trading menu of a villager. */
    openTradeMenuWith(options: OpenTradeMenuOptions, villagerUuid: string): void;

    /** Plays a sound that follows a moving entity or player. */
    playEntitySound(soundToPlay: [SoundInput, ...SoundInput[]], ...targetUuid: [string, ...string[]]): void;

    /** Plays a sound that follows a moving entity or player. */
    playEntitySoundWith(options: PlayEntitySoundOptions, soundToPlay: [SoundInput, ...SoundInput[]], ...targetUuid: [string, ...string[]]): void;

    /** Plays a sound for a player. */
    playSound(soundToPlay: [SoundInput, ...SoundInput[]], playbackLocation?: Location): void;

    /** Plays a sound for a player. */
    playSoundWith(options: PlaySoundOptions, soundToPlay: [SoundInput, ...SoundInput[]], playbackLocation?: Location): void;

    /** Plays a sequence of sounds to a player, with a delay between each sound. */
    playSoundSeq(soundsToPlay: [SoundInput, ...SoundInput[]], soundDelayTicksDefault_60?: number, playbackLocation?: Location): void;

    /** Plays a sequence of sounds to a player, with a delay between each sound. */
    playSoundSeqWith(options: PlaySoundSeqOptions, soundsToPlay: [SoundInput, ...SoundInput[]], soundDelayTicksDefault_60?: number, playbackLocation?: Location): void;

    /** Disguises a player as another player. */
    playerDisguise(playerNameToDisguiseAs: ComponentInput, displaySkin?: Item): void;

    /** Prompts the player to purchase a plot product. */
    promptPurchase(productId: string): void;

    /** Sets one of the player's reach-related attributes such as block and entity interaction ranges. */
    reachAttribute(value?: number): void;

    /** Sets one of the player's reach-related attributes such as block and entity interaction ranges. */
    reachAttributeWith(options: ReachAttributeOptions, value?: number): void;

    /** Removes a boss health bar from a player's screen. */
    removeBossBar(bossBarPosition?: number): void;

    /** Removes the given number of rows from the bottom of a player's current inventory menu. */
    removeInvRow(rowsToRemove?: number): void;

    /** Removes the given number of rows from the bottom of a player's current inventory menu. */
    removeInvRowWith(options: RemoveInvRowOptions, rowsToRemove?: number): void;

    /** Removes items from a player. */
    removeItems(...itemsToRemove: [Item, ...Item[]]): void;

    /** Removes a score from the scoreboard. */
    removeScore(scoreName: ComponentInput): void;

    /** Replaces items in a player's inventory with the given item. */
    replaceItems(itemsToReplace: Item[] | undefined, itemToReplaceWith: Item, amountOfItemsToReplace?: number): void;

    /** Send a resource pack to a player. */
    resourcePack(resourcePackUrl: string): void;

    /** Mounts a player on top of another player or entity. */
    rideEntity(...targetUuid: string[]): void;

    /** Mounts a player on top of another player or entity. */
    rideEntityWith(options: RideEntityOptions, ...targetUuid: string[]): void;

    /** Removes a player's world border. */
    rmWorldBorder(): void;

    /** Undoes the interactions with blocks by a player. */
    rollbackBlocks(rollbackTime?: number): void;

    /** Saves a player's inventory. It can be loaded later with 'Load Saved Inventory'. */
    saveInv(): void;

    /** Sets the default number format of the player's scoreboard. */
    scoreDefFormat(contentOrStyle?: ComponentInput): void;

    /** Sets the default number format of the player's scoreboard. */
    scoreDefFormatWith(options: ScoreDefFormatOptions, contentOrStyle?: ComponentInput): void;

    /** Sets the number format of a single line in the player's scoreboard. */
    scoreLineFormat(scoreName: ComponentInput, contentOrStyle?: ComponentInput): void;

    /** Sets the number format of a single line in the player's scoreboard. */
    scoreLineFormatWith(options: ScoreLineFormatOptions, scoreName: ComponentInput, contentOrStyle?: ComponentInput): void;

    /** Displays a custom advancement popup to a player. */
    sendAdvancement(advancementName: ComponentInput, advancementIcon?: Item): void;

    /** Displays a custom advancement popup to a player. */
    sendAdvancementWith(options: SendAdvancementOptions, advancementName: ComponentInput, advancementIcon?: Item): void;

    /** Sends a chat message to a player. */
    sendMessage(...messages: AnyValueInput[]): void;

    /** Sends a chat message to a player. */
    sendMessageWith(options: SendMessageOptions, ...messages: AnyValueInput[]): void;

    /** Sends a series of messages in chat to a player, with a delay after each message. */
    sendMessageSeq(messagesToSend: [ComponentInput, ...ComponentInput[]], messageDelayTicks?: number): void;

    /** Sends a series of messages in chat to a player, with a delay after each message. */
    sendMessageSeqWith(options: SendMessageSeqOptions, messagesToSend: [ComponentInput, ...ComponentInput[]], messageDelayTicks?: number): void;

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

    /** Sets a player's armor items. Place the armor in slots 1-4 of the chest, with 1 being the helmet and 4 being the boots. */
    setArmor(...armorToSet: [Item, ...Item[]]): void;

    /** Sets the amount of arrows sticking out of a player's character model. */
    setArrowsStuck(arrowCount?: number): void;

    /** Creates or modifies a custom boss health bar at the top of a player's screen. */
    setBossBar(title?: ComponentInput, health?: number, maximumHealth?: number, bossBarPosition?: number): void;

    /** Creates or modifies a custom boss health bar at the top of a player's screen. */
    setBossBarWith(options: SetBossBarOptions, title?: ComponentInput, health?: number, maximumHealth?: number, bossBarPosition?: number): void;

    /** Sets a player's chat tag. */
    setChatTag(...chatTag: ComponentInput[]): void;

    /** Sets whether a player is able to collide with other entities. */
    setCollidable(): void;

    /** Sets whether a player is able to collide with other entities. */
    setCollidableWith(options: SetCollidableOptions): void;

    /** Sets the location compasses point to for a player. */
    setCompass(newTarget: Location): void;

    /** Sets the item on a player's cursor. */
    setCursorItem(itemToSet?: Item): void;

    /** Sets a player's ability to see their own disguise. It is recommended that it is almost always hidden. */
    setDisguiseVisible(): void;

    /** Sets a player's ability to see their own disguise. It is recommended that it is almost always hidden. */
    setDisguiseVisibleWith(options: SetDisguiseVisibleOptions): void;

    /** Sets whether a player drops their items when dead. */
    setDropsEnabled(): void;

    /** Sets whether a player drops their items when dead. */
    setDropsEnabledWith(options: SetDropsEnabledOptions): void;

    /** Sets if an entity is hidden to a target. */
    setEntityHidden(...entityUuids: [string, ...string[]]): void;

    /** Sets if an entity is hidden to a target. */
    setEntityHiddenWith(options: SetEntityHiddenOptions, ...entityUuids: [string, ...string[]]): void;

    /** Sets the item in one of the equipment slots (armor and held items) of a player. */
    setEquipment(itemToSet?: Item): void;

    /** Sets the item in one of the equipment slots (armor and held items) of a player. */
    setEquipmentWith(options: SetEquipmentOptions, itemToSet?: Item): void;

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
    setFogDistance(fogDistanceInChunks_2_7?: number): void;

    /** Sets a player's food hunger level. */
    setFoodLevel(foodLevel_1_20: number): void;

    /** Sets how long a player is frozen for. */
    setFreezeTicks(ticks_0_140: number): void;

    /** Sets how long a player is frozen for. */
    setFreezeTicksWith(options: SetFreezeTicksOptions, ticks_0_140: number): void;

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

    /** Sets items in a player's hotbar. */
    setHotbar(...itemsToSet: [Item, ...Item[]]): void;

    /** Renames a player's current inventory menu. */
    setInvName(inventoryName: ComponentInput): void;

    /** Renames a player's current inventory menu. */
    setInvNameWith(options: SetInvNameOptions, inventoryName: ComponentInput): void;

    /** Sets items in a player's upper inventory. */
    setInventory(...itemsToSet: [Item, ...Item[]]): void;

    /** Sets whether a player's inventory is kept after death. */
    setInventoryKept(): void;

    /** Sets whether a player's inventory is kept after death. */
    setInventoryKeptWith(options: SetInventoryKeptOptions): void;

    /** Sets the currently remaining ticks until a player can next be hurt. */
    setInvulTicks(ticks: number): void;

    /** Applies a cooldown visual effect to an item type. */
    setItemCooldown(itemTypeToAffect: Item, cooldownInTicks: number): void;

    /** Sets a player's maximum health. */
    setMaxHealth(maximumHealth: number): void;

    /** Sets a player's maximum health. */
    setMaxHealthWith(options: SetMaxHealthOptions, maximumHealth: number): void;

    /** Sets the item in a slot of a player's current inventory menu. */
    setMenuItem(slot: number, itemToSet?: Item): void;

    /** Sets the color a player's name tag appears in. */
    setNameColor(): void;

    /** Sets the color a player's name tag appears in. */
    setNameColorWith(options: SetNameColorOptions): void;

    /** Sets the prefix or suffix for the player's name. */
    setNamePrefix(prefixSuffixText?: ComponentInput): void;

    /** Sets the prefix or suffix for the player's name. */
    setNamePrefixWith(options: SetNamePrefixOptions, prefixSuffixText?: ComponentInput): void;

    /** Sets whether a player's name tag is visible. */
    setNameVisible(): void;

    /** Sets whether a player's name tag is visible. */
    setNameVisibleWith(options: SetNameVisibleOptions): void;

    /** Sets the time of day visible to a player. */
    setPlayerTime(daylightTicks?: number): void;

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

    /** Sets the player's skin. */
    setSkin(playerHead?: Item): void;

    /** Sets a player's selected hotbar slot. */
    setSlot(newSlot: number): void;

    /** Sets the item in a slot of a player's inventory. */
    setSlotItem(itemToSet: Item | undefined, slotToSet: number): void;

    /** Sets the location a player will spawn when they die and respawn. */
    setSpawnPoint(theNewSpawnLocation?: Location): void;

    /** Sets the player's game status, which is used to display information about what the player is doing in the game. */
    setStatus(gameStatus?: ComponentInput): void;

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

    /** Changes a player's world border size if they have one active. */
    shiftWorldBorder(newRadius: number, blocksPerSecond?: number): void;

    /** Opens a custom inventory for a player. */
    showInv(...itemsToDisplay: Item[]): void;

    /** Makes a player spectate another player or entity. */
    spectateTarget(targetUuid?: string): void;

    /** Makes a player spectate another player or entity. */
    spectateTargetWith(options: SpectateTargetOptions, targetUuid?: string): void;

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

    /** Removes a player's disguise. */
    undisguise(): void;

    /** Displays the wake up (fade in) animation to a player. */
    wakeUpAnimation(): void;
}
