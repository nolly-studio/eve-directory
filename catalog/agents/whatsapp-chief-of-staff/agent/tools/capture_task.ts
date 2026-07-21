import { defineTool } from "eve/tools";
import { z } from "zod";

import { captureTask } from "../lib/memory-store";

export default defineTool({
  description: "Capture a quick task or commitment from a message.",
  inputSchema: z.object({
    title: z.string().min(1),
    due: z
      .string()
      .optional()
      .describe("ISO date or natural language due hint."),
  }),
  async execute(input, ctx) {
    const userId = ctx.session.auth.current?.principalId ?? "local";
    const task = await captureTask(userId, input);
    return { saved: true, task };
  },
});
