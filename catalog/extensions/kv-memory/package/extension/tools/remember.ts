import { defineTool } from "eve/tools";
import { z } from "zod";

import extension from "../extension";
import { store } from "../lib/store";

export default defineTool({
  description:
    "Store a string value under a key in this session's durable memory. Overwrites any existing value for the key.",
  inputSchema: z.object({
    key: z.string().min(1),
    value: z.string(),
  }),
  execute({ key, value }) {
    const { maxKeys } = extension.config;
    const current = store.get();

    if (!(key in current) && Object.keys(current).length >= maxKeys) {
      throw new Error(
        `Memory is full (${maxKeys} keys). Forget a key before adding a new one.`
      );
    }

    store.update((entries) => ({ ...entries, [key]: value }));
    return { key, stored: true, keyCount: Object.keys(store.get()).length };
  },
});
