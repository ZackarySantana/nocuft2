import assert from "node:assert/strict";
import test from "node:test";
import type { ValueType } from "../index.js";
import { isValueType, valueTypeAssignable, valueTypesEqual, visitValueType } from "../index.js";

test("valueTypesEqual compares scalars", () => {
    assert.equal(valueTypesEqual("text", "text"), true);
    assert.equal(valueTypesEqual("text", "number"), false);
    assert.equal(valueTypesEqual("any", "any"), true);
    assert.equal(valueTypesEqual("any", "text"), false);
});

test("valueTypesEqual compares recursive types", () => {
    const matrix: ValueType = { kind: "list", elementType: { kind: "list", elementType: "number" } };
    assert.equal(valueTypesEqual(matrix, { kind: "list", elementType: { kind: "list", elementType: "number" } }), true);
    assert.equal(valueTypesEqual(matrix, { kind: "list", elementType: { kind: "list", elementType: "text" } }), false);
    assert.equal(valueTypesEqual(matrix, { kind: "list", elementType: "number" }), false);
    assert.equal(valueTypesEqual(matrix, { kind: "dictionary", valueType: { kind: "list", elementType: "number" } }), false);
    assert.equal(valueTypesEqual(matrix, "text"), false);
    assert.equal(
        valueTypesEqual({ kind: "dictionary", valueType: "text" }, { kind: "dictionary", valueType: "text" }),
        true,
    );
});

test("valueTypeAssignable accepts any target and component sources", () => {
    assert.equal(valueTypeAssignable("text", "any"), true);
    assert.equal(valueTypeAssignable({ kind: "list", elementType: "item" }, "any"), true);
    assert.equal(valueTypeAssignable("text", "component"), true);
    assert.equal(valueTypeAssignable("number", "component"), true);
    assert.equal(valueTypeAssignable("boolean", "component"), true);
    assert.equal(valueTypeAssignable("location", "component"), false);
    assert.equal(valueTypeAssignable("component", "component"), true);
});

test("valueTypeAssignable does not widen an any source", () => {
    assert.equal(valueTypeAssignable("any", "text"), false);
    assert.equal(valueTypeAssignable("any", "component"), false);
    assert.equal(valueTypeAssignable({ kind: "list", elementType: "any" }, { kind: "list", elementType: "text" }), false);
});

test("valueTypeAssignable recurses through lists and dictionaries", () => {
    assert.equal(
        valueTypeAssignable({ kind: "list", elementType: "text" }, { kind: "list", elementType: "component" }),
        true,
    );
    assert.equal(
        valueTypeAssignable({ kind: "list", elementType: "text" }, { kind: "list", elementType: "number" }),
        false,
    );
    assert.equal(
        valueTypeAssignable({ kind: "dictionary", valueType: "number" }, { kind: "dictionary", valueType: "any" }),
        true,
    );
    assert.equal(
        valueTypeAssignable({ kind: "list", elementType: "text" }, { kind: "dictionary", valueType: "text" }),
        false,
    );
    assert.equal(valueTypeAssignable({ kind: "list", elementType: "text" }, "text"), false);
});

test("isValueType accepts every scalar and recursive type", () => {
    for (const scalar of ["text", "number", "boolean", "component", "location", "item", "sound", "any"]) {
        assert.equal(isValueType(scalar), true);
    }
    assert.equal(isValueType({ kind: "list", elementType: { kind: "dictionary", valueType: "item" } }), true);
});

test("isValueType rejects malformed values", () => {
    assert.equal(isValueType("vector"), false);
    assert.equal(isValueType("list"), false);
    assert.equal(isValueType(""), false);
    assert.equal(isValueType(undefined), false);
    assert.equal(isValueType(null), false);
    assert.equal(isValueType(7), false);
    assert.equal(isValueType([]), false);
    assert.equal(isValueType(["text"]), false);
    assert.equal(isValueType({}), false);
    assert.equal(isValueType({ kind: "list" }), false);
    assert.equal(isValueType({ kind: "list", elementType: "vector" }), false);
    assert.equal(isValueType({ kind: "dictionary" }), false);
    assert.equal(isValueType({ kind: "dictionary", keyType: "text" }), false);
    assert.equal(isValueType({ kind: "dictionary", valueType: { kind: "list", elementType: null } }), false);
    assert.equal(isValueType({ kind: "vector", elementType: "number" }), false);
});

test("visitValueType walks each node from the outside in", () => {
    const visited: ValueType[] = [];
    visitValueType(
        { kind: "list", elementType: { kind: "dictionary", valueType: "text" } },
        (type) => visited.push(type),
    );
    assert.deepEqual(visited, [
        { kind: "list", elementType: { kind: "dictionary", valueType: "text" } },
        { kind: "dictionary", valueType: "text" },
        "text",
    ]);
    const scalars: ValueType[] = [];
    visitValueType("item", (type) => scalars.push(type));
    assert.deepEqual(scalars, ["item"]);
});
