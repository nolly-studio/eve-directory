import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Escalate a community-reported bug with reproduction steps. Approval-gated before writing to bugs/.",
  inputSchema: z.object({
    title: z.string().min(1),
    markdown: z.string().min(1),
  }),
  approval: always(),
  async execute({ title, markdown }, ctx) {
    const sandbox = await ctx.getSandbox();
    const slug = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    const bugPath = `bugs/${slug}.md`;
    await sandbox.writeTextFile({ path: bugPath, content: markdown });
    return { escalated: true, path: bugPath };
  },
});
