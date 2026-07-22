# Set up Cron Task Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Fire the schedule in dev

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/weekly-briefing
```

Inspect `var/briefings.log` for the written line.

## 3. Deploy

```bash
VERCEL_USE_EXPERIMENTAL_FRAMEWORKS=1 vercel deploy --prod
```

The markdown schedule becomes a Vercel Cron Job (Settings → Cron Jobs). Default cadence is Sundays at 09:00 UTC.

## Verify

```bash
npm run eval
```
