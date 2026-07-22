import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AgentCard } from "@/components/listing-card";
import { PageShell } from "@/components/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getAgentsByCategory, getCategories } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {};
  }

  return pageMetadata({
    description: `Eve agents in ${category.name}. Inspect source, compose a starter template, and install into a Vercel Eve project.`,
    pathname: `/categories/${category.slug}`,
    title: `${category.name} Eve agents`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const agents = await getAgentsByCategory(slug);

  return (
    <PageShell>
      <ButtonLink href="/agents" variant="ghost" size="sm">
        All agents
      </ButtonLink>
      <h1 className="mt-4 text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
        {category.name}
      </h1>
      <p className="mt-2 text-body text-muted-foreground">
        <span className="tabular-nums">{agents.length}</span> agent
        {agents.length === 1 ? "" : "s"}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
    </PageShell>
  );
}
