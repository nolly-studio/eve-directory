# Set up Spend & Subscription Controller

## 1. Install and run

```bash
npm install
npm run dev
```

Local tools persist under `var/` with no external credentials.

## 2. Connect services (optional)

```bash
vercel link
vercel connect create brex
vercel connect create embat
vercel connect create airtable
vercel env pull
```

## 3. Channels

Enabled channel files live under `agent/channels/`. Follow each integration's docs for tokens or Connect setup.

## Schedule

`renewal-sweep.md` runs in production (`eve start` / Vercel Cron). It drafts only — approval-gated tools are for live sessions.

## Verify

```bash
npm run eval
```
