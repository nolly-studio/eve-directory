"use client";

import {
  ComputerIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const THEMES = [
  { icon: Sun03Icon, label: "Light", value: "light" },
  { icon: Moon02Icon, label: "Dark", value: "dark" },
  { icon: ComputerIcon, label: "System", value: "system" },
] as const;

type ThemeValue = (typeof THEMES)[number]["value"];

function subscribeToNothing() {
  return () => {
    // Client-mounted snapshot never changes after hydration.
  };
}

function isThemeValue(value: string | undefined): value is ThemeValue {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  const active = mounted && isThemeValue(theme) ? theme : null;

  return (
    <fieldset
      aria-label="Theme"
      className={cn(
        "m-0 inline-flex items-center rounded-full border border-border p-0.5",
        className
      )}
    >
      {THEMES.map((option) => {
        const selected = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={selected}
            onClick={() => {
              setTheme(option.value);
            }}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full text-gray-700 transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none",
              selected ? "bg-muted text-gray-1000" : "hover:text-gray-1000"
            )}
          >
            <HugeiconsIcon
              icon={option.icon}
              strokeWidth={1.5}
              className="size-3.5"
            />
          </button>
        );
      })}
    </fieldset>
  );
}
