import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SurfaceProps = ComponentProps<"div"> & {
  interactive?: boolean;
  inset?: boolean;
};

/**
 * Elevated panel primitive — same material language as `Card`.
 * Prefer `Card` + `CardHeader`/`CardContent` for structured content;
 * use `Surface` for freeform panels (file explorer, composer rows).
 */
export function Surface({
  className,
  interactive = false,
  inset = false,
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(
        "rounded-xl bg-card text-card-foreground transition-[box-shadow,background-color,transform] duration-200",
        inset ? "bg-muted/30 shadow-none" : "shadow-surface",
        interactive &&
          "hover:shadow-surface-hover active:scale-[0.99] dark:hover:bg-card",
        className
      )}
      {...props}
    />
  );
}
