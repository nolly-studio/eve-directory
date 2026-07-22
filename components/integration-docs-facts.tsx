import type { ReactNode } from "react";

import { SafeMarkdown } from "@/components/safe-markdown";
import { Surface } from "@/components/ui/surface";
import type { IntegrationDocsFacts } from "@/lib/catalog/types";

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

function FactLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-label-12 font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

/**
 * "At a glance" panel of structured facts derived from the eve docs at
 * scrape time — env vars, webhook route, capabilities, and hooks presented
 * in directory-native UI rather than mirrored prose.
 */
export function IntegrationDocsGlance({
  facts,
  officialDocsUrl,
  scrapedAt,
  title,
}: {
  facts: IntegrationDocsFacts;
  officialDocsUrl: string | null;
  scrapedAt: string | null;
  title: string;
}) {
  const hasPanelContent =
    facts.route ||
    facts.envVars.length > 0 ||
    facts.capabilities.length > 0 ||
    facts.hooks.length > 0;

  if (!hasPanelContent) {
    return null;
  }

  return (
    <Surface className="p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-copy-16 font-semibold text-gray-1000">
          At a glance
        </h2>
        <p className="text-label-12 text-muted-foreground">
          {scrapedAt
            ? `From Eve docs · synced ${formatSyncedAt(scrapedAt)}`
            : "From Eve docs"}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {facts.route ? (
          <div>
            <FactLabel>Webhook route</FactLabel>
            <code className="mt-1 inline-block rounded-md bg-muted px-1.5 py-0.5 font-mono text-label-13 text-foreground">
              POST {facts.route}
            </code>
          </div>
        ) : null}

        {facts.hooks.length > 0 ? (
          <div>
            <FactLabel>Extension hooks</FactLabel>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {facts.hooks.map((hook) => (
                <code
                  key={hook}
                  className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-label-13 text-foreground"
                >
                  {hook}
                </code>
              ))}
            </div>
          </div>
        ) : null}

        {facts.envVars.length > 0 ? (
          <div className="sm:col-span-2">
            <FactLabel>Environment variables</FactLabel>
            <dl className="mt-1.5 space-y-1">
              {facts.envVars.map((envVar) => (
                <div
                  key={envVar.name}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
                >
                  <dt className="shrink-0 font-mono text-label-13 text-foreground">
                    {envVar.name}
                  </dt>
                  {envVar.description ? (
                    <dd className="text-copy-14 text-muted-foreground">
                      {envVar.description}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {facts.capabilities.length > 0 ? (
          <div className="sm:col-span-2">
            <FactLabel>Capabilities</FactLabel>
            <ul className="mt-1.5 space-y-1.5">
              {facts.capabilities.map((capability) => (
                <li key={capability.id} className="flex items-baseline gap-2">
                  <span
                    aria-hidden
                    className={
                      capability.supported
                        ? "text-label-13 text-green-700 dark:text-green-500"
                        : "text-label-13 text-muted-foreground"
                    }
                  >
                    {capability.supported ? "✓" : "✗"}
                  </span>
                  <span className="text-copy-14">
                    <span className="font-medium text-gray-1000">
                      {capability.title}
                    </span>
                    {capability.summary ? (
                      <span className="text-muted-foreground">
                        {" — "}
                        {capability.summary}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {officialDocsUrl ? (
        <p className="mt-4 text-label-12 text-muted-foreground">
          Derived from{" "}
          <a
            href={officialDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Eve&apos;s {title} docs
          </a>
          .
        </p>
      ) : null}
    </Surface>
  );
}

/**
 * Collapsible, clearly-attributed excerpts of the behavioral sections from
 * the eve docs (Dispatch, Delivery, HITL, …).
 */
export function IntegrationDocsExcerpts({
  facts,
  officialDocsUrl,
  title,
}: {
  facts: IntegrationDocsFacts;
  officialDocsUrl: string | null;
  title: string;
}) {
  if (facts.excerpts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-heading-24 font-semibold tracking-tight text-gray-1000">
        How it behaves
      </h2>
      <p className="mt-1.5 text-copy-14 text-muted-foreground">
        Excerpts from{" "}
        {officialDocsUrl ? (
          <a
            href={officialDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Eve&apos;s {title} docs
          </a>
        ) : (
          "the Eve docs"
        )}
        . Prefer the source when something looks out of date.
      </p>

      <div className="mt-4 space-y-1.5">
        {facts.excerpts.map((excerpt) => (
          <details
            key={excerpt.title}
            className="group rounded-lg border border-border px-3.5 py-2.5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-copy-14 font-medium text-gray-1000 [&::-webkit-details-marker]:hidden">
              {excerpt.title}
              <span
                aria-hidden
                className="text-muted-foreground transition-transform duration-200 group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <div className="pt-2 pb-1">
              <SafeMarkdown content={excerpt.markdown} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
