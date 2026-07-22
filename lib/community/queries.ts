import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

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

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, "").toLowerCase();
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

export async function getPublishedCommunityAgents(): Promise<
  CommunityAgentListing[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag(COMMUNITY_AGENTS_TAG);

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

async function fetchCommunityAgent(
  handle: string,
  slug: string
): Promise<CommunityAgentListing | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(COMMUNITY_AGENTS_TAG, communityAgentTag(handle, slug));

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
        eq(user.handle, handle),
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
  return fetchCommunityAgent(normalizeHandle(handle), slug);
}

export async function getCommunityAgentsByHandle(
  handle: string
): Promise<CommunityAgentListing[]> {
  const normalizedHandle = normalizeHandle(handle);
  const agents = await getPublishedCommunityAgents();
  return agents.filter((agent) => agent.handle === normalizedHandle);
}

async function fetchCommunityAuthor(handle: string): Promise<{
  handle: string;
  name: string;
  image: string | null;
} | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(COMMUNITY_AGENTS_TAG);

  const [row] = await db
    .select({
      handle: user.handle,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(eq(user.handle, handle))
    .limit(1);

  return row ?? null;
}

export function getCommunityAuthor(handle: string): Promise<{
  handle: string;
  name: string;
  image: string | null;
} | null> {
  return fetchCommunityAuthor(normalizeHandle(handle));
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
