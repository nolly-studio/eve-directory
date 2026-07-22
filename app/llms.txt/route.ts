import { cacheLife } from "next/cache";

import { buildLlmsTxt, markdownResponse } from "@/lib/llms";

async function getLlmsTxt(): Promise<string> {
  "use cache";
  cacheLife("max");
  return await buildLlmsTxt();
}

export async function GET(): Promise<Response> {
  return markdownResponse(await getLlmsTxt());
}
