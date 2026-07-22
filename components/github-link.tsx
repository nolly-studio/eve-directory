import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { githubLogo as GithubLogo } from "@/lib/integrations/logos";
import { githubUrl, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const STARS_VISIBLE_THRESHOLD = 20;

async function StarsCount() {
  let formattedCount: string | null = null;

  try {
    const data = await fetch(
      `https://api.github.com/repos/${SITE.github.owner}/${SITE.github.repo}`,
      {
        next: { revalidate: 86_400 },
      }
    );
    const json = (await data.json()) as { stargazers_count?: number };
    const count = json.stargazers_count ?? 0;

    if (count > STARS_VISIBLE_THRESHOLD) {
      formattedCount =
        count >= 1000
          ? `${(count / 1000).toFixed(1)}k`.replace(/\.0$/, "")
          : count.toLocaleString();
    }
  } catch {
    return null;
  }

  if (!formattedCount) {
    return null;
  }

  return (
    <span className="text-label-12 text-muted-foreground tabular-nums">
      {formattedCount}
    </span>
  );
}

export function GitHubLink({ className }: { className?: string }) {
  return (
    <a
      href={githubUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      className={cn(
        buttonVariants({ size: "icon-sm", variant: "ghost" }),
        "w-auto min-w-8 gap-1 px-2 text-gray-900 hover:text-gray-1000",
        className
      )}
    >
      <GithubLogo className="size-4" />
      <Suspense fallback={null}>
        <StarsCount />
      </Suspense>
    </a>
  );
}
