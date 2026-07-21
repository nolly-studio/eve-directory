import Link from "next/link";
import type { CSSProperties } from "react";

import { AddToComposerButton } from "@/components/add-to-composer-button";
import { IntegrationLogo } from "@/components/integration-badge";
import type { AgentListing } from "@/lib/catalog/types";
import { integrationLabel } from "@/lib/site";

export function AgentDetailHeader({
  agent,
  authoredFiles,
}: {
  agent: AgentListing;
  authoredFiles: number;
}) {
  return (
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
          href={`/categories/${agent.category.slug}`}
          className="transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
        >
          {agent.category.name}
        </Link>
      </nav>

      <div
        className="animate-enter grid gap-6 md:grid-cols-2 md:gap-10"
        style={{ "--stagger": 1 } as CSSProperties}
      >
        <div className="min-w-0">
          <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
            {agent.name}
          </h1>
          {agent.integrations.length > 0 ? (
            <ul className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-2">
              {agent.integrations.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/integrations/${slug}`}
                    className="inline-flex items-center gap-1.5 text-label-13 text-muted-foreground transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
                  >
                    <IntegrationLogo slug={slug} className="size-3.5" />
                    {integrationLabel(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="min-w-0 md:pt-1">
          <p className="text-copy-14 text-pretty text-muted-foreground md:text-copy-16">
            {agent.summary}
          </p>
          <div className="mt-4">
            <AddToComposerButton slug={agent.slug} kind="agent" />
          </div>
        </div>
      </div>

      <dl
        className="animate-enter mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:grid-cols-4"
        style={{ "--stagger": 2 } as CSSProperties}
      >
        <div>
          <dt className="text-label-12 text-muted-foreground">Version</dt>
          <dd className="mt-1 font-mono text-label-13 text-foreground tabular-nums">
            {agent.version}
          </dd>
        </div>
        <div>
          <dt className="text-label-12 text-muted-foreground">License</dt>
          <dd className="mt-1 text-label-13 text-foreground">
            {agent.license}
          </dd>
        </div>
        <div>
          <dt className="text-label-12 text-muted-foreground">Category</dt>
          <dd className="mt-1 text-label-13 text-foreground">
            <Link
              href={`/categories/${agent.category.slug}`}
              className="transition-colors duration-150 hover:text-muted-foreground motion-reduce:transition-none"
            >
              {agent.category.name}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-label-12 text-muted-foreground">
            Authored files
          </dt>
          <dd className="mt-1 font-mono text-label-13 text-foreground tabular-nums">
            {authoredFiles}
          </dd>
        </div>
      </dl>
    </header>
  );
}
