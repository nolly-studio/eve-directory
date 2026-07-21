"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSearchContext } from "fumadocs-ui/contexts/search";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchTrigger({ className }: { className?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();

  if (!enabled) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={() => {
        setOpenSearch(true);
      }}
      className={cn(
        buttonVariants({ size: "sm", variant: "secondary" }),
        "gap-2 text-muted-foreground",
        className
      )}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      <span className="hidden sm:inline">Search</span>
      <span className="ms-0.5 hidden items-center gap-0.5 md:inline-flex">
        {hotKey.map((key) => (
          <kbd
            key={typeof key.key === "string" ? key.key : String(key.display)}
            className="rounded-md bg-background/80 px-1.5 font-mono text-[10px] text-muted-foreground"
          >
            {key.display}
          </kbd>
        ))}
      </span>
    </button>
  );
}
