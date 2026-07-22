# Set up PR Review Sentinel

## 1. Install and run

```bash
npm install
npm run dev
```

Local tools persist under `var/` with no external credentials.

## 2. Connect services (optional)

```bash
vercel link
vercel connect create linear
vercel connect create sentry
vercel connect create notion
vercel env pull
```

## 3. Channels

Enabled channel files live under `agent/channels/`. For post-install Connect/env steps, see [After you install](https://www.evedirectory.com/docs/after-you-install) and [Integrations](https://www.evedirectory.com/docs/integrations). Framework APIs: [eve.dev](https://eve.dev/docs/channels).

## Schedule

`open-pr-sweep.md` runs in production (`eve start` / Vercel Cron). It drafts only — approval-gated tools are for live sessions.

## Verify

```bash
npm run eval
```
