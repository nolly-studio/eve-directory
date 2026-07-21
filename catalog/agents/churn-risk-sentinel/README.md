# Churn Risk Sentinel

Correlate usage drop-off with billing events, remember account history, and propose specific save plays.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a schedule, a seeded sandbox, and evals.

## Layout

```text
churn-risk-sentinel/
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
