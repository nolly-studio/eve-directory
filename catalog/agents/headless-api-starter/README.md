# Headless API Starter

Drive an eve agent with `curl` or `eve/client` — no Slack, Telegram, or chat UI. The default eve HTTP channel is the product.

Demos: the session protocol (`POST /eve/v1/session`, stream, continue).

## Layout

```text
headless-api-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   └── instructions.md
├── examples/
│   ├── curl.sh          # three curls
│   └── chat.mjs         # eve/client script
├── evals/
```

## Run

```bash
npm install
npm run dev
```

In another terminal:

```bash
bash examples/curl.sh
# or
npm run chat
```

## Make it yours

Replace `agent/instructions.md` with your backend agent's job. Embed the same `Client` pattern from `examples/chat.mjs` in your service.

## Verify

```bash
npm run eval
```

## License

MIT
