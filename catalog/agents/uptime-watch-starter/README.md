# Uptime Watch Starter

Checks one URL every 5 minutes and messages you on Telegram only when it goes down or recovers.

One schedule, one tool, one channel. Demos: remembering last status across ticks (persisted under `var/uptime-status.json`).

## Layout

```text
uptime-watch-starter/
├── package.json
├── agent/
│   ├── agent.ts                  # model choice
│   ├── instructions.md           # alert rules
│   ├── lib/status-store.ts       # last-known status on disk
│   ├── tools/check_url.ts        # ← swap the URL here (or via env)
│   ├── schedules/watch.ts        # ← cron cadence here
│   └── channels/telegram.ts      # Telegram alerts
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Trigger a check without waiting for the cron tick:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/watch
```

See `SETUP.md` for Telegram setup.

## Make it yours

- Point `UPTIME_WATCH_URL` at the URL you care about.
- Set `TELEGRAM_ALERT_CHAT_ID` to your chat or group.
- Change the cadence in `agent/schedules/watch.ts` — cron runs in UTC.

## Verify

```bash
npm run eval
```

## License

MIT
