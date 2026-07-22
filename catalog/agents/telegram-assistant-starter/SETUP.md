# Set up Telegram Assistant Starter

## 1. Install and run

```bash
npm install
npm run dev
```

The dev server includes a local chat, so you can talk to the agent before Telegram is connected.

## 2. Create the Telegram bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram and run `/newbot`.
2. Copy the bot token into `.env` as `TELEGRAM_BOT_TOKEN`.
3. Pick any random string for `TELEGRAM_WEBHOOK_SECRET_TOKEN` (see `.env.example`).

## 3. Register the webhook

Deploy (or expose your dev server publicly), then point Telegram at eve's route:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://<your-deployment>/eve/v1/telegram",
       "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
       "allowed_updates":["message","callback_query"]}'
```

DM the bot and it replies. To use it in groups, pass `botUsername` in `agent/channels/telegram.ts` so it can detect `@mentions`.

## Verify

```bash
npm run eval
```

Evals drive the agent over eve's local HTTP channel, so they need model credentials but no Telegram credentials.
