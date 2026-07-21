import { cn } from "@/lib/utils";

/** Opt-in via `SHOW_SPONSOR_SLOTS=true`. Hidden when unset or any other value. */
export function sponsorSlotsEnabled(): boolean {
  return process.env.SHOW_SPONSOR_SLOTS === "true";
}

export function AdSlot({
  placement,
  className,
}: {
  placement: string;
  className?: string;
}) {
  if (!sponsorSlotsEnabled()) {
    return null;
  }

  return (
    <aside
      aria-label={`Sponsored placement: ${placement}`}
      className={cn(
        "shadow-surface flex min-h-24 items-center justify-center rounded-xl bg-muted/40 px-4 py-6 text-center text-caption text-muted-foreground",
        className
      )}
    >
      Sponsored placement reserved ({placement})
    </aside>
  );
}
