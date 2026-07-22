import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { SiteSearchDialog } from "@/components/search-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEARCH_TAGS } from "@/lib/search/tags";
import { NAV_LINKS, SITE, siteOrigin } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  description: SITE.description,
  metadataBase: new URL(siteOrigin()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    description: SITE.description,
    locale: "en_US",
    siteName: SITE.name,
    title: SITE.title,
    type: "website",
    url: siteOrigin(),
  },
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  twitter: {
    card: "summary_large_image",
    description: SITE.description,
    title: SITE.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable
      )}
    >
      <body className="flex min-h-svh flex-col font-sans">
        <ThemeProvider>
          <TooltipProvider>
            <RootProvider
              search={{
                SearchDialog: SiteSearchDialog,
                options: {
                  links: NAV_LINKS.map(
                    (link) => [link.label, link.href] as [string, string]
                  ),
                  tags: [...SEARCH_TAGS],
                },
              }}
            >
              {children}
            </RootProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
