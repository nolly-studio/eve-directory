export interface Category {
  name: string;
  slug: string;
}

export interface AgentListing {
  name: string;
  slug: string;
  path: string;
  summary: string;
  version: string;
  license: string;
  category: Category;
  integrations: string[];
}

/** Community prompt-agent listing (Postgres-backed). */
export interface CommunityAgentListing {
  id: string;
  name: string;
  slug: string;
  summary: string;
  version: string;
  license: string;
  category: Category;
  integrations: string[];
  handle: string;
  authorName: string;
  authorImage: string | null;
  installCount: number;
  instructions: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OfficialDirectoryAgent = AgentListing & { tier: "official" };

export type CommunityDirectoryAgent = CommunityAgentListing & {
  tier: "community";
};

/** Unified listing for directory index / search / filters. */
export type DirectoryAgent = OfficialDirectoryAgent | CommunityDirectoryAgent;

export interface ExtensionListing {
  name: string;
  slug: string;
  path: string;
  summary: string;
  version: string;
  license: string;
  npm?: string;
  integrations: string[];
}

export interface Registry {
  schemaVersion: number;
  source: string;
  agents: AgentListing[];
  extensions: ExtensionListing[];
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

export interface AgentFileContent {
  path: string;
  content: string;
}

/** Official Eve integration card from `catalog/integrations.json`. */
export interface OfficialIntegration {
  id: string;
  slug: string;
  name: string;
  href: string;
  description: string;
  category: "channel" | "connection" | "extension";
  badges: string[];
}

export type IntegrationDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string };

export interface IntegrationDetailSection {
  title: string;
  blocks: IntegrationDetailBlock[];
}

/** Scraped eve.dev integration page from `catalog/integrations-details.json`. */
export interface IntegrationDetail {
  slug: string;
  sourceUrl: string;
  name: string;
  description: string;
  badge: string | null;
  docsHref: string | null;
  docsUrl: string | null;
  sections: IntegrationDetailSection[];
  markdown: string;
}
