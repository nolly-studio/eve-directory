import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  // Ensure colocated OG fonts ship with the image routes on Vercel.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./lib/og/fonts/**/*"],
    "/agents/[slug]/[communitySlug]/opengraph-image": ["./lib/og/fonts/**/*"],
  },
  rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogHost) {
      return [];
    }

    const posthogAssetsHost = posthogHost
      .replace("://us.i.", "://us-assets.i.")
      .replace("://eu.i.", "://eu-assets.i.");

    return [
      {
        destination: `${posthogAssetsHost}/static/:path*`,
        source: "/ingest/static/:path*",
      },
      {
        destination: `${posthogAssetsHost}/array/:path*`,
        source: "/ingest/array/:path*",
      },
      {
        destination: `${posthogHost}/:path*`,
        source: "/ingest/:path*",
      },
    ];
  },
  redirects() {
    return [
      {
        destination: "/docs",
        permanent: true,
        source: "/guides",
      },
      {
        destination: "/docs/:path*",
        permanent: true,
        source: "/guides/:path*",
      },
    ];
  },
};

export default withMDX(nextConfig);
