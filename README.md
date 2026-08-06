# Nocuft

Nocuft is a TypeScript toolchain for building and deploying DiamondFire code.
It provides a compile-time SDK, a local project/catalog CLI, and a Fabric client
mod for applying builds in Minecraft.

## Install

Nocuft requires Node.js 22 or newer.

```sh
npm install --save-dev nocuft
npx nocuft init arena src/plot.ts
```

```ts
import { events, players } from "nocuft";

export const join = events.player.join(() => {
    players.all().sendMessage("Hello from Nocuft");
});
```

Install the separately distributed Fabric mod, start Minecraft, then run:

```sh
npx nocuft gui --open
```

The CLI compiles locally tracked projects and sends them to the in-game build
screen. Applying a build remains an explicit in-game action.

## Documentation

- [SDK and language features](packages/sdk/README.md)
- [CLI, projects, packages, and captured items](packages/cli/README.md)
- [Fabric client mod](packages/client/README.md)
- [Intermediate representations](packages/dfir/README.md)
- [Generated metadata and bindings](packages/generator/README.md)

## Status

TypeScript projects are supported. Java and Go frontends are planned but not
implemented. The Fabric mod currently targets Minecraft 26.2.

## Development

Install dependencies and run the complete check:

```sh
npm install
npm run check
```

Useful commands:

```sh
npm run build
npm test
npm run package:check
npm run link:cli
npm run mod:build
```

Generated source is committed. Run `npm run generate` after changing the action
metadata, or `npm run generate:check` to verify generated files are current.

The client core requires JDK 21. Building or running the Fabric mod requires
JDK 25.

## License

[MIT](LICENSE)
