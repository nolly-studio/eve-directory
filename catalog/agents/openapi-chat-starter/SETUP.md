# Set up OpenAPI Chat Starter

## 1. Install and run

```bash
npm install
npm run dev
```

No extra credentials are required for the default Petstore demo.

## 2. Point at your API

```bash
# .env
OPENAPI_SPEC_URL=https://api.example.com/openapi.json
OPENAPI_BASE_URL=https://api.example.com   # optional
OPENAPI_TOKEN=your-bearer-token            # optional
```

Restart `npm run dev`. Ask natural-language questions; the agent calls `api__<operationId>` tools derived from the spec.

For OAuth APIs, prefer Vercel Connect with `auth: connect("…")` — see the eve OpenAPI connection docs.

## Verify

```bash
npm run eval
```

Hits the live Petstore inventory endpoint — model credentials + network required.
