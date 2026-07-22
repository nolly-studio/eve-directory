import { eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AccountAgents } from "@/components/account-agents";
import { PageHeader, PageShell } from "@/components/page-shell";
import { SignInButton } from "@/components/sign-in-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";
import { getSession } from "@/lib/auth/session";
import { getAgentsForUser } from "@/lib/community/queries";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "My agents",
};

export default async function AccountPage() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <PageShell>
        <PageHeader
          title="My agents"
          description="Manage the community agents you've published."
        />
        <Surface className="mx-auto max-w-md space-y-4 p-8 text-center">
          <p className="text-copy-14 text-muted-foreground">
            Sign in with GitHub to manage your submissions.
          </p>
          <SignInButton callbackURL="/account" />
        </Surface>
      </PageShell>
    );
  }

  const [dbUser] = await db
    .select({ handle: user.handle })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const handle = dbUser?.handle ?? session.user.handle;
  const agents = await getAgentsForUser(session.user.id);

  return (
    <PageShell>
      <PageHeader
        title="My agents"
        description="Edit or unpublish your community submissions."
        action={
          <ButtonLink href="/submit" size="sm">
            Submit agent
          </ButtonLink>
        }
      />
      <AccountAgents
        agents={agents.map((agent) => ({
          editHref: `/account/${agent.id}/edit`,
          href: `/agents/@${handle}/${agent.slug}`,
          id: agent.id,
          installCount: agent.installCount,
          name: agent.name,
          slug: agent.slug,
          status: agent.status,
          summary: agent.summary,
        }))}
      />
    </PageShell>
  );
}
