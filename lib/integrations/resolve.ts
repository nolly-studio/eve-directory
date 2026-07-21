import { logos } from "@/lib/integrations/logos";
import type { LogoKey } from "@/lib/integrations/logos";

/** Catalog slugs that share another integration's mark. */
const LOGO_ALIASES = {
  "chat-sdk-gchat": "googlechat",
  "chat-sdk-messenger": "messenger",
  "chat-sdk-whatsapp": "whatsapp",
  "chat-sdk-x": "x",
  "linear-agent": "linear",
} as const satisfies Record<string, LogoKey>;

export function resolveLogoKey(slug: string): LogoKey | null {
  const normalized = slug.toLowerCase();
  const aliased =
    normalized in LOGO_ALIASES
      ? LOGO_ALIASES[normalized as keyof typeof LOGO_ALIASES]
      : null;
  const key = aliased ?? normalized;

  if (key in logos) {
    return key as LogoKey;
  }

  return null;
}

export function getIntegrationLogo(slug: string) {
  const key = resolveLogoKey(slug);
  return key ? logos[key] : null;
}
