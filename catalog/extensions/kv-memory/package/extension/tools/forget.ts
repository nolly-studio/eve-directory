import { defineTool } from "eve/tools";
import { z } from "zod";

import { store } from "../lib/store";

export default defineTool({
  description:
    "Delete the value stored under a key in this session's durable memory. Returns removed=false when the key was not present.",
  inputSchema: z.object({
    key: z.string().min(1),
  }),
  execute({ key }) {
    const removed = key in store.get();
    if (removed) {
      store.update((entries) => {
        const { [key]: _dropped, ...rest } = entries;
        return rest;
      });
    }
    return { key, removed };
  },
});
