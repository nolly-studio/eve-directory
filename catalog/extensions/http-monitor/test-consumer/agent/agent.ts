import { defineAgent } from "eve";
import { mockModel } from "eve/evals";

/**
 * Deterministic fixture: each turn's user message is a URL to check. The
 * mock issues exactly one monitor__check_url call per user message, then
 * replies with the JSON of the latest tool result. Comparing counts keeps
 * the script correct however many turns the eval drives.
 */
export default defineAgent({
  // mockModel has no AI Gateway metadata; compaction needs a context window.
  modelContextWindowTokens: 128_000,
  model: mockModel(({ lastUserMessage, userMessageCount, toolResults }) => {
    if (toolResults.length < userMessageCount) {
      return {
        toolCalls: [
          {
            name: "monitor__check_url",
            input: { url: (lastUserMessage ?? "").trim() },
          },
        ],
      };
    }
    const latest = toolResults.at(-1);
    return `check-result ${JSON.stringify(latest?.output ?? null)}`;
  }),
});
