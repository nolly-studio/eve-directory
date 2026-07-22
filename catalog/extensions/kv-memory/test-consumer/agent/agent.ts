import { defineAgent } from "eve";
import { mockModel } from "eve/evals";

type Command = { name: string; input: Record<string, string> };

/**
 * Deterministic fixture: each user message is a memory command —
 * `remember <key> <value...>`, `recall <key>`, or `forget <key>`.
 * The mock issues exactly one matching memory__* call per user message,
 * then replies with the JSON of the latest tool result.
 */
function parseCommand(message: string): Command {
  const [verb = "", key = "", ...rest] = message.trim().split(/\s+/);
  switch (verb) {
    case "remember":
      return {
        name: "memory__remember",
        input: { key, value: rest.join(" ") },
      };
    case "recall":
      return { name: "memory__recall", input: { key } };
    case "forget":
      return { name: "memory__forget", input: { key } };
    default:
      throw new Error(`fixture received unknown command: ${message}`);
  }
}

export default defineAgent({
  // mockModel has no AI Gateway metadata; compaction needs a context window.
  modelContextWindowTokens: 128_000,
  model: mockModel(({ lastUserMessage, userMessageCount, toolResults }) => {
    if (toolResults.length < userMessageCount) {
      const command = parseCommand(lastUserMessage ?? "");
      return { toolCalls: [command] };
    }
    const latest = toolResults.at(-1);
    return `memory-result ${JSON.stringify(latest?.output ?? null)}`;
  }),
});
