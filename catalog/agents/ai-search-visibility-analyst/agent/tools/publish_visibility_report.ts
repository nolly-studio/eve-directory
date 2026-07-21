import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description: "Publish a finished visibility report. Approval-gated.",
  inputSchema: z.object({
    title: z.string().min(1),
    markdown: z.string().min(1),
  }),
  approval: always(),
  async execute({ title, markdown }, ctx) {
    const sandbox = await ctx.getSandbox();
    const date = new Date().toISOString().slice(0, 10);
    const slug = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    const reportPath = `reports/${date}-${slug}.md`;
    await sandbox.writeTextFile({ path: reportPath, content: markdown });
    return { published: true, path: reportPath };
  },
});
