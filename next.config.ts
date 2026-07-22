import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
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
