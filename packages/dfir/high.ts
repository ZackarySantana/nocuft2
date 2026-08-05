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

export type FunctionValueType =
    | "text"
    | "number"
    | "boolean"
    | "component"
    | "location"
    | "item"
    | "sound"
    | "any";

export type HighParameter = HighValueParameter | HighTargetParameter;

export interface HighValueParameter {
    kind: "value";
    name: string;
    type: FunctionValueType;
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
    | HighLineVariableDeclaration
    | HighLineLocationShift
    | HighSetVariableStatement
    | HighClearVariableStatement
    | HighIfStatement;

export interface HighSetVariableStatement {
    kind: "set_variable";
    variable: HighPlotVariableExpression;
    value: HighExpression;
}

export interface HighClearVariableStatement {
    kind: "clear_variable";
    variable: HighPlotVariableExpression;
}

export interface HighIfStatement {
    kind: "if";
    condition: HighHeldItemCondition;
    body: HighStatement[];
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
    valueType: "location" | "number" | "text" | "boolean";
    initializer: HighExpression;
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
    source: HighSelector;
    filters: HighSelector[];
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
    | HighLineVariableExpression
    | HighPlotVariableExpression
    | HighParameterExpression
    | HighStringLiteral
    | HighNumberLiteral
    | HighBooleanLiteral
    | HighSoundLiteral
    | HighLocationLiteral
    | HighItemLiteral;

export interface HighGameValueExpression {
    kind: "game_value";
    value: string;
    valueType: "location" | "item";
    receiver: "current_player";
}

export interface HighLineVariableExpression {
    kind: "line_variable";
    name: string;
    valueType: "location" | "number" | "text" | "boolean";
}

export interface HighPlotVariableExpression {
    kind: "plot_variable";
    name: string;
    scope: "unsaved" | "saved";
    valueType: "number" | "text" | "boolean";
}

export interface HighParameterExpression {
    kind: "parameter";
    name: string;
    valueType: FunctionValueType;
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
}
