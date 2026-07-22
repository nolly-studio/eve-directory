"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import {
  getAgents,
  getCategories,
  getOfficialIntegrations,
} from "@/lib/catalog";
import {
  countRecentSubmissions,
  getOwnedCommunityAgent,
} from "@/lib/community/queries";
import { COMMUNITY_AGENTS_TAG, communityAgentTag } from "@/lib/community/tags";
import {
  communityAgentFieldsSchema,
  MAX_SUBMISSIONS_PER_DAY,
} from "@/lib/community/validation";
import type { AgentActionState } from "@/lib/community/validation";
import { db } from "@/lib/db";
import { communityAgent, user } from "@/lib/db/schema";
import { getPostHogClient } from "@/lib/posthog-server";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function formIntegrations(formData: FormData): string[] {
  return formData
    .getAll("integrations")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Authored files travel as one JSON payload (repeatable client-side editor).
 * Shape is enforced by `communityAgentFieldsSchema`; this only unwraps JSON.
 */
function formFiles(formData: FormData): unknown {
  const raw = formData.get("files");
  if (typeof raw !== "string" || !raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [{ invalid: true }];
  }
}

async function resolveCategory(categorySlug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === categorySlug) ?? null;
}

async function resolveIntegrations(slugs: string[]) {
  const official = await getOfficialIntegrations();
  const allowed = new Set(official.map((item) => item.slug.toLowerCase()));
  const unique = [...new Set(slugs.map((slug) => slug.toLowerCase()))];

  for (const slug of unique) {
    if (!allowed.has(slug)) {
      return {
        ok: false as const,
        message: `Unknown integration: ${slug}`,
      };
    }
  }

  return { ok: true as const, integrations: unique };
}

function revalidateCommunity(handle: string, slug: string) {
  updateTag(COMMUNITY_AGENTS_TAG);
  updateTag(communityAgentTag(handle, slug));
}

export async function createCommunityAgent(
  _prev: AgentActionState,
  formData: FormData
): Promise<AgentActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { ok: false, message: "Sign in to submit an agent." };
  }

  const parsed = communityAgentFieldsSchema.safeParse({
    slug: formString(formData, "slug"),
    name: formString(formData, "name"),
    summary: formString(formData, "summary"),
    instructions: formString(formData, "instructions"),
    categorySlug: formString(formData, "categorySlug"),
    integrations: formIntegrations(formData),
    files: formFiles(formData),
  });

  if (!parsed.success) {
    const fieldErrors: AgentActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const [key] = issue.path;
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof NonNullable<AgentActionState["fieldErrors"]>] =
          issue.message;
      }
    }
    return { ok: false, fieldErrors, message: "Fix the highlighted fields." };
  }

  const category = await resolveCategory(parsed.data.categorySlug);
  if (!category) {
    return {
      ok: false,
      fieldErrors: { categorySlug: "Pick a valid category." },
      message: "Pick a valid category.",
    };
  }

  const integrationsResult = await resolveIntegrations(
    parsed.data.integrations
  );
  if (!integrationsResult.ok) {
    return {
      ok: false,
      fieldErrors: { integrations: integrationsResult.message },
      message: integrationsResult.message,
    };
  }

  const officialAgents = await getAgents();
  if (officialAgents.some((agent) => agent.slug === parsed.data.slug)) {
    return {
      ok: false,
      fieldErrors: {
        slug: "This slug is reserved by an official agent.",
      },
      message: "This slug is reserved by an official agent.",
    };
  }

  const [dbUser] = await db
    .select({ handle: user.handle })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser?.handle) {
    return { ok: false, message: "Your account is missing a handle." };
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await countRecentSubmissions(session.user.id, since);
  if (recentCount >= MAX_SUBMISSIONS_PER_DAY) {
    return {
      ok: false,
      message: `You can submit up to ${MAX_SUBMISSIONS_PER_DAY} agents per day.`,
    };
  }

  const existing = await db
    .select({ id: communityAgent.id })
    .from(communityAgent)
    .where(
      and(
        eq(communityAgent.userId, session.user.id),
        eq(communityAgent.slug, parsed.data.slug)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      ok: false,
      fieldErrors: { slug: "You already have an agent with this slug." },
      message: "You already have an agent with this slug.",
    };
  }

  const id = crypto.randomUUID();

  await db.insert(communityAgent).values({
    id,
    userId: session.user.id,
    slug: parsed.data.slug,
    name: parsed.data.name,
    summary: parsed.data.summary,
    instructions: parsed.data.instructions,
    files: parsed.data.files,
    categorySlug: category.slug,
    categoryName: category.name,
    integrations: integrationsResult.integrations,
    status: "published",
  });

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: "community_agent_published",
    properties: {
      category_slug: category.slug,
      file_count: parsed.data.files.length,
      integration_count: integrationsResult.integrations.length,
    },
  });
  await posthog.flush();

  revalidateCommunity(dbUser.handle, parsed.data.slug);
  redirect(`/agents/@${dbUser.handle}/${parsed.data.slug}`);
}

export async function updateCommunityAgent(
  _prev: AgentActionState,
  formData: FormData
): Promise<AgentActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { ok: false, message: "Sign in to edit an agent." };
  }

  const id = formString(formData, "id");
  if (!id) {
    return { ok: false, message: "Missing agent id." };
  }

  const owned = await getOwnedCommunityAgent(id, session.user.id);
  if (!owned) {
    return { ok: false, message: "Agent not found." };
  }

  const parsed = communityAgentFieldsSchema.safeParse({
    slug: formString(formData, "slug"),
    name: formString(formData, "name"),
    summary: formString(formData, "summary"),
    instructions: formString(formData, "instructions"),
    categorySlug: formString(formData, "categorySlug"),
    integrations: formIntegrations(formData),
    files: formFiles(formData),
  });

  if (!parsed.success) {
    const fieldErrors: AgentActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const [key] = issue.path;
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof NonNullable<AgentActionState["fieldErrors"]>] =
          issue.message;
      }
    }
    return { ok: false, fieldErrors, message: "Fix the highlighted fields." };
  }

  const category = await resolveCategory(parsed.data.categorySlug);
  if (!category) {
    return {
      ok: false,
      fieldErrors: { categorySlug: "Pick a valid category." },
      message: "Pick a valid category.",
    };
  }

  const integrationsResult = await resolveIntegrations(
    parsed.data.integrations
  );
  if (!integrationsResult.ok) {
    return {
      ok: false,
      fieldErrors: { integrations: integrationsResult.message },
      message: integrationsResult.message,
    };
  }

  if (parsed.data.slug !== owned.slug) {
    const officialAgents = await getAgents();
    if (officialAgents.some((agent) => agent.slug === parsed.data.slug)) {
      return {
        ok: false,
        fieldErrors: {
          slug: "This slug is reserved by an official agent.",
        },
        message: "This slug is reserved by an official agent.",
      };
    }

    const conflict = await db
      .select({ id: communityAgent.id })
      .from(communityAgent)
      .where(
        and(
          eq(communityAgent.userId, session.user.id),
          eq(communityAgent.slug, parsed.data.slug),
          ne(communityAgent.id, id)
        )
      )
      .limit(1);

    if (conflict.length > 0) {
      return {
        ok: false,
        fieldErrors: { slug: "You already have an agent with this slug." },
        message: "You already have an agent with this slug.",
      };
    }
  }

  const [dbUser] = await db
    .select({ handle: user.handle })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser?.handle) {
    return { ok: false, message: "Your account is missing a handle." };
  }

  await db
    .update(communityAgent)
    .set({
      slug: parsed.data.slug,
      name: parsed.data.name,
      summary: parsed.data.summary,
      instructions: parsed.data.instructions,
      files: parsed.data.files,
      categorySlug: category.slug,
      categoryName: category.name,
      integrations: integrationsResult.integrations,
      status: "published",
    })
    .where(eq(communityAgent.id, id));

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: "community_agent_updated",
    properties: {
      category_slug: category.slug,
      file_count: parsed.data.files.length,
      integration_count: integrationsResult.integrations.length,
      slug_changed: owned.slug !== parsed.data.slug,
    },
  });
  await posthog.flush();

  revalidateCommunity(dbUser.handle, owned.slug);
  if (owned.slug !== parsed.data.slug) {
    revalidateCommunity(dbUser.handle, parsed.data.slug);
  }

  redirect(`/agents/@${dbUser.handle}/${parsed.data.slug}`);
}

export async function unpublishCommunityAgent(
  id: string
): Promise<AgentActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { ok: false, message: "Sign in to unpublish an agent." };
  }

  const owned = await getOwnedCommunityAgent(id, session.user.id);
  if (!owned) {
    return { ok: false, message: "Agent not found." };
  }

  const [dbUser] = await db
    .select({ handle: user.handle })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser?.handle) {
    return { ok: false, message: "Your account is missing a handle." };
  }

  await db
    .update(communityAgent)
    .set({ status: "delisted" })
    .where(eq(communityAgent.id, id));

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: "community_agent_unpublished",
  });
  await posthog.flush();

  revalidateCommunity(dbUser.handle, owned.slug);
  return { ok: true, message: "Agent unpublished." };
}

export async function delistCommunityAgent(
  id: string
): Promise<AgentActionState> {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    return { ok: false, message: "Admin access required." };
  }

  const [row] = await db
    .select({
      slug: communityAgent.slug,
      handle: user.handle,
    })
    .from(communityAgent)
    .innerJoin(user, eq(communityAgent.userId, user.id))
    .where(eq(communityAgent.id, id))
    .limit(1);

  if (!row) {
    return { ok: false, message: "Agent not found." };
  }

  await db
    .update(communityAgent)
    .set({ status: "delisted" })
    .where(eq(communityAgent.id, id));

  revalidateCommunity(row.handle, row.slug);
  return { ok: true, message: "Agent delisted." };
}
