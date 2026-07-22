import { defineState } from "eve/context";

import type { UrlStatus } from "./check";

export type StatusSnapshot = {
  status: UrlStatus;
  checkedAt: string;
};

/**
 * Last observed status per URL for the current session. `defineState` is
 * scoped to this extension's package, so the name cannot collide with the
 * consuming agent or another extension.
 */
export const lastStatuses = defineState<Record<string, StatusSnapshot>>(
  "http-monitor.last-statuses",
  () => ({})
);
