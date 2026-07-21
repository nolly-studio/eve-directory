import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  className,
  narrow = false,
  ...props
}: ComponentProps<"div"> & { narrow?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 py-10",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
      {...props}
    />
  );
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div
        className="max-w-2xl animate-enter"
        style={{ "--stagger": 0 } as CSSProperties}
      >
        <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-copy-16 text-pretty text-gray-900">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div
          className="shrink-0 animate-enter"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}
