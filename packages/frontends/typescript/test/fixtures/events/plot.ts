import { events, item, location, players } from "@nocuft/diamondfire";

const lobby = location(0, 65, 0);

export const boot = events.plot.startup(() => {
    players.all().sendMessage("Arena initialized.");
});

export const join = events.player.join((event) => {
    event.player.teleport(lobby);
    event.player.sendMessage(event.player.mainHandItem());
});

export const chat = events.player.chat((event) => {
    event.cancel();
});

export const attack = events.player.playerDmgPlayer((event) => {
    if (event.player.mainHandItem() === item("minecraft:mace")) {
        event.setEventDamage(999);
    }
    event.victim.sendMessage(
        "Damage:",
        event.damage,
        "Cause:",
        event.damageCause,
        "Raw:",
        event.rawDamage,
    );
    event.victim.teleport(lobby);
});

export const entityAttack = events.entity.entityDmgEntity((event) => {
    event.entity.setGlowing();
    event.victim.remove();
    event.damager.sendAnimation();
});
