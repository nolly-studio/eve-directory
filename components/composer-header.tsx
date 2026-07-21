import type { CSSProperties } from "react";

import { StepMarker } from "@/components/step-marker";

export function ComposerHeader({
  agentCount,
  extensionCount,
}: {
  agentCount: number;
  extensionCount: number;
}) {
  const steps = [
    { detail: `${agentCount} in the catalog`, title: "Pick agents" },
    {
      detail:
        extensionCount > 0
          ? `${extensionCount} available`
          : "None in the catalog yet",
      title: "Add extensions",
    },
    { detail: "No login required", title: "Export a starter" },
  ];

  return (
    <header className="mb-10">
      <div className="grid grid-cols-12 items-end gap-x-6 gap-y-4">
        <div
          className="col-span-full animate-enter lg:col-span-5"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
            Composer
          </h1>
        </div>
        <p
          className="col-span-full animate-enter text-copy-16 text-pretty text-gray-900 lg:col-span-6 lg:col-start-7"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          Assemble a starter Eve project — pick agents and extensions, review
          the composition and its required secrets, then export a runnable zip.
        </p>
      </div>

      <ol
        className="mt-6 grid animate-enter grid-cols-1 gap-x-6 gap-y-3 border-t border-border pt-5 sm:grid-cols-3"
        style={{ "--stagger": 2 } as CSSProperties}
      >
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-baseline gap-2.5">
            <StepMarker step={index + 1} />
            <span className="min-w-0">
              <span className="block text-label-13 font-medium text-gray-1000">
                {step.title}
              </span>
              <span className="mt-0.5 block text-label-12 text-gray-700 tabular-nums">
                {step.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </header>
  );
}
