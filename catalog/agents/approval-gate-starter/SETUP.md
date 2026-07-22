# Set up Approval Gate Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Connect Slack

```bash
npm install -g vercel@latest
vercel link
vercel connect create slack --triggers
vercel connect detach <uid> --yes
vercel connect attach <uid> --triggers --trigger-path /eve/v1/slack --yes
vercel env pull
```

Update the Connect UID in `agent/channels/slack.ts` to the one the CLI returned. Invite the bot to a channel.

## 3. Try it

In Slack:

- `@bot issue a refund for charge ch_123 of 2500 cents — never shipped.` → approval every time (`always()`).
- `@bot restart the api service — memory leak.` → approval the first time in the session; a later restart auto-allows (`once()`).

Approve → the stub logs and the bot confirms. Deny → the tool does not run.

## Verify

```bash
npm run eval
```

Evals assert `t.parked()` for both tools — model credentials required, Slack credentials not.
