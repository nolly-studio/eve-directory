# Inbound Lead Qualifier

Qualify site visitors conversationally, score fit against your ICP, and hand sales a context-rich lead.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a seeded sandbox, and evals.

## Layout

```text
inbound-lead-qualifier/
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
