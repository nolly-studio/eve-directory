# Eve Directory

Open registry of Eve agents and extensions for [evedirectory.com](https://evedirectory.com).

Source: [github.com/nolly-studio/eve-directory](https://github.com/nolly-studio/eve-directory)

Browse full agent source without login, filter by category or integration, and compose a starter project with the built-in composer.

## Catalog

Content lives in `catalog/`:

- `catalog/registry.json` — index of agents and extensions
- `catalog/agents/<slug>/` — full Eve agent directories
- `catalog/extensions/<slug>/` — extension stubs

Add a new agent by creating a directory and adding an entry to `registry.json`.

## Development

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check

## Routes

- `/` — home
- `/agents`, `/agents/[slug]` — agent browse and detail with file explorer
- `/extensions`, `/extensions/[slug]` — extension listings
- `/categories/[slug]`, `/integrations/[name]` — filtered browse
- `/composer` — select pieces and export a starter zip
