import { IntegrationMark } from "@/components/integration-badge";
import { cn } from "@/lib/utils";

/** Framed author avatar — same chip as IntegrationMark, GitHub image when present. */
export function AuthorMark({
  src,
  alt = "",
  fallbackSlug,
  size = "md",
  className,
}: {
  src?: string | null;
  alt?: string;
  fallbackSlug?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? 48 : 40;

  if (src) {
    return (
      <IntegrationMark
        size={size}
        className={cn("overflow-hidden p-0", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar */}
        <img
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      </IntegrationMark>
    );
  }

  return (
    <IntegrationMark slug={fallbackSlug} size={size} className={className} />
  );
}
