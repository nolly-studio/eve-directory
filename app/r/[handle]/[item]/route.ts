import { eq, sql } from "drizzle-orm";
import { after, NextResponse } from "next/server";

import { getCommunityAgent } from "@/lib/community/queries";
import { buildCommunityRegistryItem } from "@/lib/community/template";
import { db } from "@/lib/db";
import { communityAgent } from "@/lib/db/schema";

export const runtime = "nodejs";

function parseItem(item: string): string | null {
  if (!item.endsWith(".json")) {
    return null;
  }

  const slug = item.slice(0, -".json".length);
  if (!slug) {
    return null;
  }

  return slug;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ handle: string; item: string }> }
) {
  const { handle: rawHandle, item } = await context.params;
  const handle = decodeURIComponent(rawHandle);
  const slug = parseItem(decodeURIComponent(item));

  if (!handle.startsWith("@") || !slug) {
    return new NextResponse("Not found", { status: 404 });
  }

  const agent = await getCommunityAgent(handle, slug);

  if (!agent) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = buildCommunityRegistryItem(agent);

  after(async () => {
    try {
      await db
        .update(communityAgent)
        .set({
          installCount: sql`${communityAgent.installCount} + 1`,
        })
        .where(eq(communityAgent.id, agent.id));
    } catch {
      // Counting must never fail the install response.
    }
  });

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
