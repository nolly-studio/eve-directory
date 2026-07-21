"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { CommandBar } from "@/components/command-bar";
import { FileRow } from "@/components/file-row";
import { HomeHeroPreview } from "@/components/home-hero-preview";
import type { PreviewTab } from "@/components/home-hero-preview";
import { EveDirectoryLogo } from "@/components/logo";
import { integrationLabel, SITE, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Audience = "humans" | "agents";

interface FeaturedAgent {
  name: string;
  slug: string;
  summary: string;
  category: string;
  integrations: string[];
}

interface HomeHeroProps {
  featuredAgent: FeaturedAgent;
}

function AudienceToggle({
  value,
  onChange,
}: {
  value: Audience;
  onChange: (next: Audience) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Audience"
      className="inline-flex items-center text-label-13 text-gray-700"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "humans"}
        onClick={() => {
          onChange("humans");
        }}
        className={cn(
          "px-1 transition-colors duration-150 motion-reduce:transition-none",
          value === "humans"
            ? "font-medium text-gray-1000"
            : "hover:text-gray-1000"
        )}
      >
        For humans
      </button>
      <span aria-hidden className="mx-2.5 h-3.5 w-px bg-border" />
      <button
        type="button"
        role="tab"
        aria-selected={value === "agents"}
        onClick={() => {
          onChange("agents");
        }}
        className={cn(
          "px-1 transition-colors duration-150 motion-reduce:transition-none",
          value === "agents"
            ? "font-medium text-gray-1000"
            : "hover:text-gray-1000"
        )}
      >
        For agents
      </button>
    </div>
  );
}

/** Miniature listing card — mirrors the real AgentCard anatomy. */
function ListingMock({ agent }: { agent: FeaturedAgent }) {
  return (
    <div className="shadow-chip rounded-lg bg-background p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-copy-14 font-semibold text-gray-1000">
          {agent.name}
        </p>
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-label-12 text-gray-700">
          {agent.category}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-copy-14 text-pretty text-gray-700">
        {agent.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {agent.integrations.slice(0, 4).map((slug) => (
          <span
            key={slug}
            className="rounded-md bg-muted px-1.5 py-0.5 text-label-12 text-gray-700"
          >
            {integrationLabel(slug)}
          </span>
        ))}
        {agent.integrations.length > 4 ? (
          <span className="px-0.5 text-label-12 text-gray-700 tabular-nums">
            +{agent.integrations.length - 4}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function PreviewCaption({ children }: { children: ReactNode }) {
  return <p className="text-label-12-mono text-gray-700">{children}</p>;
}

function humanTabs(agent: FeaturedAgent): PreviewTab[] {
  return [
    {
      id: "install",
      label: "Install",
      codeTitle: "terminal",
      code: `# Install an agent into your Eve project
npx shadcn@latest add @evedirectory/${agent.slug}

# Review the generated files, then run
npm run dev`,
      previewTitle: "your project",
      preview: (
        <>
          <PreviewCaption>eve app — tools, connections, evals…</PreviewCaption>
          <ul className="space-y-1">
            <FileRow name="agent/instructions.md" status="added" />
            <FileRow name="agent/tools/" status="added" />
            <FileRow name="agent/connections/" status="added" />
            <FileRow name="evals/" status="added" />
          </ul>
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            Full source, no lock-in — every file is yours to edit.
          </p>
        </>
      ),
    },
    {
      id: "inspect",
      label: "Inspect",
      codeTitle: `catalog/agents/${agent.slug}/agent/instructions.md`,
      code: `# ${agent.name}

${agent.summary}

## Layout
- agent/tools/ · connections/ · schedules/
- evals/ · package.json

## Setup
See SETUP.md for Connect and channels.`,
      previewTitle: `/agents/${agent.slug}`,
      preview: (
        <>
          <PreviewCaption>Listing</PreviewCaption>
          <ListingMock agent={agent} />
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            Read every file in the browser before you install anything.
          </p>
        </>
      ),
    },
    {
      id: "compose",
      label: "Compose",
      codeTitle: "POST /api/composer/export",
      code: `curl -X POST ${siteUrl("/api/composer/export")} \\
  -H "Content-Type: application/json" \\
  -d '{
    "agents": ["${agent.slug}"],
    "extensions": []
  }' \\
  -o starter.zip`,
      previewTitle: "composer",
      preview: (
        <>
          <PreviewCaption>Your stack</PreviewCaption>
          <ul className="space-y-1">
            <FileRow name={agent.slug} status="primary" />
            <FileRow name="+ add agents or extensions" muted />
          </ul>
          <PreviewCaption>Export</PreviewCaption>
          <FileRow name="starter.zip" status="ready" />
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            Pick listings, download a runnable starter. No login, no gate.
          </p>
        </>
      ),
    },
  ];
}

function agentTabs(agent: FeaturedAgent): PreviewTab[] {
  return [
    {
      id: "agents-md",
      label: "agents.md",
      codeTitle: "GET /agents.md",
      code: `# ${SITE.name}

${SITE.description}

## Instructions
1. Start with /agents.md for product context
2. Fetch guides as Markdown from /llms.mdx/<slug>
3. Install via shadcn: @evedirectory/<slug>`,
      previewTitle: "machine-readable surface",
      preview: (
        <>
          <PreviewCaption>Endpoints</PreviewCaption>
          <ul className="space-y-1">
            <FileRow name="/agents.md" status="product context" />
            <FileRow name="/llms.txt" status="guides index" muted />
            <FileRow name="/llms.mdx/<slug>" status="guide as md" muted />
          </ul>
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            The whole directory is readable without a browser session.
          </p>
        </>
      ),
    },
    {
      id: "search",
      label: "Search",
      codeTitle: "GET /api/search",
      code: `curl "${siteUrl(`/api/search?query=${encodeURIComponent(agent.name.split(" ")[0] ?? "support")}&tag=agent`)}"`,
      previewTitle: "results",
      preview: (
        <>
          <PreviewCaption>1 match</PreviewCaption>
          <ListingMock agent={agent} />
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            One index across guides, agents, extensions, and integrations.
          </p>
        </>
      ),
    },
    {
      id: "file",
      label: "File API",
      codeTitle: "GET /api/agents/…/file",
      code: `curl "${siteUrl(`/api/agents/${agent.slug}/file?path=agent/instructions.md`)}"

{
  "content": "# ${agent.name}\\n\\n${agent.summary.slice(0, 40)}…"
}`,
      previewTitle: `agent/${agent.slug}`,
      preview: (
        <>
          <PreviewCaption>Source files</PreviewCaption>
          <ul className="space-y-1">
            <FileRow name="agent/instructions.md" />
            <FileRow name="agent/tools/" muted />
            <FileRow name="agent/connections/" muted />
            <FileRow name="evals/" muted />
          </ul>
          <p className="mt-auto text-copy-14 text-pretty text-gray-700">
            Read any catalog file raw — the same source the file explorer shows.
          </p>
        </>
      ),
    },
  ];
}

export function HomeHero({ featuredAgent }: HomeHeroProps) {
  const [audience, setAudience] = useState<Audience>("humans");

  const command =
    audience === "humans"
      ? `npx shadcn@latest add @evedirectory/${featuredAgent.slug}`
      : `curl ${siteUrl("/agents.md")}`;

  const lead =
    audience === "humans"
      ? "Browse Eve agents and extensions with full source access. Compose a starter stack and export it—no login, no gate."
      : "Machine-readable catalog, guides as Markdown, and APIs for search, file reads, and composer export.";

  const tabs =
    audience === "humans" ? humanTabs(featuredAgent) : agentTabs(featuredAgent);

  const footerHref = audience === "humans" ? "/agents" : "/agents.md";
  const footerLabel =
    audience === "humans" ? "Browse all agents" : "Read agents.md";

  return (
    <section className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-16 pb-14 md:pt-24 md:pb-20 lg:pt-28">
        <div
          className="animate-enter flex flex-col items-center text-center"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <span className="sr-only">{SITE.name}</span>
          <EveDirectoryLogo className="h-9 w-auto text-gray-1000 md:h-11" />
        </div>

        <h1
          className="mt-8 max-w-3xl animate-enter text-heading-40 font-semibold text-center text-gray-1000 [--font-weight-semibold:450] md:text-heading-64"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          Open registry for Eve agents and extensions
        </h1>

        <p
          className="mt-5 max-w-2xl animate-enter text-copy-16 text-center text-gray-900 md:text-copy-18"
          style={{ "--stagger": 2 } as CSSProperties}
        >
          {lead}
        </p>

        <div
          className="mt-7 animate-enter"
          style={{ "--stagger": 3 } as CSSProperties}
        >
          <AudienceToggle value={audience} onChange={setAudience} />
        </div>

        <div
          className="mt-5 animate-enter"
          style={{ "--stagger": 4 } as CSSProperties}
        >
          <CommandBar command={command} />
        </div>

        <div
          className="mt-12 w-full max-w-5xl animate-enter md:mt-14"
          style={{ "--stagger": 5 } as CSSProperties}
        >
          <HomeHeroPreview key={audience} tabs={tabs} />
        </div>

        <div
          className="mt-8 animate-enter"
          style={{ "--stagger": 6 } as CSSProperties}
        >
          <Link
            href={footerHref}
            className="inline-flex items-center gap-1.5 text-label-13 text-gray-700 transition-colors duration-150 hover:text-gray-1000 motion-reduce:transition-none"
          >
            {footerLabel}
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={1.5}
              className="size-3.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
