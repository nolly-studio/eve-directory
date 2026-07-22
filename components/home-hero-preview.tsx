"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PreviewTab {
  id: string;
  label: string;
  codeTitle: string;
  code: string;
  previewTitle: string;
  preview: ReactNode;
}

interface HomeHeroPreviewProps {
  tabs: PreviewTab[];
}

function WindowChrome({
  title,
  trailing,
}: {
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-gray-500/40" />
          <span className="size-2.5 rounded-full bg-gray-500/30" />
          <span className="size-2.5 rounded-full bg-gray-500/20" />
        </div>
        <p className="truncate text-label-12-mono text-gray-700">{title}</p>
      </div>
      {trailing}
    </div>
  );
}

function CodePanel({ title, code }: { title: string; code: string }) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className="shadow-surface flex min-h-[280px] min-w-0 max-w-full flex-col overflow-hidden rounded-xl bg-card md:min-h-[320px]">
      <WindowChrome title={title} />
      <div className="min-w-0 flex-1 overflow-x-auto overflow-y-auto p-4">
        <pre className="inline-block min-w-full text-copy-14-mono leading-relaxed">
          {lines.map((line, index) => {
            const isComment = line.trimStart().startsWith("#");
            return (
              <div key={`${index}-${line}`} className="flex gap-4">
                <span className="w-4 shrink-0 select-none text-right text-gray-500 tabular-nums">
                  {index + 1}
                </span>
                <code
                  className={cn(
                    "min-w-0 whitespace-pre",
                    isComment ? "text-gray-700" : "text-gray-1000"
                  )}
                >
                  {line.length > 0 ? line : " "}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

function PreviewPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="shadow-surface flex min-h-[280px] min-w-0 max-w-full flex-col overflow-hidden rounded-xl bg-card md:min-h-[320px]">
      <WindowChrome title={title} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}

export function HomeHeroPreview({ tabs }: HomeHeroPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tabs[activeIndex] ?? tabs[0];

  if (!active) {
    return null;
  }

  function go(delta: number) {
    setActiveIndex((current) => {
      const next = current + delta;
      if (next < 0) {
        return tabs.length - 1;
      }
      if (next >= tabs.length) {
        return 0;
      }
      return next;
    });
  }

  return (
    <div className="w-full min-w-0 max-w-full hidden md:block">
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Product preview"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto p-[1px]"
        >
          {tabs.map((tab, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-label-13 transition-[background-color,color,box-shadow] duration-150 motion-reduce:transition-none",
                  selected
                    ? "bg-card font-medium text-gray-1000 shadow-chip"
                    : "text-gray-700 hover:text-gray-1000"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Previous preview"
            onClick={() => {
              go(-1);
            }}
            className="inline-flex size-8 items-center justify-center rounded-full text-gray-700 transition-[background-color,color] duration-150 hover:bg-muted hover:text-gray-1000 motion-reduce:transition-none"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next preview"
            onClick={() => {
              go(1);
            }}
            className="inline-flex size-8 items-center justify-center rounded-full text-gray-700 transition-[background-color,color] duration-150 hover:bg-muted hover:text-gray-1000 motion-reduce:transition-none"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <CodePanel title={active.codeTitle} code={active.code} />
        <PreviewPanel title={active.previewTitle}>
          {active.preview}
        </PreviewPanel>
      </div>
    </div>
  );
}

export type { PreviewTab };
