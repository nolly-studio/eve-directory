export const SITE = {
  aisdkUrl:
    "https://aisdkagents.com?utm_source=evedirectory&utm_medium=web&utm_campaign=cta",
  description:
    "Open registry of Eve agents and templates for Vercel Eve. Inspect every file with no login, compose a starter stack, install via shadcn.",
  /** Apex hostname for display, email, and brand copy. */
  domain: "evedirectory.com",
  github: {
    owner: "nolly-studio",
    repo: "eve-directory",
  },
  name: "Eve Directory",
  /** Default document title (home); inner pages use the `%s · name` template. */
  title: "Eve agents & templates for Vercel Eve",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

/** Primary chrome nav (header + Fumadocs docs layout). */
export const NAV_LINKS: readonly NavLink[] = [
  { href: "/agents", label: "Agents" },
  { href: "/integrations", label: "Integrations" },
  { href: "/composer", label: "Composer" },
] as const;

/** Footer links — primary nav, catalog hubs, plus legal. */
export const FOOTER_LINKS: readonly NavLink[] = [
  ...NAV_LINKS,
  { href: "/extensions", label: "Extensions" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

/**
 * Structured product + usage instructions for `/agents.md`.
 * Keep this the single source of truth for how agents should use the site.
 */
export const AGENT = {
  instructions: [
    "Start with /agents.md for product context, then /llms.txt for the guides index.",
    "Fetch individual guides as Markdown from /llms.mdx/<slug> (same slugs as /docs/<slug>).",
    "Browse the live catalog at /agents and /extensions; open /agents/<slug> to inspect files.",
    "Filter by category at /categories/<slug> or by integration at /integrations/<name>.",
    'To export a starter project, POST /api/composer/export with JSON body { "agents": string[], "extensions": string[] }. At least one agent slug is required; the first agent becomes the primary package root.',
    "Read individual agent files via GET /api/agents/<slug>/file?path=<relative-path>.",
    "Search guides, agents, extensions, and integrations via GET /api/search?query=<q> (optional tag=guide|agent|extension|integration).",
    "Install agents via shadcn: npx shadcn@latest registry add @evedirectory=https://www.evedirectory.com/r/{name}.json then npx shadcn@latest add @evedirectory/<slug>. Item JSON is also at /r/<slug>.json.",
    "Community prompt agents can be submitted at /submit (GitHub sign-in). They install from /r/@handle/slug.json.",
    "Official agents remain under /agents/<slug> and /r/<slug>.json; community agents use /agents/@handle/slug.",
  ],
  product: {
    audience: [
      "developers building Eve agents",
      "teams composing starter stacks from curated agents and extensions",
    ],
    category: "Agent directory",
    description: SITE.description,
    name: SITE.name,
    useCases: [
      "Browse and inspect Eve agent source file-by-file",
      "Find agents by category or integration",
      "Compose agents and extensions into an exportable starter project",
      "Read guides at /docs (also available as Markdown for LLMs)",
    ],
  },
} as const;

/** Canonical public origin (www). Apex should 301 here. */
export function siteOrigin(): string {
  return `https://www.${SITE.domain}`;
}

export function siteUrl(pathname = "/"): string {
  if (pathname === "/") {
    return siteOrigin();
  }
  return `${siteOrigin()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function githubUrl(): string {
  return `https://github.com/${SITE.github.owner}/${SITE.github.repo}`;
}

/** Browse a catalog path on GitHub (`agents/<slug>` → `catalog/agents/<slug>`). */
export function githubCatalogUrl(catalogPath: string): string {
  const normalized = catalogPath.replace(/^\//, "");
  return `${githubUrl()}/tree/main/catalog/${normalized}`;
}

/** One-prompt setup copy for Cursor / coding agents (mirrors eve.dev templates). */
export function agentSetupPrompt(name: string, sourceHref: string): string {
  return `Set up the eve ${name} agent in my current workspace using ${sourceHref} as the source. Copy the project files, install its dependencies, and follow the repository README to configure it. Preserve the existing project if the workspace is not empty, and tell me about any required environment variables or manual setup steps.`;
}

export function integrationLabel(slug: string): string {
  const labels: Record<string, string> = {
    "chat-sdk-gchat": "Google Chat",
    "chat-sdk-messenger": "Messenger",
    "chat-sdk-whatsapp": "WhatsApp",
    "chat-sdk-x": "X",
    datadog: "Datadog",
    eve: "Eve",
    github: "GitHub",
    honeycomb: "Honeycomb",
    linear: "Linear",
    notion: "Notion",
    openapi: "OpenAPI",
    posthog: "PostHog",
    sentry: "Sentry",
    slack: "Slack",
    teams: "Microsoft Teams",
    ticktick: "TickTick",
  };

  return (
    labels[slug] ??
    slug.replaceAll("-", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase())
  );
}
