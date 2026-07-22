import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { updateCommunityAgent } from "@/app/(site)/submit/actions";
import { CommunityAgentForm } from "@/components/community-agent-form";
import { PageShell } from "@/components/page-shell";
import { getSession } from "@/lib/auth/session";
import { getCategories, getOfficialIntegrations } from "@/lib/catalog";
import { getOwnedCommunityAgent } from "@/lib/community/queries";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

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
  const [agent, categories, integrations, dbUsers] = await Promise.all([
    getOwnedCommunityAgent(id, session.user.id),
    getCategories(),
    getOfficialIntegrations(),
    db
      .select({ handle: user.handle })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1),
  ]);

  if (!agent) {
    notFound();
  }

  const authorHandle =
    dbUsers[0]?.handle ??
    ("handle" in session.user && typeof session.user.handle === "string"
      ? session.user.handle
      : undefined);

  return (
    <PageShell>
      <header className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="animate-enter mb-4 flex flex-wrap items-center gap-1.5 text-label-13 text-muted-foreground"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <Link
            href="/account"
            className="transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
          >
            My agents
          </Link>
          <span aria-hidden className="text-gray-500">
            /
          </span>
          <span className="text-foreground">Edit</span>
        </nav>

        <div
          className="animate-enter grid gap-6 md:grid-cols-2 md:gap-10"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          <div className="min-w-0">
            <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
              Edit {agent.name}
            </h1>
          </div>
          <div className="min-w-0 md:pt-1">
            <p className="text-copy-14 text-pretty text-muted-foreground md:text-copy-16">
              Updates go live immediately for published agents.
            </p>
          </div>
        </div>
      </header>

      <div
        className="animate-enter"
        style={{ "--stagger": 2 } as CSSProperties}
      >
        <CommunityAgentForm
          categories={categories}
          integrations={integrations}
          action={updateCommunityAgent}
          submitLabel="Save changes"
          authorHandle={authorHandle}
          authorImage={session.user.image}
          initial={{
            id: agent.id,
            slug: agent.slug,
            name: agent.name,
            summary: agent.summary,
            instructions: agent.instructions,
            categorySlug: agent.categorySlug,
            integrations: agent.integrations ?? [],
            files: agent.files ?? [],
          }}
        />
      </div>
    </PageShell>
  );
}
