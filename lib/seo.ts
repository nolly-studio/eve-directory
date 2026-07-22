import type { Metadata } from "next";

import { SITE, siteUrl } from "@/lib/site";

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
}

/**
 * Shared page metadata: unique title/description, self-canonical, OG/Twitter.
 * Relies on root `metadataBase` (www) to resolve relative canonicals.
 */
export function pageMetadata({
  title,
  description,
  pathname,
  absoluteTitle = false,
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
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
