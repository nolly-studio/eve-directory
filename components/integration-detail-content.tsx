import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Fragment } from "react";
import type { ReactNode } from "react";

import type {
  IntegrationDetailBlock,
  IntegrationDetailSection,
} from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** Renders scraped paragraph text with `` `inline code` `` spans. */
function InlineRichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  const nodes: ReactNode[] = [];

  for (const [index, part] of parts.entries()) {
    if (!part) {
      continue;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      nodes.push(
        <code
          key={`code-${index}`}
          className="rounded-md bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
      continue;
    }
    nodes.push(<Fragment key={`text-${index}`}>{part}</Fragment>);
  }

  return nodes;
}

function SectionBlock({
  block,
  nextType,
}: {
  block: IntegrationDetailBlock;
  nextType: IntegrationDetailBlock["type"] | null;
}) {
  switch (block.type) {
    case "paragraph": {
      // Keep lead-in copy tight to the code it introduces.
      return (
        <p
          className={cn(
            "max-w-2xl text-copy-14 text-pretty text-gray-900",
            nextType === "code" && "mb-2",
            nextType === "paragraph" && "mb-3"
          )}
        >
          <InlineRichText text={block.text} />
        </p>
      );
    }
    case "code": {
      return (
        <div className={cn(nextType && "mb-5")}>
          <DynamicCodeBlock
            lang={block.language}
            code={block.code}
            codeblock={{ allowCopy: true, className: "my-0" }}
          />
        </div>
      );
    }
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/**
 * Eve-style Install / Quick start / Configure body for an integration detail
 * page — section headings, prose, and highlighted code blocks with dividers.
 */
export function IntegrationDetailContent({
  sections,
}: {
  sections: IntegrationDetailSection[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-border border-t border-border">
      {sections.map((section) => (
        <section key={section.title} className="py-8">
          <h2 className="text-heading-24 font-semibold tracking-tight text-gray-1000">
            {section.title}
          </h2>
          <div className="mt-3">
            {section.blocks.map((block, index) => (
              <SectionBlock
                key={`${section.title}-${index}`}
                block={block}
                nextType={section.blocks[index + 1]?.type ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
