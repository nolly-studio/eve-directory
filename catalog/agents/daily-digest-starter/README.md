# Daily Digest Starter

Every weekday at 9:00 UTC, fetches one RSS/Atom feed and posts a five-item summary to a Slack channel.

One schedule, one tool, one channel. Demos: cron schedules.

## Layout

```text
daily-digest-starter/
├── package.json
├── agent/
│   ├── agent.ts                     # model choice
│   ├── instructions.md              # digest format and rules
│   ├── tools/fetch_source.ts        # ← swap the feed URL here (or via env)
│   ├── schedules/daily-digest.ts    # ← cron cadence here
│   └── channels/slack.ts            # Slack delivery via Vercel Connect
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Trigger the schedule once, without waiting for the cron tick:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/daily-digest
```

See `SETUP.md` for Slack setup.

## Make it yours

- Point `DIGEST_FEED_URL` at your feed (defaults to Hacker News).
- Change the cadence in `agent/schedules/daily-digest.ts` — cron runs in UTC.
- Adjust item count and tone in `agent/instructions.md`.

## Verify

```bash
npm run eval
```

## License

MIT
