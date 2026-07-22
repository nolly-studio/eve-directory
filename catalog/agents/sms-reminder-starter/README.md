# SMS Reminder Starter

Text "remind me Thursday at 9" via Twilio and get texted back at that time.

One tool (`create_reminder`) writes a row; a one-minute schedule claims due rows and `receive`s Twilio. Demos: dynamic scheduling.

## Layout

```text
sms-reminder-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   ├── channels/twilio.ts
│   ├── lib/reminder-store.ts       # file-backed reminder rows
│   ├── tools/create_reminder.ts    # ← the one tool
│   └── schedules/dispatch-reminders.ts
├── evals/
```

## Run

```bash
npm install
npm run dev
```

See `SETUP.md` to connect Twilio. In production the dispatcher fires every minute; in dev, trigger it with:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/dispatch-reminders
```

## Make it yours

Swap the reminder body for any deferred SMS action — the pattern is the same: tool writes a row, cron claims it, channel delivers.

## Verify

```bash
npm run eval
```

## License

MIT
