import type { DirectoryAgent } from "@/lib/catalog/types";

export function directoryAgentHref(agent: DirectoryAgent): string {
  switch (agent.tier) {
    case "official": {
      return `/agents/${agent.slug}`;
    }
    case "community": {
      return `/agents/@${agent.handle}/${agent.slug}`;
    }
    default: {
      const _exhaustive: never = agent;
      return _exhaustive;
    }
  }
}

export function directoryAgentKey(agent: DirectoryAgent): string {
  switch (agent.tier) {
    case "official": {
      return `official:${agent.slug}`;
    }
    case "community": {
      return `community:${agent.handle}:${agent.slug}`;
    }
    default: {
      const _exhaustive: never = agent;
      return _exhaustive;
    }
  }
}

export function communityAgentPath(handle: string, slug: string): string {
  const normalized = handle.replace(/^@/, "");
  return `/agents/@${normalized}/${slug}`;
}

export function communityRegistryPath(handle: string, slug: string): string {
  const normalized = handle.replace(/^@/, "");
  return `/r/@${normalized}/${slug}.json`;
}
