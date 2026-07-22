import type { Metadata } from "next";

import { ComposerHeader } from "@/components/composer-header";
import { ComposerWorkspace } from "@/components/composer-workspace";
import { PageShell } from "@/components/page-shell";
import { getAgents, getExtensions } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  description:
    "Compose Eve templates into a starter project — pick agents and extensions, review the composition and required secrets, then export a runnable zip.",
  pathname: "/composer",
  title: "Compose Eve templates",
});

export default async function ComposerPage() {
  const [agents, extensions] = await Promise.all([
    getAgents(),
    getExtensions(),
  ]);

  return (
    <PageShell>
      <ComposerHeader
        agentCount={agents.length}
        extensionCount={extensions.length}
      />
      <ComposerWorkspace agents={agents} extensions={extensions} />
    </PageShell>
  );
}
