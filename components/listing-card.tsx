import Link from "next/link";

import {
  IntegrationLogo,
  IntegrationMark,
} from "@/components/integration-badge";
import { Badge } from "@/components/ui/badge";
import type { AgentListing, ExtensionListing } from "@/lib/catalog/types";
import { getIntegrationLogo } from "@/lib/integrations/resolve";
import { integrationLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

const VISIBLE_INTEGRATIONS = 4;

function pickMarkSlug(integrations: string[]): string | undefined {
  return (
    integrations.find((slug) => getIntegrationLogo(slug)) ?? integrations[0]
  );
}

function ListingCard({
  href,
  title,
  summary,
  markSlug,
  badges,
  integrations,
}: {
  href: string;
  title: string;
  summary: string;
  markSlug?: string;
  badges?: string[];
  integrations: string[];
}) {
  const withLogos = integrations.filter((slug) => getIntegrationLogo(slug));
  const visible = withLogos.slice(0, VISIBLE_INTEGRATIONS);
  const overflow = Math.max(integrations.length - visible.length, 0);

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-xl bg-card p-5",
        "shadow-surface transition-[box-shadow,transform,background-color] duration-200",
        "hover:shadow-surface-hover active:scale-[0.99] motion-reduce:transition-none"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <IntegrationMark slug={markSlug} />
        {badges && badges.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <h3 className="mt-4 text-copy-16 font-semibold text-balance text-gray-1000 group-hover:underline group-hover:underline-offset-4">
        {title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-copy-14 text-pretty text-muted-foreground">
        {summary}
      </p>

      {visible.length > 0 ? (
        <div className="mt-auto flex items-center gap-1.5 pt-4">
          {visible.map((integration) => (
            <span
              key={integration}
              title={integrationLabel(integration)}
              className="flex size-6 items-center justify-center rounded-md bg-muted/50"
            >
              <IntegrationLogo slug={integration} className="size-3.5" />
            </span>
          ))}
          {overflow > 0 ? (
            <span className="px-0.5 text-label-12 text-gray-700 tabular-nums">
              +{overflow}
            </span>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}

export function AgentCard({ agent }: { agent: AgentListing }) {
  return (
    <ListingCard
      href={`/agents/${agent.slug}`}
      title={agent.name}
      summary={agent.summary}
      markSlug={pickMarkSlug(agent.integrations)}
      badges={[agent.category.name]}
      integrations={agent.integrations}
    />
  );
}

export function ExtensionCard({ extension }: { extension: ExtensionListing }) {
  return (
    <ListingCard
      href={`/extensions/${extension.slug}`}
      title={extension.name}
      summary={extension.summary}
      markSlug={pickMarkSlug(extension.integrations)}
      badges={["Extension"]}
      integrations={extension.integrations}
    />
  );
}
