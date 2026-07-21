"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  addAgentToComposer,
  addExtensionToComposer,
} from "@/lib/composer/storage";

export function AddToComposerButton({
  slug,
  kind,
}: {
  slug: string;
  kind: "agent" | "extension";
}) {
  const router = useRouter();

  function handleClick() {
    if (kind === "agent") {
      addAgentToComposer(slug);
    } else {
      addExtensionToComposer(slug);
    }

    router.push("/composer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" onClick={handleClick}>
        Add to composer
      </Button>
      <ButtonLink href="/composer" variant="outline" size="sm">
        Open composer
      </ButtonLink>
    </div>
  );
}
