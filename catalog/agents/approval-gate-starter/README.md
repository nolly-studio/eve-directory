# Approval Gate Starter

Ask it to "issue a refund" — an approval card appears in Slack, and the tool only runs after someone approves. The tool body just logs; swap in your real action.

One gated tool, one Slack channel. Demos: human-in-the-loop.

## Layout

```text
approval-gate-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   ├── channels/slack.ts
│   └── tools/issue_refund.ts   # ← approval: always(); replace execute()
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Evals prove the park-on-approval behavior without Slack. See `SETUP.md` to wire Slack buttons in a workspace.

## Make it yours

Replace the `console.log` in `agent/tools/issue_refund.ts` with a real API call (Stripe refund, ops restart, etc.). Keep `approval: always()`.

## Verify

```bash
npm run eval
```

## License

MIT
