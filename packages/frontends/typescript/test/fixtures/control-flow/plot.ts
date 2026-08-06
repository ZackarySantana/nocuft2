import { control, players, process } from "nocuft";

function broadcast(message: string): void {
    players.all().sendMessage(message);
}

function arithmetic(input: number, enabled: boolean): void {
    let value = input;
    value = ((value + 2) * 3) / 2;
    value %= 5;
    value **= 2;
    ++value;

    if ((value >= 1 && value !== 3) || !enabled) {
        value -= 1;
    } else {
        return;
    }

    while (value > 0) {
        value--;
        if (value === 2) {
            continue;
        }
        if (value === 1) {
            break;
        }
    }

    do {
        value += 1;
    } while (value < 2);
}

export function fixedRange(): void {
    for (let index = 0; index <= 4; index++) {
        broadcast(`${index}`);
    }
}

export const countdown = process.create((seconds: number, step: number) => {
    for (let secs = seconds; secs >= 0; secs -= step) {
        broadcast(`${secs} seconds remaining!`);
        control.waitWith({ timeUnit: "seconds" }, step);
    }
});
