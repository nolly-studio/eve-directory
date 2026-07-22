import type { Metadata } from "next";

import { SITE, siteUrl } from "@/lib/site";

/**
 * Default site-wide OG/Twitter card.
 * Sourced from the `app/opengraph-image.png` file convention — still set
 * explicitly because page-level `openGraph` replaces the parent object and
 * would otherwise drop the file-based image.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name}: ${SITE.description}`,
} as const;

interface PageMetadataInput {
  title: string;
  description: string;
  /** Pathname for canonical + og:url (e.g. `/agents` or `/`). */
  pathname: string;
  /**
   * Use the title as-is for `<title>` (no `%s · Eve Directory` template).
   * Open Graph / Twitter still include the site name when helpful.
   */
  absoluteTitle?: boolean;
  /** Open Graph images. Defaults to the static site-wide card. */
  images?: typeof DEFAULT_OG_IMAGE;
}

/**
 * Shared page metadata: unique title/description, self-canonical, OG/Twitter.
 * Relies on root `metadataBase` (www) to resolve relative canonicals + images.
 *
 * Always includes `og:image` — Next.js replaces nested `openGraph` wholesale
 * per segment, so pages must set images explicitly.
 */
export function pageMetadata({
  title,
  description,
  pathname,
  absoluteTitle = false,
  images = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata {
  const canonicalPath = pathname === "" ? "/" : pathname;
  const url = siteUrl(canonicalPath);
  const ogTitle = absoluteTitle ? title : `${title} · ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [images],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [images.url],
    },
  };
}
