#!/usr/bin/env bash
# Three curls against a local eve dev server (npm run dev).
set -euo pipefail

HOST="${EVE_HOST:-http://127.0.0.1:3000}"

echo "== 1. health =="
curl -sS "$HOST/eve/v1/health"
echo

echo "== 2. create session =="
CREATE=$(curl -sS -X POST "$HOST/eve/v1/session" \
  -H 'content-type: application/json' \
  -d '{"message":"Say hello in one short sentence."}')
echo "$CREATE"
SESSION_ID=$(node -e "const j=JSON.parse(process.argv[1]); if(!j.sessionId) process.exit(1); process.stdout.write(j.sessionId)" "$CREATE")
TOKEN=$(node -e "const j=JSON.parse(process.argv[1]); process.stdout.write(j.continuationToken||'')" "$CREATE")

echo
echo "== 3. stream (first ~20 events, then Ctrl-C if it hangs) =="
curl -sSN "$HOST/eve/v1/session/$SESSION_ID/stream" | head -n 20

if [[ -n "$TOKEN" ]]; then
  echo
  echo "== 4. continue session =="
  curl -sS -X POST "$HOST/eve/v1/session/$SESSION_ID" \
    -H 'content-type: application/json' \
    -d "{\"message\":\"Thanks.\",\"continuationToken\":$(node -e "process.stdout.write(JSON.stringify(process.argv[1]))" "$TOKEN")}"
  echo
fi
