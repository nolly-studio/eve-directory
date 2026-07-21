import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "File a reproducible bug report into the workspace bugs/ directory. Only call after the user has reviewed the report.",
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
    return { filed: true, path: bugPath };
  },
});
