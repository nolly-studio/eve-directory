"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav({ links }: { links: readonly NavLink[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ size: "icon-sm", variant: "ghost" }),
          "text-gray-900 hover:text-gray-1000 md:hidden"
        )}
        aria-label="Open menu"
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 md:hidden">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
