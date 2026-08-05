// This file is generated. Do not edit manually.

import type { ComponentInput, Item, Location } from "../values/index";

/** Options for advanceTime. */
export interface AdvanceTimeOptions {
    /** Default: "enable" */
    readonly advanceTime?: "enable" | "disable";
}

/** Options for advanceWeather. */
export interface AdvanceWeatherOptions {
    /** Default: "enable" */
    readonly hasWeatherCycle?: "enable" | "disable";
}

/** Options for boneMeal. */
export interface BoneMealOptions {
    /** Default: true */
    readonly showParticles?: boolean;
}

/** Options for changeSign. */
export interface ChangeSignOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
}

/** Options for cloneRegion. */
export interface CloneRegionOptions {
    /** Default: false */
    readonly ignoreAir?: boolean;
    /** Default: true */
    readonly cloneBlockEntities?: boolean;
}

/** Options for fallingBlock. */
export interface FallingBlockOptions {
    /** Default: false */
    readonly hurtHitEntities?: boolean;
    /** Default: true */
    readonly reformOnImpact?: boolean;
}

/** Options for firework. */
export interface FireworkOptions {
    /** Default: false */
    readonly instant?: boolean;
    /** Default: "upwards" */
    readonly movement?: "upwards" | "directional";
}

/** Options for generateTree. */
export interface GenerateTreeOptions {
    /** Default: "oakTree" */
    readonly treeType?: "oakTree" | "bigOakTree" | "swampTree" | "spruceTree" | "slightlyTallerSpruceTree" | "bigSpruceTree" | "birchTree" | "tallBirchTree" | "jungleTree" | "bigJungleTree" | "jungleBush" | "acaciaTree" | "darkOakTree" | "paleOakTree" | "creakingPaleOakTree" | "mangroveTree" | "tallMangroveTree" | "cherryTree" | "azaleaTree" | "redMushroom" | "brownMushroom" | "crimsonFungus" | "warpedFungus" | "chorusPlant";
}

/** Options for mobSpawning. */
export interface MobSpawningOptions {
    /** Default: "enable" */
    readonly mobSpawning?: "enable" | "disable";
}

/** Options for setBlockData. */
export interface SetBlockDataOptions {
    /** Default: false */
    readonly overwriteExistingData?: boolean;
}

/** Options for setBlockGrowth. */
export interface SetBlockGrowthOptions {
    /** Default: "growthStageNumber" */
    readonly growthUnit?: "growthStageNumber" | "growthPercentage";
}

/** Options for setCampfireItem. */
export interface SetCampfireItemOptions {
    /** Default: "1" */
    readonly campfireSlot?: "1" | "2" | "3" | "4";
}

/** Options for setDifficulty. */
export interface SetDifficultyOptions {
    /** Default: "peaceful" */
    readonly difficulty?: "peaceful" | "easy" | "normal" | "hard";
}

/** Options for signColor. */
export interface SignColorOptions {
    /** Default: "front" */
    readonly signSide?: "front" | "back";
    /** Default: "black" */
    readonly textColor?: "white" | "orange" | "magenta" | "lightBlue" | "yellow" | "lime" | "pink" | "gray" | "lightGray" | "cyan" | "purple" | "blue" | "brown" | "green" | "red" | "black";
    /** Default: "disable" */
    readonly glowing?: "enable" | "disable";
}

/** Options for spawnArmorStand. */
export interface SpawnArmorStandOptions {
    /** Default: "visible" */
    readonly visibility?: "visible" | "visibleNoHitbox" | "invisible" | "invisibleNoHitbox";
}

/** Options for spawnCrystal. */
export interface SpawnCrystalOptions {
    /** Default: true */
    readonly showBottom?: boolean;
}

/** Options for spawnEnderEye. */
export interface SpawnEnderEyeOptions {
    /** Default: "random" */
    readonly endOfLifespan?: "dropItem" | "shatter" | "random";
}

/** Options for spawnInteraction. */
export interface SpawnInteractionOptions {
    /** Default: "disable" */
    readonly responsive?: "enable" | "disable";
}

/** Options for spawnItem. */
export interface SpawnItemOptions {
    /** Default: true */
    readonly applyItemMotion?: boolean;
}

/** Options for spawnMannequin. */
export interface SpawnMannequinOptions {
    /** Default: true */
    readonly movable?: boolean;
    /** Default: "leftHand" */
    readonly mainHand?: "leftHand" | "rightHand";
}

/** Options for spawnTextDisplay. */
export interface SpawnTextDisplayOptions {
    /** Default: "noSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: true */
    readonly inheritStyles?: boolean;
}

/** Options for traderSpawning. */
export interface TraderSpawningOptions {
    /** Default: "enable" */
    readonly traderSpawning?: "enable" | "disable";
}

/** Options for vineSpreading. */
export interface VineSpreadingOptions {
    /** Default: "enable" */
    readonly vineSpreading?: "enable" | "disable";
}

/** Options for webRequest. */
export interface WebRequestOptions {
    /** Default: "post" */
    readonly requestMethod?: "post" | "get" | "put" | "delete";
    /** Default: "textPlain" */
    readonly contentType?: "textPlain" | "applicationJson";
}

export interface GameActions {
    /** Sets if the world has a natural time cycle. */
    advanceTime(): void;

    /** Sets if the world has a natural time cycle. */
    advanceTimeWith(options: AdvanceTimeOptions): void;

    /** Sets if the world has a natural weather cycle. */
    advanceWeather(): void;

    /** Sets if the world has a natural weather cycle. */
    advanceWeatherWith(options: AdvanceWeatherOptions): void;

    /** Applies the current transaction and generates a new one. */
    applyTransaction(): void;

    /** Disables blocks dropping as items when broken. */
    blockDropsOff(): void;

    /** Enables blocks dropping as items when broken. */
    blockDropsOn(): void;

    /** Applies bone meal to a block. */
    boneMeal(blocksToBoneMeal: [Location, ...Location[]], numberOfUses?: number): void;

    /** Applies bone meal to a block. */
    boneMealWith(options: BoneMealOptions, blocksToBoneMeal: [Location, ...Location[]], numberOfUses?: number): void;

    /** Breaks the block at a location as if it was broken by a player. */
    breakBlock(...blocksToBreak: [Location, ...Location[]]): void;

    /** Changes a line of text on a sign. */
    changeSign(signLocation: Location, lineNumber: number, newText?: ComponentInput): void;

    /** Changes a line of text on a sign. */
    changeSignWith(options: ChangeSignOptions, signLocation: Location, lineNumber: number, newText?: ComponentInput): void;

    /** Empties a container at a location. */
    clearContainer(containerLocation: Location): void;

    /** Removes all of an item from the container at a location. */
    clearItems(containerLocation: Location, ...itemsToClear: [Item, ...Item[]]): void;

    /** Copies a region of blocks to another region, including air. */
    cloneRegion(corner_1: Location, corner_2: Location, positionToCopyFrom: Location, positionToPasteTo: Location): void;

    /** Copies a region of blocks to another region, including air. */
    cloneRegionWith(options: CloneRegionOptions, corner_1: Location, corner_2: Location, positionToCopyFrom: Location, positionToPasteTo: Location): void;

    debugStackTrace(): void;

    /** Sends a message to a Discord webhook. */
    discordWebhook(webhookUrl: string, messageContent: string): void;

    /** Creates an explosion at a location. */
    explosion(explosionLocation: Location, explosionPower_0_4?: number): void;

    /** Spawns a falling block at a location. */
    fallingBlock(blockLocation: Location, blockMaterial?: Item, ...blockData: string[]): void;

    /** Spawns a falling block at a location. */
    fallingBlockWith(options: FallingBlockOptions, blockLocation: Location, blockMaterial?: Item, ...blockData: string[]): void;

    /** Fills the container at a location with items. */
    fillContainer(containerLocation: Location, ...itemsToFillWith: [Item, ...Item[]]): void;

    /** Sets the radius fire spreads around a player. */
    fireSpreadRadius(radiusInBlocks: number): void;

    /** Launches a firework rocket at a location. */
    firework(fireworkRocket: Item, spawnLocation: Location): void;

    /** Launches a firework rocket at a location. */
    fireworkWith(options: FireworkOptions, fireworkRocket: Item, spawnLocation: Location): void;

    /** Generates a tree at a location. */
    generateTree(treeLocationBottomLogBlock: Location): void;

    /** Generates a tree at a location. */
    generateTreeWith(options: GenerateTreeOptions, treeLocationBottomLogBlock: Location): void;

    /** Launches a projectile. */
    launchProj(projectileToLaunch: Item, launchPoint: Location, customName?: ComponentInput, speed?: number, inaccuracy?: number): void;

    /** Strikes lightning at a location. */
    lightning(impactLocation: Location): void;

    /** Sets the lock key of the container at a location. */
    lockContainer(containerLocation: Location, lockKey?: string): void;

    /** Sets if the world spawns mobs. */
    mobSpawning(): void;

    /** Sets if the world spawns mobs. */
    mobSpawningWith(options: MobSpawningOptions): void;

    /** Sets the random tick speed in the world. */
    randomTickSpeed(tickSpeed: number): void;

    /** Removes items from the container at a location. */
    removeItems(containerLocation: Location, ...itemsToRemove: [Item, ...Item[]]): void;

    /** Replaces items in the container at a location with the given item. */
    replaceItems(containerLocation: Location, itemsToReplace: Item[] | undefined, itemToReplaceWith: Item, amountOfItemsToReplace?: number): void;

    /** Sets the biome of a region. */
    setBiome(corner_1: Location, corner_2: Location, biomeToSet: string): void;

    /** Sets the block at a location. */
    setBlock(blockToSet: Item, blockLocations: [Location, ...Location[]], ...blockData: string[]): void;

    /** Sets a data tag value of the block at a location. */
    setBlockData(location: [Location, ...Location[]], ...blockData: [string, ...string[]]): void;

    /** Sets a data tag value of the block at a location. */
    setBlockDataWith(options: SetBlockDataOptions, location: [Location, ...Location[]], ...blockData: [string, ...string[]]): void;

    /** Sets the growth stage of the block (eg. carrots) at a location. */
    setBlockGrowth(blockLocation: Location, growthStage?: number): void;

    /** Sets the growth stage of the block (eg. carrots) at a location. */
    setBlockGrowthWith(options: SetBlockGrowthOptions, blockLocation: Location, growthStage?: number): void;

    /** Sets the item buried in a suspicious sand or gravel. */
    setBrushableItem(blockLocation: Location, item?: Item): void;

    /** Sets the item being cooked in one of a campfire's slots. */
    setCampfireItem(campfireLocation: Location, campfireItem: Item, cookingTimeTicks?: number): void;

    /** Sets the item being cooked in one of a campfire's slots. */
    setCampfireItemWith(options: SetCampfireItemOptions, campfireLocation: Location, campfireItem: Item, cookingTimeTicks?: number): void;

    /** Sets the contents of the container at a location. */
    setContainer(containerLocation: Location, ...itemsToSet: [Item, ...Item[]]): void;

    /** Sets the name of the container at a location. */
    setContainerName(containerLocation: Location, name: ComponentInput): void;

    /** Sets the world's difficulty. */
    setDifficulty(): void;

    /** Sets the world's difficulty. */
    setDifficultyWith(options: SetDifficultyOptions): void;

    /** Sets the amount of ticks it takes for a furnace block to cook an item. */
    setFurnaceSpeed(furnaceLocation: Location, ticks: number): void;

    /** Sets the block at a location to a player head. */
    setHead(headLocation: Location, playerHead: Item | string): void;

    /** Sets the item in a slot of the container at a location. */
    setItemInSlot(containerLocation: Location, itemToSet: Item | undefined, slot: number): void;

    /** Sets the book and the displayed page of a Lectern. */
    setLecternBook(lecternLocation: Location, bookToPut?: Item, displayedPage?: number): void;

    /** Fills a region with a type of block. */
    setRegion(blockToSet: Item, corner_1: Location, corner_2: Location, blockDataCommaSeparated?: string): void;

    /** Sets the time in the world. */
    setWorldTime(daylightTicks: number): void;

    /** Spawns a shulker bullet at a location. */
    shulkerBullet(spawnLocation: Location): void;

    /** Changes the text color of a sign. */
    signColor(signLocation: Location): void;

    /** Changes the text color of a sign. */
    signColorWith(options: SignColorOptions, signLocation: Location): void;

    /** Sets the simulation distance in the world. */
    simulationDistance(simulationDistance: number): void;

    /** Sets the percentage of players that must sleep in order to skip the night. */
    sleepPercentage(percentageOfPlayers?: number): void;

    /** Spawns an armor stand at a location. */
    spawnArmorStand(spawnLocation: Location, customName?: ComponentInput, ...equipment: Item[]): void;

    /** Spawns an armor stand at a location. */
    spawnArmorStandWith(options: SpawnArmorStandOptions, spawnLocation: Location, customName?: ComponentInput, ...equipment: Item[]): void;

    /** Spawns a block display entity. */
    spawnBlockDisp(spawnLocation: Location, displayedBlock: Item, ...blockData: string[]): void;

    /** Spawns an end crystal at a location. */
    spawnCrystal(spawnLocation: Location, customName?: ComponentInput): void;

    /** Spawns an end crystal at a location. */
    spawnCrystalWith(options: SpawnCrystalOptions, spawnLocation: Location, customName?: ComponentInput): void;

    /** Spawns an eye of ender at a location, which (if specified) will float towards its destination. */
    spawnEnderEye(locationToSpawnAt: Location, destination?: Location, lifespanTicks?: number, customName?: ComponentInput): void;

    /** Spawns an eye of ender at a location, which (if specified) will float towards its destination. */
    spawnEnderEyeWith(options: SpawnEnderEyeOptions, locationToSpawnAt: Location, destination?: Location, lifespanTicks?: number, customName?: ComponentInput): void;

    /** Spawns an experience orb at a location. */
    spawnExpOrb(spawnLocation: Location, experienceAmount?: number, customName?: ComponentInput): void;

    /** Spawns evoker fangs at a location. */
    spawnFangs(spawnLocation: Location, customName?: ComponentInput): void;

    /** Spawns an invisible hitbox with the specified size. */
    spawnInteraction(spawnLocation: Location, hitboxWidth?: number, hitboxHeight?: number): void;

    /** Spawns an invisible hitbox with the specified size. */
    spawnInteractionWith(options: SpawnInteractionOptions, spawnLocation: Location, hitboxWidth?: number, hitboxHeight?: number): void;

    /** Spawns an item at a location. */
    spawnItem(itemsToSpawn: [Item, ...Item[]], spawnLocation: Location, customName?: ComponentInput): void;

    /** Spawns an item at a location. */
    spawnItemWith(options: SpawnItemOptions, itemsToSpawn: [Item, ...Item[]], spawnLocation: Location, customName?: ComponentInput): void;

    /** Spawns an item display entity. */
    spawnItemDisp(spawnLocation: Location, displayedItem: Item): void;

    /** Spawns a mannequin at a location. */
    spawnMannequin(mannequinPlayerHead: Item | string, spawnLocation: Location, description?: ComponentInput): void;

    /** Spawns a mannequin at a location. */
    spawnMannequinWith(options: SpawnMannequinOptions, mannequinPlayerHead: Item | string, spawnLocation: Location, description?: ComponentInput): void;

    /** Spawns a text display entity. */
    spawnTextDisplay(spawnLocation: Location, ...displayedText: [ComponentInput, ...ComponentInput[]]): void;

    /** Spawns a text display entity. */
    spawnTextDisplayWith(options: SpawnTextDisplayOptions, spawnLocation: Location, ...displayedText: [ComponentInput, ...ComponentInput[]]): void;

    /** Spawns primed TNT at a location. */
    spawnTnt(spawnLocation: Location, tntPower_0_4?: number, fuseDuration?: number, customName?: ComponentInput): void;

    /** Spawns a vehicle at a location. */
    spawnVehicle(vehicleType: Item, spawnLocation: Location, customName?: ComponentInput): void;

    /** Causes a block to get "random ticked", which could cause a block update. */
    tickBlock(blocksToTick: [Location, ...Location[]], numberOfTicks?: number): void;

    /** Sets if the world spawns wandering traders. */
    traderSpawning(): void;

    /** Sets if the world spawns wandering traders. */
    traderSpawningWith(options: TraderSpawningOptions): void;

    /** Sets the view distance in the world. */
    viewDistance(viewDistance: number): void;

    /** Sets if the world spreads vines. */
    vineSpreading(): void;

    /** Sets if the world spreads vines. */
    vineSpreadingWith(options: VineSpreadingOptions): void;

    /** Sends a web request to a URL. */
    webRequest(urlToRequest: string, contentBody?: string): void;

    /** Sends a web request to a URL. */
    webRequestWith(options: WebRequestOptions, urlToRequest: string, contentBody?: string): void;

    /** Adds blocks to the next transaction; a method of queuing up block operations so that they can be sent simultaneously. */
    writeTransaction(blockToSet: Item, corner_1: Location, corner_2: Location, blockDataCommaSeparated?: string): void;
}
