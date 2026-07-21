import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { EveDirectoryLogo } from "@/components/logo";
import { githubUrl, NAV_LINKS, SITE } from "@/lib/site";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: githubUrl(),
    links: NAV_LINKS.map((link) => ({
      active:
        link.href === "/docs" ? ("nested-url" as const) : ("none" as const),
      text: link.label,
      url: link.href,
    })),
    nav: {
      title: (
        <>
          <span className="sr-only">{SITE.name}</span>
          <EveDirectoryLogo className="h-3.5 w-auto" />
        </>
      ),
      url: "/",
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
