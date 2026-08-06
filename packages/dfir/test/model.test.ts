import type {
    DictionaryValueType,
    HighDictionaryGetExpression,
    HighDictionaryHasKeyCondition,
    HighDictionaryKeysExpression,
    HighDictionaryLiteralExpression,
    HighDictionaryMergedExpression,
    HighDictionarySizeExpression,
    HighDictionaryValuesExpression,
    HighDictionaryWithExpression,
    HighDictionaryWithoutExpression,
    HighForEachDictionaryStatement,
    HighForEachStatement,
    HighListIndexExpression,
    HighListAppendExpression,
    HighListLiteralExpression,
    HighRestValueParameter,
    ListValueType,
    LowParameterValue,
    LowRestValueParameter,
    LowSingleValueParameter,
    LowVariableValue,
    ScalarValueType,
    ValueType,
} from "../index.js";

const scalar: ScalarValueType = "number";
const nestedList: ListValueType = {
    kind: "list",
    elementType: { kind: "list", elementType: scalar },
};
const valueType: ValueType = nestedList;

const literal: HighListLiteralExpression = {
    kind: "list",
    elements: [{ kind: "number", value: 1 }],
    valueType: { kind: "list", elementType: "number" },
};
const indexed: HighListIndexExpression = {
    kind: "list_index",
    list: literal,
    index: { kind: "number", value: 0 },
    valueType: "number",
};
const appended: HighListAppendExpression = {
    kind: "list_append",
    list: literal,
    values: [{ kind: "number", value: 2 }],
    valueType: literal.valueType,
};
const loop: HighForEachStatement = {
    kind: "for_each",
    variable: { kind: "line_variable", name: "row", valueType: nestedList.elementType },
    iterable: literal,
    body: [],
};
const highRest: HighRestValueParameter = {
    kind: "value",
    name: "values",
    type: { kind: "list", elementType: "number" },
    rest: true,
};
const lowRest: LowRestValueParameter = highRest;

const dictionaryType: DictionaryValueType = {
    kind: "dictionary",
    valueType: { kind: "list", elementType: "number" },
};
const dictionary: HighDictionaryLiteralExpression = {
    kind: "dictionary",
    entries: [{
        key: { kind: "string", value: "scores" },
        value: literal,
    }],
    valueType: dictionaryType,
};
const dictionaryGet: HighDictionaryGetExpression = {
    kind: "dictionary_get",
    dictionary,
    key: { kind: "string", value: "scores" },
    valueType: dictionaryType.valueType,
};
const dictionarySize: HighDictionarySizeExpression = {
    kind: "dictionary_size",
    dictionary,
};
const dictionaryKeys: HighDictionaryKeysExpression = {
    kind: "dictionary_keys",
    dictionary,
};
const dictionaryValues: HighDictionaryValuesExpression = {
    kind: "dictionary_values",
    dictionary,
    valueType: { kind: "list", elementType: dictionaryType.valueType },
};
const dictionaryWith: HighDictionaryWithExpression = {
    kind: "dictionary_with",
    dictionary,
    key: { kind: "string", value: "more" },
    value: literal,
    valueType: dictionaryType,
};
const dictionaryWithout: HighDictionaryWithoutExpression = {
    kind: "dictionary_without",
    dictionary: dictionaryWith,
    key: { kind: "string", value: "scores" },
    valueType: dictionaryType,
};
const dictionaryMerged: HighDictionaryMergedExpression = {
    kind: "dictionary_merged",
    dictionary,
    dictionaries: [dictionaryWithout],
    valueType: dictionaryType,
};
const dictionaryHasKey: HighDictionaryHasKeyCondition = {
    kind: "dictionary_has_key",
    dictionary,
    key: { kind: "string", value: "scores" },
};
const dictionaryLoop: HighForEachDictionaryStatement = {
    kind: "for_each_dictionary",
    keyVariable: { kind: "line_variable", name: "key", valueType: "text" },
    valueVariable: {
        kind: "line_variable",
        name: "scores",
        valueType: dictionaryType.valueType,
    },
    dictionary,
    body: [],
};
const lowDictionaryParameter: LowSingleValueParameter = {
    kind: "value",
    name: "scoresByName",
    type: dictionaryType,
};
const lowDictionaryParameterValue: LowParameterValue = {
    kind: "parameter",
    name: lowDictionaryParameter.name,
    valueType: dictionaryType,
};
const lowDictionaryVariable: LowVariableValue = {
    kind: "variable",
    name: "scoresByName",
    scope: "line",
    valueType: dictionaryType,
};

void [
    valueType, indexed, appended, loop, lowRest, dictionaryGet,
    dictionarySize, dictionaryKeys, dictionaryValues, dictionaryMerged,
    dictionaryHasKey, dictionaryLoop, lowDictionaryParameterValue,
    lowDictionaryVariable,
];
