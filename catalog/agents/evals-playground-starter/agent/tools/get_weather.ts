import { defineTool } from "eve/tools";
import { z } from "zod";

/** Deterministic stub so evals never need a weather API. */
export default defineTool({
  description: "Get the current weather for a city (stubbed for demos).",
  inputSchema: z.object({
    city: z.string().min(1),
  }),
  async execute({ city }) {
    return {
      city,
      condition: "Sunny",
      temperatureF: 72,
      note: "Stubbed result for eval demos.",
    };
  },
});
