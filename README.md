# Nocuft

A transpiler for DiamondFire code templates.

Development requires Node.js 22 or newer. The client core build uses JDK 21;
the optional Fabric mod build uses JDK 25.

This project supports:

- [x] TypeScript
- [ ] Java
- [ ] Golang

## DFIR-High

A high-level intermediate representation of a program, independent of any specific programming language. It's expressed through language constructs and semantics that DiamondFire code templates **do not support**.

## DFIR-Low

The lowering target of DFIR-High. It's expressed through language constructs and semantics that DiamondFire code templates **do support**.

## Locations

`location(x, y, z)` and player location methods produce immutable location
values. Literal coordinates must currently be compile-time numbers; emitted
literals use zero pitch and yaw and are non-block locations.

Use `line.location(value)` when a location must be changed before it is passed
to an action:

```ts
const destination = line.location(event.player.location());
destination.shift(0, 10, 0);
destination.face(event.player.location(), "away");
event.player.teleport(destination);
```

Mutable line locations support `shift`, `shiftDirection`, `shiftAxis`,
`shiftToward`, `setCoordinate`, and `face`. Omitted directional offsets default
to zero, `face` defaults to `"toward"`, and `shiftToward` may omit its distance.
Rotated literals and block locations are not currently supported.

## CLI

Build the workspace and link the command locally:

```sh
npm run build
npm run link:cli
```

Register each TypeScript project once:

```sh
nocuft local register hello examples/hello/plot.ts
nocuft local register arena examples/arena/plot.ts --module examples.arena
```

To register every runnable example under the shared `examples` namespace, run:

```sh
npm run register:examples
```

This registers the `hello` and `arena` examples. Re-running updates
their local registrations. Pass `-- --no-force` to keep existing registrations
unchanged instead.

A registration stores an absolute entry path and a module namespace on this
machine. The default module is `app.<project-name>`. Use `--module` when a
project needs a different stable namespace. Replacing an existing registration
requires `--force`.

Registration creates `nocuft.json` in the project root when the project does
not have an identity yet. Commit that file so every checkout refers to the same
project.

Manage registrations with:

```sh
nocuft local list
nocuft local show hello
nocuft local unregister hello
```

Start Minecraft with the Nocuft client mod, then run:

```sh
nocuft gui --open
```

The mod listens only on localhost and accepts the connection immediately.
The CLI compiles every registered project, sends successful builds,
and watches the source files and TypeScript configuration used by each build.
Compilation failures leave the last successful build visible and are retried
after the next save.

`nocuft gui` only feeds the in-game screen. Applying a build to a plot remains
an in-game action.

To inspect the same live compiler output without starting Minecraft, run:

```sh
nocuft web
```

The command prints `http://127.0.0.1:31381/` and keeps running until stopped.
The local page groups templates by registered project and renders each one as
a readable DiamondFire-like code line. Successful builds update immediately.
If a later build fails, the page keeps the last successful line visible, marks
it stale, and shows the current diagnostics.

Use a different fixed port or rebuild delay when needed:

```sh
nocuft web --port 43181 --debounce 500
```

The web viewer binds only to `127.0.0.1`, does not open a browser, and does not
connect to the Minecraft mod.

The current CLI supports TypeScript projects only. Custom action registries,
Go, and Java are not implemented.

Before committing, run the complete workspace check:

```sh
npm run check
```

Generated SDK, compiler, and frontend bindings are committed. They are derived
from `packages/generator/src/actiondump.json`; `npm run generate` refreshes them,
and `npm run generate:check` fails when committed generated source is stale.
The action dump is the DiamondFire action metadata snapshot consumed by the
generator. When replacing it, regenerate all bindings and review the resulting
API changes together with the updated snapshot.

### Processes and control actions

Declare a named process with `process.create` and start it from a function,
event, or another process. Starting a process does not pause the current code
line.

```ts
import { control, events, players, process } from "@nocuft/diamondfire";

export const countdown = process.create(
    (message: string, delay: number) => {
        control.waitWith({ timeUnit: "seconds" }, delay);
        players.all().sendMessage(message);
    },
);

export const boot = events.plot.startup(() => {
    countdown.startWith(
        {
            targetMode: "withNoTargets",
            localVariables: "dontCopy",
        },
        "Ready",
        2,
    );
});
```

`control.wait(duration)` uses DiamondFire's default `ticks` time unit.
`control.waitWith` accepts the generated `timeUnit` values `ticks`, `seconds`,
and `minutes`. Process declaration and start options are also generated from
the DiamondFire action metadata, including `isHidden`, `targetMode`, and
`localVariables`.

Processes currently support up to 25 fixed value parameters. Anonymous
process callbacks, delayed callback scheduling, and general TypeScript loop
lowering are not implemented.

### Vendored packages

A package is one TypeScript file that exports reusable `void` functions. Its
parameters may be `string`, `number`, `boolean`, `ComponentInput`, `Location`,
`Item`, `SoundInput`, or `AnyValueInput`. One `PlayerTarget` parameter may appear
anywhere in the signature when the function acts on players. Parameters must be
required, named, and fixed. Package source may import only
`@nocuft/diamondfire`.

From anywhere inside a project, install a local file or an HTTP, HTTPS, or file
URL under an alias:

```sh
nocuft package install mathx ./mathx.ts
nocuft package install messages https://example.com/messages.ts
```

Install writes these files, which should all be committed:

```text
nocuft.lock.json
nocuft/mathx/src/source.ts
nocuft/mathx/module.dfir.json
nocuft/mathx/exports.json
nocuft/mathx/index.ts
```

Import the generated TypeScript stub with a relative path:

```ts
import { greet } from "./nocuft/mathx/index.js";
```

Normal builds verify and link only these committed files. They never access
the network and do not recompile package source. `exports.json` is the portable
contract future Go and Java stub generators will consume. Go and Java stubs
are intentionally not emitted until those SDKs exist.

Manage packages with:

```sh
nocuft package list
nocuft package show mathx
nocuft package verify
nocuft package outdated
nocuft package update mathx
nocuft package uninstall mathx
```

`install` refuses an existing alias. Use `update` to fetch and replace it.
Only `install`, `update`, and `outdated` access package sources.

## Client mod

The client mod targets Minecraft 26.2 with Fabric Loader and requires JDK 25.
Build its installable JAR from the repository root:

```sh
npm run mod:build
```

The JAR is written to `packages/client/mod/build/libs/`. Install it with Fabric
API for Minecraft 26.2. You can also copy it to a launcher profile with:

```sh
npm run mod:install -- --dir "<mods folder>" --save
```

The saved mods directory is local to this checkout. The installer refuses to
replace the JAR while a Nocuft client is listening unless `--force` is used.

For a development instance, run:

```sh
npm run mod:run
```

Use `/nocuft` in game to open the build selection screen. Authentication is
not part of the initial protocol. The mod binds its WebSocket server to
`127.0.0.1:31380` and accepts local tool connections immediately.
