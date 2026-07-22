# Translator Starter

Paste text, get it back in your target language. Instructions-only — no tools, no channels required (uses the default eve HTTP / dev chat surface).

One env var (`TARGET_LANGUAGE`). Demos: instructions as the entire product.

## Layout

```text
translator-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   └── instructions.ts   # ← TARGET_LANGUAGE baked in at compile time
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Type any English sentence in the dev terminal; the reply is Spanish by default. Change language:

```bash
TARGET_LANGUAGE=French npm run dev
```

## Make it yours

Set `TARGET_LANGUAGE`, or edit `agent/instructions.ts` for tone rules (formal, slang, preserve brand names, etc.).

## Verify

```bash
npm run eval
```

## License

MIT
