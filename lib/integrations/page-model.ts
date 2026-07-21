import {
  getAgentsByIntegration,
  getIntegrationDetail,
  getIntegrationInstallSummary,
  resolveIntegrationPage,
} from "@/lib/catalog";
import type { AgentListing } from "@/lib/catalog/types";
import { getIntegrationGuideUrl } from "@/lib/docs/related-guides";
import { integrationLabel } from "@/lib/site";

export interface IntegrationPageModel {
  slug: string;
  title: string;
  description: string | null;
  badge: string | null;
  installSummary: string | null;
  localGuideUrl: string | null;
  officialDocsUrl: string | null;
  agents: AgentListing[];
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

  const title =
    detail?.name ?? resolved.official?.name ?? integrationLabel(normalized);

  return {
    agents,
    badge:
      detail?.badge ??
      resolved.official?.badges[0] ??
      resolved.official?.category ??
      null,
    description: detail?.description ?? resolved.official?.description ?? null,
    installSummary: detail ? getIntegrationInstallSummary(detail) : null,
    localGuideUrl: getIntegrationGuideUrl(normalized),
    officialDocsUrl: detail?.docsUrl ?? null,
    slug: normalized,
    title,
  };
}
