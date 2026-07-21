---
cron: "0 13 * * 1-5"
---

Run the daily competitive scan.

1. Read `/workspace/watchlist.md` for the competitor list, watched surfaces, and standing questions.
2. For each competitor and surface, gather the current public state. Use the similarweb connection for traffic signals when relevant.
3. Call `list_snapshots` to load the stored baseline, note what changed, then call `save_snapshot` for each surface you observed.
4. Write an impact-ranked draft brief to `/workspace/briefs/drafts/` covering only material changes, with a source URL and observation date for every claim. If nothing material changed, write a one-line "no material changes" note instead.

Do not call `publish_brief`. This scan runs unattended and publishing requires human approval; a person reviews the draft and publishes it from a live session.
