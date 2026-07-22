import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { AgentDetailHeader } from "@/components/agent-detail-header";
import { FileExplorer } from "@/components/file-explorer";
import { InstallCommand } from "@/components/install-command";
import { IntegrationSetup } from "@/components/integration-setup";
import { PageShell } from "@/components/page-shell";
import { RelatedGuides } from "@/components/related-guides";
import {
  countAuthoredFiles,
  getAgent,
  getAgents,
  getIntegrationDetails,
  listAgentFiles,
  readAgentFile,
} from "@/lib/catalog";
import { getRelatedGuidesForIntegrations } from "@/lib/docs/related-guides";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const agents = await getAgents();
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    return {};
  }

  return pageMetadata({
    description: agent.summary,
    pathname: `/agents/${agent.slug}`,
    title: `${agent.name} — Eve agent`,
  });
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Community agents live at /agents/@handle/slug (nested route).
  if (slug.startsWith("@")) {
    notFound();
  }

  const agent = await getAgent(slug);

  if (!agent) {
    notFound();
  }

  const tree = await listAgentFiles(slug);
  // Nested eve apps keep instructions under agent/; legacy flat agents at root.
  const initialFile =
    (await readAgentFile(slug, "agent/instructions.md")) ??
    (await readAgentFile(slug, "instructions.md")) ??
    (await readAgentFile(slug, "README.md"));

  if (!initialFile) {
    notFound();
  }

  const relatedGuides = getRelatedGuidesForIntegrations(agent.integrations);
  const integrationDetails = await getIntegrationDetails(agent.integrations);
  const authoredFiles = countAuthoredFiles(tree);

  return (
    <PageShell>
      <AgentDetailHeader agent={agent} authoredFiles={authoredFiles} />

      <div className="space-y-4">
        <InstallCommand slug={agent.slug} kind="agent" />
        <RelatedGuides guides={relatedGuides} />
        <AdSlot placement="agent-detail" />
      </div>

      <section className="mt-10">
        <div>
          <h2 className="text-heading-24 font-semibold text-gray-1000">
            Filesystem
          </h2>
          <p className="mt-2 text-copy-14 text-pretty text-muted-foreground">
            Browse the authored files — tools, connections, schedules, and evals
            included.
          </p>
        </div>
        <div className="mt-4">
          <FileExplorer
            slug={agent.slug}
            tree={tree}
            initialPath={initialFile.path}
            initialContent={initialFile.content}
          />
        </div>
      </section>

      {integrationDetails.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-heading-24 font-semibold text-gray-1000">
            Set up integrations
          </h2>
          <p className="mt-2 max-w-2xl text-copy-14 text-pretty text-muted-foreground">
            Work top to bottom — wire a channel so you can talk to the agent,
            then connect the services it uses. Every step is here; no need to
            leave the directory.
          </p>
          <div className="mt-5">
            <IntegrationSetup details={integrationDetails} />
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
