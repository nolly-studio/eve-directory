import type { Metadata } from "next";

import { AdSlot } from "@/components/ad-slot";
import { AgentsCatalog } from "@/components/agents-catalog";
import { PageHeader, PageShell } from "@/components/page-shell";
import { getCategories, getOfficialIntegrations } from "@/lib/catalog";
import { buildIntegrationFilterOptions } from "@/lib/catalog/agent-filters";
import { getDirectoryAgents } from "@/lib/community/directory";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  description:
    "Browse Eve agents you can inspect file-by-file and install into a Vercel Eve project. No login required for official listings.",
  pathname: "/agents",
  title: "Eve agents",
});

export default async function AgentsPage() {
  const [agents, categories, officialIntegrations] = await Promise.all([
    getDirectoryAgents(),
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
        description="Official Eve agents plus community prompt agents. Inspect instructions and install with one command."
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
