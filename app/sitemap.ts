import type { MetadataRoute } from "next";

import {
  getAgents,
  getCategories,
  getExtensions,
  getIntegrationDirectorySlugs,
} from "@/lib/catalog";
import { siteUrl } from "@/lib/site";
import { source } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [agents, extensions, categories, integrations] = await Promise.all([
    getAgents(),
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
    ...extensionRoutes,
    ...categoryRoutes,
    ...integrationRoutes,
    ...docRoutes,
  ];
}
