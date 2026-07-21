import { createSearchAPI } from "fumadocs-core/search/server";

import { buildSearchIndexes } from "@/lib/search/indexes";

export const { GET } = createSearchAPI("advanced", {
  indexes: buildSearchIndexes,
  language: "english",
});
