import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import type { CommunityAgentListing } from "@/lib/catalog/types";
import { COMMUNITY_AGENTS_TAG, communityAgentTag } from "@/lib/community/tags";
import { db } from "@/lib/db";
import { communityAgent, user } from "@/lib/db/schema";

interface JoinedRow {
  agent: typeof communityAgent.$inferSelect;
  user: {
    handle: string;
    name: string;
    image: string | null;
  };
}

function toListing(row: JoinedRow): CommunityAgentListing {
  return {
    id: row.agent.id,
    name: row.agent.name,
    slug: row.agent.slug,
    summary: row.agent.summary,
    version: "1.0.0",
    license: "MIT",
    category: {
      name: row.agent.categoryName,
      slug: row.agent.categorySlug,
    },
    integrations: row.agent.integrations ?? [],
    handle: row.user.handle,
    authorName: row.user.name,
    authorImage: row.user.image,
    installCount: row.agent.installCount,
    instructions: row.agent.instructions,
    files: row.agent.files ?? [],
    featured: row.agent.featured,
    createdAt: row.agent.createdAt.toISOString(),
    updatedAt: row.agent.updatedAt.toISOString(),
  };
}

async function fetchPublishedCommunityAgents(): Promise<
  CommunityAgentListing[]
> {
  const rows = await db
    .select({
      agent: communityAgent,
      user: {
        handle: user.handle,
        name: user.name,
        image: user.image,
      },
    })
    .from(communityAgent)
    .innerJoin(user, eq(communityAgent.userId, user.id))
    .where(eq(communityAgent.status, "published"))
    .orderBy(desc(communityAgent.installCount), desc(communityAgent.createdAt));

  return rows.map(toListing);
}

export function getPublishedCommunityAgents(): Promise<
  CommunityAgentListing[]
> {
  return unstable_cache(fetchPublishedCommunityAgents, ["community-agents"], {
    tags: [COMMUNITY_AGENTS_TAG],
    revalidate: 3600,
  })();
}

async function fetchCommunityAgent(
  handle: string,
  slug: string
): Promise<CommunityAgentListing | null> {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();

  const [row] = await db
    .select({
      agent: communityAgent,
      user: {
        handle: user.handle,
        name: user.name,
        image: user.image,
      },
    })
    .from(communityAgent)
    .innerJoin(user, eq(communityAgent.userId, user.id))
    .where(
      and(
        eq(user.handle, normalizedHandle),
        eq(communityAgent.slug, slug),
        eq(communityAgent.status, "published")
      )
    )
    .limit(1);

  return row ? toListing(row) : null;
}

export function getCommunityAgent(
  handle: string,
  slug: string
): Promise<CommunityAgentListing | null> {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();

  return unstable_cache(
    () => fetchCommunityAgent(normalizedHandle, slug),
    ["community-agent", normalizedHandle, slug],
    {
      tags: [COMMUNITY_AGENTS_TAG, communityAgentTag(normalizedHandle, slug)],
      revalidate: 3600,
    }
  )();
}

export async function getCommunityAgentsByHandle(
  handle: string
): Promise<CommunityAgentListing[]> {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();
  const agents = await getPublishedCommunityAgents();
  return agents.filter((agent) => agent.handle === normalizedHandle);
}

export function getCommunityAuthor(handle: string): Promise<{
  handle: string;
  name: string;
  image: string | null;
} | null> {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();

  return unstable_cache(
    async () => {
      const [row] = await db
        .select({
          handle: user.handle,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.handle, normalizedHandle))
        .limit(1);

      return row ?? null;
    },
    ["community-author", normalizedHandle],
    {
      tags: [COMMUNITY_AGENTS_TAG],
      revalidate: 3600,
    }
  )();
}

/** Uncached — for account dashboard only. */
export function getAgentsForUser(
  userId: string
): Promise<(typeof communityAgent.$inferSelect)[]> {
  return db
    .select()
    .from(communityAgent)
    .where(eq(communityAgent.userId, userId))
    .orderBy(desc(communityAgent.updatedAt));
}

export async function countRecentSubmissions(
  userId: string,
  since: Date
): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(communityAgent)
    .where(
      and(
        eq(communityAgent.userId, userId),
        sql`${communityAgent.createdAt} >= ${since}`
      )
    );

  return row?.count ?? 0;
}

export async function getOwnedCommunityAgent(
  id: string,
  userId: string
): Promise<typeof communityAgent.$inferSelect | null> {
  const [row] = await db
    .select()
    .from(communityAgent)
    .where(and(eq(communityAgent.id, id), eq(communityAgent.userId, userId)))
    .limit(1);

  return row ?? null;
}
