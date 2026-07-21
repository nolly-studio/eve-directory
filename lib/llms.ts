import { llms } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";

import { getAgents, getExtensions } from "@/lib/catalog";
import { AGENT, SITE, siteUrl } from "@/lib/site";
import { source } from "@/lib/source";

export type DocsPage = InferPageType<typeof source>;

const markdownHeaders = {
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "Content-Type": "text/markdown; charset=utf-8",
} as const;

export function markdownResponse(body: string): Response {
  return new Response(body, { headers: markdownHeaders });
}

export async function getLLMText(page: DocsPage): Promise<string> {
  const processed = await page.data.getText("processed");
  const description = page.data.description
    ? `${page.data.description}\n\n`
    : "";

  return `# ${page.data.title}

URL: ${siteUrl(page.url)}

${description}${processed}`;
}

function formatListingLine(
  name: string,
  href: string,
  summary: string
): string {
  return `- [${name}](${siteUrl(href)}): ${summary}`;
}

export async function buildLlmsTxt(): Promise<string> {
  const [agents, extensions] = await Promise.all([
    getAgents(),
    getExtensions(),
  ]);

  const docsIndex = llms(source).index();

  const agentLines = agents
    .map((agent) =>
      formatListingLine(agent.name, `/agents/${agent.slug}`, agent.summary)
    )
    .join("\n");

  const extensionLines = extensions
    .map((extension) =>
      formatListingLine(
        extension.name,
        `/extensions/${extension.slug}`,
        extension.summary
      )
    )
    .join("\n");

  return `# ${SITE.name}

> ${SITE.description}

- Full agent instructions: ${siteUrl("/agents.md")}
- Per-page guide Markdown: ${siteUrl("/llms.mdx")}/<slug>
- Human guides: ${siteUrl("/docs")}
- Composer export: POST ${siteUrl("/api/composer/export")}

## Guides

${docsIndex}

## Agents

${agentLines || "_No agents in the registry._"}

## Extensions

${extensionLines || "_No extensions in the registry._"}
`;
}

export async function buildAgentsMd(): Promise<string> {
  const [agents, extensions] = await Promise.all([
    getAgents(),
    getExtensions(),
  ]);

  const { product, instructions } = AGENT;

  const instructionLines = instructions
    .map((line, index) => `${index + 1}. ${line}`)
    .join("\n");

  const audience = product.audience.map((item) => `- ${item}`).join("\n");
  const useCases = product.useCases.map((item) => `- ${item}`).join("\n");

  const agentLines = agents
    .map((agent) =>
      formatListingLine(agent.name, `/agents/${agent.slug}`, agent.summary)
    )
    .join("\n");

  const extensionLines = extensions
    .map((extension) =>
      formatListingLine(
        extension.name,
        `/extensions/${extension.slug}`,
        extension.summary
      )
    )
    .join("\n");

  return `# ${product.name}

${product.description}

**Category:** ${product.category}

## Audience

${audience}

## Use cases

${useCases}

## Instructions for agents

${instructionLines}

## Machine-readable surfaces

- Guides index: ${siteUrl("/llms.txt")}
- Guide Markdown: ${siteUrl("/llms.mdx")}/<slug>
- Search: GET ${siteUrl("/api/search")}?query=<q>
- Agent file: GET ${siteUrl("/api/agents")}/<slug>/file?path=<relative-path>
- Composer export: POST ${siteUrl("/api/composer/export")}

## Catalog snapshot

### Agents (${agents.length})

${agentLines || "_No agents in the registry._"}

### Extensions (${extensions.length})

${extensionLines || "_No extensions in the registry._"}
`;
}
