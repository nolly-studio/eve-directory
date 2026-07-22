import Link from "next/link";

import { EveDirectoryLogo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <p className="text-gray-1000">
            <span className="sr-only">{SITE.name}</span>
            <EveDirectoryLogo className="h-5 w-auto" />
          </p>
          <p className="max-w-md text-copy-14 text-pretty text-gray-900">
            {SITE.description}
          </p>
          <p className="text-copy-14">
            <a
              href={SITE.aisdkUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-foreground/20 underline-offset-4 transition-colors duration-150 hover:decoration-foreground/60 motion-reduce:transition-none"
              style={{
                textDecorationThickness: "from-font",
                textUnderlinePosition: "from-font",
              }}
            >
              Production AI SDK agents at aisdkagents.com
            </a>
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-x-5 gap-y-2.5 text-copy-14">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-900 transition-colors duration-150 hover:text-gray-1000 motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-label-12 text-gray-700">
            © 2026 {SITE.name}.{" "}
            <Link
              href="/docs/contributing"
              className="underline decoration-foreground/20 underline-offset-4 transition-colors duration-150 hover:decoration-foreground/60 motion-reduce:transition-none"
              style={{
                textDecorationThickness: "from-font",
                textUnderlinePosition: "from-font",
              }}
            >
              Open source
            </Link>
            .
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
