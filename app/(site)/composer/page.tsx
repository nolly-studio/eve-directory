import type { Metadata } from "next";

import { ComposerHeader } from "@/components/composer-header";
import { ComposerWorkspace } from "@/components/composer-workspace";
import { PageShell } from "@/components/page-shell";
import { getAgents, getExtensions } from "@/lib/catalog";

export const metadata: Metadata = {
  description:
    "Assemble a starter Eve project — pick agents and extensions, review the composition and required secrets, then export a runnable zip.",
  title: "Composer",
};

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
