# Set up Uptime Watch Starter

## 1. Install and run

```bash
npm install
npm run dev
```

`eve dev` never fires schedules on their cron cadence; trigger one manually:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/watch
```

## 2. Create the Telegram bot

1. Message [@BotFather](https://t.me/BotFather) and run `/newbot`.
2. Copy the bot token into `.env` as `TELEGRAM_BOT_TOKEN`.
3. Pick any random string for `TELEGRAM_WEBHOOK_SECRET_TOKEN`.
4. DM the bot once, then look up your chat id (or use a group chat id) and set `TELEGRAM_ALERT_CHAT_ID`.

## 3. Register the webhook

Deploy (or expose your dev server), then:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://<your-deployment>/eve/v1/telegram",
       "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
       "allowed_updates":["message","callback_query"]}'
```

## 4. Pick the URL

Set `UPTIME_WATCH_URL` in `.env`. The first check only records a baseline — alerts fire on subsequent changes.

## Verify

```bash
npm run eval
```

The eval drives an on-demand check over eve's local HTTP channel — model credentials and network access required, Telegram credentials not.
