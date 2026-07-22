"use client";

import { useRouter } from "next/navigation";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import {
  addAgentToComposer,
  addExtensionToComposer,
} from "@/lib/composer/storage";

export function AddToComposerButton({
  slug,
  kind,
  variant = "default",
}: {
  slug: string;
  kind: "agent" | "extension";
  variant?: "default" | "secondary" | "ghost";
}) {
  const router = useRouter();

  function handleClick() {
    if (kind === "agent") {
      addAgentToComposer(slug);
    } else {
      addExtensionToComposer(slug);
    }

    posthog.capture("agent_added_to_composer", {
      item_kind: kind,
      item_slug: slug,
    });

    router.push("/composer");
  }

  return (
    <Button type="button" onClick={handleClick} variant={variant}>
      Add to composer
    </Button>
  );
}
