import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Fragment } from 'react';
import type { ReactNode } from 'react';

import type {
  IntegrationDetailBlock,
  IntegrationDetailSection,
} from "@/lib/catalog/types";

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

function SectionBlock({ block }: { block: IntegrationDetailBlock }) {
  switch (block.type) {
    case "paragraph": {
      return (
        <p className="max-w-2xl text-copy-16 text-pretty text-gray-900">
          <InlineRichText text={block.text} />
        </p>
      );
    }
    case "code": {
      return (
        <DynamicCodeBlock
          lang={block.language}
          code={block.code}
          codeblock={{ allowCopy: true, className: "my-0" }}
        />
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
    <div className="mt-10">
      {sections.map((section, sectionIndex) => (
        <section
          key={section.title}
          className={
            sectionIndex === 0
              ? "border-t border-border pt-10"
              : "mt-10 border-t border-border pt-10"
          }
        >
          <h2 className="text-heading-24 font-semibold tracking-tight text-gray-1000">
            {section.title}
          </h2>
          <div className="mt-4 space-y-4">
            {section.blocks.map((block, index) => (
              <SectionBlock key={`${section.title}-${index}`} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
