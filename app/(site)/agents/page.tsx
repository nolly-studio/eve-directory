import { AdSlot } from "@/components/ad-slot";
import { AgentCard } from "@/components/listing-card";
import { PageHeader, PageShell } from "@/components/page-shell";
import { getAgents } from "@/lib/catalog";

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <PageShell>
      <PageHeader
        title="Agents"
        description="Full Eve agent directories with public source files. Inspect instructions, skills, and setup before adding to your project."
        action={
          <AdSlot placement="agents-sidebar" className="w-full max-w-xs" />
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
    </PageShell>
  );
}
