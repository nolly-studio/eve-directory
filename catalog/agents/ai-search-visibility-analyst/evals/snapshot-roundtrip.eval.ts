import { defineEval } from "eve/evals";

export default defineEval({
  description: "Visibility snapshots round-trip through the store.",
  async test(t) {
    await t.send(
      'Save a visibility snapshot for query "best AI agent framework" on ai-answer channel: our brand is cited third. Then confirm it was stored.'
    );
    t.succeeded();
    t.calledTool("save_visibility_snapshot", {
      input: { query: /best AI agent framework/i },
    });
  },
});
