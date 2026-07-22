# Set up Inbound Lead Qualifier

## 1. Install and run

```bash
npm install
npm run dev
```

Local tools persist under `var/` with no external credentials.

## 2. Connect services (optional)

```bash
vercel link
vercel connect create airtable
vercel connect create mem0
vercel env pull
```

## 3. Channels

Enabled channel files live under `agent/channels/`. For post-install Connect/env steps, see [After you install](https://www.evedirectory.com/docs/after-you-install) and [Integrations](https://www.evedirectory.com/docs/integrations). Framework APIs: [eve.dev](https://eve.dev/docs/channels).

## Verify

```bash
npm run eval
```

## Optional: Messenger via Chat SDK

Chat SDK adapters require provider secrets at module load, so this agent ships without a `messenger` channel file. Add one after install:

```bash
npm install chat @chat-adapter/messenger @chat-adapter/state-memory
```

Then create `agent/channels/messenger.ts` from the [eve Chat SDK docs](https://eve.dev/docs/channels/chat-sdk) and set the provider env vars before `npm run dev`.
