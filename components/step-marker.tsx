import { cn } from "@/lib/utils";

/** Mono `[ 01 ]` wayfinding marker — replaces uppercase kickers. */
export function StepMarker({
  step,
  className,
}: {
  step: number | string;
  className?: string;
}) {
  const digits =
    typeof step === "number" ? String(step).padStart(2, "0") : step;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-[30px] shrink-0 items-center gap-1 text-label-12-mono",
        className
      )}
    >
      <span className="text-gray-500">[</span>
      <span className="text-gray-700">{digits}</span>
      <span className="text-gray-500">]</span>
    </span>
  );
}
