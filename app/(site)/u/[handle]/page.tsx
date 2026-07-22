import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AgentCard } from "@/components/listing-card";
import { PageHeader, PageShell } from "@/components/page-shell";
import { Surface } from "@/components/ui/surface";
import {
  getCommunityAgentsByHandle,
  getCommunityAuthor,
} from "@/lib/community/queries";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

function normalizeHandle(raw: string): string {
  return decodeURIComponent(raw).replace(/^@/, "").toLowerCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle: raw } = await params;
  const handle = normalizeHandle(raw);
  const author = await getCommunityAuthor(handle);

  if (!author) {
    return { title: "Profile" };
  }

  return pageMetadata({
    description: `Community Eve agents by @${author.handle} on ${SITE.name}.`,
    pathname: `/u/${author.handle}`,
    title: `@${author.handle}`,
  });
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: raw } = await params;
  const handle = normalizeHandle(raw);
  const [author, agents] = await Promise.all([
    getCommunityAuthor(handle),
    getCommunityAgentsByHandle(handle),
  ]);

  if (!author) {
    notFound();
  }

  const totalInstalls = agents.reduce(
    (sum, agent) => sum + agent.installCount,
    0
  );

  return (
    <PageShell>
      <PageHeader
        title={`@${author.handle}`}
        description={
          agents.length > 0
            ? `${agents.length} published agent${agents.length === 1 ? "" : "s"} · ${totalInstalls} installs`
            : "No published community agents yet."
        }
      />

      <Surface className="mb-8 flex items-center gap-4 p-5">
        {author.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar
          <img
            src={author.image}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-full bg-muted text-copy-16 font-medium">
            {(author.name || author.handle).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-copy-16 font-semibold text-gray-1000">
            {author.name}
          </p>
          <p className="text-label-13 text-muted-foreground">
            <a
              href={`https://github.com/${author.handle}`}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              github.com/{author.handle}
            </a>
          </p>
        </div>
      </Surface>

      {agents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={{
                ...agent,
                tier: "community",
              }}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-copy-14 text-muted-foreground">
          <Link href="/submit" className="underline underline-offset-4">
            Submit an agent
          </Link>{" "}
          to appear here.
        </p>
      )}
    </PageShell>
  );
}
