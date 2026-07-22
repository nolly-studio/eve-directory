# KV Memory

An eve extension that gives an agent session-scoped key/value memory with three tools: `remember`, `recall`, and `forget`. Values are stored with extension-scoped `defineState`, so they persist durably for the life of the session, never leak across sessions, and never collide with the consuming agent's own state. No external store is required.

## Layout

- `package/` — the publishable extension (`@eve-directory/kv-memory`)
- `test-consumer/` — a fixture agent that mounts the extension with a deterministic `mockModel` and proves it end to end with `eve eval`

## Mount

```ts
// agent/extensions/memory.ts
import memory from "@eve-directory/kv-memory";

export default memory({ maxKeys: 50 });
```

The mount namespace comes from the filename, so the tools compose as `memory__remember`, `memory__recall`, and `memory__forget`.

## Tools

- `remember({ key, value })` — store a string value; overwrites an existing key; throws when the store is full (`maxKeys`)
- `recall({ key })` — returns `{ key, found, value }`; `found` is `false` for a key that was never stored
- `forget({ key })` — returns `{ key, removed }`

## Config

| Key       | Type   | Default | Description                        |
| --------- | ------ | ------- | ---------------------------------- |
| `maxKeys` | number | `100`   | Maximum number of keys per session |

## Testing

The evals are fully deterministic: the fixture agent uses `mockModel` (no model provider needed) and the evals cover the remember/recall round-trip, forget semantics, and cross-session isolation via `t.newSession()`.

```bash
cd package && npm install && npm run build
cd ../test-consumer && npm install && npx eve eval --strict
```
