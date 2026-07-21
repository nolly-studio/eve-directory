# Set up Competitive Intel Scout

## 1. Install and run

```bash
npm install
npm run dev
```

No external credentials are required for the base agent. Snapshots persist to `var/snapshots.json` next to the app (swap `agent/lib/snapshot-store.ts` for a database or blob store in production).

## 2. Edit the watchlist

`agent/sandbox/workspace/watchlist.md` seeds into the agent's `/workspace` at session start. Put your real competitors, domains, watched surfaces, and standing questions there.

## 3. Connect integrations (optional)

Both connections use [Vercel Connect](https://vercel.com/docs/connect), app-scoped so the daily schedule can use them unattended:

```bash
npm install @vercel/connect   # already in package.json
vercel link
vercel connect create similarweb
vercel connect create notion
vercel env pull
```

Without these, the agent still works from user-supplied pages and notes; it will explain the missing capability when asked for traffic data.

## 4. The daily schedule

`agent/schedules/daily-scan.md` runs weekdays at 13:00 UTC in production (`eve start` or Vercel Cron). It gathers, diffs, saves snapshots, and writes a draft brief to `/workspace/briefs/drafts/` — it never publishes, because `publish_brief` requires human approval and scheduled runs are unattended. Schedules do not fire under `eve dev`.

## 5. Verify

Use `examples/sample-input.md` for a first conversational run, then:

```bash
npm run eval
```
