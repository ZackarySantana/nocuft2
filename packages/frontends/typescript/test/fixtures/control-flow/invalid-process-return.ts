import { control, process } from "nocuft";

export const invalidReturn = process.create(() => {
    control.return();
});
