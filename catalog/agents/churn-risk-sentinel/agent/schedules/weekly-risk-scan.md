---
cron: "0 15 * * 1"
---

Run the weekly churn risk scan.

1. Pull usage drop-offs and billing events for the watchlist accounts.
2. Score each account with `score_account` and propose save plays.
3. Write a draft risk brief to `/workspace/reports/drafts/`. Do not notify customers; outreach requires human approval via `propose_save_play` in a live session.
