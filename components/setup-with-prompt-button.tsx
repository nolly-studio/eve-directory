"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { agentSetupPrompt } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SetupWithPromptButton({
  name,
  sourceHref,
}: {
  name: string;
  sourceHref: string;
}) {
  const [copied, setCopied] = useState(false);
  const prompt = agentSetupPrompt(name, sourceHref);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      // Clipboard may be unavailable; keep UI quiet.
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "Setup prompt copied" : "Copy setup prompt"}
    >
      <span className="relative size-4 shrink-0" data-icon="inline-start">
        <HugeiconsIcon
          icon={Copy01Icon}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
      </span>
      {copied ? "Copied prompt" : "Setup with one prompt"}
    </Button>
  );
}
