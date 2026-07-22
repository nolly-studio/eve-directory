# Set up Webhook Summarizer Starter

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

Update the Connect UID in `agent/channels/slack.ts`, set `SLACK_SUMMARY_CHANNEL_ID`, and invite the bot to that channel.

## 3. Secure the webhook (recommended)

Set `WEBHOOK_SECRET` and send `Authorization: Bearer <secret>` on every POST.

## 4. Try it

```bash
curl -X POST https://<your-deployment>/eve/v1/intake/submit \
  -H "content-type: application/json" \
  -H "authorization: Bearer $WEBHOOK_SECRET" \
  -d '{"text":"Interested in Pro pricing for a 12-person team","source":"pricing-form"}'
```

A classified summary lands in the Slack channel.

## Verify

```bash
npm run eval
```

Evals exercise the summary format over eve's local HTTP channel — model credentials required, Slack credentials not.
