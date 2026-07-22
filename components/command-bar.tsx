"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CommandBarProps {
  command: string;
  className?: string;
}

export function CommandBar({ command, className }: CommandBarProps) {
  const [copied, setCopied] = useState(false);

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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard may be unavailable; keep UI quiet.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy command: ${command}`}
      className={cn(
        "group flex h-11 w-full max-w-full min-w-0 items-center gap-3 rounded-full bg-card px-5 shadow-chip transition-[box-shadow,transform] duration-150 hover:shadow-surface-hover active:scale-[0.99] motion-reduce:transition-none",
        className
      )}
    >
      <span
        className="shrink-0 font-mono text-label-13 text-gray-700"
        aria-hidden
      >
        $
      </span>
      <span className="min-w-0 flex-1 truncate text-left font-mono text-label-13 text-gray-1000">
        {command}
      </span>
      <span className="relative size-4 shrink-0" aria-hidden>
        <HugeiconsIcon
          icon={Copy01Icon}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 size-4 text-gray-700 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 size-4 text-gray-1000 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
      </span>
    </button>
  );
}
