import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { AgentsByIntegration } from "@/components/mdx/agents-by-integration";
import { CatalogAgentCard } from "@/components/mdx/catalog-agent-card";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AgentCard: CatalogAgentCard,
    AgentsByIntegration,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;
