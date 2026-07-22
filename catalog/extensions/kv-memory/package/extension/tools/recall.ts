import { defineTool } from "eve/tools";
import { z } from "zod";

import { store } from "../lib/store";

export default defineTool({
  description:
    "Read the value stored under a key in this session's durable memory. Returns found=false when the key has never been stored.",
  inputSchema: z.object({
    key: z.string().min(1),
  }),
  execute({ key }) {
    const entries = store.get();
    const found = key in entries;
    return { key, found, value: found ? entries[key] : null };
  },
});
