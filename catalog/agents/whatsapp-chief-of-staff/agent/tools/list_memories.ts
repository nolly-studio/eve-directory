import { defineTool } from "eve/tools";
import { z } from "zod";

import { listFacts } from "../lib/memory-store";

export default defineTool({
  description: "List durable facts remembered for the current user.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const userId = ctx.session.auth.current?.principalId ?? "local";
    return { memories: await listFacts(userId) };
  },
});
