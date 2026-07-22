# Eve Directory

Open registry of [Eve](https://eve.dev) agents and extensions for [evedirectory.com](https://evedirectory.com).

Browse full agent source without login, install into a project with the shadcn CLI, or compose a starter stack and export a zip.

**Repo:** [github.com/nolly-studio/eve-directory](https://github.com/nolly-studio/eve-directory)

## Install an agent (shadcn CLI)

One-time registry setup:

```bash
npx shadcn@latest registry add @evedirectory=https://evedirectory.com/r/{name}.json
```

Then install by slug (from `/agents/<slug>`):

```bash
npx shadcn@latest add @evedirectory/pr-review-sentinel
```

That drops a complete Eve app (`package.json`, `agent/`, `evals/`) into your project. See [Install with shadcn CLI](https://evedirectory.com/docs/install-with-shadcn).

## Catalog

Content lives in `catalog/` (not app code):

| Path | Role |
| --- | --- |
| `catalog/registry.json` | Index of agents and extensions |
| `catalog/agents/<slug>/` | Full Eve agent apps (nested `agent/`, `evals/`, …) |
| `catalog/extensions/<slug>/` | Extension listings |
| `catalog/integrations.json` | Official Eve integration index |
| `public/r/` | Built shadcn registry JSON (served at `/r/<slug>.json`) |

### Add an agent

1. Create `catalog/agents/<slug>/` as a nested Eve app (see `competitive-intel-scout`)
2. Add a listing entry to `catalog/registry.json`
3. Validate inside the agent dir: `npm install && npx eve info`
4. Regenerate the install registry: `pnpm registry:build`

## Development

```bash
pnpm install
pnpm dev
```

Quality checks before shipping:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

### Scripts

| Script                      | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `pnpm dev`                  | Next.js dev server                      |
| `pnpm build` / `pnpm start` | Production build / serve                |
| `pnpm lint` / `pnpm format` | Ultracite check / fix                   |
| `pnpm typecheck`            | Fumadocs MDX + TypeScript               |
| `pnpm registry:build`       | Regenerate `public/r/` from `catalog/`  |
| `pnpm scrape:integrations`  | Refresh scraped Eve integration details |

## Site routes

- `/` — home
- `/agents`, `/agents/[slug]` — browse + file explorer + install command
- `/extensions`, `/categories/[slug]`, `/integrations/[name]` — discovery
- `/composer` — select listings and export a starter zip
- `/docs` — guides (Fumadocs MDX under `content/docs/`)
- `/r/<slug>.json` — shadcn registry items

## License

[MIT](./LICENSE) — site and catalog agents unless a listing says otherwise.
