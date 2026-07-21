import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Analyze one competitor surface in isolation: take the surface's current public state and a prior baseline, and return classified changes with exact quotes and source references. Delegate one competitor surface per call; run several in parallel for a full scan.",
  model: "openai/gpt-5.4-mini",
});
