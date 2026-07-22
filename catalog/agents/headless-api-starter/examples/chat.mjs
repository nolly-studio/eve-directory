/**
 * Minimal eve/client script: start a session, print the reply, send a follow-up.
 *
 * Usage (with `npm run dev` in another terminal):
 *   npm run chat
 *   EVE_HOST=http://127.0.0.1:3000 node examples/chat.mjs "Your question"
 */
import { Client } from "eve/client";

const host = process.env.EVE_HOST ?? "http://127.0.0.1:3000";
const first =
  process.argv.slice(2).join(" ").trim() || "In one sentence, what can you do?";

const client = new Client({ host });

const health = await client.health();
console.log("health:", health.status);

const session = client.session();
const turn = await session.send(first);
console.log("sessionId:", turn.sessionId);
console.log("continuationToken:", turn.continuationToken);

const result = await turn.result();
console.log("\nassistant:", result.message ?? "(no reply)");
console.log("status:", result.status);

const followUp = await session.send("Repeat that even more briefly.");
const followResult = await followUp.result();
console.log("\nfollow-up:", followResult.message ?? "(no reply)");
