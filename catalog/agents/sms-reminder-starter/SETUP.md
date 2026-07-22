# Set up SMS Reminder Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Twilio

1. Create a Twilio account and buy a phone number with SMS.
2. Fill `.env` from `.env.example` (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `TWILIO_ALLOW_FROM`).
3. Point the number's Messaging webhook at `https://<your-deployment>/eve/v1/twilio/messages`.

Restrict `TWILIO_ALLOW_FROM` to your own number for demos. `"*"` accepts anyone and is not safe for production.

## 3. Try it

Text the Twilio number: `remind me tomorrow at 9am ET to call the plumber`. Confirm the reply, then wait (or nudge the dispatcher in dev). You should get an SMS with the reminder text at the scheduled time.

Outbound SMS may require carrier registration and prior consent — follow Twilio's and local legal requirements.

## Verify

```bash
npm run eval
```

Evals exercise `create_reminder` and delivery phrasing over eve's local HTTP channel — model credentials required, Twilio credentials not.
