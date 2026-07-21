# Set up API Contract Guardian

## 1. Install and run

```bash
npm install
npm run dev
```

Local tools persist under `var/` with no external credentials.

## 2. Connect services (optional)

```bash
vercel link
vercel connect create postman
vercel connect create notion
vercel env pull
```

## 3. Channels

Enabled channel files live under `agent/channels/`. Follow each integration's docs for tokens or Connect setup.

## Schedule

`daily-drift-check.md` runs in production (`eve start` / Vercel Cron). It drafts only — approval-gated tools are for live sessions.

## Verify

```bash
npm run eval
```
