import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  IntegrationDetail,
  IntegrationDetailBlock,
  OfficialIntegration,
} from "@/lib/catalog/types";

const CATALOG_ROOT = path.join(process.cwd(), "catalog");

interface OfficialIntegrationsFile {
  integrations: OfficialIntegration[];
}

interface IntegrationDetailsFile {
  integrations: IntegrationDetail[];
}

async function readOfficialIntegrationsFile(): Promise<OfficialIntegrationsFile> {
  const raw = await readFile(
    path.join(CATALOG_ROOT, "integrations.json"),
    "utf-8"
  );
  return JSON.parse(raw) as OfficialIntegrationsFile;
}

async function readIntegrationDetailsFile(): Promise<IntegrationDetailsFile> {
  const raw = await readFile(
    path.join(CATALOG_ROOT, "integrations-details.json"),
    "utf-8"
  );
  return JSON.parse(raw) as IntegrationDetailsFile;
}

export async function getOfficialIntegrations(): Promise<
  OfficialIntegration[]
> {
  const file = await readOfficialIntegrationsFile();
  return file.integrations.toSorted((a, b) => a.name.localeCompare(b.name));
}

export async function getOfficialIntegration(
  slug: string
): Promise<OfficialIntegration | null> {
  const integrations = await getOfficialIntegrations();
  const normalized = slug.toLowerCase();
  return (
    integrations.find((item) => item.slug.toLowerCase() === normalized) ?? null
  );
}

export async function getIntegrationDetail(
  slug: string
): Promise<IntegrationDetail | null> {
  const file = await readIntegrationDetailsFile();
  const normalized = slug.toLowerCase();
  return (
    file.integrations.find((item) => item.slug.toLowerCase() === normalized) ??
    null
  );
}

/**
 * Scraped details for a set of integration slugs (e.g. a listing's
 * `integrations`), preserving input order. Slugs without scraped
 * details are skipped.
 */
export async function getIntegrationDetails(
  slugs: string[]
): Promise<IntegrationDetail[]> {
  const file = await readIntegrationDetailsFile();
  const bySlug = new Map(
    file.integrations.map((item) => [item.slug.toLowerCase(), item])
  );

  const details: IntegrationDetail[] = [];
  for (const slug of slugs) {
    const detail = bySlug.get(slug.toLowerCase());
    if (detail) {
      details.push(detail);
    }
  }

  return details;
}

/** First Install-section paragraph from scraped details, if present. */
export function getIntegrationInstallSummary(
  detail: IntegrationDetail
): string | null {
  const install = detail.sections.find(
    (section) => section.title.toLowerCase() === "install"
  );

  if (!install) {
    return null;
  }

  const paragraph = install.blocks.find(
    (block): block is Extract<IntegrationDetailBlock, { type: "paragraph" }> =>
      block.type === "paragraph"
  );

  return paragraph?.text ?? null;
}

/**
 * Docs markdown ready for the integration detail page: drop frontmatter and
 * the leading H1 (the page already has a title), then normalize whitespace.
 */
export function getIntegrationDocsMarkdownForDisplay(
  detail: IntegrationDetail
): string | null {
  let raw = detail.docsMarkdown?.trim();
  if (!raw) {
    return null;
  }

  raw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, "").trim();
  raw = raw.replace(/^#\s+[^\n]+\n+/, "").trim();

  return `${raw}\n`;
}
