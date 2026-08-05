// This file is generated. Do not edit manually.

export interface CreateProcessOptions {
    /** Default: false */
    readonly isHidden?: boolean;
}

export interface StartProcessOptions {
    /** Default: "withCurrentTargets" */
    readonly targetMode?: "withCurrentTargets" | "withCurrentSelection" | "withNoTargets" | "forEachInSelection";
    /** Default: "dontCopy" */
    readonly localVariables?: "dontCopy" | "copy" | "share";
}
