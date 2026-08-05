import {
    item,
    location,
    players,
    sound,
    type AnyValueInput,
    type ComponentInput,
    type Item,
    type Location,
    type PlayerTarget,
    type SoundInput,
} from "@nocuft/diamondfire";

function useAll(
    message: string,
    component: ComponentInput,
    player: PlayerTarget,
    amount: number,
    enabled: boolean,
    destination: Location,
    held: Item,
    cue: SoundInput,
    payload: AnyValueInput,
): void {
    player.sendMessage(message, component, amount, enabled, payload);
    player.teleport(destination);
    player.setCursorItem(held);
    player.playSound([cue]);
}

export function run(): void {
    useAll(
        "Hello",
        "Component",
        players.all(),
        3,
        true,
        location(1, 2, 3),
        item("stone"),
        "entity.player.levelup",
        sound("entity.player.levelup"),
    );
}
