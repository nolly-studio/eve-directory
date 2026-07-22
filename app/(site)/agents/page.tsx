import { AdSlot } from "@/components/ad-slot";
import { AgentsCatalog } from "@/components/agents-catalog";
import { PageHeader, PageShell } from "@/components/page-shell";
import {
  getAgents,
  getCategories,
  getOfficialIntegrations,
} from "@/lib/catalog";
import { buildIntegrationFilterOptions } from "@/lib/catalog/agent-filters";

export default async function AgentsPage() {
  const [agents, categories, officialIntegrations] = await Promise.all([
    getAgents(),
    getCategories(),
    getOfficialIntegrations(),
  ]);

  const integrations = buildIntegrationFilterOptions(
    agents,
    officialIntegrations
  );

  return (
    <PageShell>
      <PageHeader
        title="Agents"
        description="Full Eve agent directories with public source files. Inspect instructions, skills, and setup before adding to your project."
        action={
          <AdSlot placement="agents-sidebar" className="w-full max-w-xs" />
        }
      />
      <AgentsCatalog
        agents={agents}
        categories={categories}
        integrations={integrations}
      />
    </PageShell>
  );
}
