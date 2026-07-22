import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { defineTool } from "eve/tools";
import { z } from "zod";

const STORE_PATH = path.join(process.cwd(), "var", "briefings.log");

export default defineTool({
  description:
    "Append a dated weekly briefing line to the local log. Call once per schedule run.",
  inputSchema: z.object({
    line: z.string().min(1).max(500),
  }),
  async execute({ line }) {
    const stamped = `${new Date().toISOString()} ${line.trim()}\n`;
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await appendFile(STORE_PATH, stamped, "utf-8");
    return { saved: true, path: "var/briefings.log", line: stamped.trim() };
  },
});
