import { defineState } from "eve/context";

/**
 * Session-scoped key/value memory. `defineState` is scoped to this
 * extension's package, so the slot never collides with the consuming
 * agent or another extension, and it resets with every fresh session.
 */
export const store = defineState<Record<string, string>>(
  "kv-memory.store",
  () => ({})
);
