# HTTP Monitor

An eve extension that adds a single tool, `check_url`, for probing HTTP(S) endpoints. The target URL is a tool input; the request timeout is mount configuration. Results include status (`up`/`down`), the HTTP status code, latency, and whether the status changed since the last check of that URL in the current session (tracked with extension-scoped `defineState`).

## Layout

- `package/` — the publishable extension (`@eve-directory/http-monitor`)
- `test-consumer/` — a fixture agent that mounts the extension with a deterministic `mockModel` and proves it end to end with `eve eval`

## Mount

```ts
// agent/extensions/monitor.ts
import monitor from "@eve-directory/http-monitor";

export default monitor({ timeoutMs: 5000 });
```

The mount namespace comes from the filename, so the tool composes as `monitor__check_url`.

## Tool

`check_url({ url })` returns:

```json
{
  "url": "https://example.com/",
  "status": "up",
  "statusCode": 200,
  "latencyMs": 84,
  "error": null,
  "previousStatus": null,
  "changed": false,
  "checkedAt": "2026-07-21T00:00:00.000Z"
}
```

`previousStatus` and `changed` compare against the last check of the same URL in the session, so an agent can report transitions ("example.com went down") instead of raw snapshots.

## Config

| Key         | Type   | Default | Description                         |
| ----------- | ------ | ------- | ----------------------------------- |
| `timeoutMs` | number | `10000` | Per-request timeout in milliseconds |

## Testing

The evals are fully deterministic: the fixture agent uses `mockModel` (no model provider needed) and each eval spins up a throwaway local HTTP server whose response code it controls, covering the "up", "down", and status-change cases.

```bash
cd package && npm install && npm run build
cd ../test-consumer && npm install && npx eve eval --strict
```
