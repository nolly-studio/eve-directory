import { notFound } from "next/navigation";

import { getLLMText, markdownResponse } from "@/lib/llms";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> }
): Promise<Response> {
  const { slug } = await context.params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  return markdownResponse(await getLLMText(page));
}

export function generateStaticParams() {
  return source.generateParams();
}
