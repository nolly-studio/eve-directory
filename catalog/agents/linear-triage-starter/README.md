# Linear Triage Starter

Delegate or mention this agent on a Linear ticket and it answers with a triage recommendation — priority, team, and what is missing from the report — per the rules in your instructions.

One channel, no tools. Demos: the Linear Agent Sessions channel.

## Layout

```text
linear-triage-starter/
├── package.json
├── agent/
│   ├── agent.ts             # model choice
│   ├── instructions.md      # ← edit priority + team rules here
│   └── channels/linear.ts   # Linear Agent Sessions channel
├── evals/
```

## Run

```bash
npm install
npm run dev
```

You can paste a ticket into the dev terminal immediately (see `examples/sample-input.md`). See `SETUP.md` to connect Linear.

## Make it yours

Edit the `Priority rules` and `Team routing rules` in `agent/instructions.md` to match your workspace's teams and severity conventions. That is the only required change.

## Verify

```bash
npm run eval
```

## License

MIT
