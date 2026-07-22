import type { AdvancedIndex } from "fumadocs-core/search/server";

import {
  getAgents,
  getExtensions,
  getIntegrationDirectorySlugs,
  getOfficialIntegrations,
} from "@/lib/catalog";
import { getPublishedCommunityAgents } from "@/lib/community/queries";
import { integrationLabel } from "@/lib/site";
import { source } from "@/lib/source";

function listingStructuredData(
  content: string
): AdvancedIndex["structuredData"] {
  return {
    contents: [{ content, heading: undefined }],
    headings: [],
  };
}

function buildGuideIndexes(): AdvancedIndex[] {
  return source.getPages().map((page) => {
    const structuredData =
      page.data.structuredData ??
      listingStructuredData(page.data.description ?? "");

    return {
      breadcrumbs: ["Guides"],
      description: page.data.description,
      id: page.url,
      structuredData,
      tag: "guide",
      title: page.data.title,
      url: page.url,
    } satisfies AdvancedIndex;
  });
}

async function buildCatalogIndexes(): Promise<AdvancedIndex[]> {
  const [
    agents,
    communityAgents,
    extensions,
    integrationSlugs,
    officialIntegrations,
  ] = await Promise.all([
    getAgents(),
    getPublishedCommunityAgents(),
    getExtensions(),
    getIntegrationDirectorySlugs(),
    getOfficialIntegrations(),
  ]);

  const officialBySlug = new Map(
    officialIntegrations.map((item) => [item.slug.toLowerCase(), item])
  );

  const agentIndexes: AdvancedIndex[] = agents.map((agent) => ({
    breadcrumbs: ["Agents", agent.category.name],
    description: agent.summary,
    id: `/agents/${agent.slug}`,
    structuredData: listingStructuredData(
      [agent.summary, agent.category.name, ...agent.integrations].join(" ")
    ),
    tag: "agent",
    title: agent.name,
    url: `/agents/${agent.slug}`,
  }));

  const communityIndexes: AdvancedIndex[] = communityAgents.map((agent) => {
    const url = `/agents/@${agent.handle}/${agent.slug}`;
    return {
      breadcrumbs: ["Agents", "Community", agent.category.name],
      description: agent.summary,
      id: url,
      structuredData: listingStructuredData(
        [
          agent.summary,
          agent.category.name,
          agent.handle,
          ...agent.integrations,
        ].join(" ")
      ),
      tag: "agent",
      title: `${agent.name} (@${agent.handle})`,
      url,
    } satisfies AdvancedIndex;
  });

  const extensionIndexes: AdvancedIndex[] = extensions.map((extension) => ({
    breadcrumbs: ["Extensions"],
    description: extension.summary,
    id: `/extensions/${extension.slug}`,
    structuredData: listingStructuredData(
      [extension.summary, ...extension.integrations].join(" ")
    ),
    tag: "extension",
    title: extension.name,
    url: `/extensions/${extension.slug}`,
  }));

  const integrationIndexes: AdvancedIndex[] = integrationSlugs.map((slug) => {
    const official = officialBySlug.get(slug);
    const title = official?.name ?? integrationLabel(slug);
    const description =
      official?.description ?? `Agents and extensions that use ${title}.`;

    return {
      breadcrumbs: ["Integrations"],
      description,
      id: `/integrations/${slug}`,
      structuredData: listingStructuredData(
        [description, official?.category ?? "", ...(official?.badges ?? [])]
          .filter(Boolean)
          .join(" ")
      ),
      tag: "integration",
      title,
      url: `/integrations/${slug}`,
    } satisfies AdvancedIndex;
  });

  return [
    ...agentIndexes,
    ...communityIndexes,
    ...extensionIndexes,
    ...integrationIndexes,
  ];
}

/** Combined Orama indexes for guides + catalog directory pages. */
export async function buildSearchIndexes(): Promise<AdvancedIndex[]> {
  const catalog = await buildCatalogIndexes();
  return [...buildGuideIndexes(), ...catalog];
}
