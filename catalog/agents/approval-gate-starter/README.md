# Approval Gate Starter

Ask it to "issue a refund" or "restart the api service" — Slack shows an approval card. Tool bodies just log; swap in your real actions.

Two gated tools demonstrate `always()` vs `once()`:

| Tool | Helper | Behavior |
| --- | --- | --- |
| `issue_refund` | `always()` | Approve every call |
| `restart_service` | `once()` | Approve the first call in the session; later calls auto-allow |

Demos: human-in-the-loop approvals.

## Layout

```text
approval-gate-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   ├── channels/slack.ts
│   ├── tools/issue_refund.ts      # approval: always()
│   └── tools/restart_service.ts   # approval: once()
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Evals prove park-on-approval without Slack. See `SETUP.md` for Connect.

## Make it yours

Replace the `console.log` bodies with real API calls. Keep the `approval` helpers.

## Verify

```bash
npm run eval
```

## License

MIT
