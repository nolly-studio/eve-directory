import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { getLLMText, markdownResponse } from "@/lib/llms";
import { source } from "@/lib/source";

async function getCachedLlmText(slugKey: string): Promise<string | null> {
  "use cache";
  cacheLife("max");
  const slug = slugKey === "" ? undefined : slugKey.split("/");
  const page = source.getPage(slug);

  if (!page) {
    return null;
  }

  return await getLLMText(page);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> }
): Promise<Response> {
  const { slug } = await context.params;
  const body = await getCachedLlmText(slug?.join("/") ?? "");

  if (!body) {
    notFound();
  }

  return markdownResponse(body);
}

export function generateStaticParams() {
  return source.generateParams();
}
