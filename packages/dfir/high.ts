export interface HighModule {
    kind: "module";
    templates: HighTemplate[];
}

export type HighTemplate = HighFunction | HighProcess | HighEvent;

export interface HighFunction {
    kind: "function";
    name: string;
    exported?: boolean;
    parameters?: HighParameter[];
    body: HighStatement[];
}

export interface HighProcess {
    kind: "process";
    name: string;
    exported?: boolean;
    parameters?: HighValueParameter[];
    options?: Record<string, string>;
    body: HighStatement[];
}

export type ScalarValueType =
    | "text"
    | "number"
    | "boolean"
    | "component"
    | "location"
    | "item"
    | "sound"
    | "any";

export type ValueType = ScalarValueType | ListValueType | DictionaryValueType;

export interface ListValueType {
    kind: "list";
    elementType: ValueType;
}

export interface DictionaryValueType {
    kind: "dictionary";
    valueType: ValueType;
}

export type HighParameter = HighValueParameter | HighTargetParameter;

export type HighValueParameter = HighSingleValueParameter | HighRestValueParameter;

export interface HighSingleValueParameter {
    kind: "value";
    name: string;
    type: ValueType;
    rest?: false;
}

export interface HighRestValueParameter {
    kind: "value";
    name: string;
    type: ListValueType;
    rest: true;
}

export interface HighTargetParameter {
    kind: "target";
    name: string;
    target: "player";
}

export interface HighEvent {
    kind: "event";
    name: string;
    event: string;
    body: HighStatement[];
}

export type HighStatement =
    | HighIntrinsicStatement
    | HighEventActionStatement
    | HighFunctionCallStatement
    | HighStartProcessStatement
    | HighSelectionSnapshotDeclaration
    | HighLineVariableDeclaration
    | HighDictionaryGetDeclaration
    | HighLineLocationShift
    | HighSetVariableStatement
    | HighClearVariableStatement
    | HighIfStatement
    | HighLoopStatement
    | HighForEachStatement
    | HighForEachDictionaryStatement
    | HighLoopControlStatement
    | HighReturnStatement;

export type HighMutableVariableExpression =
    | HighLineVariableExpression
    | HighPlotVariableExpression
    | HighPlayerVariableExpression;

export interface HighSetVariableStatement {
    kind: "set_variable";
    variable: HighMutableVariableExpression;
    operation?: string;
    value: HighExpression;
}

export interface HighClearVariableStatement {
    kind: "clear_variable";
    variable: HighPlotVariableExpression | HighPlayerVariableExpression;
}

export interface HighIfStatement {
    kind: "if";
    condition: HighCondition;
    body: HighStatement[];
    elseBody?: HighStatement[];
}

export type HighCondition =
    | HighHeldItemCondition
    | HighComparisonCondition
    | HighBooleanCondition
    | HighLogicalCondition
    | HighDictionaryHasKeyCondition;

export interface HighDictionaryHasKeyCondition {
    kind: "dictionary_has_key";
    dictionary: HighExpression;
    key: HighExpression;
}

export interface HighComparisonCondition {
    kind: "comparison";
    action: string;
    left: HighExpression;
    right: HighExpression;
}

export interface HighBooleanCondition {
    kind: "boolean_condition";
    value: HighExpression;
}

export interface HighLogicalCondition {
    kind: "logical";
    operator: "and" | "or" | "not";
    operands: HighCondition[];
}

export interface HighLoopStatement {
    kind: "loop";
    form: "for" | "while" | "do_while";
    condition: HighCondition;
    body: HighStatement[];
    initializer?: HighLineVariableDeclaration;
    update?: HighSetVariableStatement;
}

export interface HighForEachStatement {
    kind: "for_each";
    variable: HighLineVariableExpression;
    iterable: HighExpression;
    body: HighStatement[];
}

export interface HighForEachDictionaryStatement {
    kind: "for_each_dictionary";
    keyVariable: HighLineVariableExpression & { valueType: "text" };
    valueVariable: HighLineVariableExpression;
    dictionary: HighExpression;
    body: HighStatement[];
}

export interface HighLoopControlStatement {
    kind: "loop_control";
    control: "break" | "continue";
}

export interface HighReturnStatement {
    kind: "return";
    context: "function" | "process" | "event";
}

export interface HighHeldItemCondition {
    kind: "held_item";
    receiver: "current_player";
    hand: "main";
    item: HighItemLiteral;
}

export interface HighLineVariableDeclaration {
    kind: "declare_line_variable";
    name: string;
    valueType: ValueType;
    initializer: HighExpression;
}

export interface HighDictionaryGetDeclaration {
    kind: "declare_dictionary_get";
    valueVariable: HighLineVariableExpression;
    foundVariable: HighLineVariableExpression & { valueType: "boolean" };
    dictionary: HighExpression;
    key: HighExpression;
}

export interface HighSelectionSnapshotDeclaration {
    kind: "declare_selection_snapshot";
    name: string;
    sizeName: string;
    resultType: "player";
    cardinality: "many" | "at_most_one";
    initializer: HighSelectionExpression;
}

export interface HighLineLocationShift {
    kind: "shift_line_location";
    name: string;
    operation:
        | "axes"
        | "direction"
        | "axis"
        | "toward"
        | "coordinate"
        | "face";
    arguments: HighExpression[];
    options?: Record<string, string>;
}

export interface HighFunctionCallStatement {
    kind: "call_function";
    function: string;
    arguments: HighExpression[];
    receiver?: HighReceiver;
}

export interface HighStartProcessStatement {
    kind: "start_process";
    process: string;
    arguments: HighExpression[];
    options?: Record<string, string>;
}

export interface HighEventActionStatement {
    kind: "event_action";
    operation: string;
    arguments: Record<string, HighArgument>;
    options?: Record<string, string>;
}

export interface HighIntrinsicStatement {
    kind: "intrinsic";
    operation: string;
    receiver: HighReceiver;
    arguments: Record<string, HighArgument>;
    options?: Record<string, string>;
}

export type HighReceiver =
    | {
          kind: "game";
      }
    | {
          kind: "control";
      }
    | {
          kind: "selection";
          value: HighSelectionExpression;
      }
    | {
          kind: "current_player";
      }
    | {
          kind: "event_entity";
          role: HighEventEntityRole;
      };

export interface HighSelectionExpression {
    kind: "selection";
    resultType: "player" | "entity";
    source: HighSelector | HighSelectionSnapshotExpression;
    filters: HighSelector[];
}

export interface HighSelectionSnapshotExpression {
    kind: "selection_snapshot";
    name: string;
    sizeName: string;
    resultType: "player";
    cardinality: "many" | "at_most_one";
}

export interface HighSelector {
    operation: string;
    arguments: HighExpression[];
    options?: Record<string, string>;
}

export type HighEventEntityRole =
    | "default"
    | "victim"
    | "damager"
    | "killer"
    | "shooter"
    | "projectile";

export type HighArgument = HighExpression | HighExpression[];

export type HighExpression =
    | HighEventFieldExpression
    | HighGameValueExpression
    | HighSelectionSnapshotExpression
    | HighSelectionCountExpression
    | HighLineVariableExpression
    | HighPlotVariableExpression
    | HighPlayerVariableExpression
    | HighParameterExpression
    | HighStringLiteral
    | HighNumberLiteral
    | HighBooleanLiteral
    | HighSoundLiteral
    | HighLocationLiteral
    | HighItemLiteral
    | HighItemSnapshotLiteral
    | HighItemConstructorExpression
    | HighItemTransformExpression
    | HighArithmeticExpression
    | HighStringTemplateExpression
    | HighListLiteralExpression
    | HighListIndexExpression
    | HighListLengthExpression
    | HighListWithExpression
    | HighListAppendExpression
    | HighListConcatExpression
    | HighListSliceExpression
    | HighDictionaryLiteralExpression
    | HighDictionaryGetExpression
    | HighDictionarySizeExpression
    | HighDictionaryKeysExpression
    | HighDictionaryValuesExpression
    | HighDictionaryWithExpression
    | HighDictionaryWithoutExpression
    | HighDictionaryMergedExpression;

export interface HighListLiteralExpression {
    kind: "list";
    elements: HighExpression[];
    valueType: ListValueType;
}

export interface HighListIndexExpression {
    kind: "list_index";
    list: HighExpression;
    index: HighExpression;
    valueType: ValueType;
}

export interface HighListLengthExpression {
    kind: "list_length";
    list: HighExpression;
}

export interface HighListWithExpression {
    kind: "list_with";
    list: HighExpression;
    index: HighExpression;
    value: HighExpression;
    valueType: ListValueType;
}

export interface HighListAppendExpression {
    kind: "list_append";
    list: HighExpression;
    values: HighExpression[];
    valueType: ListValueType;
}

export interface HighListConcatExpression {
    kind: "list_concat";
    list: HighExpression;
    lists: HighExpression[];
    valueType: ListValueType;
}

export interface HighListSliceExpression {
    kind: "list_slice";
    list: HighExpression;
    start?: HighExpression;
    end?: HighExpression;
    valueType: ListValueType;
}

export interface HighDictionaryEntry {
    key: HighExpression;
    value: HighExpression;
}

export interface HighDictionaryLiteralExpression {
    kind: "dictionary";
    entries: HighDictionaryEntry[];
    valueType: DictionaryValueType;
}

export interface HighDictionaryGetExpression {
    kind: "dictionary_get";
    dictionary: HighExpression;
    key: HighExpression;
    valueType: ValueType;
}

export interface HighDictionarySizeExpression {
    kind: "dictionary_size";
    dictionary: HighExpression;
}

export interface HighDictionaryKeysExpression {
    kind: "dictionary_keys";
    dictionary: HighExpression;
}

export interface HighDictionaryValuesExpression {
    kind: "dictionary_values";
    dictionary: HighExpression;
    valueType: ListValueType;
}

export interface HighDictionaryWithExpression {
    kind: "dictionary_with";
    dictionary: HighExpression;
    key: HighExpression;
    value: HighExpression;
    valueType: DictionaryValueType;
}

export interface HighDictionaryWithoutExpression {
    kind: "dictionary_without";
    dictionary: HighExpression;
    key: HighExpression;
    valueType: DictionaryValueType;
}

export interface HighDictionaryMergedExpression {
    kind: "dictionary_merged";
    dictionary: HighExpression;
    dictionaries: HighExpression[];
    valueType: DictionaryValueType;
}

export interface HighSelectionCountExpression {
    kind: "selection_count";
    selection: HighSelectionExpression;
}

export interface HighArithmeticExpression {
    kind: "arithmetic";
    operation: string;
    operands: HighExpression[];
}

export interface HighStringTemplateExpression {
    kind: "string_template";
    parts: HighExpression[];
}

export interface HighGameValueExpression {
    kind: "game_value";
    value: string;
    valueType: ValueType;
    receiver: "current_player" | HighSelectionSnapshotExpression;
}

export interface HighLineVariableExpression {
    kind: "line_variable";
    name: string;
    valueType: ValueType;
}

export interface HighPlotVariableExpression {
    kind: "plot_variable";
    name: string;
    scope: "unsaved" | "saved";
    valueType: ValueType;
}

export interface HighPlayerVariableExpression {
    kind: "player_variable";
    name: string;
    scope: "unsaved" | "saved";
    valueType: ValueType;
    receiver: "current_player" | "selection" | HighSelectionSnapshotExpression;
}

export interface HighParameterExpression {
    kind: "parameter";
    name: string;
    valueType: ValueType;
}

export type HighEventFieldType =
    | "text"
    | "number"
    | "component"
    | "location"
    | "item"
    | "list"
    | "vector";

export interface HighEventFieldExpression {
    kind: "event_field";
    event: string;
    field: string;
    valueType: HighEventFieldType;
}

export interface HighStringLiteral {
    kind: "string";
    value: string;
}

export interface HighNumberLiteral {
    kind: "number";
    value: number;
}

export interface HighBooleanLiteral {
    kind: "boolean";
    value: boolean;
}

export interface HighSoundLiteral {
    kind: "sound";
    value: string;
}

export interface HighLocationLiteral {
    kind: "location";
    x: number;
    y: number;
    z: number;
}

export interface HighItemLiteral {
    kind: "item";
    id: string;
    count: number;
}

export interface HighItemSnapshotLiteral {
    kind: "item_snapshot";
    snbt: string;
}

export interface HighItemConstructorExpression {
    kind: "item_constructor";
    material: HighExpression;
    count: HighExpression;
}

export interface HighItemTransformExpression {
    kind: "item_transform";
    operation: string;
    receiver: HighExpression;
    arguments: HighExpression[];
}
