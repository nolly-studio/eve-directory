"use client";

import { useEffect, useState } from "react";

interface LoadedSecrets {
  slug: string;
  keys: string[];
}

/** Secret keys parsed from the primary agent's `.env.example`, if any. */
export function usePrimaryAgentSecrets(slug: string | null): string[] {
  const [loaded, setLoaded] = useState<LoadedSecrets | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    async function loadSecrets(agentSlug: string) {
      try {
        const response = await fetch(
          `/api/agents/${agentSlug}/file?path=${encodeURIComponent(".env.example")}`
        );

        if (!response.ok) {
          if (!cancelled) {
            setLoaded({ keys: [], slug: agentSlug });
          }
          return;
        }

        const data = (await response.json()) as { content: string };
        const keys = data.content
          .split("\n")
          .filter((line) => line.includes("=") && !line.startsWith("#"))
          .map((line) => line.split("=")[0]?.trim())
          .filter((key): key is string => Boolean(key));

        if (!cancelled) {
          setLoaded({ keys, slug: agentSlug });
        }
      } catch {
        if (!cancelled) {
          setLoaded({ keys: [], slug: agentSlug });
        }
      }
    }

    void loadSecrets(slug);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Keyed by slug so a stale fetch for a previous agent never leaks through.
  return slug && loaded?.slug === slug ? loaded.keys : [];
}
