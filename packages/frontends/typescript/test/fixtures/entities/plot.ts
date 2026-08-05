import { entities } from "@nocuft/diamondfire";

export function removeEntities(): void {
    entities.all().remove();
}
