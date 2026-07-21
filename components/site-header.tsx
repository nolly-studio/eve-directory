import Link from "next/link";

import { EveDirectoryLogo } from "@/components/logo";
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          aria-label={SITE.name}
          className="group flex min-h-10 items-center gap-2.5 text-gray-1000 transition-opacity duration-150 hover:opacity-80 motion-reduce:transition-none"
        >
          <EveDirectoryLogo className="h-3.5 w-auto" />
          <span className="hidden text-label-12-mono text-gray-700 sm:inline">
            directory
          </span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <ButtonLink
              key={link.href}
              href={link.href}
              variant="ghost"
              size="sm"
            >
              {link.label}
            </ButtonLink>
          ))}
          <SearchTrigger className="ml-1" />
          <a
            href={SITE.aisdkUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "ml-1")}
          >
            AI SDK Agents
          </a>
        </nav>
      </div>
    </header>
  );
}
