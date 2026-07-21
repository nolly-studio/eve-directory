# Set up Chief of Staff (WhatsApp)

## 1. Install and run

```bash
npm install
npm run dev
```

Local tools persist under `var/` with no external credentials.

## 2. Connect services (optional)

```bash
vercel link
vercel connect create todoist
vercel connect create ticktick
vercel connect create notion
vercel connect create mem0
vercel env pull
```

## 3. Channels

Enabled channel files live under `agent/channels/`. Follow each integration's docs for tokens or Connect setup.

## Schedule

`daily-brief.md` runs in production (`eve start` / Vercel Cron). It drafts only — approval-gated tools are for live sessions.

## Verify

```bash
npm run eval
```

## Optional: WhatsApp via Chat SDK

Chat SDK adapters require provider secrets at module load, so this agent ships without a `whatsapp` channel file. Add one after install:

```bash
npm install chat @chat-adapter/whatsapp @chat-adapter/state-memory
```

Then create `agent/channels/whatsapp.ts` from the [eve Chat SDK docs](https://eve.dev/docs/channels/chat-sdk) and set the provider env vars before `npm run dev`.
