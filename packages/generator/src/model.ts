export interface Operation {
    id: string;
    receiver: "player";
    method: string;
    description: string;

    native: {
        block: string;
        action: string;
    };

    inputs: OperationInput[];
    omittedInputs: OmittedInput[];
    tags: OperationTag[];
}

export interface OmittedInput {
    native: {
        slotId: number;
        index: number;
    };
    reason: "missing_public_metadata";
}

export type UnsupportedReason =
    | "missing_public_metadata"
    | "unsupported_shape"
    | "unsupported_type";

export interface UnsupportedOperation {
    id: string;
    receiver: "player";
    method: string;
    native: {
        block: string;
        action: string;
    };
    reason: UnsupportedReason;
    detail: string;
}

export type NormalizationResult =
    | {
          kind: "operation";
          operation: Operation;
      }
    | {
          kind: "unsupported";
          operation: UnsupportedOperation;
      };

interface OperationInputBase {
    id: string;
    type: string;
    native: {
        encodings: NativeInputEncoding[];
    };
}

export interface NativeInputEncoding {
    slotId: number;
    index: number;
    layout: "single" | "plural" | "static";
    orSlotId?: number;
    variantIndex?: number;
}

export interface OperationSingleInput extends OperationInputBase {
    cardinality: "single";
    optional: boolean;
}

export interface OperationPluralInput extends OperationInputBase {
    cardinality: "plural";
    minimumLength: number;
    listShortcut: boolean;
}

export type OperationInput = OperationSingleInput | OperationPluralInput;

export interface OperationTag {
    id: string;
    defaultOption: string;
    options: string[];
}

export interface SoundDefinition {
    id: string;
    native: string;
}
