# Nocuft IR

Nocuft compiles through two language-independent intermediate representations.

## DFIR High

High IR models source-level behavior that DiamondFire does not directly
support: expressions, typed variables, structured control flow, selections,
processes, package calls, item construction, and captured item snapshots.

Frontends produce High IR. It should describe semantics rather than native
DiamondFire block layout.

## DFIR Low

Low IR models operations DiamondFire can execute directly: native actions,
conditions, brackets, variables, selectors, values, and tags with concrete
argument layouts.

The compiler lowers High IR into Low IR, then emits DiamondFire template JSON.
The Java client fixtures verify that emitted templates remain compatible with
the in-game planner.

Both representations are TypeScript data structures exported by
`@nocuft/dfir`. This package is internal and is bundled into the public CLI.

## Value and collection types

`ScalarValueType` names the scalar DiamondFire values. `ValueType` additionally
accepts recursive lists and text-keyed dictionaries:

```ts
const matrixType: ValueType = {
    kind: "list",
    elementType: { kind: "list", elementType: "number" },
};

const rowsByNameType: ValueType = {
    kind: "dictionary",
    valueType: matrixType,
};
```

High IR represents list and dictionary operations as semantic expression nodes.
Dictionary keys are always text, while `DictionaryValueType.valueType` can be
any recursive `ValueType`. `HighForEachDictionaryStatement` binds a text key
and typed value line variable. Low IR can carry list and dictionary type
metadata on variables and parameters, but intentionally has no directly
emittable list or dictionary literal; both lower to native actions writing a
variable. The low-level `"list"` type is retained only on `LowGameValue`, where
native event fields expose untyped lists.

Value parameters in both representations accept `ValueType`. A parameter with
`rest: true` collects trailing arguments; its type describes the collected
list, including its recursive element type. Its native `pn_el` advertises the
element type with `plural: true`; a fixed `List<T>` parameter instead advertises
native `list` with `plural: false`. Calls store rest elements as separate
physical arguments rather than as one list value.
