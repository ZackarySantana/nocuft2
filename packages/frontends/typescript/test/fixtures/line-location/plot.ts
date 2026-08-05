import { entities, events, item, line } from "@nocuft/diamondfire";

export const join = events.player.join((event) => {
    entities.all().nearest(event.player.location(), 1).remove();
    const destination = line.location(event.player.location());
    destination.shift(0, 50, 0);
    destination.shiftDirection(1, 2, 3);
    destination.shiftDirection();
    destination.shiftAxis("y", 4);
    destination.shiftToward(event.player.location(), 5);
    destination.shiftToward(event.player.location());
    destination.setCoordinate("yaw", 90);
    destination.face(event.player.location(), "away");
    destination.face(event.player.location());
    const amount = line.number(4);
    const message = line.string("hello");
    const enabled = line.boolean(true);
    event.player.sendMessage(message, amount, enabled);
    event.player.teleport(destination);
});

export const attack = events.player.playerDmgPlayer((event) => {
    const value = line.number(1);
    if (event.player.mainHandItem() === item("minecraft:mace")) {
        const value = line.number(2);
        event.player.sendMessage(value);
    }
    event.player.sendMessage(value);
});
