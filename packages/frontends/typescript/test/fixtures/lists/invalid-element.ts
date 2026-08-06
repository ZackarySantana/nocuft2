import { list } from "nocuft";

export function invalid(): void {
    let values = list<number>(1);
    values = values.appended("wrong");
}
