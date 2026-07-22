import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  maxConcurrency: 1,
  timeoutMs: 120_000,
  // Optional judge defaults for soft LLM grading (see judge.eval.ts).
  judge: { model: "openai/gpt-5.4-mini" },
});
