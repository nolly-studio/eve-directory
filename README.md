# Eve Directory

Install Eve agents with the shadcn CLI, browse every file without a login, or contribute a listing to the open catalog.

Eve Directory is an open registry of [Eve](https://eve.dev) agents and extensions that you inspect file-by-file, install into a project, or compose into a starter zip. The live site is [evedirectory.com](https://www.evedirectory.com). This repository is the site and the curated catalog behind it.

```bash
npx shadcn@latest registry add @evedirectory=https://www.evedirectory.com/r/{name}.json
npx shadcn@latest add @evedirectory/pr-review-sentinel
```

That drops a complete Eve app (`package.json`, `agent/`, `evals/`) into your project. Replace `pr-review-sentinel` with any slug from `/agents/<slug>`.

## Choose how you take an agent home

CLI install belongs in an existing Eve project (or after `npx eve@latest init`). Switch to Composer once you need several agents or extensions in one starter zip. Clone this repo only when you are contributing catalog content or running the directory site itself.

| You need | Use |
| --- | --- |
| One agent in your project | `npx shadcn@latest add @evedirectory/<slug>` |
| A multi-listing starter zip | [Composer](https://www.evedirectory.com/composer) |
| To change the catalog or site | Clone this repo |

Guides: [Install with shadcn CLI](https://www.evedirectory.com/docs/install-with-shadcn), [Compose vs clone](https://www.evedirectory.com/docs/compose-vs-clone).

## The catalog is content, not app code

Listings live under `catalog/`. The Next.js app reads them through `lib/catalog/` and serves install JSON from `public/r/`.

```text
catalog/
├── registry.json              # Index of agents and extensions
├── agents/<slug>/             # Full Eve apps (agent/, evals/, SETUP.md, …)
├── extensions/<slug>/         # Extension listings
├── integrations.json          # Official Eve integration index
└── integrations-details.json  # Scraped detail dump from eve.dev
public/r/                      # Built shadcn registry (served at /r/<slug>.json)
```

Start with a nested Eve app under `catalog/agents/<slug>/` and one entry in `registry.json`. Add the rest of the site surface when you need it.

## Contribute a listing

A curated catalog agent is a full Eve app in a pull request under `catalog/`. A community prompt agent is published on the site after GitHub sign-in. Prefer curated when the agent has tools, evals, and channels. Prefer community when you only need a prompt-style listing live quickly.

| Path | When | How |
| --- | --- | --- |
| Curated catalog | Full Eve app for the official index | PR under `catalog/` (see below) |
| Community agent | Prompt-style listing under `@handle/slug` | Sign in at [/submit](https://www.evedirectory.com/submit) |
| Site or docs | App routes, guides, tooling | See [CONTRIBUTING.md](./CONTRIBUTING.md) |

### Add a curated agent

Copy the layout of an existing listing such as `catalog/agents/approval-gate-starter/` or `catalog/agents/competitive-intel-scout/`.

1. Create `catalog/agents/<slug>/` as a nested Eve app (`package.json`, `agent/`, `evals/`, `SETUP.md`, `README.md`).
2. Add an entry under `agents` in `catalog/registry.json` with `name`, `slug`, `path`, `summary`, `version`, `license`, `category`, and `integrations`.
3. Inside the agent directory, validate discovery:

```bash
npm install
npx eve info
```

Eve prints the agent shape it found. Fix warnings before you continue.

4. From the repo root, rebuild install JSON and validate the index:

```bash
pnpm registry:build
pnpm catalog:validate
```

`public/r/<slug>.json` is what the shadcn CLI installs. `catalog:validate` checks registry-to-disk consistency, required files, and env hygiene.

Full checklist and extension path: [Contribute](https://www.evedirectory.com/docs/contributing) and [CONTRIBUTING.md](./CONTRIBUTING.md).

## Run the site locally

Browse and most catalog routes work without auth. GitHub sign-in, `/submit`, and community agents need the variables in `.env.example`.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Fill `.env.local` when you need those flows:

- `DATABASE_URL`: Neon Postgres connection string.
- `BETTER_AUTH_SECRET`: random secret for session signing.
- `BETTER_AUTH_URL`: `http://localhost:3000` in development.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: GitHub OAuth app with callback `http://localhost:3000/api/auth/callback/github`.

PostHog (`NEXT_PUBLIC_POSTHOG_*`) is optional for local work. The site runs without it.

### Quality checks before you open a PR

```bash
pnpm lint && pnpm typecheck && pnpm build
```

After catalog changes, also run:

```bash
pnpm catalog:validate
pnpm registry:build
```

Optional deeper checks (stage agents outside the repo; see `AGENTS.md`):

```bash
pnpm agents:check          # compile + eve info per agent
pnpm registry:smoke        # install path into a scratch consumer
```

| Script                      | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `pnpm dev`                  | Next.js dev server                      |
| `pnpm build` / `pnpm start` | Production build / serve                |
| `pnpm lint` / `pnpm format` | Ultracite check / fix                   |
| `pnpm typecheck`            | Fumadocs MDX + TypeScript               |
| `pnpm catalog:validate`     | Registry ↔ disk consistency             |
| `pnpm registry:build`       | Regenerate `public/r/` from `catalog/`  |
| `pnpm scrape:integrations`  | Refresh scraped Eve integration details |

## Prompt for coding agents

```text
Clone https://github.com/nolly-studio/eve-directory.git, run pnpm install,
and follow README.md plus CONTRIBUTING.md. Catalog content lives under catalog/
(not app UI). To add a curated agent: create catalog/agents/<slug>/ as a nested
Eve app, register it in catalog/registry.json, run npm install && npx eve info
inside the agent dir, then pnpm registry:build && pnpm catalog:validate from
the repo root. Community prompt agents use https://www.evedirectory.com/submit
after GitHub sign-in. Do not invent Eve framework APIs; read node_modules/eve/docs
or https://eve.dev/docs/introduction.
```

## What to read next

- [CONTRIBUTING.md](./CONTRIBUTING.md): PR checklist, curated vs community, and local env.
- [Contribute](https://www.evedirectory.com/docs/contributing): catalog steps with listing metadata rules.
- [After you install](https://www.evedirectory.com/docs/after-you-install): `SETUP.md`, Connect UIDs, and evals once an agent is in your project.
- [Registry & machine access](https://www.evedirectory.com/docs/registry-and-llms): `/r/<slug>.json`, `llms.txt`, and APIs.
- [AGENTS.md](./AGENTS.md): conventions for coding agents editing this repository.
- [Eve documentation](https://eve.dev/docs/introduction): framework APIs, channels, and connections.

## License

[MIT](./LICENSE). Site and catalog agents are MIT unless a listing says otherwise.
