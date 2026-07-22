# Webhook Summarizer Starter

POST any text (form submission, support ticket) to a webhook and get a classified summary in Slack.

One custom channel (`intake`) that hands off to Slack. Demos: custom channels.

## Layout

```text
webhook-summarizer-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md            # ← summary format / categories
│   ├── channels/intake.ts         # POST /eve/v1/intake/submit
│   └── channels/slack.ts          # delivery target
├── evals/
```

## Run

```bash
npm install
npm run dev
```

With Slack connected and `SLACK_SUMMARY_CHANNEL_ID` set:

```bash
curl -X POST http://localhost:3000/eve/v1/intake/submit \
  -H "content-type: application/json" \
  -d '{"text":"Cannot log in after password reset","source":"contact-form"}'
```

## Make it yours

Edit categories and output shape in `agent/instructions.md`. Optionally set `WEBHOOK_SECRET` so callers must send `Authorization: Bearer …`.

## Verify

```bash
npm run eval
```

## License

MIT
