# Nocuft Generator

The generator converts DiamondFire action metadata into committed SDK,
frontend, and compiler bindings.

The source snapshot is `src/actiondump.json`. Generated output includes action
methods, events, values, selectors, structural operations, item transforms,
sounds, tags, and unsupported-action documentation.

From the repository root:

```sh
npm run generate
npm run generate:check
```

`generate` rewrites committed bindings. `generate:check` regenerates them and
fails when the worktree changes. Metadata changes and their generated API
changes should be reviewed together.
