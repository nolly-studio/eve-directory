import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { forgetFact } from "../lib/memory-store";

export default defineTool({
  description: "Forget one previously remembered fact. Approval-gated.",
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  approval: always(),
  async execute({ id }, ctx) {
    const userId = ctx.session.auth.current?.principalId ?? "local";
    const removed = await forgetFact(userId, id);
    return { forgotten: removed };
  },
});
