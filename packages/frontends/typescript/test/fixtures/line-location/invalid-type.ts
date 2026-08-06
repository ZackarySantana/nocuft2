import { events, line, location } from "nocuft";

export const startup = events.plot.startup(() => {
    const destination = line.location(location(0, 64, 0));
    // @ts-expect-error Exercises analyzer validation beyond the SDK type.
    destination.shift("one", 2, 3);
});
