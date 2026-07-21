import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function AisdkCta({
  campaign = "inline",
  compact = false,
}: {
  campaign?: string;
  compact?: boolean;
}) {
  const href = `${SITE.aisdkUrl.replace("utm_campaign=cta", `utm_campaign=${campaign}`)}`;

  return (
    <div
      className={cn(
        "shadow-surface bg-card transition-[box-shadow] duration-200",
        compact ? "rounded-lg px-4 py-3" : "rounded-xl px-5 py-5"
      )}
    >
      <p className="text-label">Need production-ready AI SDK agents?</p>
      <p className="mt-1 text-body text-pretty text-muted-foreground">
        Templates, workflows, and integrations built for shipping—not just
        browsing.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ size: "sm" }), "mt-3 inline-flex")}
      >
        Explore aisdkagents.com
      </a>
    </div>
  );
}

export function AisdkCtaLink({ campaign = "nav" }: { campaign?: string }) {
  const href = `${SITE.aisdkUrl.replace("utm_campaign=cta", `utm_campaign=${campaign}`)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-body underline decoration-foreground/20 underline-offset-4 transition-colors duration-150 hover:decoration-foreground/60"
    >
      aisdkagents.com
    </a>
  );
}
