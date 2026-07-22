# Contributing

Open a pull request for curated catalog and site changes, or publish a community agent from the live site. This page picks the right path, lists the checks to run, and points at the longer guides.

Eve Directory accepts three kinds of contribution. Pick by what you are shipping, not by how large the diff looks.

| You are shipping | Path |
| --- | --- |
| A full Eve app for the official index | Curated PR under `catalog/agents/` or `catalog/extensions/` |
| A prompt-style listing under your GitHub handle | [/submit](https://www.evedirectory.com/submit) (GitHub sign-in) |
| Site routes, guides, or tooling | PR against this repo (see [AGENTS.md](./AGENTS.md)) |

A curated listing belongs in `catalog/` when the agent has tools, evals, channels, or a `SETUP.md` others will run. Switch to `/submit` once you only need a community prompt agent live under `/agents/@handle/slug` without a catalog PR.

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io)
- Familiarity with [Eve](https://eve.dev/docs/introduction) if you are adding a curated agent
- A fork of [nolly-studio/eve-directory](https://github.com/nolly-studio/eve-directory) for pull requests

Browse-only local work needs no secrets. Auth, `/submit`, and community agents need the variables in `.env.example`.

## Add a curated agent

Catalog content is not app UI. Create a nested Eve app, register it, validate with Eve, then rebuild install JSON.

```text
catalog/agents/<slug>/
├── package.json
├── README.md
├── SETUP.md
├── agent/          # instructions, tools, channels, …
└── evals/
```

Copy `catalog/agents/approval-gate-starter/` or `catalog/agents/competitive-intel-scout/` when you want a known-good shape.

1. Create `catalog/agents/<slug>/` with the tree above.
2. Add an `agents` entry in `catalog/registry.json`:

   - `name`, `slug`, `path` (`agents/<slug>`), `summary`, `version`, `license`
   - `category`: `{ "name", "slug" }`
   - `integrations`: short slugs users see on cards (prefer values already in `catalog/integrations.json`)

3. Inside the agent directory:

```bash
npm install
npx eve info
```

Eve must report a clean agent shape. Treat warnings as blockers for the PR.

4. From the repo root:

```bash
pnpm registry:build
pnpm catalog:validate
```

`registry:build` writes `public/r/<slug>.json` for the shadcn CLI. `catalog:validate` checks the index against disk.

5. Ship a clear `SETUP.md`. Point channel and Connect steps at [After you install](https://www.evedirectory.com/docs/after-you-install) and any matching `/docs/integrations/…` page. Link [eve.dev](https://eve.dev/docs/introduction) for framework APIs. Do not duplicate Eve’s channel guides inside the listing.

Longer version with extension steps: [Contribute](https://www.evedirectory.com/docs/contributing).

## Add an extension

1. Create `catalog/extensions/<slug>/` with a publishable `package/`, `directory.json`, README, and preferably a `test-consumer/` that mounts the extension and runs evals.
2. Register it under `extensions` in `catalog/registry.json` (include `npm` when published).
3. Run `pnpm registry:build` and `pnpm catalog:validate`.

## Publish a community agent

Sign in with GitHub at [evedirectory.com/submit](https://www.evedirectory.com/submit). Community agents install from `/r/@handle/slug.json` and appear at `/agents/@handle/slug`. They are not entries in `catalog/registry.json`.

Use `/submit` for prompt-style listings. Open a curated catalog PR when you want the agent in the official index with full Eve app source in git.

## Change the site or docs

Public guides live under `content/docs/` (rendered at `/docs`). Agent-facing repo docs live under `docs/agents/` and [AGENTS.md](./AGENTS.md). Do not put site guides in `docs/`.

```bash
pnpm install
cp .env.example .env.local   # only if you need auth /submit
pnpm dev
```

Before you open a PR:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

Catalog PRs also need `pnpm catalog:validate` and `pnpm registry:build` (commit the updated `public/r/` output when the build changes install JSON).

## Pull request checklist

- [ ] Conventional commit style in the title when possible (`feat:`, `fix:`, `docs:`)
- [ ] Curated agent or extension: `npx eve info` clean in the listing directory
- [ ] Curated change: `pnpm catalog:validate` and `pnpm registry:build` pass
- [ ] Site or docs change: `pnpm lint && pnpm typecheck && pnpm build` pass
- [ ] `SETUP.md` / consumer docs link Eve docs instead of copying them
- [ ] No secrets in the diff (`.env.local`, API keys, Connect secrets)

## What to read next

- [README.md](./README.md): install path, catalog layout, and local scripts.
- [Contribute](https://www.evedirectory.com/docs/contributing): curated checklist and listing metadata.
- [Compose vs clone](https://www.evedirectory.com/docs/compose-vs-clone): when cloning this repo is the right move.
- [AGENTS.md](./AGENTS.md): architecture and coding conventions for this repository.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md): community standards.
- [SECURITY.md](./SECURITY.md): how to report vulnerabilities.
