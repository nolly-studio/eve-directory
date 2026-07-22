import type { MetadataRoute } from "next";

import {
  getAgents,
  getCategories,
  getExtensions,
  getIntegrationDirectorySlugs,
} from "@/lib/catalog";
import { getPublishedCommunityAgents } from "@/lib/community/queries";
import { siteUrl } from "@/lib/site";
import { source } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [agents, communityAgents, extensions, categories, integrations] =
    await Promise.all([
      getAgents(),
      getPublishedCommunityAgents(),
      getExtensions(),
      getCategories(),
      getIntegrationDirectorySlugs(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/agents",
    "/extensions",
    "/integrations",
    "/composer",
    "/docs",
    "/terms",
    "/privacy",
  ].map((pathname) => ({
    changeFrequency: pathname === "" ? "weekly" : "monthly",
    priority: pathname === "" ? 1 : 0.7,
    url: siteUrl(pathname || "/"),
  }));

  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    changeFrequency: "weekly",
    priority: 0.8,
    url: siteUrl(`/agents/${agent.slug}`),
  }));

  const communityAgentRoutes: MetadataRoute.Sitemap = communityAgents.map(
    (agent) => ({
      changeFrequency: "weekly" as const,
      priority: 0.7,
      url: siteUrl(`/agents/@${agent.handle}/${agent.slug}`),
    })
  );

  const profileHandles = [...new Set(communityAgents.map((a) => a.handle))];
  const profileRoutes: MetadataRoute.Sitemap = profileHandles.map((handle) => ({
    changeFrequency: "weekly" as const,
    priority: 0.5,
    url: siteUrl(`/u/${handle}`),
  }));

  const extensionRoutes: MetadataRoute.Sitemap = extensions.map(
    (extension) => ({
      changeFrequency: "weekly",
      priority: 0.7,
      url: siteUrl(`/extensions/${extension.slug}`),
    })
  );

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    changeFrequency: "weekly",
    priority: 0.6,
    url: siteUrl(`/categories/${category.slug}`),
  }));

  const integrationRoutes: MetadataRoute.Sitemap = integrations.map((name) => ({
    changeFrequency: "weekly",
    priority: 0.6,
    url: siteUrl(`/integrations/${name}`),
  }));

  const docRoutes: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    changeFrequency: "monthly",
    priority: 0.5,
    url: siteUrl(page.url),
  }));

  return [
    ...staticRoutes,
    ...agentRoutes,
    ...communityAgentRoutes,
    ...profileRoutes,
    ...extensionRoutes,
    ...categoryRoutes,
    ...integrationRoutes,
    ...docRoutes,
  ];
}
