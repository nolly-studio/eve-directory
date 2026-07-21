# AI Search Visibility Analyst

Measure how your brand appears in AI answers and search, diagnose citation gaps, and prioritize content fixes.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a schedule, a seeded sandbox, and evals.

## Layout

```text
ai-search-visibility-analyst/
├── package.json
├── agent/
├──   agent.ts
├──   instructions.md
├──   skills/
├──   tools/
├──   connections/
├──   channels/
├──   sandbox/
├──   schedules/
├── evals/
```

## Run

```bash
npm install
npm run dev
```

See `SETUP.md` for connections and channels. Run `npm run eval` with model credentials to verify approval gates and tool round-trips.

## License

MIT
