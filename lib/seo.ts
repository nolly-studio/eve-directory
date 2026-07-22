import type { Metadata } from "next";

import { SITE, siteUrl } from "@/lib/site";

/** Default site-wide OG/Twitter card (from `app/opengraph-image.tsx`). */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.description}`,
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
  /**
   * Open Graph images. Defaults to the site-wide card.
   * Pass `null` when the route has its own `opengraph-image.tsx` so Next can
   * attach that file (page-level `openGraph` otherwise replaces the parent
   * object and drops file-based images).
   */
  images?: typeof DEFAULT_OG_IMAGE | null;
}

/**
 * Shared page metadata: unique title/description, self-canonical, OG/Twitter.
 * Relies on root `metadataBase` (www) to resolve relative canonicals + images.
 *
 * Always includes a default `og:image` unless `images: null`. Next.js replaces
 * nested `openGraph` wholesale per segment, so omitting images here would wipe
 * the root `opengraph-image` on every page that uses this helper.
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
      ...(images ? { images: [images] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(images ? { images: [images.url] } : {}),
    },
  };
}
