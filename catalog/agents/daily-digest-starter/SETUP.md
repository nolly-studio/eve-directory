# Set up Daily Digest Starter

## 1. Install and run

```bash
npm install
npm run dev
```

`eve dev` never fires schedules on their cron cadence; trigger one manually:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/daily-digest
```

(Without Slack connected, the run logs the delivery failure — the fetch and summarization still exercise end to end via `npm run eval`.)

## 2. Connect Slack

```bash
npm install -g vercel@latest
vercel link
vercel connect create slack --triggers
vercel connect detach <uid> --yes
vercel connect attach <uid> --triggers --trigger-path /eve/v1/slack --yes
vercel env pull
```

Update the Connect UID in `agent/channels/slack.ts` to the one the CLI returned, and set `SLACK_DIGEST_CHANNEL_ID` in `.env` to the channel the digest should land in. Invite the bot to that channel.

## 3. Pick your feed and cadence

- `DIGEST_FEED_URL` in `.env` — any RSS or Atom feed.
- `cron` in `agent/schedules/daily-digest.ts` — evaluated in UTC on Vercel.

## 4. Deploy

```bash
VERCEL_USE_EXPERIMENTAL_FRAMEWORKS=1 vercel deploy --prod
```

Each schedule becomes a Vercel Cron Job (Settings → Cron Jobs).

## Verify

```bash
npm run eval
```

The eval drives an on-demand digest over eve's local HTTP channel — model credentials and network access required, Slack credentials not.
