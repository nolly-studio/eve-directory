import { defineExtension } from "eve/extension";
import { z } from "zod";

export default defineExtension({
  config: z.object({
    timeoutMs: z.number().int().positive().default(10_000),
  }),
});
