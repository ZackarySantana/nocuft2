import { control, events, players, process } from "@nocuft/diamondfire";

export const countdown = process.createWith(
    { isHidden: true },
    (message: string, delay: number) => {
        control.waitWith({ timeUnit: "seconds" }, delay);
        players.all().sendMessage(message);
    },
);

export const boot = events.plot.startup(() => {
    countdown.start("Ready", 1);
    countdown.startWith(
        {
            targetMode: "withNoTargets",
            localVariables: "dontCopy",
        },
        "Begin",
        2,
    );
});
