# OpenAPI Chat Starter

Chat with any HTTP API in plain English. Ships pointed at the public Swagger Petstore — change one env var to your own OpenAPI spec URL.

One connection, default eve HTTP channel. Demos: OpenAPI connections.

## Layout

```text
openapi-chat-starter/
├── package.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   └── connections/api.ts   # ← OPENAPI_SPEC_URL lands here
├── evals/
```

## Run

```bash
npm install
npm run dev
```

Ask in the dev terminal: `What is in the petstore inventory?`

## Make it yours

Set `OPENAPI_SPEC_URL` (and optionally `OPENAPI_BASE_URL` / `OPENAPI_TOKEN`). When you leave the default Petstore URL, the starter drops its read-only operation filter so your full spec is available — narrow it again in `agent/connections/api.ts` if you want.

## Verify

```bash
npm run eval
```

Needs network access to reach Petstore.

## License

MIT
