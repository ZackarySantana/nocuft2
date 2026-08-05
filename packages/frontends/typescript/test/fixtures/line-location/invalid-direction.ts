import { events, line, location } from "@nocuft/diamondfire";

export const startup = events.plot.startup(() => {
    const destination = line.location(location(0, 64, 0));
    // @ts-expect-error Exercises analyzer validation beyond the SDK type.
    destination.face(location(1, 64, 0), "sideways");
});
