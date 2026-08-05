// This file is generated. Do not edit manually.

import type { Entity } from "./entities";

import type { Player } from "./players";

import type { ComponentInput, Item, Location, SoundInput } from "./values/index";

export interface EntityEvents {
    /** Executes code when a block affected by gravity turns into a falling block. */
    blockFall(callback: (event: EntityBlockFallEvent) => void): void;
    /** Executes code when an entity catches on fire. */
    entityCombust(callback: (event: EntityEntityCombustEvent) => void): void;
    /** Executes code when an entity dies by natural causes. */
    entityDeath(callback: (event: EntityEntityDeathEvent) => void): void;
    /** Executes code when an entity takes damage. */
    entityDmg(callback: (event: EntityEntityDmgEvent) => void): void;
    /** Executes code when an entity damages another entity. */
    entityDmgEntity(callback: (event: EntityEntityDmgEntityEvent) => void): void;
    /** Executes code when an entity explodes. */
    entityExplode(callback: (event: EntityEntityExplodeEvent) => void): void;
    /** Executes code when an entity regains health. */
    entityHeal(callback: (event: EntityEntityHealEvent) => void): void;
    /** Executes code when an entity kills another entity. */
    entityKillEntity(callback: (event: EntityEntityKillEntityEvent) => void): void;
    /** Executes code when an entity resurrects with a totem of undying. */
    entityResurrect(callback: (event: EntityEntityResurrectEvent) => void): void;
    /** Executes code when a falling block lands on the ground. */
    fallingBlockLand(callback: (event: EntityFallingBlockLandEvent) => void): void;
    /** Executes code when dropped items try to merge into a stack. */
    itemMerge(callback: (event: EntityItemMergeEvent) => void): void;
    /** Executes code when an entity spawns into the world naturally. */
    naturallySpawn(callback: (event: EntityNaturallySpawnEvent) => void): void;
    /** Executes code when a projectile damages an entity. */
    projDmgEntity(callback: (event: EntityProjDmgEntityEvent) => void): void;
    /** Executes code when a projectile kills an entity. */
    projKillEntity(callback: (event: EntityProjKillEntityEvent) => void): void;
    /** Executes code when a sheep regrows its wool. */
    regrowWool(callback: (event: EntityRegrowWoolEvent) => void): void;
    /** Executes code when an entity shoots a bow. */
    shootBow(callback: (event: EntityShootBowEvent) => void): void;
    /** Executes code when an entity is teleported. */
    teleport(callback: (event: EntityTeleportEvent) => void): void;
    /** Executes code when an entity turns into another or group of others for any reason. */
    transform(callback: (event: EntityTransformEvent) => void): void;
    /** Executes code when a vehicle entity (minecart or boat) is damaged. */
    vehicleDamage(callback: (event: EntityVehicleDamageEvent) => void): void;
}

export interface PlayerEvents {
    /** Executes code when a player breaks a block. */
    breakBlock(callback: (event: PlayerBreakBlockEvent) => void): void;
    /** Executes code when a player breaks an item. */
    breakItem(callback: (event: PlayerBreakItemEvent) => void): void;
    /** Executes code when a player changes a sign. */
    changeSign(callback: (event: PlayerChangeSignEvent) => void): void;
    /** Executes code when a player changes their hotbar slot. */
    changeSlot(callback: (event: PlayerChangeSlotEvent) => void): void;
    /** Executes code when a player sends a chat message. */
    chat(callback: (event: PlayerChatEvent) => void): void;
    /** Executes code when a player clicks a slot in a container. */
    clickContainerSlot(callback: (event: PlayerClickContainerSlotEvent) => void): void;
    /** Executes code when a player right clicks an entity. */
    clickEntity(callback: (event: PlayerClickEntityEvent) => void): void;
    /** Executes code when a player clicks a slot inside their inventory. */
    clickInvSlot(callback: (event: PlayerClickInvSlotEvent) => void): void;
    /** Executes code when a player clicks a slot in an inventory menu. */
    clickMenuSlot(callback: (event: PlayerClickMenuSlotEvent) => void): void;
    /** Executes code when a player right clicks another player. */
    clickPlayer(callback: (event: PlayerClickPlayerEvent) => void): void;
    /** Executes code when a player closes an inventory. */
    closeInv(callback: (event: PlayerCloseInvEvent) => void): void;
    /** Executes code when an area of effect cloud applies its potion effect(s) to a player. */
    cloudImbuePlayer(callback: (event: PlayerCloudImbuePlayerEvent) => void): void;
    /** Executes code when a player types a command on the plot. */
    command(callback: (event: PlayerCommandEvent) => void): void;
    /** Executes code when a player eats or drinks an item. */
    consume(callback: (event: PlayerConsumeEvent) => void): void;
    /** Executes code when a player damages an entity. */
    damageEntity(callback: (event: PlayerDamageEntityEvent) => void): void;
    /** Executes code when a player dies, not as a result of another player or entity. */
    death(callback: (event: PlayerDeathEvent) => void): void;
    /** Executes code when a player dismounts a vehicle or other entity. */
    dismount(callback: (event: PlayerDismountEvent) => void): void;
    /** Executes code when a player drops an item. */
    dropItem(callback: (event: PlayerDropItemEvent) => void): void;
    /** Executes code when an entity damages a player. */
    entityDmgPlayer(callback: (event: PlayerEntityDmgPlayerEvent) => void): void;
    /** Executes code when a player gains exhaustion. */
    exhaustion(callback: (event: PlayerExhaustionEvent) => void): void;
    /**  */
    fallDamage(callback: (event: PlayerFallDamageEvent) => void): void;
    /** Executes code when a player fishes an entity, player, or nothing. */
    fish(callback: (event: PlayerFishEvent) => void): void;
    /** Executes code when a player causes a horse to jump. */
    horseJump(callback: (event: PlayerHorseJumpEvent) => void): void;
    /** Executes code when a player joins the plot. */
    join(callback: (event: PlayerJoinEvent) => void): void;
    /** Executes code when a player jumps. */
    jump(callback: (event: PlayerJumpEvent) => void): void;
    /** Executes code when a player kills a mob. */
    killMob(callback: (event: PlayerKillMobEvent) => void): void;
    /** Executes code when a player kills another player. */
    killPlayer(callback: (event: PlayerKillPlayerEvent) => void): void;
    /** Executes code when a player leaves the plot. */
    leave(callback: (event: PlayerLeaveEvent) => void): void;
    /** Executes code when a player left clicks. */
    leftClick(callback: (event: PlayerLeftClickEvent) => void): void;
    /** Executes code when a player left clicks an entity. */
    leftClickEntity(callback: (event: PlayerLeftClickEntityEvent) => void): void;
    /** Executes code when a player left clicks another player. */
    leftClickPlayer(callback: (event: PlayerLeftClickPlayerEvent) => void): void;
    /** Executes code when a player loads a crossbow. */
    loadCrossbow(callback: (event: PlayerLoadCrossbowEvent) => void): void;
    /**  */
    loopEvent(callback: (event: PlayerLoopEventEvent) => void): void;
    /** Executes code when a mob kills a player. */
    mobKillPlayer(callback: (event: PlayerMobKillPlayerEvent) => void): void;
    /** Executes code when a player moves. */
    move(callback: (event: PlayerMoveEvent) => void): void;
    /** Executes code when a player presses or releases movement keys. */
    movementKey(callback: (event: PlayerMovementKeyEvent) => void): void;
    /** Executes code when a player declines a plot resource pack prompt. */
    packDecline(callback: (event: PlayerPackDeclineEvent) => void): void;
    /** Executes code when a player finishes loading a plot resource pack. */
    packLoad(callback: (event: PlayerPackLoadEvent) => void): void;
    /** Executes code when a player uses their Pick Block key bind on a block. */
    pickBlock(callback: (event: PlayerPickBlockEvent) => void): void;
    /** Executes code when a player uses their Pick Block key bind on an entity. */
    pickEntity(callback: (event: PlayerPickEntityEvent) => void): void;
    /** Executes code when a player picks up an item. */
    pickUpItem(callback: (event: PlayerPickUpItemEvent) => void): void;
    /** Executes code when a player places a block. */
    placeBlock(callback: (event: PlayerPlaceBlockEvent) => void): void;
    /** Executes code when a player catches on fire. */
    playerCombust(callback: (event: PlayerPlayerCombustEvent) => void): void;
    /** Executes code when a player damages another player. */
    playerDmgPlayer(callback: (event: PlayerPlayerDmgPlayerEvent) => void): void;
    /** Executes code when a player regains health from any source. */
    playerHeal(callback: (event: PlayerPlayerHealEvent) => void): void;
    /** Executes code when a player resurrects with a totem of undying. */
    playerResurrect(callback: (event: PlayerPlayerResurrectEvent) => void): void;
    /** Executes code when a player takes damage. */
    playerTakeDmg(callback: (event: PlayerPlayerTakeDmgEvent) => void): void;
    /** Executes code when a projectile damages a player. */
    projDmgPlayer(callback: (event: PlayerProjDmgPlayerEvent) => void): void;
    /** Executes code when a projectile launched by a player hits a block, an entity, or another player. */
    projHit(callback: (event: PlayerProjHitEvent) => void): void;
    /** Executes code when a player purchases a plot product. */
    purchase(callback: (event: PlayerPurchaseEvent) => void): void;
    /** Executes code when a player respawns. */
    respawn(callback: (event: PlayerRespawnEvent) => void): void;
    /** Executes code when a player right clicks while looking at a block or holding an item. */
    rightClick(callback: (event: PlayerRightClickEvent) => void): void;
    /** Executes code when a player throws a riptide trident. */
    riptide(callback: (event: PlayerRiptideEvent) => void): void;
    /** Executes code when a player fires an arrow with a bow. */
    shootBow(callback: (event: PlayerShootBowEvent) => void): void;
    /** Executes code when a player throws a projectile such as snowballs or eggs. */
    shootProjectile(callback: (event: PlayerShootProjectileEvent) => void): void;
    /** Executes code when a player sneaks. */
    sneak(callback: (event: PlayerSneakEvent) => void): void;
    /** Executes code when a player begins breaking a block. */
    startBreaking(callback: (event: PlayerStartBreakingEvent) => void): void;
    /** Executes code when a player starts flying. */
    startFly(callback: (event: PlayerStartFlyEvent) => void): void;
    /** Executes code when a player starts gliding. */
    startGlide(callback: (event: PlayerStartGlideEvent) => void): void;
    /** Executes code when a player starts sprinting. */
    startSprint(callback: (event: PlayerStartSprintEvent) => void): void;
    /** Executes code when a player stops breaking a block. */
    stopBreaking(callback: (event: PlayerStopBreakingEvent) => void): void;
    /** Executes code when a player stops flying. */
    stopFly(callback: (event: PlayerStopFlyEvent) => void): void;
    /** Executes code when a player stops gliding. */
    stopGlide(callback: (event: PlayerStopGlideEvent) => void): void;
    /** Executes code when a player stops sprinting. */
    stopSprint(callback: (event: PlayerStopSprintEvent) => void): void;
    /** Executes code when a player swaps an item or items between their main hand and off hand. */
    swapHands(callback: (event: PlayerSwapHandsEvent) => void): void;
    /** Executes code when a player tames a mob. */
    tameEntity(callback: (event: PlayerTameEntityEvent) => void): void;
    /** Executes code when a player is teleported. */
    teleport(callback: (event: PlayerTeleportEvent) => void): void;
    /** Executes code when a player stops sneaking. */
    unsneak(callback: (event: PlayerUnsneakEvent) => void): void;
    /** Executes code when a player presses the jump key while riding a vehicle or other entity. */
    vehicleJump(callback: (event: PlayerVehicleJumpEvent) => void): void;
    /** Executes code when a player trades with a villager. */
    villagerTrade(callback: (event: PlayerVillagerTradeEvent) => void): void;
    /** Executes code while a player is walking. */
    walk(callback: (event: PlayerWalkEvent) => void): void;
}

export interface PlotEvents {
    /** Executes code when a beacon is activated. */
    beaconActivated(callback: () => void): void;
    /** Executes code when a bell is rung. */
    bellRing(callback: (event: PlotBellRingEvent) => void): void;
    /** Executes code when a block is destroyed by fire. */
    blockBurn(callback: (event: PlotBlockBurnEvent) => void): void;
    /** Executes code when a block cooks an item. */
    blockCook(callback: () => void): void;
    /** Executes code when a block dispenses an item. */
    blockDispense(callback: () => void): void;
    /** Executes code when a block explodes. */
    blockExplode(callback: (event: PlotBlockExplodeEvent) => void): void;
    /** Executes code when a block fades. */
    blockFade(callback: () => void): void;
    /** Executes code when a block is fertilized. */
    blockFertilize(callback: (event: PlotBlockFertilizeEvent) => void): void;
    /** Executes code when a block is formed, typically through natural means. */
    blockForm(callback: (event: PlotBlockFormEvent) => void): void;
    /** Executes code when a block grows naturally. */
    blockGrow(callback: (event: PlotBlockGrowEvent) => void): void;
    /** Executes code when a block ignites. */
    blockIgnite(callback: (event: PlotBlockIgniteEvent) => void): void;
    /** Executes code when a block moves. */
    blockMove(callback: (event: PlotBlockMoveEvent) => void): void;
    /** Executes code when a block spreads. */
    blockSpread(callback: (event: PlotBlockSpreadEvent) => void): void;
    /** Executes code when brewing completes. */
    brew(callback: () => void): void;
    /** Executes code when a campfire starts cooking. */
    campfireStart(callback: () => void): void;
    /** Executes code when a cauldron's level or contents changes. */
    cauldronChange(callback: (event: PlotCauldronChangeEvent) => void): void;
    /** Executes code when a chunk is loaded. */
    chunkLoad(callback: () => void): void;
    /** Executes code when a chunk is unloaded. */
    chunkUnload(callback: () => void): void;
    /** Executes code when a crafter crafts an item. */
    crafterCraft(callback: (event: PlotCrafterCraftEvent) => void): void;
    /** Executes code when a liquid's level changes. */
    fluidLevelChange(callback: (event: PlotFluidLevelChangeEvent) => void): void;
    /** Executes code when a furnace consumes fuel. */
    furnaceBurn(callback: (event: PlotFurnaceBurnEvent) => void): void;
    /** Executes code when a plot recovers from a LagSlayer halt. */
    lagSlayRecover(callback: () => void): void;
    /** Executes code when leaves decay. */
    leavesDecay(callback: () => void): void;
    /** Executes code when soil moisture changes. */
    moistureChange(callback: (event: PlotMoistureChangeEvent) => void): void;
    /** Executes code when a note block plays a note. */
    notePlay(callback: () => void): void;
    /** Executes code when a piston extends. */
    pistonExtend(callback: (event: PlotPistonExtendEvent) => void): void;
    /** Executes code when a piston retracts. */
    pistonRetract(callback: (event: PlotPistonRetractEvent) => void): void;
    /** Executes code when a redstone current changes. */
    redstone(callback: (event: PlotRedstoneEvent) => void): void;
    /** Executes code when a sculk catalyst blooms. */
    sculkBloom(callback: () => void): void;
    /** Executes code when a plot no longer has players and is shutting down. */
    shutdown(callback: () => void): void;
    /** Executes code when a sponge absorbs water. */
    spongeAbsorb(callback: (event: PlotSpongeAbsorbEvent) => void): void;
    /** Executes code when a plot is first started. */
    startup(callback: () => void): void;
    /** Executes code when TNT is ignited. */
    tntprime(callback: () => void): void;
    /** Executes code when a vault changes its state. */
    vaultChangeState(callback: (event: PlotVaultChangeStateEvent) => void): void;
    /** Executes code when a vault displays an item. */
    vaultDisplayItem(callback: (event: PlotVaultDisplayItemEvent) => void): void;
}

export interface EntityBlockFallEvent {
    readonly entity: Entity;
}

export interface EntityEntityCombustEvent {
    /** Gets the location of the block in this event. */
    readonly blockLocation: Location;
    /** Gets the duration of fire inflicted in this event. */
    readonly combustDuration: number;
    /** Gets the reason the target caught on fire in this event. */
    readonly combustCause: string;
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityEntityDeathEvent {
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly entity: Entity;
    /** Sets the sound to play for this event, replacing the original sound. */
    setEventSound(newSound: SoundInput): void;
    /** Sets the amount of experience this event should drop. */
    setEventXp(experience: number): void;
    cancel(): void;
}

export interface EntityEntityDmgEvent {
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly entity: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface EntityEntityDmgEntityEvent {
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly entity: Entity;
    readonly victim: Entity;
    readonly damager: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface EntityEntityExplodeEvent {
    /** Gets the locations of blocks affected in this event. */
    readonly affectedBlocks: readonly unknown[];
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityEntityHealEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityEntityKillEntityEvent {
    readonly entity: Entity;
    readonly victim: Entity;
    readonly killer: Entity;
    cancel(): void;
}

export interface EntityEntityResurrectEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityFallingBlockLandEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityItemMergeEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityNaturallySpawnEvent {
    readonly entity: Entity;
}

export interface EntityProjDmgEntityEvent {
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly entity: Entity;
    readonly victim: Entity;
    readonly shooter: Entity;
    readonly projectile: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface EntityProjKillEntityEvent {
    readonly entity: Entity;
    readonly victim: Entity;
    readonly shooter: Entity;
    readonly projectile: Entity;
    cancel(): void;
}

export interface EntityRegrowWoolEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityShootBowEvent {
    readonly entity: Entity;
    readonly projectile: Entity;
    cancel(): void;
}

export interface EntityTeleportEvent {
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityTransformEvent {
    /** Gets the reason the target transformed in this event. */
    readonly transformCause: string;
    /** Gets the entities an entity transforms into. */
    readonly transformEntities: readonly unknown[];
    readonly entity: Entity;
    cancel(): void;
}

export interface EntityVehicleDamageEvent {
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly entity: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerBreakBlockEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerBreakItemEvent {
    readonly player: Player;
}

export interface PlayerChangeSignEvent {
    readonly player: Player;
    /** Gets the sign text in this event. */
    readonly signText: readonly unknown[];
    /** Gets the sign side modified in this event. */
    readonly signSide: string;
    cancel(): void;
}

export interface PlayerChangeSlotEvent {
    readonly player: Player;
    /** Gets the hotbar slot being changed to in this event. */
    readonly hotbarSlot: number;
    cancel(): void;
}

export interface PlayerChatEvent {
    readonly player: Player;
    /** The message sent in this event */
    readonly message: string;
    cancel(): void;
}

export interface PlayerClickContainerSlotEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerClickEntityEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerClickInvSlotEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerClickMenuSlotEvent {
    readonly player: Player;
    /** Gets the index of the clicked inventory slot in this event. */
    readonly clickedSlotIndex: number;
    /** Gets the inventory item clicked on in this event. */
    readonly clickedSlotItem: Item;
    /** Gets the inventory item clicked with in this event. */
    readonly clickedSlotNewItem: Item;
    /** Gets the click type in this inventory click event. */
    readonly inventoryClickType: string;
}

export interface PlayerClickPlayerEvent {
    readonly player: Player;
    readonly victim: Player;
}

export interface PlayerCloseInvEvent {
    readonly player: Player;
    /** Gets the reason the target's inventory was closed in this event. */
    readonly closeInventoryCause: string;
}

export interface PlayerCloudImbuePlayerEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerCommandEvent {
    readonly player: Player;
    /** Gets the entire command line entered in this event. */
    readonly command: string;
    /** Gets the separated parts of the event command. */
    readonly commandArguments: readonly unknown[];
}

export interface PlayerConsumeEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerDamageEntityEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly victim: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerDeathEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    /** Gets the death message for this death event. */
    readonly deathMessage: ComponentInput;
    /** Sets the death message in this event. */
    setEventDeathMsg(newDeathMessage: ComponentInput): void;
    cancel(): void;
}

export interface PlayerDismountEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerDropItemEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerEntityDmgPlayerEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly victim: Player;
    readonly damager: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerExhaustionEvent {
    readonly player: Player;
    /** Gets the reason the target became exhausted in this event. */
    readonly exhaustionCause: string;
    /** Gets the amount of exhaustion gained in this event. */
    readonly exhaustion: number;
    /** Sets the exhaustion gained in this event. */
    setExhaustion(newExhaustionAmount: number): void;
    cancel(): void;
}

export interface PlayerFallDamageEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
}

export interface PlayerFishEvent {
    readonly player: Player;
    /** Gets the cause of this fish event. */
    readonly fishCause: string;
    /** Sets the amount of experience this event should drop. */
    setEventXp(experience: number): void;
    cancel(): void;
}

export interface PlayerHorseJumpEvent {
    readonly player: Player;
    /** Gets the percentage of power this event was executed with. */
    readonly power: number;
}

export interface PlayerJoinEvent {
    readonly player: Player;
}

export interface PlayerJumpEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerKillMobEvent {
    readonly player: Player;
    readonly victim: Entity;
    cancel(): void;
}

export interface PlayerKillPlayerEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    /** Gets the death message for this death event. */
    readonly deathMessage: ComponentInput;
    readonly victim: Player;
    /** Sets the death message in this event. */
    setEventDeathMsg(newDeathMessage: ComponentInput): void;
    cancel(): void;
}

export interface PlayerLeaveEvent {
    readonly player: Player;
}

export interface PlayerLeftClickEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerLeftClickEntityEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerLeftClickPlayerEvent {
    readonly player: Player;
    readonly victim: Player;
    cancel(): void;
}

export interface PlayerLoadCrossbowEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerLoopEventEvent {
    readonly player: Player;
}

export interface PlayerMobKillPlayerEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    /** Gets the death message for this death event. */
    readonly deathMessage: ComponentInput;
    readonly victim: Player;
    readonly killer: Entity;
    /** Sets the death message in this event. */
    setEventDeathMsg(newDeathMessage: ComponentInput): void;
    cancel(): void;
}

export interface PlayerMoveEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerMovementKeyEvent {
    readonly player: Player;
}

export interface PlayerPackDeclineEvent {
    readonly player: Player;
}

export interface PlayerPackLoadEvent {
    readonly player: Player;
}

export interface PlayerPickBlockEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerPickEntityEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerPickUpItemEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerPlaceBlockEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerPlayerCombustEvent {
    readonly player: Player;
    /** Gets the location of the block in this event. */
    readonly blockLocation: Location;
    /** Gets the duration of fire inflicted in this event. */
    readonly combustDuration: number;
    /** Gets the reason the target caught on fire in this event. */
    readonly combustCause: string;
    cancel(): void;
}

export interface PlayerPlayerDmgPlayerEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly victim: Player;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerPlayerHealEvent {
    readonly player: Player;
    /** Gets the amount of health regained in this event. */
    readonly healAmount: number;
    /** Gets the reason the target regained health in this event. */
    readonly healCause: string;
    /** Sets the amount of health regained in this event. */
    setEventHeal(newHealingAmount: number): void;
    cancel(): void;
}

export interface PlayerPlayerResurrectEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerPlayerTakeDmgEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerProjDmgPlayerEvent {
    readonly player: Player;
    /** Gets the amount of damage dealt in this event. Includes damage reduction. */
    readonly damage: number;
    /** Gets the type of damage taken or dealt in this event. */
    readonly damageCause: string;
    /** Gets the amount of damage dealt in this event before any damage reductions. */
    readonly rawDamage: number;
    readonly victim: Player;
    readonly shooter: Entity;
    readonly projectile: Entity;
    /** Sets the damage dealt in this event. */
    setEventDamage(newDamageAmount: number): void;
    cancel(): void;
}

export interface PlayerProjHitEvent {
    readonly player: Player;
    /** Gets the location of the block in this event. */
    readonly blockLocation: Location;
    /** Gets the side of the block that was hit in this event as a direction. */
    readonly blockSide: readonly [number, number, number];
    /** Gets the type of object that the projectile collided with */
    readonly hitType: string;
    readonly projectile: Entity;
}

export interface PlayerPurchaseEvent {
    readonly player: Player;
}

export interface PlayerRespawnEvent {
    readonly player: Player;
}

export interface PlayerRightClickEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerRiptideEvent {
    readonly player: Player;
}

export interface PlayerShootBowEvent {
    readonly player: Player;
    /** Gets the percentage of power this event was executed with. */
    readonly power: number;
    readonly projectile: Entity;
    /** Replaces the projectile fired in the Shoot Bow Event. */
    setEventProj(projectileToLaunch?: Item): void;
    cancel(): void;
}

export interface PlayerShootProjectileEvent {
    readonly player: Player;
    readonly projectile: Entity;
    cancel(): void;
}

export interface PlayerSneakEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStartBreakingEvent {
    readonly player: Player;
    /** Gets the side of the block that was hit in this event as a direction. */
    readonly blockSide: readonly [number, number, number];
}

export interface PlayerStartFlyEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStartGlideEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStartSprintEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStopBreakingEvent {
    readonly player: Player;
}

export interface PlayerStopFlyEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStopGlideEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerStopSprintEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerSwapHandsEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerTameEntityEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerTeleportEvent {
    readonly player: Player;
    /** Gets the reason the player was teleported in this event. */
    readonly teleportCause: string;
    /** Gets the location that will be teleported to in this event. */
    readonly teleportLocation: Location;
    cancel(): void;
}

export interface PlayerUnsneakEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlayerVehicleJumpEvent {
    readonly player: Player;
}

export interface PlayerVillagerTradeEvent {
    readonly player: Player;
    /** Gets the items given to a villager in a trade. */
    readonly tradeIngredients: readonly unknown[];
    /** Gets the result item of a villager trade. */
    readonly tradeResult: Item;
    cancel(): void;
}

export interface PlayerWalkEvent {
    readonly player: Player;
    cancel(): void;
}

export interface PlotBellRingEvent {
    cancel(): void;
}

export interface PlotBlockBurnEvent {
    cancel(): void;
}

export interface PlotBlockExplodeEvent {
    /** Gets the locations of blocks affected in this event. */
    readonly affectedBlocks: readonly unknown[];
}

export interface PlotBlockFertilizeEvent {
    cancel(): void;
}

export interface PlotBlockFormEvent {
    cancel(): void;
}

export interface PlotBlockGrowEvent {
    cancel(): void;
}

export interface PlotBlockIgniteEvent {
    cancel(): void;
}

export interface PlotBlockMoveEvent {
    /** Gets the location of the destination block in this event. */
    readonly destinationBlockLocation: Location;
}

export interface PlotBlockSpreadEvent {
    cancel(): void;
}

export interface PlotCauldronChangeEvent {
    cancel(): void;
}

export interface PlotCrafterCraftEvent {
    cancel(): void;
}

export interface PlotFluidLevelChangeEvent {
    cancel(): void;
}

export interface PlotFurnaceBurnEvent {
    cancel(): void;
}

export interface PlotMoistureChangeEvent {
    cancel(): void;
}

export interface PlotPistonExtendEvent {
    /** Gets the locations of blocks affected in this event. */
    readonly affectedBlocks: readonly unknown[];
    cancel(): void;
}

export interface PlotPistonRetractEvent {
    /** Gets the locations of blocks affected in this event. */
    readonly affectedBlocks: readonly unknown[];
    cancel(): void;
}

export interface PlotRedstoneEvent {
    /** Gets the strength of the redstone current before this event. */
    readonly redstoneCurrentStrength: number;
    /** Gets the strength of the redstone current after this event. */
    readonly newRedstoneCurrentStrength: number;
    /** Sets the current strength in this event. */
    redstoneStrength(newCurrentStrength: number): void;
}

export interface PlotSpongeAbsorbEvent {
    /** Gets the locations of blocks affected in this event. */
    readonly affectedBlocks: readonly unknown[];
    cancel(): void;
}

export interface PlotVaultChangeStateEvent {
    /** Gets the state of the vault before this event. */
    readonly vaultState: string;
    /** Gets the state of the vault after this event. */
    readonly newVaultState: string;
}

export interface PlotVaultDisplayItemEvent {
    /** Sets the item displayed in this event. */
    setDisplayedItem(itemToDisplay: Item): void;
}

export interface Events {
    readonly entity: EntityEvents;
    readonly player: PlayerEvents;
    readonly plot: PlotEvents;
}

export declare const events: Events;
