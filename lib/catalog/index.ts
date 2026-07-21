import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

import {
  getOfficialIntegration,
  getOfficialIntegrations,
} from "./integrations";
import type {
  AgentFileContent,
  AgentListing,
  Category,
  ExtensionListing,
  FileTreeNode,
  Registry,
} from "./types";

export {
  getIntegrationDetail,
  getIntegrationDetails,
  getIntegrationInstallSummary,
  getOfficialIntegration,
  getOfficialIntegrations,
} from "./integrations";

const CATALOG_ROOT = path.join(process.cwd(), "catalog");

/** Local install / eve compile noise — never show or export these. */
const EXCLUDED_CATALOG_DIRS = new Set([
  "node_modules",
  ".eve",
  ".output",
  ".cache",
  ".git",
  "var",
]);

const EXCLUDED_CATALOG_FILES = new Set([
  ".DS_Store",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "skills-lock.json",
]);

async function readRegistry(): Promise<Registry> {
  const raw = await readFile(path.join(CATALOG_ROOT, "registry.json"), "utf-8");
  return JSON.parse(raw) as Registry;
}

export function getRegistry(): Promise<Registry> {
  return readRegistry();
}

export async function getAgents(): Promise<AgentListing[]> {
  const registry = await readRegistry();
  return registry.agents;
}

export async function getAgent(slug: string): Promise<AgentListing | null> {
  const registry = await readRegistry();
  return registry.agents.find((agent) => agent.slug === slug) ?? null;
}

export async function getExtensions(): Promise<ExtensionListing[]> {
  const registry = await readRegistry();
  return registry.extensions;
}

export async function getExtension(
  slug: string
): Promise<ExtensionListing | null> {
  const registry = await readRegistry();
  return (
    registry.extensions.find((extension) => extension.slug === slug) ?? null
  );
}

export async function getCategories(): Promise<Category[]> {
  const agents = await getAgents();
  const seen = new Map<string, Category>();

  for (const agent of agents) {
    seen.set(agent.category.slug, agent.category);
  }

  return [...seen.values()].toSorted((a, b) => a.name.localeCompare(b.name));
}

export async function getAgentsByCategory(
  categorySlug: string
): Promise<AgentListing[]> {
  const agents = await getAgents();
  return agents.filter((agent) => agent.category.slug === categorySlug);
}

export async function getAgentsByIntegration(
  integration: string
): Promise<AgentListing[]> {
  const agents = await getAgents();
  const normalized = integration.toLowerCase();
  return agents.filter((agent) =>
    agent.integrations.some((item) => item.toLowerCase() === normalized)
  );
}

/** Integration slugs referenced by catalog agents/extensions. */
export async function getIntegrations(): Promise<string[]> {
  const agents = await getAgents();
  const extensions = await getExtensions();
  const integrations = new Set<string>();

  for (const agent of agents) {
    for (const integration of agent.integrations) {
      integrations.add(integration);
    }
  }

  for (const extension of extensions) {
    for (const integration of extension.integrations) {
      integrations.add(integration);
    }
  }

  return [...integrations].toSorted((a, b) => a.localeCompare(b));
}

/**
 * Slugs with a directory page: official Eve integrations union
 * integrations referenced by catalog listings.
 */
export async function getIntegrationDirectorySlugs(): Promise<string[]> {
  const [official, catalogUsed] = await Promise.all([
    getOfficialIntegrations(),
    getIntegrations(),
  ]);

  const slugs = new Set<string>();

  for (const item of official) {
    slugs.add(item.slug.toLowerCase());
  }

  for (const slug of catalogUsed) {
    slugs.add(slug.toLowerCase());
  }

  return [...slugs].toSorted((a, b) => a.localeCompare(b));
}

export async function resolveIntegrationPage(slug: string): Promise<{
  official: Awaited<ReturnType<typeof getOfficialIntegration>>;
  catalogUsed: boolean;
} | null> {
  const normalized = slug.toLowerCase();
  const [official, catalogUsed] = await Promise.all([
    getOfficialIntegration(normalized),
    getIntegrations(),
  ]);

  const used = catalogUsed.some((item) => item.toLowerCase() === normalized);

  if (!official && !used) {
    return null;
  }

  return { catalogUsed: used, official };
}

function resolveAgentPath(agentPath: string, relativePath: string): string {
  const agentRoot = path.join(CATALOG_ROOT, agentPath);
  const resolved = path.resolve(agentRoot, relativePath);

  if (!resolved.startsWith(agentRoot)) {
    throw new Error("Invalid file path");
  }

  return resolved;
}

async function buildFileTree(
  directoryPath: string,
  relativeRoot: string
): Promise<FileTreeNode[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nodes: FileTreeNode[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_CATALOG_DIRS.has(entry.name)) {
        continue;
      }

      const entryPath = path.join(directoryPath, entry.name);
      const relativePath = path.join(relativeRoot, entry.name);

      nodes.push({
        children: await buildFileTree(entryPath, relativePath),
        name: entry.name,
        path: relativePath.replaceAll("\\", "/"),
        type: "directory",
      });
      continue;
    }

    if (EXCLUDED_CATALOG_FILES.has(entry.name)) {
      continue;
    }

    if (entry.name.endsWith(".tsbuildinfo")) {
      continue;
    }

    const relativePath = path.join(relativeRoot, entry.name);

    nodes.push({
      name: entry.name,
      path: relativePath.replaceAll("\\", "/"),
      type: "file",
    });
  }

  return nodes.toSorted((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

export async function listAgentFiles(slug: string): Promise<FileTreeNode[]> {
  const agent = await getAgent(slug);

  if (!agent) {
    return [];
  }

  const agentRoot = path.join(CATALOG_ROOT, agent.path);
  return buildFileTree(agentRoot, "");
}

export { countAuthoredFiles, flattenFileTree } from "./tree";

export async function readAgentFile(
  slug: string,
  filePath: string
): Promise<AgentFileContent | null> {
  const agent = await getAgent(slug);

  if (!agent) {
    return null;
  }

  const resolved = resolveAgentPath(agent.path, filePath);
  const fileStat = await stat(resolved).catch(() => null);

  if (!fileStat?.isFile()) {
    return null;
  }

  const content = await readFile(resolved, "utf-8");

  return {
    content,
    path: filePath.replaceAll("\\", "/"),
  };
}

export async function readAllAgentFiles(
  slug: string
): Promise<AgentFileContent[]> {
  const tree = await listAgentFiles(slug);
  const files: AgentFileContent[] = [];

  async function walk(nodes: FileTreeNode[]) {
    for (const node of nodes) {
      if (node.type === "directory" && node.children) {
        await walk(node.children);
        continue;
      }

      if (node.type === "file") {
        const file = await readAgentFile(slug, node.path);
        if (file) {
          files.push(file);
        }
      }
    }
  }

  await walk(tree);
  return files;
}

export async function readExtensionReadme(
  slug: string
): Promise<string | null> {
  const extension = await getExtension(slug);

  if (!extension) {
    return null;
  }

  const readmePath = path.join(CATALOG_ROOT, extension.path, "README.md");

  try {
    return await readFile(readmePath, "utf-8");
  } catch {
    return null;
  }
}
