import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Suspense } from "react";

import { AdSlot } from "@/components/ad-slot";
import { AuthorMark } from "@/components/author-mark";
import { CommunityAgentActions } from "@/components/community-agent-actions";
import { DynamicMarker } from "@/components/dynamic-marker";
import { FileExplorer } from "@/components/file-explorer";
import { InstallCommand } from "@/components/install-command";
import { IntegrationLogo } from "@/components/integration-badge";
import { IntegrationSetup } from "@/components/integration-setup";
import { PageShell } from "@/components/page-shell";
import { RelatedGuides } from "@/components/related-guides";
import { Badge } from "@/components/ui/badge";
import { getIntegrationDetails } from "@/lib/catalog";
import {
  getCommunityAgent,
  getPublishedCommunityAgents,
} from "@/lib/community/queries";
import { communityAgentExplorer } from "@/lib/community/template";
import { getRelatedGuidesForIntegrations } from "@/lib/docs/related-guides";
import { getIntegrationLogo } from "@/lib/integrations/resolve";
import { pageMetadata } from "@/lib/seo";
import { integrationLabel, SITE } from "@/lib/site";

function parseHandle(raw: string): string | null {
  const decoded = decodeURIComponent(raw);
  if (!decoded.startsWith("@")) {
    return null;
  }
  const handle = decoded.slice(1).toLowerCase();
  return handle || null;
}

export async function generateStaticParams() {
  try {
    const agents = await getPublishedCommunityAgents();

    if (agents.length === 0) {
      return [{ slug: "@_", communitySlug: "_" }];
    }

    return agents.map((agent) => ({
      slug: `@${agent.handle}`,
      communitySlug: agent.slug,
    }));
  } catch {
    // Neon may be unreachable during build; keep at least one param for PPR.
    return [{ slug: "@_", communitySlug: "_" }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; communitySlug: string }>;
}): Promise<Metadata> {
  const { slug: rawHandle, communitySlug } = await params;
  const handle = parseHandle(rawHandle);
  if (!handle) {
    return {};
  }

  const agent = await getCommunityAgent(handle, communitySlug);
  if (!agent) {
    return {};
  }

  return pageMetadata({
    description: agent.summary,
    // Segment `opengraph-image.tsx` supplies the card; don't set images here
    // or Next will skip attaching the file-based metadata.
    images: null,
    pathname: `/agents/@${agent.handle}/${agent.slug}`,
    title: `${agent.name} · @${agent.handle}`,
  });
}

function CommunityAgentFallback() {
  return (
    <PageShell>
      <div aria-hidden className="h-48 animate-pulse rounded-xl bg-muted/40" />
    </PageShell>
  );
}

async function CommunityAgentDetailContent({
  params,
}: {
  params: Promise<{ slug: string; communitySlug: string }>;
}) {
  const { slug: rawHandle, communitySlug } = await params;
  const handle = parseHandle(rawHandle);

  if (!handle) {
    notFound();
  }

  const agent = await getCommunityAgent(handle, communitySlug);

  if (!agent) {
    notFound();
  }

  const relatedGuides = getRelatedGuidesForIntegrations(agent.integrations);
  const integrationDetails = await getIntegrationDetails(agent.integrations);
  const explorer = communityAgentExplorer(agent);
  const reportHref = `mailto:hello@${SITE.domain}?subject=${encodeURIComponent(
    `Report community agent @${agent.handle}/${agent.slug}`
  )}`;

  return (
    <PageShell>
      <header className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="animate-enter mb-4 flex flex-wrap items-center gap-1.5 text-label-13 text-muted-foreground"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <Link
            href="/agents"
            className="transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
          >
            Agents
          </Link>
          <span aria-hidden className="text-gray-500">
            /
          </span>
          <Link
            href={`/u/${agent.handle}`}
            className="transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
          >
            @{agent.handle}
          </Link>
        </nav>

        <div
          className="animate-enter grid gap-6 md:grid-cols-2 md:gap-10"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          <div className="flex min-w-0 items-start gap-4">
            <AuthorMark
              src={agent.authorImage}
              alt=""
              size="lg"
              fallbackSlug={
                agent.integrations.find((slug) => getIntegrationLogo(slug)) ??
                agent.integrations[0]
              }
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Community</Badge>
                <Badge variant="secondary">{agent.category.name}</Badge>
              </div>
              <h1 className="mt-3 text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
                {agent.name}
              </h1>
              {agent.integrations.length > 0 ? (
                <ul className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  {agent.integrations.map((integrationSlug) => (
                    <li key={integrationSlug}>
                      <Link
                        href={`/integrations/${integrationSlug}`}
                        className="inline-flex items-center gap-1.5 text-label-13 text-muted-foreground transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
                      >
                        <IntegrationLogo
                          slug={integrationSlug}
                          className="size-3.5"
                        />
                        {integrationLabel(integrationSlug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 md:pt-1">
            <p className="text-copy-14 text-pretty text-muted-foreground md:text-copy-16">
              {agent.summary}
            </p>
            <p className="mt-3 text-label-13 text-muted-foreground">
              By{" "}
              <Link
                href={`/u/${agent.handle}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                @{agent.handle}
              </Link>
              {" · "}
              <span className="tabular-nums">
                {agent.installCount} installs
              </span>
            </p>
            <div className="mt-4">
              <CommunityAgentActions
                agentId={agent.id}
                reportHref={reportHref}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <InstallCommand slug={agent.slug} handle={agent.handle} kind="agent" />
        <RelatedGuides guides={relatedGuides} />
        <AdSlot placement="agent-detail" />
      </div>

      <section className="mt-10">
        <div>
          <h2 className="text-heading-24 font-semibold text-gray-1000">
            Filesystem
          </h2>
          <p className="mt-2 text-copy-14 text-pretty text-muted-foreground">
            Authored content installed into the generated starter — instructions
            {explorer.tree.length > 1 ? ", skills, and examples" : ""} exactly
            as they ship.
          </p>
        </div>
        <div className="mt-4">
          <FileExplorer
            tree={explorer.tree}
            inlineFiles={explorer.inlineFiles}
            initialPath="agent/instructions.md"
            initialContent={explorer.inlineFiles["agent/instructions.md"] ?? ""}
          />
        </div>
      </section>

      {integrationDetails.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-heading-24 font-semibold text-gray-1000">
            Set up integrations
          </h2>
          <p className="mt-2 max-w-2xl text-copy-14 text-pretty text-muted-foreground">
            Suggested services for this community agent. Wire them into the
            generated starter as needed.
          </p>
          <div className="mt-5">
            <IntegrationSetup details={integrationDetails} />
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}

export default function CommunityAgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string; communitySlug: string }>;
}) {
  return (
    <>
      <Suspense fallback={<CommunityAgentFallback />}>
        <CommunityAgentDetailContent params={params} />
      </Suspense>
      <DynamicMarker />
    </>
  );
}
