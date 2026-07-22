import type { DirectoryAgent, OfficialIntegration } from "@/lib/catalog/types";
import { integrationLabel } from "@/lib/site";

export type IntegrationFilterCategory =
  | "channel"
  | "connection"
  | "extension"
  | "other";

export interface IntegrationFilterOption {
  slug: string;
  name: string;
  category: IntegrationFilterCategory;
  badge: string;
}

const CATEGORY_ORDER: IntegrationFilterCategory[] = [
  "channel",
  "connection",
  "extension",
  "other",
];

const CATEGORY_LABELS: Record<IntegrationFilterCategory, string> = {
  channel: "Channels",
  connection: "Connections",
  extension: "Extensions",
  other: "Other",
};

const CATEGORY_BADGES: Record<IntegrationFilterCategory, string> = {
  channel: "Channel",
  connection: "Connection",
  extension: "Extension",
  other: "Integration",
};

function asFilterCategory(
  value: OfficialIntegration["category"] | undefined
): IntegrationFilterCategory {
  if (!value) {
    return "other";
  }

  switch (value) {
    case "channel":
    case "connection":
    case "extension": {
      return value;
    }
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

/** Build integration filter options from agents + official catalog metadata. */
export function buildIntegrationFilterOptions(
  agents: Pick<DirectoryAgent, "integrations">[],
  official: OfficialIntegration[]
): IntegrationFilterOption[] {
  const used = new Set<string>();

  for (const agent of agents) {
    for (const slug of agent.integrations) {
      used.add(slug.toLowerCase());
    }
  }

  const bySlug = new Map(
    official.map((item) => [item.slug.toLowerCase(), item] as const)
  );

  const options: IntegrationFilterOption[] = [];

  for (const slug of used) {
    const meta = bySlug.get(slug);
    const category = asFilterCategory(meta?.category);

    options.push({
      badge: meta?.badges[0] ?? CATEGORY_BADGES[category],
      category,
      name: meta?.name ?? integrationLabel(slug),
      slug,
    });
  }

  return options.toSorted((a, b) => {
    const categoryDelta =
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (categoryDelta !== 0) {
      return categoryDelta;
    }
    return a.name.localeCompare(b.name);
  });
}

export function groupIntegrationFilterOptions(
  options: IntegrationFilterOption[]
): {
  category: IntegrationFilterCategory;
  label: string;
  items: IntegrationFilterOption[];
}[] {
  const groups: {
    category: IntegrationFilterCategory;
    label: string;
    items: IntegrationFilterOption[];
  }[] = [];

  for (const category of CATEGORY_ORDER) {
    const items = options.filter((item) => item.category === category);
    if (items.length === 0) {
      continue;
    }
    groups.push({
      category,
      items,
      label: CATEGORY_LABELS[category],
    });
  }

  return groups;
}

export type AgentTierFilter = "all" | "official" | "community";

export function filterAgents({
  agents,
  query,
  categorySlug,
  integrationSlug,
  tier = "all",
}: {
  agents: DirectoryAgent[];
  query: string;
  categorySlug: string | null;
  integrationSlug: string | null;
  tier?: AgentTierFilter;
}): DirectoryAgent[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedIntegration = integrationSlug?.toLowerCase() ?? null;

  return agents.filter((agent) => {
    if (tier !== "all" && agent.tier !== tier) {
      return false;
    }

    if (categorySlug && agent.category.slug !== categorySlug) {
      return false;
    }

    if (
      normalizedIntegration &&
      !agent.integrations.some(
        (item) => item.toLowerCase() === normalizedIntegration
      )
    ) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const handle = agent.tier === "community" ? agent.handle : "";
    const haystack = [
      agent.name,
      agent.summary,
      agent.category.name,
      handle,
      ...agent.integrations.map((item) => integrationLabel(item)),
      ...agent.integrations,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
