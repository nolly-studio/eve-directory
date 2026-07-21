---
cron: "0 16 * * 1"
---

Run the weekly AI search visibility scan.

1. Read `/workspace/queries.md` for the brand queries and competitors to track.
2. Measure how the brand appears in AI answers and search; save snapshots with `save_visibility_snapshot`.
3. Write a draft report to `/workspace/reports/drafts/` with citation gaps and prioritized content fixes. Do not publish; publishing requires human approval via `publish_visibility_report` in a live session.
