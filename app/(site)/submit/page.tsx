import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

import { CommunityAgentForm } from "@/components/community-agent-form";
import { PageShell } from "@/components/page-shell";
import { SignInButton } from "@/components/sign-in-button";
import { Surface } from "@/components/ui/surface";
import { getSession } from "@/lib/auth/session";
import { getCategories, getOfficialIntegrations } from "@/lib/catalog";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

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

  let authorHandle: string | undefined;
  if (session?.user) {
    const [dbUser] = await db
      .select({ handle: user.handle })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    authorHandle =
      dbUser?.handle ??
      ("handle" in session.user && typeof session.user.handle === "string"
        ? session.user.handle
        : undefined);
  }

  return (
    <PageShell>
      <header className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="animate-enter mb-4 flex flex-wrap items-center gap-1.5 text-label-13 text-muted-foreground"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <Link
            href="/agents"
            className="transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
          >
            Agents
          </Link>
          <span aria-hidden className="text-gray-500">
            /
          </span>
          <span className="text-foreground">Submit</span>
        </nav>

        <div
          className="animate-enter grid gap-6 md:grid-cols-2 md:gap-10"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          <div className="min-w-0">
            <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
              Submit an agent
            </h1>
          </div>
          <div className="min-w-0 md:pt-1">
            <p className="text-copy-14 text-pretty text-muted-foreground md:text-copy-16">
              Publish a community prompt agent. We wrap your instructions in a
              standard Eve starter - no custom code required.
            </p>
          </div>
        </div>

        <dl
          className="animate-enter mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:grid-cols-4"
          style={{ "--stagger": 2 } as CSSProperties}
        >
          <div>
            <dt className="text-label-12 text-muted-foreground">Tier</dt>
            <dd className="mt-1 text-label-13 text-foreground">Community</dd>
          </div>
          <div>
            <dt className="text-label-12 text-muted-foreground">Format</dt>
            <dd className="mt-1 text-label-13 text-foreground">Prompt agent</dd>
          </div>
          <div>
            <dt className="text-label-12 text-muted-foreground">Installs as</dt>
            <dd className="mt-1 font-mono text-label-13 text-foreground">
              Eve starter
            </dd>
          </div>
          <div>
            <dt className="text-label-12 text-muted-foreground">Visibility</dt>
            <dd className="mt-1 text-label-13 text-foreground">Public</dd>
          </div>
        </dl>
      </header>

      <div
        className="animate-enter"
        style={{ "--stagger": 3 } as CSSProperties}
      >
        {session?.user ? (
          <CommunityAgentForm
            categories={categories}
            integrations={integrations}
            action={createCommunityAgent}
            submitLabel="Publish agent"
            authorHandle={authorHandle}
            authorImage={session.user.image}
          />
        ) : (
          <Surface className="mx-auto max-w-lg p-8 sm:p-10">
            <h2 className="text-heading-24 font-semibold text-balance text-gray-1000">
              Sign in to publish
            </h2>
            <p className="mt-2 text-copy-14 text-pretty text-muted-foreground">
              Community agents publish under your GitHub handle so others can
              install and credit your work.
            </p>
            <div className="mt-6">
              <SignInButton callbackURL="/submit" />
            </div>
          </Surface>
        )}
      </div>
    </PageShell>
  );
}
