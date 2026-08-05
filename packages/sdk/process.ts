import type {
    CreateProcessOptions,
    StartProcessOptions,
} from "./generated/process";
import type {
    AnyValueInput,
    ComponentInput,
    Item,
    Location,
} from "./values/index";
import type { SoundInput } from "./generated/sounds";

export type ProcessValueInput =
    | string
    | number
    | boolean
    | ComponentInput
    | Location
    | Item
    | SoundInput
    | AnyValueInput;

export interface ProcessHandle<Arguments extends readonly ProcessValueInput[]> {
    start(...arguments_: Arguments): void;
    startWith(options: StartProcessOptions, ...arguments_: Arguments): void;
}

export interface Processes {
    create<Arguments extends readonly ProcessValueInput[]>(
        callback: (...arguments_: Arguments) => void,
    ): ProcessHandle<Arguments>;
    createWith<Arguments extends readonly ProcessValueInput[]>(
        options: CreateProcessOptions,
        callback: (...arguments_: Arguments) => void,
    ): ProcessHandle<Arguments>;
}

export declare const process: Processes;
