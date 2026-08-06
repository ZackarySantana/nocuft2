import { entities } from "nocuft";

export function removeEntities(): void {
    entities.all().remove();
}
