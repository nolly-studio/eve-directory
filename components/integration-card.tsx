import Link from "next/link";

import { IntegrationMark } from "@/components/integration-badge";
import { Badge } from "@/components/ui/badge";
import type { OfficialIntegration } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  integration: OfficialIntegration;
  agentCount: number;
  /** Match the surrounding heading hierarchy (h2 under an h1 page title). */
  headingAs?: "h2" | "h3";
}

/** Linked integration card — mark, badges, description, agent count. */
export function IntegrationCard({
  integration,
  agentCount,
  headingAs: Heading = "h3",
}: IntegrationCardProps) {
  return (
    <Link
      href={`/integrations/${integration.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-xl bg-card p-5",
        "shadow-surface transition-[box-shadow,transform,background-color] duration-200",
        "hover:shadow-surface-hover active:scale-[0.99] motion-reduce:transition-none"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <IntegrationMark slug={integration.slug} />
        {integration.badges.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {integration.badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <Heading className="mt-4 text-copy-16 font-semibold text-balance text-gray-1000 group-hover:underline group-hover:underline-offset-4">
        {integration.name}
      </Heading>
      <p className="mt-1.5 line-clamp-2 text-copy-14 text-pretty text-muted-foreground">
        {integration.description}
      </p>
      <p className="mt-auto pt-4 text-label-12 tabular-nums text-gray-700">
        {agentCount === 1 ? "1 agent" : `${agentCount} agents`}
      </p>
    </Link>
  );
}
