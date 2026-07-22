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

  const shortcut = hotKey.map((key) => key.display).join(" ");

  return (
    <button
      type="button"
      aria-label={shortcut ? `Search (${shortcut})` : "Search"}
      onClick={() => {
        setOpenSearch(true);
      }}
      className={cn(
        buttonVariants({ size: "icon-sm", variant: "ghost" }),
        "text-gray-900 hover:text-gray-1000",
        className
      )}
    >
      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
    </button>
  );
}
