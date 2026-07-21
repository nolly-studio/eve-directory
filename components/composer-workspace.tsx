"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { AisdkCta } from "@/components/aisdk-cta";
import { ComposerPicker } from "@/components/composer-picker";
import { ComposerStarterPanel } from "@/components/composer-starter-panel";
import type { ComposerMessage } from "@/components/composer-starter-panel";
import type { AgentListing, ExtensionListing } from "@/lib/catalog/types";
import { useComposerSelection } from "@/lib/composer/use-composer-selection";
import { usePrimaryAgentSecrets } from "@/lib/composer/use-primary-agent-secrets";

export function ComposerWorkspace({
  agents,
  extensions,
}: {
  agents: AgentListing[];
  extensions: ExtensionListing[];
}) {
  const {
    clear,
    removeAgent,
    removeExtension,
    selection,
    toggleAgent,
    toggleExtension,
  } = useComposerSelection();

  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<ComposerMessage | null>(null);

  // Preserve selection order — the export API treats the first slug as the
  // primary agent, so the panel must mirror that, not catalog order.
  const selectedAgents = useMemo(
    () =>
      selection.agents
        .map((slug) => agents.find((agent) => agent.slug === slug))
        .filter((agent): agent is AgentListing => Boolean(agent)),
    [agents, selection.agents]
  );

  const selectedExtensions = useMemo(
    () =>
      selection.extensions
        .map((slug) => extensions.find((ext) => ext.slug === slug))
        .filter((ext): ext is ExtensionListing => Boolean(ext)),
    [extensions, selection.extensions]
  );

  const primaryAgent = selectedAgents[0] ?? null;
  const secrets = usePrimaryAgentSecrets(primaryAgent?.slug ?? null);

  function handleClear() {
    clear();
    setMessage(null);
  }

  async function handleExport() {
    if (selection.agents.length === 0) {
      setMessage({
        text: "Select at least one agent to export.",
        tone: "error",
      });
      return;
    }

    setExporting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/composer/export", {
        body: JSON.stringify(selection),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${selection.agents[0]}-starter.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage({ text: "Starter archive downloaded.", tone: "info" });
    } catch {
      setMessage({
        text: "Could not export starter. Try again.",
        tone: "error",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div
        className="animate-enter"
        style={{ "--stagger": 3 } as CSSProperties}
      >
        <ComposerPicker
          agents={agents}
          extensions={extensions}
          selectedAgentSlugs={selection.agents}
          selectedExtensionSlugs={selection.extensions}
          onToggleAgent={toggleAgent}
          onToggleExtension={toggleExtension}
        />
      </div>

      <div
        className="animate-enter space-y-5 lg:sticky lg:top-24"
        style={{ "--stagger": 4 } as CSSProperties}
      >
        <ComposerStarterPanel
          selectedAgents={selectedAgents}
          selectedExtensions={selectedExtensions}
          secrets={secrets}
          exporting={exporting}
          message={message}
          onExport={handleExport}
          onClear={handleClear}
          onRemoveAgent={removeAgent}
          onRemoveExtension={removeExtension}
        />
        <AisdkCta campaign="composer-export" compact />
      </div>
    </div>
  );
}
