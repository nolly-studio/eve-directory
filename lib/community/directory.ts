import "server-only";
import { getAgents } from "@/lib/catalog";
import type {
  DirectoryAgent,
  OfficialDirectoryAgent,
} from "@/lib/catalog/types";
import { getPublishedCommunityAgents } from "@/lib/community/queries";

export function toOfficialDirectoryAgent(
  agent: Awaited<ReturnType<typeof getAgents>>[number]
): OfficialDirectoryAgent {
  return {
    ...agent,
    tier: "official",
  };
}

export async function getDirectoryAgents(): Promise<DirectoryAgent[]> {
  const [official, community] = await Promise.all([
    getAgents(),
    getPublishedCommunityAgents(),
  ]);

  const officialListings: DirectoryAgent[] = official.map(
    toOfficialDirectoryAgent
  );

  const communityListings: DirectoryAgent[] = community.map((agent) => ({
    ...agent,
    tier: "community" as const,
  }));

  return [...officialListings, ...communityListings];
}

export {
  communityAgentPath,
  communityRegistryPath,
  directoryAgentHref,
  directoryAgentKey,
} from "@/lib/community/paths";
