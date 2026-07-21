import { source } from "@/lib/source";

export interface RelatedGuide {
  title: string;
  url: string;
  description?: string;
}

/**
 * Guides related to a set of integration slugs.
 * Prefers `/docs/integrations/<slug>` recipe pages when present, plus the
 * integrations index when the listing uses any integrations.
 */
export function getRelatedGuidesForIntegrations(
  integrations: string[]
): RelatedGuide[] {
  if (integrations.length === 0) {
    return [];
  }

  const guides: RelatedGuide[] = [];
  const seen = new Set<string>();

  const push = (page: NonNullable<ReturnType<typeof source.getPage>>) => {
    if (seen.has(page.url)) {
      return;
    }

    seen.add(page.url);
    guides.push({
      description: page.data.description,
      title: page.data.title,
      url: page.url,
    });
  };

  const index = source.getPage(["integrations"]);
  if (index) {
    push(index);
  }

  for (const slug of integrations) {
    const page = source.getPage(["integrations", slug.toLowerCase()]);
    if (page) {
      push(page);
    }
  }

  return guides;
}

/** Local guide URL for an integration, if authored under content/docs. */
export function getIntegrationGuideUrl(slug: string): string | null {
  const recipe = source.getPage(["integrations", slug.toLowerCase()]);
  if (recipe) {
    return recipe.url;
  }

  const index = source.getPage(["integrations"]);
  return index?.url ?? null;
}
