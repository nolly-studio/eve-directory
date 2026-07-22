# Telegram Assistant Starter

Message a Telegram bot, it replies per your instructions. This is the blank canvas: edit `agent/instructions.md` and nothing else.

One channel, no tools — the smallest useful eve agent.

## Layout

```text
telegram-assistant-starter/
├── package.json
├── agent/
│   ├── agent.ts              # model choice
│   ├── instructions.md       # ← edit this
│   └── channels/telegram.ts  # Telegram webhook channel
├── evals/
```

## Run

```bash
npm install
npm run dev
```

You can chat with the agent immediately in the dev terminal, before any Telegram setup. See `SETUP.md` to connect the bot.

## Make it yours

Everything the agent is lives in `agent/instructions.md` — persona, duties, boundaries. Change the `CUSTOMIZE HERE` section and the agent updates as you save.

## Verify

```bash
npm run eval
```

## License

MIT
