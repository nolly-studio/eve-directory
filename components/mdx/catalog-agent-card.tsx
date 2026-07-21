import { AgentCard } from "@/components/listing-card";
import { getAgent } from "@/lib/catalog";

/** MDX embed: live agent card from the catalog by slug. */
export async function CatalogAgentCard({ slug }: { slug: string }) {
  const agent = await getAgent(slug);

  if (!agent) {
    return (
      <p className="not-prose text-copy-14 text-muted-foreground">
        Unknown agent <code>{slug}</code>.
      </p>
    );
  }

  return (
    <div className="not-prose my-6">
      <AgentCard agent={agent} />
    </div>
  );
}
