# Nocuft CLI

The CLI initializes projects, compiles live builds, manages vendored packages,
and maintains the local captured-item catalog.

```sh
npm install --save-dev nocuft
npx nocuft --help
```

## Projects

Initialize a project once:

```sh
npx nocuft init arena
npx nocuft init arena src/plot.ts
npx nocuft init arena src/plot.ts --module games.arena
```

The entry defaults to `entry.ts`. When the entry file or TypeScript
configuration does not exist, `init` creates a strict `tsconfig.json` and a
player-join Hello World event. It also runs `npm install --save-dev nocuft`
unless the package is already declared. Existing files are left unchanged.

The entry file owns event and process registrations. It may import named
top-level `void` functions from other project source files; reachable imported
functions compile as hidden helpers, while registrations outside the entry file
are not included.

The committed `nocuft.json` is the source of truth for the UUID, name, language,
relative entry path, and module. Local configuration stores only the absolute
checkout root and manifest location.

Track an existing checkout or remove local tracking:

```sh
npx nocuft local add .
npx nocuft local list
npx nocuft local show arena
npx nocuft local remove arena
```

`local remove` never deletes project files.

## Minecraft GUI

With the Fabric mod installed and Minecraft running:

```sh
npx nocuft gui --open
```

The command compiles every locally tracked project, sends successful builds to
Minecraft, and watches source and TypeScript configuration files. Failed
rebuilds leave the last successful build available.

The mod listens only on `127.0.0.1:31380`. Applying a build remains an explicit
in-game action.

## Web Viewer

Inspect the same live output without Minecraft:

```sh
npx nocuft web
npx nocuft web --port 43181 --debounce 500
```

The local viewer binds to `127.0.0.1` and does not open a browser automatically.

## Vendored Packages

A package is a TypeScript file exporting reusable `void` functions. Install a
local file or URL under an alias:

```sh
npx nocuft package install mathx ./mathx.ts
npx nocuft package install messages https://example.com/messages.ts
```

The project commits its lockfile, source snapshot, DFIR artifact, export
contract, and generated TypeScript facade. Normal builds verify these files and
never fetch or recompile package sources.

```sh
npx nocuft package list
npx nocuft package show mathx
npx nocuft package verify
npx nocuft package outdated
npx nocuft package update mathx
npx nocuft package uninstall mathx
```

Package source may import only `nocuft`. Supported parameters include primitive
values, components, locations, items, sounds, recursive `List<T>` and
`Dictionary<T>` values, one
optional player target, and one final rest declaration such as
`...items: Item[]`. Rest calls pass explicit trailing arguments; spreading a
dynamic Nocuft `List` into a user function is rejected. Package IR and export
manifests currently use their initial version 1 formats.

## Captured Items

Run `nocuft gui`, hold an item in Minecraft, then capture it:

```text
/nocuft items capture sword-of-doom
```

The first capture creates v1. Identical captures are ignored. Changed captures
can create a catalog-only revision or transactionally update every locally tracked
project using the item.

Projects commit `nocuft.items.json` and `nocuft/items.ts`. They contain the full
payload, so builds remain offline and reproducible.

```sh
npx nocuft items list
npx nocuft items history sword-of-doom
npx nocuft items install sword-of-doom
npx nocuft items install sword-of-doom@2
npx nocuft items outdated
npx nocuft items update sword-of-doom
npx nocuft items outdated --all-projects
npx nocuft items update --all-projects
npx nocuft items rollback sword-of-doom --to 2
```

Catalog restore creates a new monotonic revision. Removal creates a tombstone;
it never silently uninstalls vendored project copies.

```sh
npx nocuft items restore sword-of-doom --from 2
npx nocuft items remove sword-of-doom
npx nocuft items list --deleted
npx nocuft items rename sword-of-doom doom-blade
npx nocuft items export sword-of-doom --history
npx nocuft items import ./sword-of-doom.json
```

## Local Files

- Project tracking: `$XDG_CONFIG_HOME/nocuft/projects.json` or
  `~/.config/nocuft/projects.json`
- Item catalog: `$XDG_DATA_HOME/nocuft/items.json` or
  `~/.local/share/nocuft/items.json`
