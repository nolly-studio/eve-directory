import { cacheLife } from "next/cache";

import { buildAgentsMd, markdownResponse } from "@/lib/llms";

async function getAgentsMd(): Promise<string> {
  "use cache";
  cacheLife("max");
  return await buildAgentsMd();
}

export async function GET(): Promise<Response> {
  return markdownResponse(await getAgentsMd());
}
