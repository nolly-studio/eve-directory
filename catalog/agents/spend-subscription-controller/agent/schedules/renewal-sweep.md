---
cron: "0 13 * * 1-5"
---

Run the daily spend and renewal sweep.

1. Flag card-spend anomalies, upcoming SaaS renewals, and duplicate subscriptions.
2. Record each finding with `flag_anomaly`.
3. Write a draft owner digest to `/workspace/reports/drafts/`. Do not cancel or change subscriptions; that requires human approval via `propose_cancel` in a live session.
