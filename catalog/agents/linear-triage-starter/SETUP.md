# Set up Linear Triage Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Connect Linear

The easiest path is [Vercel Connect](https://vercel.com/docs/connect), which manages the Linear app and webhook verification:

```bash
npm install -g vercel@latest
vercel connect create linear --triggers
vercel connect detach <uid> --yes
vercel connect attach <uid> --triggers --trigger-path /eve/v1/linear --yes
```

Then switch `agent/channels/linear.ts` to `connectLinearCredentials("<uid>")` (requires `npm install @vercel/connect`).

To bring your own Linear OAuth app instead: create one with `actor=app`, grant `app:assignable` and `app:mentionable`, subscribe to the `AgentSessionEvent` webhook category, point the webhook at `https://<your-deployment>/eve/v1/linear`, and fill `.env` from `.env.example`.

## 3. Try it

In Linear, delegate a ticket to the agent (or @mention it). It replies as a native Agent Session response with priority, team, reasoning, and missing info.

## Verify

```bash
npm run eval
```

Evals exercise the triage rules over eve's local HTTP channel — model credentials required, Linear credentials not.
