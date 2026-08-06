# Nocuft Client

The Nocuft Fabric client receives compiled projects from the local CLI and
provides the in-game build selection and captured-item workflows.

The mod currently targets Minecraft 26.2 with Fabric Loader and Fabric API.
Building the core requires JDK 21; building the Fabric mod requires JDK 25.

## Build

From the repository root:

```sh
npm run mod:build
```

The installable JAR is written under `packages/client/mod/build/libs/`.

Install it into a launcher profile:

```sh
npm run mod:install -- --dir "<mods folder>" --save
```

The saved mods directory is local to the checkout. The installer refuses to
replace the JAR while a Nocuft client is listening unless `--force` is used.

Run a development client with:

```sh
npm run mod:run
```

## Usage

Run `npx nocuft gui --open`, then use `/nocuft` in Minecraft. The mod listens
on `127.0.0.1:31380` and rejects browser-originated WebSocket connections.

Available client commands:

```text
/nocuft
/nocuft help
/nocuft items capture <name>
```

The CLI only supplies builds. Clearing and applying code to a plot always
requires an explicit in-game action.
