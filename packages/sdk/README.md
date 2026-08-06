# Nocuft

Nocuft is a TypeScript toolchain for building and deploying DiamondFire code.
This public package contains both the compile-time SDK and the `nocuft` CLI.

```sh
npx nocuft init arena
```

`init` creates `entry.ts` and `tsconfig.json`, then installs `nocuft` as a
development dependency. To install it before initialization instead:

```sh
npm install --save-dev nocuft
npx nocuft init arena
```

The SDK declarations describe DiamondFire values and operations. Nocuft reads
the TypeScript source directly; the declarations are not a JavaScript runtime.

## First Project

```ts
import { events, players } from "nocuft";

export const join = events.player.join((event) => {
    event.player.sendMessage("Welcome!");
    players.all().sendMessage(`${event.player.name()} joined`);
});
```

Functions, events, and processes compile into DiamondFire code templates.

## Values

The SDK supports text, numbers, booleans, components, locations, items, sounds,
lists, dictionaries, players, and typed line variables. Constant values are
embedded directly; supported dynamic expressions lower to native DiamondFire
actions.

### Lists

`List<T>` is a nominal DiamondFire value created with `list()`. It supports
indexed reads, `length`, and functional updates:

```ts
import { list, plot, type List } from "nocuft";

const route: List<number> = list(10, 20, 30);
const first = route[0];
const changed = route.with(1, 25);
const extended = changed.appended(40).concatenated(list(50, 60));
const middle = extended.slice(1, 4);

const savedRoute = plot.var.saved.list<number>("route");
savedRoute.set(middle);

const nested: List<List<number>> = list(route, middle);
```

Player-scoped lists use the same factory and take a player target when read or
written:

```ts
import { events, players } from "nocuft";

const recentScores = players.var.game.list<number>("recent-scores");

export const join = events.player.join((event) => {
    const scores = recentScores.get(event.player);
    recentScores.set(event.player, scores.appended(100));
});
```

List updates do not mutate their receiver; assign or store the returned list.
Only indexing, `length`, `with`, `appended`, `concatenated`, and `slice` are SDK
list operations. JavaScript array iteration and methods such as `map`, `push`,
and `splice` are not available. TypeScript arrays remain compile-time argument
containers (for example, `giveItems([item(...)])`) and are not assignable to
`List<T>` or accepted as portable runtime values. Nested `List` values are
portable, including as process and package-function inputs.
Literal list indices and slice bounds must be non-negative integers and use
zero-based semantics. Dynamic `number` indices and bounds remain supported and
are passed through to the runtime.

### Dictionaries

`Dictionary<V>` is a nominal DiamondFire runtime value, not a TypeScript
`Record` or ordinary object. Keys are always text; an object literal passed to
`dictionary()` is only constructor syntax and its values must all share one
type:

```ts
import { dictionary, list, plot, type Dictionary } from "nocuft";

const scores = dictionary({ red: 10, blue: 20 });
// Dictionary<number>
const [red, foundRed] = scores.get("red");
const changed = scores.with("red", 15).without("blue");
const combined = changed.merged(dictionary({ red: 30, blue: 5 }));

const empty: Dictionary<number> = dictionary<number>();
const savedScores = plot.var.saved.dictionary<number>("scores");
savedScores.set(combined);
```

The entries argument must be written inline; an object variable is not a
constructor. Empty `list()` and `dictionary()` calls need explicit type
arguments, and mixed value types need an explicit value type such as
`dictionary<AnyValueInput>({ ... })`.

`size`, `get`, `has`, `with`, `without`, `merged`, `keys`, and `values` are the
supported dictionary operations. Updates are functional: they return a new
dictionary and do not mutate the receiver. `keys()` and `values()` return
runtime `List` values. Dictionaries can contain other dictionaries or lists and
can be nested inside lists, and plot- and player-scoped variable factories can
store them.

Dictionary iteration yields readonly `[key, value]` pairs:

```ts
for (const [team, score] of scores) {
    // team is string and score is number
}

const grouped = dictionary({ rounds: list(scores, changed) });
```

Lists and dictionaries can also be made explicit line variables:

```ts
const values = line.list(list(1, 2, 3));
const scores = line.dictionary(dictionary({ red: 10, blue: 20 }));
```

`get` returns a `[value, found]` pair that must be destructured in a
declaration. A missing key sets `found` to `false` and writes a typed empty
value: an empty list or dictionary, `0`, `""`, `false`, an empty component, a
zeroed location, or an air item. Dictionaries of sounds have no empty value and
reject `get`. Runtime dictionary order follows DiamondFire and should not be
treated as TypeScript object property ordering.

### Locations

```ts
import { events, line } from "nocuft";

export const launch = events.player.join((event) => {
    const destination = line.location(event.player.location());
    destination.shift(0, 10, 0);
    destination.face(event.player.location(), "away");
    event.player.teleport(destination);
});
```

Mutable line locations support `shift`, `shiftDirection`, `shiftAxis`,
`shiftToward`, `setCoordinate`, and `face`.

### Items

```ts
import { item, line, players } from "nocuft";

let sword = line.item(item("diamond_sword"));
sword = sword
    .withCount(2)
    .withName("Sword of Doom")
    .withEnchantment("minecraft:sharpness", 5)
    .withLoreAppended("Forged for the arena");

players.all().giveItems([sword]);
```

Item transformations are functional and must be assigned or consumed. Available
operations include material, count, name, enchantment, and lore changes.

Captured catalog items are generated as ordinary typed item values:

```ts
import { players } from "nocuft";
import { items } from "./nocuft/items.js";

players.all().giveItems([items["sword-of-doom"]]);
```

Their complete SNBT remains vendored in the project and is preserved through
High IR, Low IR, and native template emission.

## Processes

```ts
import { control, players, process } from "nocuft";

export const countdown = process.create((message: string, delay: number) => {
    control.waitWith({ timeUnit: "seconds" }, delay);
    players.all().sendMessage(message);
});

export function start(): void {
    countdown.startWith(
        { targetMode: "withNoTargets", localVariables: "dontCopy" },
        "Ready",
        2,
    );
}
```

Processes currently support up to 25 fixed value parameters. Anonymous process
callbacks and delayed callback scheduling are not implemented.

## Arithmetic And Control Flow

Initialized `let` declarations of type `number`, `string`, or `boolean` become
line variables. Numeric arithmetic, assignment, comparisons, boolean logic,
`if`/`else`, canonical `for` loops, `while`, `do while`, `break`, `continue`,
and value-less `return` are supported.

```ts
import { control, players, process } from "nocuft";

export const timer = process.create((seconds: number) => {
    for (let remaining = seconds; remaining >= 0; remaining -= 1) {
        players.all().sendMessage(`${remaining} seconds remaining`);
        control.waitWith({ timeUnit: "seconds" }, 1);
    }
});
```

## Player State And Selections

```ts
import { events, players } from "nocuft";

const queued = players.var.game.boolean("queued");
const wins = players.var.saved.number("wins");

export const join = events.player.join((event) => {
    queued.set(event.player, true);
    wins.set(event.player, wins.get(event.player) + 1);
});
```

Selections can be filtered, randomized, counted, and narrowed to one player.
Assigning a selection to a local `const` creates an eager UUID snapshot so later
operations reuse the same membership rather than rerunning the query.

```ts
const bearer = players.all().where(queued, true).one();
bearer.sendMessage("You have been selected");
players.all().sendMessage(`${bearer.name()} has the sword`);
```

Selection ordering is not guaranteed. An empty `one()` selection performs no
targeted actions and uses DiamondFire's empty-selection result for values.

## CLI

See the full [CLI documentation](https://github.com/ZackarySantana/nocuft2/blob/main/packages/cli/README.md)
for project tracking, live builds, vendored packages, and captured item catalogs.

## License

[MIT](LICENSE)
