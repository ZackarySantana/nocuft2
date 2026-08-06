import type { ScalarValueType, ValueType } from "./high.js";

const scalarValueTypes: readonly string[] = [
    "text",
    "number",
    "boolean",
    "component",
    "location",
    "item",
    "sound",
    "any",
] satisfies readonly ScalarValueType[];

const componentSourceTypes: readonly string[] = ["text", "number", "boolean"] satisfies readonly ScalarValueType[];

export function valueTypesEqual(left: ValueType, right: ValueType): boolean {
    if (typeof left === "string" || typeof right === "string") return left === right;
    if (left.kind !== right.kind) return false;
    return left.kind === "list" && right.kind === "list"
        ? valueTypesEqual(left.elementType, right.elementType)
        : left.kind === "dictionary" && right.kind === "dictionary" &&
            valueTypesEqual(left.valueType, right.valueType);
}

export function valueTypeAssignable(source: ValueType, target: ValueType): boolean {
    if (target === "any") return true;
    if (typeof source === "string" || typeof target === "string") {
        return source === target || (target === "component" && typeof source === "string" &&
            componentSourceTypes.includes(source));
    }
    if (source.kind !== target.kind) return false;
    return source.kind === "list" && target.kind === "list"
        ? valueTypeAssignable(source.elementType, target.elementType)
        : source.kind === "dictionary" && target.kind === "dictionary" &&
            valueTypeAssignable(source.valueType, target.valueType);
}

export function isValueType(value: unknown): value is ValueType {
    if (typeof value === "string") return scalarValueTypes.includes(value);
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
    const record = value as Record<string, unknown>;
    return record.kind === "list"
        ? isValueType(record.elementType)
        : record.kind === "dictionary" && isValueType(record.valueType);
}

export function visitValueType(type: ValueType, visit: (type: ValueType) => void): void {
    visit(type);
    if (typeof type === "string") return;
    visitValueType(type.kind === "list" ? type.elementType : type.valueType, visit);
}
