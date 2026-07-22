# Set up Headless API Starter

## 1. Install and run

```bash
npm install
npm run dev
```

Local route auth is open by default. Deployed apps may require Vercel OIDC or a bearer — see eve's auth docs and pass credentials to `Client`.

## 2. Three curls

```bash
# health
curl http://127.0.0.1:3000/eve/v1/health

# start a session
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Hello from curl"}'

# stream events (use sessionId from the create response)
curl http://127.0.0.1:3000/eve/v1/session/<sessionId>/stream
```

Or run `bash examples/curl.sh` / `npm run chat`.

## Verify

```bash
npm run eval
```
