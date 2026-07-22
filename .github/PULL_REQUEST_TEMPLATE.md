## Summary

<!-- What changed and why. One or two sentences. -->

## Type of change

- [ ] Curated catalog agent or extension (`catalog/`)
- [ ] Community-related site flow (`/submit`, auth)
- [ ] Site, docs, or tooling
- [ ] Other

## Checklist

- [ ] `pnpm lint && pnpm typecheck` (site/docs/tooling) or N/A
- [ ] `pnpm catalog:validate` (catalog changes) or N/A
- [ ] `pnpm registry:build` and committed `public/r/` updates (catalog changes) or N/A
- [ ] `npx eve info` clean inside new/changed agent dirs or N/A
- [ ] `SETUP.md` links Eve / After you install docs instead of copying them or N/A
- [ ] No secrets in the diff

## Test plan

<!-- How you verified. Commands run, pages clicked, install smoke, etc. -->
