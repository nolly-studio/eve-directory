import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntegrationLogo } from "@/components/integration-badge";
import { IntegrationDetailContent } from "@/components/integration-detail-content";
import { AgentCard } from "@/components/listing-card";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getIntegrationDirectorySlugs } from "@/lib/catalog";
import {
  docsLinkLabel,
  getIntegrationPageModel,
} from "@/lib/integrations/page-model";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getIntegrationDirectorySlugs();
  return slugs.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const model = await getIntegrationPageModel(name);

  if (!model) {
    return {};
  }

  return pageMetadata({
    description:
      model.description ??
      `${model.title} for Vercel Eve agents — setup context and catalog agents that use this integration.`,
    pathname: `/integrations/${name}`,
    title: `${model.title} for Vercel Eve`,
  });
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const model = await getIntegrationPageModel(name);

  if (!model) {
    notFound();
  }

  const {
    agents,
    badge,
    description,
    localGuideUrl,
    officialDocsUrl,
    sections,
    slug,
    title,
  } = model;

  return (
    <PageShell narrow>
      <ButtonLink href="/integrations" variant="ghost" size="sm">
        All integrations
      </ButtonLink>

      <header className="mt-6">
        <IntegrationLogo slug={slug} className="size-8" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
            {title}
          </h1>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
        <p className="mt-3 max-w-2xl text-copy-16 text-pretty text-muted-foreground md:text-copy-18">
          {description ?? `Agents that include ${title} integration variants.`}
        </p>
        {officialDocsUrl || localGuideUrl ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
            {officialDocsUrl ? (
              <a
                href={officialDocsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-copy-14 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {docsLinkLabel(title, badge)} ↗
              </a>
            ) : null}
            {localGuideUrl ? (
              <ButtonLink
                href={localGuideUrl}
                variant="ghost"
                size="sm"
                className="-ml-2 h-auto px-2 py-1 text-copy-14 text-muted-foreground"
              >
                Directory guide
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </header>

      <IntegrationDetailContent sections={sections} />

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="text-heading-24 font-semibold tracking-tight text-gray-1000">
          Agents using {title}
        </h2>
        {agents.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-copy-14 text-muted-foreground">
            No catalog agents reference this integration yet.
          </p>
        )}
      </section>
    </PageShell>
  );
}
