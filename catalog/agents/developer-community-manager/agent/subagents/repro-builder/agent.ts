import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Turn a community bug report into a minimal reproduction: environment, steps, expected vs actual, and a short title. Return structured repro notes the parent can escalate.",
  model: "openai/gpt-5.4-mini",
});
