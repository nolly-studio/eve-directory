import type { Metadata } from "next";

import { CommunityAgentForm } from "@/components/community-agent-form";
import { PageHeader, PageShell } from "@/components/page-shell";
import { SignInButton } from "@/components/sign-in-button";
import { Surface } from "@/components/ui/surface";
import { getSession } from "@/lib/auth/session";
import { getCategories, getOfficialIntegrations } from "@/lib/catalog";

import { createCommunityAgent } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Submit an agent",
};

export default async function SubmitPage() {
  const session = await getSession();
  const [categories, integrations] = await Promise.all([
    getCategories(),
    getOfficialIntegrations(),
  ]);

  return (
    <PageShell>
      <PageHeader
        title="Submit an agent"
        description="Publish a community prompt agent. We generate a standard Eve starter around your instructions — no custom code required."
      />

      <Surface className="mx-auto max-w-2xl p-6">
        {session?.user ? (
          <CommunityAgentForm
            categories={categories}
            integrations={integrations}
            action={createCommunityAgent}
            submitLabel="Publish agent"
          />
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-copy-14 text-pretty text-muted-foreground">
              Sign in with GitHub to submit a community agent.
            </p>
            <SignInButton callbackURL="/submit" />
          </div>
        )}
      </Surface>
    </PageShell>
  );
}
