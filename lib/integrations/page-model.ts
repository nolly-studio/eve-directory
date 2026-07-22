import {
  getAgentsByIntegration,
  getIntegrationDetail,
  isIntegrationDocsShared,
  resolveIntegrationPage,
} from "@/lib/catalog";
import type {
  AgentListing,
  IntegrationDetail,
  IntegrationDetailSection,
  IntegrationDocsFacts,
} from "@/lib/catalog/types";
import { getIntegrationGuideUrl } from "@/lib/docs/related-guides";
import { integrationLabel } from "@/lib/site";

export interface IntegrationPageModel {
  slug: string;
  title: string;
  description: string | null;
  badge: string | null;
  sections: IntegrationDetailSection[];
  /** Docs-derived facts; null when the docs page is shared across integrations. */
  docsFacts: IntegrationDocsFacts | null;
  scrapedAt: string | null;
  localGuideUrl: string | null;
  officialDocsUrl: string | null;
  agents: AgentListing[];
}

type ResolvedIntegrationPage = NonNullable<
  Awaited<ReturnType<typeof resolveIntegrationPage>>
>;

function resolveTitle(
  detail: IntegrationDetail | null,
  resolved: ResolvedIntegrationPage,
  slug: string
): string {
  if (detail?.name) {
    return detail.name;
  }
  if (resolved.official?.name) {
    return resolved.official.name;
  }
  return integrationLabel(slug);
}

function resolveBadge(
  detail: IntegrationDetail | null,
  resolved: ResolvedIntegrationPage
): string | null {
  if (detail?.badge) {
    return detail.badge;
  }
  if (resolved.official?.badges[0]) {
    return resolved.official.badges[0];
  }
  return resolved.official?.category ?? null;
}

function resolveDescription(
  detail: IntegrationDetail | null,
  resolved: ResolvedIntegrationPage
): string | null {
  if (detail?.description) {
    return detail.description;
  }
  return resolved.official?.description ?? null;
}

export function docsLinkLabel(title: string, badge: string | null): string {
  const kind = badge ? ` ${badge.toLowerCase()}` : "";
  return `Read the full ${title}${kind} docs`;
}

export async function getIntegrationPageModel(
  slug: string
): Promise<IntegrationPageModel | null> {
  const normalized = slug.toLowerCase();
  const resolved = await resolveIntegrationPage(normalized);

  if (!resolved) {
    return null;
  }

  const [detail, agents] = await Promise.all([
    getIntegrationDetail(normalized),
    getAgentsByIntegration(normalized),
  ]);

  let docsFacts: IntegrationDocsFacts | null = null;
  if (detail?.docsFacts) {
    const shared = await isIntegrationDocsShared(detail);
    if (!shared) {
      ({ docsFacts } = detail);
    }
  }

  return {
    agents,
    badge: resolveBadge(detail, resolved),
    description: resolveDescription(detail, resolved),
    docsFacts,
    localGuideUrl: getIntegrationGuideUrl(normalized),
    officialDocsUrl: detail?.docsUrl ?? null,
    scrapedAt: detail?.scrapedAt ?? null,
    sections: detail?.sections ?? [],
    slug: normalized,
    title: resolveTitle(detail, resolved, normalized),
  };
}
