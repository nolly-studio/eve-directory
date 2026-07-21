import { buildAgentsMd, markdownResponse } from "@/lib/llms";

export const revalidate = false;

export async function GET(): Promise<Response> {
  return markdownResponse(await buildAgentsMd());
}
