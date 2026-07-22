import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntegrationMark } from "@/components/integration-badge";
import { AgentCard } from "@/components/listing-card";
import { PageShell } from "@/components/page-shell";
import { SafeMarkdown } from "@/components/safe-markdown";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";
import { getIntegrationDirectorySlugs } from "@/lib/catalog";
import { getIntegrationPageModel } from "@/lib/integrations/page-model";
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

function formatSyncedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function IntegrationDocsPanel({
  docsMarkdown,
  installSummary,
  officialDocsUrl,
  scrapedAt,
  title,
}: {
  docsMarkdown: string | null;
  installSummary: string | null;
  officialDocsUrl: string | null;
  scrapedAt: string | null;
  title: string;
}) {
  if (docsMarkdown) {
    return (
      <Surface className="mt-8 p-5 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-label">From Eve docs</p>
          {scrapedAt ? (
            <p className="text-label-12 text-muted-foreground">
              Synced {formatSyncedAt(scrapedAt)}
            </p>
          ) : null}
        </div>
        <SafeMarkdown content={docsMarkdown} className="mt-2" />
        {officialDocsUrl ? (
          <p className="mt-6 text-label-12 text-muted-foreground">
            Source:{" "}
            <a
              href={officialDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Eve&apos;s {title} docs
            </a>
            . Prefer the official page when something looks out of date.
          </p>
        ) : null}
      </Surface>
    );
  }

  if (installSummary) {
    return (
      <Surface className="mt-8 p-5">
        <p className="text-label">Setup</p>
        <p className="mt-2 max-w-3xl text-copy-14 text-pretty text-muted-foreground">
          {installSummary}
        </p>
        {officialDocsUrl ? (
          <p className="mt-3 text-label-12 text-muted-foreground">
            Full install steps live in{" "}
            <a
              href={officialDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Eve&apos;s {title} docs
            </a>
            . We do not fork framework setup here.
          </p>
        ) : null}
      </Surface>
    );
  }

  return null;
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
    docsMarkdown,
    installSummary,
    localGuideUrl,
    officialDocsUrl,
    scrapedAt,
    slug,
    title,
  } = model;

  return (
    <PageShell>
      <ButtonLink href="/integrations" variant="ghost" size="sm">
        All integrations
      </ButtonLink>

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <IntegrationMark slug={slug} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
              {title}
            </h1>
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
          </div>
          <p className="mt-2 max-w-2xl text-copy-16 text-pretty text-muted-foreground md:text-copy-18">
            {description ??
              `Agents that include ${title} integration variants.`}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {localGuideUrl ? (
          <ButtonLink href={localGuideUrl} variant="outline" size="sm">
            Read the guide
          </ButtonLink>
        ) : null}
        {officialDocsUrl ? (
          <ButtonLink
            href={officialDocsUrl}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noreferrer"
          >
            Eve docs
          </ButtonLink>
        ) : null}
        <ButtonLink href="/agents" variant="ghost" size="sm">
          Browse agents
        </ButtonLink>
      </div>

      <IntegrationDocsPanel
        docsMarkdown={docsMarkdown}
        installSummary={installSummary}
        officialDocsUrl={officialDocsUrl}
        scrapedAt={scrapedAt}
        title={title}
      />

      <section className="mt-10">
        <h2 className="text-heading-24 font-semibold text-gray-1000">
          Agents using {title}
        </h2>
        {agents.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
