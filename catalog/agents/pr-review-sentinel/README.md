# PR Review Sentinel

Review pull requests against team conventions, flag risky changes, and post structured, actionable feedback.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a schedule, a seeded sandbox, and evals.

## Layout

```text
pr-review-sentinel/
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
