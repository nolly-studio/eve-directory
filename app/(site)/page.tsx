import type { Metadata } from "next";

import { AdSlot, sponsorSlotsEnabled } from "@/components/ad-slot";
import { HomeCategoryStrip } from "@/components/home-category-strip";
import { HomeComposeTeaser } from "@/components/home-compose-teaser";
import { HomeHero } from "@/components/home-hero";
import { HomeIntegrationsSection } from "@/components/home-integrations-section";
import { AgentCard } from "@/components/listing-card";
import { StepMarker } from "@/components/step-marker";
import { ButtonLink } from "@/components/ui/button-link";
import {
  getAgents,
  getCategories,
  getExtensions,
  getOfficialIntegrations,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  absoluteTitle: true,
  description: SITE.description,
  pathname: "/",
  title: SITE.title,
});

/** Hand-picked, recognizable marks for the landing integration cards. */
const FEATURED_INTEGRATION_SLUGS = [
  "slack",
  "github",
  "linear",
  "notion",
  "chat-sdk-whatsapp",
  "discord",
];

export default async function HomePage() {
  const [agents, categories, extensions, officialIntegrations] =
    await Promise.all([
      getAgents(),
      getCategories(),
      getExtensions(),
      getOfficialIntegrations(),
    ]);

  const featured = agents.slice(0, 6);
  const demoAgent = featured[0] ?? agents[0];

  if (!demoAgent) {
    throw new Error("Home page requires at least one catalog agent");
  }

  const featuredIntegrations = FEATURED_INTEGRATION_SLUGS.flatMap((slug) => {
    const integration = officialIntegrations.find(
      (item) => item.slug.toLowerCase() === slug
    );

    if (!integration) {
      return [];
    }

    const agentCount = agents.filter((agent) =>
      agent.integrations.some((item) => item.toLowerCase() === slug)
    ).length;

    return [{ agentCount, integration }];
  });

  const categoriesWithCounts = categories.map((category) => ({
    category,
    count: agents.filter((agent) => agent.category.slug === category.slug)
      .length,
  }));

  return (
    <div>
      <HomeHero
        featuredAgent={{
          name: demoAgent.name,
          slug: demoAgent.slug,
          summary: demoAgent.summary,
          category: demoAgent.category.name,
          integrations: demoAgent.integrations,
        }}
      />

      {sponsorSlotsEnabled() ? (
        <section className="mx-auto max-w-6xl px-6 py-4">
          <AdSlot placement="home-hero" className="min-h-20" />
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20">
        <div className="mb-8 grid grid-cols-12 items-end gap-x-6 gap-y-4">
          <div className="col-span-full lg:col-span-5">
            <StepMarker step={1} className="mb-3" />
            <h2 className="text-heading-32 font-semibold text-balance text-gray-1000 [--font-weight-semibold:450] lg:text-heading-40">
              Featured agents
            </h2>
          </div>
          <div className="col-span-full flex items-end justify-between gap-4 lg:col-span-5 lg:col-start-8">
            <p className="text-copy-16 text-pretty text-gray-900">
              <span className="tabular-nums">{agents.length}</span> agents in
              the open catalog
            </p>
            <ButtonLink href="/agents" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>

      <HomeComposeTeaser agents={agents} extensions={extensions} />

      <HomeIntegrationsSection
        integrations={featuredIntegrations}
        totalCount={officialIntegrations.length}
      />

      <HomeCategoryStrip categories={categoriesWithCounts} />
    </div>
  );
}
