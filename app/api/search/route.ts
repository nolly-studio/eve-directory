import { createSearchAPI } from "fumadocs-core/search/server";
import { cacheLife, cacheTag } from "next/cache";

import { COMMUNITY_AGENTS_TAG } from "@/lib/community/tags";
import { buildSearchIndexes } from "@/lib/search/indexes";

async function getStaticSearchIndexData(): Promise<unknown> {
  "use cache";
  cacheLife("hours");
  cacheTag(COMMUNITY_AGENTS_TAG);

  // Create inside the cache scope so index builds (and their `use cache`
  // data loaders) run within the App Router work store. Cache the JSON
  // payload — Response objects are not serializable.
  const api = createSearchAPI("advanced", {
    indexes: buildSearchIndexes,
    language: "english",
  });

  return await api.export();
}

export async function GET(): Promise<Response> {
  const data = await getStaticSearchIndexData();
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
