import Link from "next/link";

import { AgentCard } from "@/components/listing-card";
import { getAgentsByIntegration } from "@/lib/catalog";
import { integrationLabel } from "@/lib/site";

/** MDX embed: agent grid filtered by integration slug. */
export async function AgentsByIntegration({ slug }: { slug: string }) {
  const agents = await getAgentsByIntegration(slug);

  if (agents.length === 0) {
    return (
      <p className="not-prose text-copy-14 text-muted-foreground">
        No catalog agents use {integrationLabel(slug)} yet.{" "}
        <Link
          href={`/integrations/${slug}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Open the directory page
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
      {agents.map((agent) => (
        <AgentCard key={agent.slug} agent={agent} />
      ))}
    </div>
  );
}
