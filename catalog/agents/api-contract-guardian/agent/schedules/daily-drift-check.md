---
cron: "0 12 * * 1-5"
---

Run the daily API contract drift check.

1. Read `/workspace/contracts.md` for the specs and surfaces to watch.
2. Diff specs against live behavior and docs; record each drift with `record_drift`.
3. Write a draft changelog to `/workspace/reports/drafts/`. Do not publish; publishing requires human approval via `publish_drift_report` in a live session.
