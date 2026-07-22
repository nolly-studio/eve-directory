# Discord Docs Starter

Answers questions in your Discord server from a single knowledge file you paste your FAQ into.

One channel, one knowledge skill, no tools. Demos: giving an agent knowledge.

## Layout

```text
discord-docs-starter/
├── package.json
├── agent/
│   ├── agent.ts               # model choice
│   ├── instructions.md        # answer-from-docs rules
│   ├── skills/knowledge.md    # ← paste your FAQ here
│   └── channels/discord.ts    # Discord interactions channel
├── evals/
```

## Run

```bash
npm install
npm run dev
```

You can ask questions in the dev terminal immediately. See `SETUP.md` to connect Discord.

## Make it yours

Replace the body of `agent/skills/knowledge.md` with your own FAQ or docs. The frontmatter `description` tells the model when to load it — keep it matching your content. The agent loads the file on demand, so it can grow well past what would fit in a prompt.

## Verify

```bash
npm run eval
```

## License

MIT
