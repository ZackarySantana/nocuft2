declare const valueBrand: unique symbol;

import type { SoundInput } from "../generated/sounds";

export interface Location {
    readonly [valueBrand]: "Location";
}

export declare function location(x: number, y: number, z: number): Location;

export type ComponentInput = string | number | boolean;

export interface Sound {
    readonly [valueBrand]: "Sound";
}

export declare function sound(id: SoundInput): Sound;

/** A typed DiamondFire list value. List operations return a new list. */
export interface List<T extends AnyValueInput = AnyValueInput> {
    readonly [valueBrand]: "List";
    readonly [index: number]: T;
    readonly length: number;
    [Symbol.iterator](): Iterator<T>;
    with(index: number, value: T): List<T>;
    appended(...values: T[]): List<T>;
    concatenated(...lists: List<T>[]): List<T>;
    slice(start?: number, end?: number): List<T>;
}

/** Creates a DiamondFire list. This is distinct from a TypeScript array. */
export declare function list<T extends AnyValueInput>(value: T, ...values: T[]): List<T>;
/** Creates an empty DiamondFire list. The element type must be explicit. */
export declare function list<T extends AnyValueInput = never>(
    ...elementType: [T] extends [never] ? [never] : []
): List<T>;

/** A typed DiamondFire dictionary value. Dictionary operations return a new dictionary. */
export interface Dictionary<V extends AnyValueInput = AnyValueInput> {
    readonly [valueBrand]: "Dictionary";
    readonly size: number;
    /** Returns the value and whether the key was present; missing keys yield a typed empty value. */
    get(key: string): readonly [value: V, found: boolean];
    has(key: string): boolean;
    with(key: string, value: V): Dictionary<V>;
    without(key: string): Dictionary<V>;
    merged(other: Dictionary<V>): Dictionary<V>;
    keys(): List<string>;
    values(): List<V>;
    [Symbol.iterator](): Iterator<readonly [string, V]>;
}

type WidenedValue<T> = T extends string ? string
    : T extends number ? number
    : T extends boolean ? boolean
    : T;

type EntryValue<Entries> = WidenedValue<Entries[Extract<keyof Entries, string>]>;

type InlineEntries<Entries> = (<T>() => T extends Entries ? 1 : 2) extends
    (<T>() => T extends Readonly<Entries> ? 1 : 2) ? unknown : never;

type UniformEntries<Entries, V = EntryValue<Entries>> = V extends unknown
    ? [EntryValue<Entries>] extends [V] ? unknown : never
    : never;

/** Creates an empty DiamondFire dictionary. The value type must be explicit. */
export declare function dictionary<V extends AnyValueInput = never>(
    ...valueType: [V] extends [never] ? [never] : []
): Dictionary<V>;
/** Creates a DiamondFire dictionary from an inline object literal with one value type. */
export declare function dictionary<
    const Entries extends Readonly<Record<string, AnyValueInput>>,
>(
    entries: Entries & InlineEntries<Entries> & UniformEntries<Entries>,
): Dictionary<EntryValue<Entries>>;
export declare function dictionary<V extends AnyValueInput = never>(
    entries: Readonly<Record<string, NoInfer<V>>>,
): Dictionary<V>;

type AnyContainerInput = List<AnyValueInput> | Dictionary<AnyValueInput>;

export type AnyValueInput = ComponentInput | Location | Item | Sound | AnyContainerInput;

export type { SoundId, SoundInput } from "../generated/sounds";

export interface Item {
    readonly [valueBrand]: "Item";
    withMaterial(material: string): Item;
    withCount(count: number): Item;
    withName(...name: ComponentInput[]): Item;
    withEnchantment(enchantment: string, level: number): Item;
    withoutEnchantment(enchantment: string): Item;
    withoutEnchantments(): Item;
    withLoreAppended(...lines: ComponentInput[]): Item;
}

export interface ItemOptions {
    readonly count?: number;
}

export declare function item(id: string, options?: ItemOptions): Item;

/** Compiler intrinsic used by generated captured-item facades. */
export declare function itemSnapshot(snbt: string): Item;
