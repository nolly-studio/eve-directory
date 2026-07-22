# Set up Receipt Scanner Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Telegram bot

1. Create a bot with [@BotFather](https://t.me/BotFather).
2. Fill `.env` from `.env.example`.
3. Deploy and register the webhook:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://<your-deployment>/eve/v1/telegram",
       "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
       "allowed_updates":["message","callback_query"]}'
```

Send the bot a photo of a receipt.

Use a vision-capable model for photo scans (the default mini model may be enough for clear images; upgrade in `agent/agent.ts` if needed).

## Verify

```bash
npm run eval
```
