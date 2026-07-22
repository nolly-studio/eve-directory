import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateCommunityAgent } from "@/app/(site)/submit/actions";
import { CommunityAgentForm } from "@/components/community-agent-form";
import { PageHeader, PageShell } from "@/components/page-shell";
import { Surface } from "@/components/ui/surface";
import { getSession } from "@/lib/auth/session";
import { getCategories, getOfficialIntegrations } from "@/lib/catalog";
import { getOwnedCommunityAgent } from "@/lib/community/queries";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Edit agent",
};

export default async function EditCommunityAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) {
    notFound();
  }

  const { id } = await params;
  const [agent, categories, integrations] = await Promise.all([
    getOwnedCommunityAgent(id, session.user.id),
    getCategories(),
    getOfficialIntegrations(),
  ]);

  if (!agent) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title={`Edit ${agent.name}`}
        description="Updates go live immediately for published agents."
      />
      <Surface className="mx-auto max-w-2xl p-6">
        <CommunityAgentForm
          categories={categories}
          integrations={integrations}
          action={updateCommunityAgent}
          submitLabel="Save changes"
          initial={{
            id: agent.id,
            slug: agent.slug,
            name: agent.name,
            summary: agent.summary,
            instructions: agent.instructions,
            categorySlug: agent.categorySlug,
            integrations: agent.integrations ?? [],
          }}
        />
      </Surface>
    </PageShell>
  );
}
