import { defineTool } from "eve/tools";
import { z } from "zod";

import { rememberFact } from "../lib/memory-store";

export default defineTool({
  description:
    "Remember one durable fact for the current user across sessions.",
  inputSchema: z.object({
    fact: z.string().min(1),
  }),
  async execute({ fact }, ctx) {
    const userId = ctx.session.auth.current?.principalId ?? "local";
    const record = await rememberFact(userId, fact);
    return { saved: true, record };
  },
});
