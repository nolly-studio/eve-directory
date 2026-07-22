# Receipt Scanner Starter

Photo a receipt in Telegram — get merchant, date, total, category, and line items back as plain text.

One channel with `uploadPolicy`, no tools. Demos: inbound attachments.

## Layout

```text
receipt-scanner-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md          # ← extraction format
│   └── channels/telegram.ts     # uploadPolicy for image/* + PDF
├── evals/
```

## Run

```bash
npm install
npm run dev
```

See `SETUP.md` for Telegram. Evals exercise extraction from a pasted transcript without needing a photo.

## Make it yours

Edit categories and fields in `agent/instructions.md`. Widen `uploadPolicy.allowedMediaTypes` if you want more file types.

## Verify

```bash
npm run eval
```

## License

MIT
