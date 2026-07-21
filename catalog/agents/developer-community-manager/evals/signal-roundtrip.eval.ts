import { defineEval } from "eve/evals";

export default defineEval({
  description: "Logging roadmap signal persists the theme.",
  async test(t) {
    await t.send(
      'Log roadmap signal theme "better webhook docs", frequency recurring, evidence: 4 Discord threads this week.'
    );
    t.succeeded();
    t.calledTool("log_roadmap_signal", {
      input: { theme: /webhook/i, frequency: "recurring" },
    });
  },
});
