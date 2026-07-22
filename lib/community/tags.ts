export const COMMUNITY_AGENTS_TAG = "community-agents";

export function communityAgentTag(handle: string, slug: string): string {
  return `community-agent:${handle}:${slug}`;
}
