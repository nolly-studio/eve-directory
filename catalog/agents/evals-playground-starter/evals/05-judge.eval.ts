import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Soft: LLM-as-judge grades the reply (tracked, not a hard fail).",
  async test(t) {
    await t.send("What is the weather in Brooklyn? Use get_weather.");
    t.succeeded();
    t.calledTool("get_weather");
    // Soft by default — appears in reports; use --strict to fail on threshold.
    t.judge.autoevals.closedQA("Mentions sunny or clear weather for Brooklyn");
  },
});
