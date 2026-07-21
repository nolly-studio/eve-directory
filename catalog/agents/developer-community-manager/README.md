# Developer Community Manager

Triage community questions, escalate real bugs with reproductions, and turn recurring pain into roadmap signal.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a schedule, a seeded sandbox, and evals.

## Layout

```text
developer-community-manager/
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
├──   subagents/repro-builder/
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
