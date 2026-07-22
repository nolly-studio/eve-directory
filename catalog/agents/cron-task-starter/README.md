# Cron Task Starter

A fire-and-forget weekly task defined as a plain markdown schedule — cron in the frontmatter, prompt in the body. No TypeScript schedule handler.

One `.md` schedule, one tool. Demos: markdown schedules (task mode).

## Layout

```text
cron-task-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   ├── tools/write_briefing.ts
│   └── schedules/weekly-briefing.md   # ← edit cron + prompt here
├── evals/
```

## Run

```bash
npm install
npm run dev
```

`eve dev` never fires cron automatically. Trigger once:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/weekly-briefing
```

Briefings append to `var/briefings.log`.

## Make it yours

Change the `cron` expression (UTC on Vercel) and the prompt body in `agent/schedules/weekly-briefing.md`. Swap `write_briefing` for whatever side effect your task needs.

## Verify

```bash
npm run eval
```

## License

MIT
