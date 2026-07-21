# Competitive Intel Scout

Track competitors' pricing, changelogs, and traffic; report evidence-cited changes since the last check.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, a seeded sandbox workspace, a daily schedule, a specialist subagent, and evals.

## Layout

```text
competitive-intel-scout/
├── package.json                      # app manifest; root agent name comes from here
├── agent/
│   ├── agent.ts                      # model selection
│   ├── instructions.md               # role, workflow, guardrails
│   ├── skills/competitive-intel-scout.md
│   ├── tools/
│   │   ├── save_snapshot.ts          # store surface state, returns prior baseline
│   │   ├── list_snapshots.ts         # read stored baselines
│   │   └── publish_brief.ts          # approval-gated (always()) publish
│   ├── lib/snapshot-store.ts         # local JSON store behind the tools
│   ├── connections/
│   │   ├── similarweb.ts             # traffic/market MCP (Vercel Connect, app-scoped)
│   │   └── notion.ts                 # briefs + watchlist workspace MCP
│   ├── sandbox/
│   │   ├── sandbox.ts
│   │   └── workspace/watchlist.md    # seeded to /workspace at session start
│   ├── schedules/daily-scan.md       # weekday cron scan (drafts only, never publishes)
│   └── subagents/surface-analyst/    # parallel per-surface diff specialist
└── evals/
    ├── snapshot-roundtrip.eval.ts
    └── publish-requires-approval.eval.ts
```

## Run it

```bash
npm install
npm run dev
```

The base agent is useful with zero external setup: paste pages, screenshots, or notes and it diffs them against stored snapshots. See `SETUP.md` for connecting Similarweb and Notion, and for how the daily schedule behaves.

## Evals

```bash
npm run eval
```

Requires model-provider credentials; `snapshot-roundtrip` proves the snapshot tools round-trip, and `publish-requires-approval` proves publishing parks on human approval.

## License

MIT
