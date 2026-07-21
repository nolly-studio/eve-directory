"use client";

import { PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { IntegrationMark } from "@/components/integration-badge";
import { StepMarker } from "@/components/step-marker";
import { Surface } from "@/components/ui/surface";
import type { AgentListing, ExtensionListing } from "@/lib/catalog/types";
import { getIntegrationLogo } from "@/lib/integrations/resolve";
import { cn } from "@/lib/utils";

function pickMarkSlug(integrations: string[]): string | undefined {
  return (
    integrations.find((slug) => getIntegrationLogo(slug)) ?? integrations[0]
  );
}

function SelectionIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow,opacity] duration-150 motion-reduce:transition-none",
        selected
          ? "bg-primary text-primary-foreground"
          : "shadow-chip bg-background text-gray-700 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      )}
    >
      <HugeiconsIcon
        icon={PlusSignIcon}
        strokeWidth={1.5}
        className={cn(
          "absolute size-3.5 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          selected ? "scale-50 opacity-0" : "scale-100 opacity-100"
        )}
      />
      <HugeiconsIcon
        icon={Tick02Icon}
        strokeWidth={1.5}
        className={cn(
          "absolute size-3.5 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
      />
    </span>
  );
}

function PickerCard({
  title,
  meta,
  metaMono = false,
  summary,
  markSlug,
  selected,
  onToggle,
}: {
  title: string;
  meta: string;
  metaMono?: boolean;
  summary: string;
  markSlug?: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "group flex h-full flex-col rounded-xl p-4 text-left",
        "transition-[box-shadow,background-color,transform] duration-200",
        "active:scale-[0.99] motion-reduce:transition-none",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        selected
          ? "shadow-surface-active bg-muted/50"
          : "shadow-surface hover:shadow-surface-hover bg-card"
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <IntegrationMark slug={markSlug} />
        <SelectionIndicator selected={selected} />
      </span>

      <span className="mt-3 block text-copy-14 font-medium text-gray-1000">
        {title}
      </span>
      <span
        className={cn(
          "mt-0.5 block truncate text-gray-700",
          metaMono ? "text-label-12-mono" : "text-label-12"
        )}
      >
        {meta}
      </span>
      <span className="mt-2 line-clamp-2 block text-copy-14 text-pretty text-muted-foreground">
        {summary}
      </span>
    </button>
  );
}

function SectionHeading({
  step,
  title,
  selectedCount,
}: {
  step: number;
  title: string;
  selectedCount?: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="flex items-baseline gap-2.5">
        <StepMarker step={step} />
        <h2 className="text-heading-24 font-semibold text-gray-1000">
          {title}
        </h2>
      </div>
      {selectedCount === undefined ? null : (
        <p
          className={cn(
            "text-label-12 tabular-nums transition-colors duration-150 motion-reduce:transition-none",
            selectedCount > 0 ? "text-gray-900" : "text-gray-700"
          )}
        >
          {selectedCount} selected
        </p>
      )}
    </div>
  );
}

export function ComposerPicker({
  agents,
  extensions,
  selectedAgentSlugs,
  selectedExtensionSlugs,
  onToggleAgent,
  onToggleExtension,
}: {
  agents: AgentListing[];
  extensions: ExtensionListing[];
  selectedAgentSlugs: string[];
  selectedExtensionSlugs: string[];
  onToggleAgent: (slug: string) => void;
  onToggleExtension: (slug: string) => void;
}) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <SectionHeading
          step={1}
          title="Agents"
          selectedCount={selectedAgentSlugs.length}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {agents.map((agent) => (
            <PickerCard
              key={agent.slug}
              title={agent.name}
              meta={agent.category.name}
              summary={agent.summary}
              markSlug={pickMarkSlug(agent.integrations)}
              selected={selectedAgentSlugs.includes(agent.slug)}
              onToggle={() => onToggleAgent(agent.slug)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          step={2}
          title="Extensions"
          selectedCount={
            extensions.length > 0 ? selectedExtensionSlugs.length : undefined
          }
        />
        {extensions.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {extensions.map((extension) => (
              <PickerCard
                key={extension.slug}
                title={extension.name}
                meta={extension.npm ?? extension.slug}
                metaMono
                summary={extension.summary}
                markSlug={pickMarkSlug(extension.integrations)}
                selected={selectedExtensionSlugs.includes(extension.slug)}
                onToggle={() => onToggleExtension(extension.slug)}
              />
            ))}
          </div>
        ) : (
          <Surface inset className="px-4 py-5">
            <p className="text-copy-14 text-pretty text-muted-foreground">
              No extensions in the catalog yet. Agents still export with their
              own tools, connections, and schedules included.
            </p>
          </Surface>
        )}
      </section>
    </div>
  );
}
