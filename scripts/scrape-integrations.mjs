#!/usr/bin/env node
/**
 * Scrape official eve.dev integration detail pages into a structured JSON file.
 *
 * Reads slugs from catalog/integrations.json and fetches:
 *   https://eve.dev/integrations/<slug>
 *   https://eve.dev/docs/.../<slug>.md  (via each page's docs link)
 *
 * Usage:
 *   node scripts/scrape-integrations.mjs
 *   node scripts/scrape-integrations.mjs --slug slack
 *   node scripts/scrape-integrations.mjs --out catalog/integrations-details.json
 *   node scripts/scrape-integrations.mjs --concurrency 4 --delay 150
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = import.meta.dirname;
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_CATALOG = path.join(ROOT, "catalog/integrations.json");
const DEFAULT_OUT = path.join(ROOT, "catalog/integrations-details.json");
const BASE_URL = "https://eve.dev";

/** @typedef {{ type: "paragraph", text: string }} ParagraphBlock */
/** @typedef {{ type: "code", language: string, code: string }} CodeBlock */
/** @typedef {ParagraphBlock | CodeBlock} ContentBlock */
/** @typedef {{ title: string, blocks: ContentBlock[] }} Section */
/** @typedef {{
 *   slug: string
 *   sourceUrl: string
 *   scrapedAt: string
 *   name: string
 *   description: string
 *   badge: string | null
 *   docsHref: string | null
 *   docsUrl: string | null
 *   docsMarkdown: string | null
 *   sections: Section[]
 *   markdown: string
 * }} ScrapedIntegration */

const DOCS_FOOTER_RE =
  /\n---\s*\n+For a semantic overview of all documentation[\s\S]*$/;
const DOCS_FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n+/;

/**
 * Strip agent-facing footer boilerplate and rewrite relative docs links to
 * absolute eve.dev URLs so they work when mirrored on this site.
 *
 * @param {string} markdown
 * @param {string | null} docsHref e.g. `/docs/channels/discord`
 */
function cleanDocsMarkdown(markdown, docsHref) {
  let text = markdown.replaceAll("\r\n", "\n").trim();
  text = text.replace(DOCS_FRONTMATTER_RE, "").trim();
  text = text.replace(DOCS_FOOTER_RE, "").trim();

  const docsDir = docsHref
    ? path.posix.dirname(docsHref.replace(/\.md$/i, ""))
    : "/docs";

  text = text.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (match, label, href) => {
      if (/^(https?:|mailto:|#)/i.test(href)) {
        return match;
      }

      const withoutMd = href.replace(/\.md$/i, "");
      let resolvedPath;
      if (withoutMd.startsWith("/")) {
        resolvedPath = withoutMd;
      } else {
        resolvedPath = path.posix.normalize(
          path.posix.join(docsDir, withoutMd)
        );
      }

      if (!resolvedPath.startsWith("/")) {
        resolvedPath = `/${resolvedPath}`;
      }

      return `[${label}](${BASE_URL}${resolvedPath})`;
    }
  );

  return `${text}\n`;
}

/**
 * @param {string} docsUrl
 * @param {string | null} docsHref
 * @returns {Promise<string | null>}
 */
async function fetchDocsMarkdown(docsUrl, docsHref) {
  const url = `${docsUrl}.md`;
  const response = await fetch(url, {
    headers: {
      accept: "text/markdown,text/plain,*/*",
      "user-agent":
        "eve-directory-scraper/1.0 (+https://github.com/nolly-studio/eve-directory)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return cleanDocsMarkdown(await response.text(), docsHref);
}

function parseArgs(argv) {
  /** @type {{
   *   catalog: string
   *   out: string
   *   slug: string | null
   *   concurrency: number
   *   delay: number
   *   dryRun: boolean
   * }} */
  const opts = {
    catalog: DEFAULT_CATALOG,
    concurrency: 4,
    delay: 150,
    dryRun: false,
    out: DEFAULT_OUT,
    slug: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--catalog": {
        opts.catalog = path.resolve(argv[++i] ?? "");
        break;
      }
      case "--out": {
        opts.out = path.resolve(argv[++i] ?? "");
        break;
      }
      case "--slug": {
        opts.slug = argv[++i] ?? null;
        break;
      }
      case "--concurrency": {
        opts.concurrency = Number(argv[++i] ?? opts.concurrency);
        break;
      }
      case "--delay": {
        opts.delay = Number(argv[++i] ?? opts.delay);
        break;
      }
      case "--dry-run": {
        opts.dryRun = true;
        break;
      }
      case "--help":
      case "-h": {
        printHelp();
        process.exit(0);
        break;
      }
      default: {
        if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
    }
  }

  if (!Number.isFinite(opts.concurrency) || opts.concurrency < 1) {
    throw new Error("--concurrency must be a positive number");
  }
  if (!Number.isFinite(opts.delay) || opts.delay < 0) {
    throw new Error("--delay must be a non-negative number");
  }

  return opts;
}

function printHelp() {
  console.log(`Usage: node scripts/scrape-integrations.mjs [options]

Options:
  --catalog <path>     Integrations index (default: catalog/integrations.json)
  --out <path>         Output JSON (default: catalog/integrations-details.json)
  --slug <slug>        Scrape a single integration
  --concurrency <n>    Parallel fetches (default: 4)
  --delay <ms>         Delay between starting fetches (default: 150)
  --dry-run            Parse and print counts; do not write
  -h, --help           Show help
`);
}

function decodeEntities(text) {
  return text
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll(/&#x27;/gi, "'")
    .replaceAll(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCodePoint(Number.parseInt(n, 16))
    );
}

/**
 * @param {string} html
 * @param {{ collapseWhitespace?: boolean }} [options]
 */
function stripTags(html, options = {}) {
  const collapseWhitespace = options.collapseWhitespace ?? true;
  let text = decodeEntities(
    html
      .replaceAll(/<br\s*\/?>/gi, "\n")
      .replaceAll(/<\/(p|div|li|h\d|tr)>/gi, "\n")
      .replaceAll(/<[^>]+>/g, "")
  );
  if (collapseWhitespace) {
    text = text
      .replaceAll(/[ \t]+\n/g, "\n")
      .replaceAll(/\n{3,}/g, "\n\n")
      .replaceAll(/[ \t]{2,}/g, " ")
      .trim();
  } else {
    text = text.replace(/^\n+/, "").replace(/\n+$/, "");
  }
  return text;
}

function stripCodeLine(html) {
  // Preserve indentation; only decode entities and drop tags.
  return decodeEntities(html.replaceAll(/<[^>]+>/g, "")).replaceAll(
    /\s+$/g,
    ""
  );
}

/**
 * Extract innermost matching tag content. Naive but enough for these pages
 * (no nested same-tag for the selectors we use).
 */
function extractMain(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match?.[1] ?? "";
}

/**
 * @param {string} html
 * @returns {{ name: string, description: string, badge: string | null, docsHref: string | null }}
 */
function extractHeader(mainHtml) {
  const h1 = mainHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const badge = mainHtml.match(
    /<span class="rounded-full[^"]*"[^>]*>([\s\S]*?)<\/span>/i
  );
  const description = mainHtml.match(
    /<p class="text-gray-900 text-lg">([\s\S]*?)<\/p>/i
  );
  // Prefer the "Read the full … docs" link in the header
  const docs =
    mainHtml.match(
      /<a[^>]+href="(\/docs\/[^"]+)"[^>]*>[\s\S]*?Read the full/i
    ) ?? mainHtml.match(/href="(\/docs\/[^"]+)"/i);

  return {
    badge: badge ? stripTags(badge[1]) : null,
    description: description ? stripTags(description[1]) : "",
    docsHref: docs?.[1] ?? null,
    name: h1 ? stripTags(h1[1]) : "",
  };
}

/**
 * Extract unique fenced code blocks from a chunk of HTML.
 * Eve pages render Streamdown code blocks as:
 *   <div class="language-ts …" data-language="ts"><pre><code>…line spans…</code></pre></div>
 * Duplicates appear (SSR + streamed slots); we keep first occurrence order.
 *
 * @param {string} html
 * @returns {CodeBlock[]}
 */
function extractCodeBlocks(html) {
  /** @type {CodeBlock[]} */
  const blocks = [];
  const seen = new Set();

  const re =
    /<div class="language-([a-zA-Z0-9_+-]+)[^"]*"[^>]*data-language="([^"]*)"[^>]*>\s*<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi;

  for (const match of html.matchAll(re)) {
    const language = match[2] || match[1] || "text";
    const code = codeFromMatchBody(match[3]);
    const key = `${language}\0${code}`;
    if (!code || seen.has(key)) {
      continue;
    }
    seen.add(key);
    blocks.push({ code, language, type: "code" });
  }

  return blocks;
}

/**
 * @param {string} body
 */
function codeFromMatchBody(body) {
  const lineMatches = [
    ...body.matchAll(
      /<span class="block before:content-\[counter\(line\)\][^"]*"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/gi
    ),
  ];
  const code =
    lineMatches.length > 0
      ? lineMatches.map((line) => stripCodeLine(line[1])).join("\n")
      : stripCodeLine(body);
  return code
    .replaceAll(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
}

/**
 * Walk a section body and emit paragraphs + code blocks in document order.
 *
 * @param {string} sectionBodyHtml
 * @returns {ContentBlock[]}
 */
function extractBlocks(sectionBodyHtml) {
  /** @type {Array<{ index: number, end: number, block: ContentBlock }>} */
  const ordered = [];

  const codeRe =
    /<div class="language-([a-zA-Z0-9_+-]+)[^"]*"[^>]*data-language="([^"]*)"[^>]*>\s*<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi;

  const seenCodes = new Set();
  /** @type {Array<{ start: number, end: number }>} */
  const codeRanges = [];

  for (const match of sectionBodyHtml.matchAll(codeRe)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const language = match[2] || match[1] || "text";
    const code = codeFromMatchBody(match[3]);
    const key = `${language}\0${code}`;
    codeRanges.push({ end, start });
    if (!code || seenCodes.has(key)) {
      continue;
    }
    seenCodes.add(key);
    ordered.push({
      block: { code, language, type: "code" },
      end,
      index: start,
    });
  }

  for (const match of sectionBodyHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const insideCode = codeRanges.some(
      (range) => start >= range.start && end <= range.end
    );
    if (insideCode) {
      continue;
    }
    const text = stripTags(match[1]);
    if (!text) {
      continue;
    }
    ordered.push({
      block: { text, type: "paragraph" },
      end,
      index: start,
    });
  }

  ordered.sort((a, b) => a.index - b.index);
  return ordered.map((entry) => entry.block);
}

/**
 * @param {string} mainHtml
 * @returns {Section[]}
 */
function extractSections(mainHtml) {
  /** @type {Section[]} */
  const sections = [];
  const re = /<section\b[^>]*>([\s\S]*?)<\/section>/gi;

  for (const match of mainHtml.matchAll(re)) {
    const body = match[1];
    const titleMatch = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    if (!titleMatch) {
      continue;
    }
    const title = stripTags(titleMatch[1]);
    const afterTitle = body.slice(titleMatch.index + titleMatch[0].length);
    const blocks = extractBlocks(afterTitle);
    if (!title && blocks.length === 0) {
      continue;
    }
    sections.push({ blocks, title });
  }

  return sections;
}

/**
 * @param {Section[]} sections
 * @param {{ name: string, description: string, badge: string | null, docsHref: string | null }} header
 */
function toMarkdown(header, sections) {
  const lines = [`# ${header.name}`];
  if (header.badge) {
    lines.push("", `\`${header.badge}\``);
  }
  if (header.description) {
    lines.push("", header.description);
  }
  if (header.docsHref) {
    lines.push("", `[Docs](${BASE_URL}${header.docsHref})`);
  }

  for (const section of sections) {
    lines.push("", `## ${section.title}`, "");
    for (const block of section.blocks) {
      if (block.type === "paragraph") {
        lines.push(block.text, "");
      } else {
        lines.push(`\`\`\`${block.language}`, block.code, "```", "");
      }
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

/**
 * @param {string} html
 * @param {string} slug
 * @returns {ScrapedIntegration}
 */
function parseIntegrationPage(html, slug) {
  const mainHtml = extractMain(html);
  if (!mainHtml) {
    throw new Error(`No <main> content found for ${slug}`);
  }

  const header = extractHeader(mainHtml);
  if (!header.name) {
    throw new Error(`No <h1> found for ${slug}`);
  }

  let sections = extractSections(mainHtml);

  // Fallback: if sections somehow missed code, attach page-level unique codes
  const sectionCodeCount = sections.reduce(
    (n, s) => n + s.blocks.filter((b) => b.type === "code").length,
    0
  );
  if (sectionCodeCount === 0) {
    const codes = extractCodeBlocks(html);
    if (codes.length > 0 && sections.length > 0) {
      sections = sections.map((section, index) =>
        index === 0
          ? { ...section, blocks: [...section.blocks, ...codes] }
          : section
      );
    } else if (codes.length > 0) {
      sections = [{ blocks: codes, title: "Code" }];
    }
  }

  return {
    badge: header.badge,
    description: header.description,
    docsHref: header.docsHref,
    docsMarkdown: null,
    docsUrl: header.docsHref ? `${BASE_URL}${header.docsHref}` : null,
    markdown: toMarkdown(header, sections),
    name: header.name,
    scrapedAt: new Date().toISOString(),
    sections,
    slug,
    sourceUrl: `${BASE_URL}/integrations/${slug}`,
  };
}

/**
 * @param {string} slug
 * @returns {Promise<ScrapedIntegration>}
 */
async function scrapeSlug(slug) {
  const url = `${BASE_URL}/integrations/${slug}`;
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent":
        "eve-directory-scraper/1.0 (+https://github.com/nolly-studio/eve-directory)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const html = await response.text();
  const detail = parseIntegrationPage(html, slug);

  if (detail.docsUrl) {
    try {
      detail.docsMarkdown = await fetchDocsMarkdown(
        detail.docsUrl,
        detail.docsHref
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`    ⚠ docs markdown for ${slug}: ${message}`);
      detail.docsMarkdown = null;
    }
  }

  return detail;
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {number} delayMs
 * @param {(item: T, index: number) => Promise<void>} worker
 */
async function mapPool(items, concurrency, delayMs, worker) {
  let next = 0;
  let active = 0;
  /** @type {Error[]} */
  const errors = [];

  await new Promise((resolve) => {
    const launch = () => {
      while (active < concurrency && next < items.length) {
        const index = next++;
        active++;
        const start = async () => {
          if (delayMs > 0 && index > 0) {
            await new Promise((r) => setTimeout(r, delayMs));
          }
          try {
            await worker(items[index], index);
          } catch (error) {
            errors.push(
              error instanceof Error ? error : new Error(String(error))
            );
          } finally {
            active--;
            if (next >= items.length && active === 0) {
              resolve();
            } else {
              launch();
            }
          }
        };
        void start();
      }
      if (items.length === 0) {
        resolve();
      }
    };
    launch();
  });

  return errors;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const catalogRaw = await readFile(opts.catalog, "utf-8");
  /** @type {{ integrations: Array<{ slug: string, name?: string }> }} */
  const catalog = JSON.parse(catalogRaw);

  let slugs = catalog.integrations.map((item) => item.slug);
  if (opts.slug) {
    if (!slugs.includes(opts.slug)) {
      console.warn(
        `Warning: ${opts.slug} is not in ${path.relative(ROOT, opts.catalog)}; scraping anyway`
      );
    }
    slugs = [opts.slug];
  }

  console.log(
    `Scraping ${slugs.length} integration(s) from ${BASE_URL} (concurrency=${opts.concurrency})`
  );

  /** @type {ScrapedIntegration[]} */
  const results = [];
  /** @type {Array<{ slug: string, error: string }>} */
  const failures = [];

  const errors = await mapPool(
    slugs,
    opts.concurrency,
    opts.delay,
    async (slug) => {
      try {
        const detail = await scrapeSlug(slug);
        results.push(detail);
        const codeCount = detail.sections.reduce(
          (n, s) => n + s.blocks.filter((b) => b.type === "code").length,
          0
        );
        const docsNote = detail.docsMarkdown
          ? `, docs markdown (${detail.docsMarkdown.length} chars)`
          : detail.docsUrl
            ? ", docs markdown missing"
            : "";
        console.log(
          `  ✓ ${slug} — ${detail.sections.length} sections, ${codeCount} code blocks${docsNote}`
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ error: message, slug });
        console.error(`  ✗ ${slug} — ${message}`);
        throw error instanceof Error ? error : new Error(message);
      }
    }
  );

  // Stable order matching catalog
  const bySlug = new Map(results.map((item) => [item.slug, item]));
  const ordered = slugs
    .map((slug) => bySlug.get(slug))
    .filter(
      /** @returns {item is ScrapedIntegration} */ (item) => Boolean(item)
    );

  const payload = {
    catalog: path.relative(ROOT, opts.catalog),
    count: ordered.length,
    failed: failures,
    integrations: ordered,
    scrapedAt: new Date().toISOString(),
    source: BASE_URL,
  };

  if (opts.dryRun) {
    console.log(
      `\nDry run: would write ${ordered.length} integrations (${failures.length} failed, ${errors.length} errors)`
    );
    if (opts.slug && ordered[0]) {
      console.log("\n--- preview markdown ---\n");
      console.log(ordered[0].markdown);
    }
    return;
  }

  await mkdir(path.dirname(opts.out), { recursive: true });
  await writeFile(opts.out, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  console.log(
    `\nWrote ${ordered.length} integrations to ${path.relative(ROOT, opts.out)}${failures.length ? ` (${failures.length} failed)` : ""}`
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
