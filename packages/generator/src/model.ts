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
    tags: OperationTag[];
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
    acceptedTypes: string[];
    native: {
        index: number;
    };
}

export interface OperationSingleInput extends OperationInputBase {
    cardinality: "single";
    optional: boolean;
}

export interface OperationPluralInput extends OperationInputBase {
    cardinality: "plural";
    minimumLength: number;
}

export type OperationInput = OperationSingleInput | OperationPluralInput;

export interface OperationTag {
    id: string;
    defaultOption: string;
    options: string[];
    native: {
        name: string;
        slot: number;
        options: Record<string, string>;
    };
}

export interface SoundDefinition {
    id: string;
    native: string;
}
