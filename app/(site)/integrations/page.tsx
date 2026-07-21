import { IntegrationCard } from "@/components/integration-card";
import { PageHeader, PageShell } from "@/components/page-shell";
import { getAgents, getOfficialIntegrations } from "@/lib/catalog";

export default async function IntegrationsPage() {
  const [integrations, agents] = await Promise.all([
    getOfficialIntegrations(),
    getAgents(),
  ]);

  const withCounts = integrations.map((integration) => {
    const slug = integration.slug.toLowerCase();
    const agentCount = agents.filter((agent) =>
      agent.integrations.some((item) => item.toLowerCase() === slug)
    ).length;

    return { agentCount, integration };
  });

  return (
    <PageShell>
      <PageHeader
        title="Integrations"
        description="Official Eve channels and connections. Open a page for setup context and the agents that use it."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {withCounts.map(({ agentCount, integration }) => (
          <IntegrationCard
            key={integration.slug}
            integration={integration}
            agentCount={agentCount}
            headingAs="h2"
          />
        ))}
      </div>
    </PageShell>
  );
}
