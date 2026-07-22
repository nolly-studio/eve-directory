import Link from "next/link";

import { AuthMenu } from "@/components/auth-menu";
import { GitHubLink } from "@/components/github-link";
import { EveDirectoryLogo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { SearchTrigger } from "@/components/search-trigger";
import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href="/"
            aria-label={SITE.name}
            className="group flex shrink-0 items-center gap-2.5 text-gray-1000 transition-opacity duration-150 hover:opacity-80 motion-reduce:transition-none"
          >
            <EveDirectoryLogo className="h-3.5 w-auto" />
            <span className="hidden text-label-12-mono text-gray-700 sm:inline">
              directory
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <ButtonLink
                key={link.href}
                href={link.href}
                variant="ghost"
                size="sm"
                className="text-gray-900"
              >
                {link.label}
              </ButtonLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <SearchTrigger />
          <GitHubLink />
          <a
            href={SITE.aisdkUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "ml-1.5 hidden lg:inline-flex"
            )}
          >
            AI SDK Patterns
          </a>
          <span
            aria-hidden
            className="mx-1.5 hidden h-4 w-px bg-border sm:block"
          />
          <AuthMenu />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
