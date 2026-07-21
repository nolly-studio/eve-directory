"use client";

import { Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { IntegrationLogo } from "@/components/integration-badge";
import { StepMarker } from "@/components/step-marker";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import type { AgentListing, ExtensionListing } from "@/lib/catalog/types";
import { integrationLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface ComposerMessage {
  text: string;
  tone: "info" | "error";
}

function RemoveButton({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={label}
      className="flex size-5 shrink-0 items-center justify-center rounded-sm text-gray-700 transition-colors duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none motion-reduce:transition-none"
    >
      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-3" />
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-label-12-mono text-gray-700">{children}</p>;
}

function StackEmptyState() {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-4">
      <p className="text-copy-14 text-pretty text-muted-foreground">
        Select an agent from the catalog to start a composition.
      </p>
      <p className="mt-2 text-label-13">
        <Link
          href="/agents"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Browse all agents
        </Link>
        <span className="mx-2 text-gray-500" aria-hidden>
          ·
        </span>
        <Link
          href="/docs/compose-vs-clone"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Compose vs. clone
        </Link>
      </p>
    </div>
  );
}

export function ComposerStarterPanel({
  selectedAgents,
  selectedExtensions,
  secrets,
  exporting,
  message,
  onExport,
  onClear,
  onRemoveAgent,
  onRemoveExtension,
}: {
  selectedAgents: AgentListing[];
  selectedExtensions: ExtensionListing[];
  secrets: string[];
  exporting: boolean;
  message: ComposerMessage | null;
  onExport: () => void;
  onClear: () => void;
  onRemoveAgent: (slug: string) => void;
  onRemoveExtension: (slug: string) => void;
}) {
  const primaryAgent = selectedAgents[0] ?? null;
  const hasSelection =
    selectedAgents.length > 0 || selectedExtensions.length > 0;

  let footerText =
    "Exports a starter with full source — runtime wiring stays yours.";
  if (message) {
    footerText = message.text;
  } else if (selectedAgents.length === 0) {
    footerText = "Select at least one agent to export.";
  }

  return (
    <Surface className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-gray-500/40" />
          <span className="size-2.5 rounded-full bg-gray-500/30" />
          <span className="size-2.5 rounded-full bg-gray-500/20" />
        </div>
        <p className="flex-1 truncate text-label-12-mono text-gray-700">
          {primaryAgent ? `${primaryAgent.slug}-starter.zip` : "starter.zip"}
        </p>
        <StepMarker step={3} className="h-auto" />
      </div>

      <div className="space-y-5 px-4 py-4">
        <section className="space-y-2">
          <SectionLabel>Your stack</SectionLabel>
          {hasSelection ? (
            <ul className="space-y-1.5">
              {selectedAgents.map((agent, index) => (
                <li
                  key={agent.slug}
                  className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate text-copy-14-mono text-gray-1000">
                    {agent.slug}
                  </span>
                  <span className="shrink-0 text-label-12-mono text-gray-700">
                    {index === 0 ? "primary" : "reference"}
                  </span>
                  <RemoveButton
                    label={`Remove ${agent.name}`}
                    onRemove={() => onRemoveAgent(agent.slug)}
                  />
                </li>
              ))}
              {selectedExtensions.map((extension) => (
                <li
                  key={extension.slug}
                  className="rounded-md bg-muted/50 px-2.5 py-1.5"
                >
                  <span className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-copy-14-mono text-gray-1000">
                      {extension.slug}
                    </span>
                    <span className="shrink-0 text-label-12-mono text-gray-700">
                      extension
                    </span>
                    <RemoveButton
                      label={`Remove ${extension.name}`}
                      onRemove={() => onRemoveExtension(extension.slug)}
                    />
                  </span>
                  <span className="mt-0.5 block truncate text-label-12-mono text-gray-700">
                    → agent/extensions/{extension.slug}.ts
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <StackEmptyState />
          )}
        </section>

        {primaryAgent && primaryAgent.integrations.length > 0 ? (
          <section className="space-y-2">
            <SectionLabel>Integrations</SectionLabel>
            <ul className="flex flex-wrap items-center gap-1.5">
              {primaryAgent.integrations.map((slug) => (
                <li
                  key={slug}
                  title={integrationLabel(slug)}
                  className="flex size-6 items-center justify-center rounded-md bg-muted/50"
                >
                  <IntegrationLogo slug={slug} className="size-3.5" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {primaryAgent ? (
          <section className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <SectionLabel>Secrets</SectionLabel>
              <p className="text-label-12-mono text-gray-700 tabular-nums">
                {secrets.length}
              </p>
            </div>
            {secrets.length > 0 ? (
              <>
                <ul className="space-y-1">
                  {secrets.map((secret) => (
                    <li
                      key={secret}
                      className="flex items-baseline gap-2 text-label-12-mono text-gray-900"
                    >
                      <span className="text-gray-500" aria-hidden>
                        ·
                      </span>
                      <span className="truncate">{secret}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-label-12 text-gray-700">
                  From{" "}
                  <span className="font-mono">
                    {primaryAgent.slug}/.env.example
                  </span>{" "}
                  — keys only, never values.
                </p>
              </>
            ) : (
              <p className="text-label-12 text-gray-700">
                No secrets detected in .env.example.
              </p>
            )}
          </section>
        ) : null}
      </div>

      <div className="border-t border-border px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onExport}
            disabled={exporting || selectedAgents.length === 0}
          >
            <HugeiconsIcon
              icon={Download01Icon}
              strokeWidth={1.5}
              data-icon="inline-start"
            />
            {exporting ? "Exporting…" : "Export starter zip"}
          </Button>
          {hasSelection ? (
            <Button variant="ghost" onClick={onClear}>
              Clear
            </Button>
          ) : null}
        </div>
        <p
          aria-live="polite"
          className={cn(
            "mt-2.5 text-label-12 text-pretty",
            message?.tone === "error" ? "text-destructive" : "text-gray-700"
          )}
        >
          {footerText}
        </p>
      </div>
    </Surface>
  );
}
