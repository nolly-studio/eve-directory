import Link from "next/link";
import { createElement } from "react";
import type { ComponentProps, ReactNode, SVGProps } from "react";

import { Badge } from "@/components/ui/badge";
import { getIntegrationLogo } from "@/lib/integrations/resolve";
import { integrationLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

type IntegrationLogoProps = SVGProps<SVGSVGElement> & {
  slug: string;
};

export function IntegrationLogo({
  slug,
  className,
  ...props
}: IntegrationLogoProps) {
  const Logo = getIntegrationLogo(slug);

  if (!Logo) {
    return null;
  }

  return createElement(Logo, {
    ...props,
    "aria-hidden": true,
    className: cn("size-3.5 shrink-0", className),
  });
}

/** Framed brand mark — card headers and detail heroes. */
export function IntegrationMark({
  slug,
  className,
  children,
  size = "md",
}: {
  slug?: string;
  className?: string;
  children?: ReactNode;
  size?: "md" | "lg";
}) {
  const Logo = slug ? getIntegrationLogo(slug) : null;
  const logoSize = size === "lg" ? "size-6" : "size-5";

  let content: ReactNode = children;
  if (!content) {
    if (Logo) {
      content = createElement(Logo, {
        "aria-hidden": true,
        className: cn("shrink-0", logoSize),
      });
    } else if (slug) {
      content = (
        <span
          aria-hidden
          className="text-label-12 font-medium text-muted-foreground uppercase"
        >
          {integrationLabel(slug).slice(0, 1)}
        </span>
      );
    } else {
      content = (
        <span
          aria-hidden
          className="size-2 rounded-full bg-muted-foreground/40"
        />
      );
    }
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-card shadow-chip",
        size === "lg" ? "size-12 rounded-xl shadow-surface" : "size-10",
        className
      )}
    >
      {content}
    </div>
  );
}

interface IntegrationChipProps {
  slug: string;
  className?: string;
  variant?: "outline" | "ghost";
}

/** Dense chip with logo + label — listing cards and non-linked rows. */
export function IntegrationBadge({
  slug,
  className,
  variant = "outline",
}: IntegrationChipProps) {
  const label = integrationLabel(slug);

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      <IntegrationLogo slug={slug} data-icon="inline-start" />
      {label}
    </Badge>
  );
}

type IntegrationLinkProps = IntegrationChipProps &
  Omit<ComponentProps<typeof Link>, "href" | "className">;

/**
 * Linked chip — same Badge/`shadow-chip` recipe as IntegrationBadge.
 * Prefer this over Button for integration marks so cards and detail match.
 */
export function IntegrationLink({
  slug,
  className,
  variant = "outline",
  ...props
}: IntegrationLinkProps) {
  const label = integrationLabel(slug);

  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5", className)}
      render={<Link href={`/integrations/${slug}`} {...props} />}
    >
      <IntegrationLogo slug={slug} data-icon="inline-start" />
      {label}
    </Badge>
  );
}
