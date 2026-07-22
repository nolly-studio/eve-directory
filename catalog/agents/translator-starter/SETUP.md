# Set up Translator Starter

## 1. Install and run

```bash
npm install
cp .env.example .env   # optional — defaults to Spanish
npm run dev
```

`TARGET_LANGUAGE` is read when the agent compiles. Restart `eve dev` after changing it.

## 2. Optional: add a channel

This starter has no channel file. Point Telegram, Slack, or Discord at it the same way as the other starters if you want a mobile or workspace surface.

## Verify

```bash
npm run eval
```
