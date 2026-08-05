// This file is generated. Do not edit manually.

import type { AnyValueInput } from "../values/index";

/** Options for endAllThreads. */
export interface EndAllThreadsOptions {
    /** Default: true */
    readonly endCurrentThread?: boolean;
}

/** Options for printDebug. */
export interface PrintDebugOptions {
    /** Default: "developer" */
    readonly permission?: "owner" | "developer" | "builder" | "developerOrBuilder" | "whitelisted" | "all";
    /** Default: "addSpaces" */
    readonly merging?: "addSpaces" | "noSpaces";
    /** Default: "none" */
    readonly highlighting?: "none" | "error" | "warning" | "other";
    /** Default: "default" */
    readonly sound?: "none" | "default" | "success" | "error" | "warning" | "lagSlayer";
    /** Default: "debug" */
    readonly messageStyle?: "custom" | "debug" | "error" | "warning" | "info" | "lagSlayer";
}

/** Options for wait. */
export interface WaitOptions {
    /** Default: "ticks" */
    readonly timeUnit?: "ticks" | "seconds" | "minutes";
}

export interface ControlActions {
    /** Stops the current event thread. Any code after this block will not be executed. */
    end(): void;

    /** Ends all currently active threads, including active lines, loops, etc. */
    endAllThreads(): void;

    /** Ends all currently active threads, including active lines, loops, etc. */
    endAllThreadsWith(options: EndAllThreadsOptions): void;

    /** Sends a formatted message to the specified plot staff group regardless of which mode they're currently in. Clicking on the message will teleport you to this block. */
    printDebug(...messageToFormat: AnyValueInput[]): void;

    /** Sends a formatted message to the specified plot staff group regardless of which mode they're currently in. Clicking on the message will teleport you to this block. */
    printDebugWith(options: PrintDebugOptions, ...messageToFormat: AnyValueInput[]): void;

    /** Skips the rest of a Function sequence and returns to the block it was called from. */
    return(): void;

    returnNtimes(): void;

    /** Skips the rest of this repeat statement's code and continues to the next repetition. */
    skip(): void;

    /** Stops a Repeat sequence and continues to the next code block. */
    stopRepeat(): void;

    /** Pauses the current code sequence for a duration of ticks, seconds, or minutes. */
    wait(waitDuration?: number): void;

    /** Pauses the current code sequence for a duration of ticks, seconds, or minutes. */
    waitWith(options: WaitOptions, waitDuration?: number): void;
}
