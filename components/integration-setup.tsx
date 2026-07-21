import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

import { IntegrationLogo } from "@/components/integration-badge";
import { StepMarker } from "@/components/step-marker";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  IntegrationDetail,
  IntegrationDetailSection,
} from "@/lib/catalog/types";

const KINDS = ["channel", "connection", "extension"] as const;

type IntegrationKind = (typeof KINDS)[number];

const KIND_COPY: Record<IntegrationKind, { title: string; lead: string }> = {
  channel: {
    lead: "Where the agent listens and replies. Wire at least one channel first so you can talk to it.",
    title: "Channels",
  },
  connection: {
    lead: "Services the agent reads and acts on. Connect these once a channel is live.",
    title: "Connections",
  },
  extension: {
    lead: "Runtime capabilities that extend what the agent can do.",
    title: "Extensions",
  },
};

function kindOf(detail: IntegrationDetail): IntegrationKind {
  const badge = detail.badge?.toLowerCase();
  switch (badge) {
    case "channel":
    case "connection":
    case "extension": {
      return badge;
    }
    default: {
      return "connection";
    }
  }
}

function docsLinkLabel(detail: IntegrationDetail): string {
  const kind = detail.badge ? ` ${detail.badge.toLowerCase()}` : "";
  return `Read the full ${detail.name}${kind} docs`;
}

function SetupSection({
  section,
  step,
}: {
  section: IntegrationDetailSection;
  step: number;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <StepMarker step={step} />
        <h4 className="text-copy-16 font-medium text-gray-1000">
          {section.title}
        </h4>
      </div>
      <div className="mt-2 space-y-3">
        {section.blocks.map((block, index) =>
          block.type === "paragraph" ? (
            <p
              key={`p-${index}-${block.text.slice(0, 24)}`}
              className="max-w-2xl text-copy-14 text-pretty text-gray-900"
            >
              {block.text}
            </p>
          ) : (
            <DynamicCodeBlock
              key={`c-${index}-${block.code.slice(0, 24)}`}
              lang={block.language}
              code={block.code}
              codeblock={{ allowCopy: true, className: "my-0" }}
            />
          )
        )}
      </div>
    </section>
  );
}

function SetupPanel({ detail }: { detail: IntegrationDetail }) {
  return (
    <Surface className="p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <IntegrationLogo slug={detail.slug} className="size-4" />
        <h4 className="text-copy-16 font-medium text-gray-1000">
          {detail.name}
        </h4>
      </div>
      {detail.description ? (
        <p className="mt-2 max-w-2xl text-copy-14 text-pretty text-muted-foreground">
          {detail.description}
        </p>
      ) : null}

      <div className="mt-6 space-y-6">
        {detail.sections.map((section, index) => (
          <SetupSection
            key={section.title}
            section={section}
            step={index + 1}
          />
        ))}
      </div>

      {detail.docsUrl ? (
        <div className="mt-6">
          <ButtonLink
            href={detail.docsUrl}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noreferrer"
          >
            {docsLinkLabel(detail)}
          </ButtonLink>
        </div>
      ) : null}
    </Surface>
  );
}

function SetupGroupTabs({ details }: { details: IntegrationDetail[] }) {
  if (details.length === 1) {
    return <SetupPanel detail={details[0]} />;
  }

  return (
    <Tabs defaultValue={details[0].slug}>
      <TabsList className="h-auto max-w-full flex-wrap justify-start">
        {details.map((detail) => (
          <TabsTrigger key={detail.slug} value={detail.slug}>
            <IntegrationLogo slug={detail.slug} />
            {detail.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {details.map((detail) => (
        <TabsContent key={detail.slug} value={detail.slug}>
          <SetupPanel detail={detail} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * Setup instructions for a listing's integrations, sourced from the scraped
 * eve.dev pages in `catalog/integrations-details.json`.
 *
 * Grouped into a guided journey — channels first (talk to the agent), then
 * connections, then extensions — each group with one tab per integration.
 */
export function IntegrationSetup({
  details,
}: {
  details: IntegrationDetail[];
}) {
  const groups = KINDS.map((kind) => ({
    details: details.filter((detail) => kindOf(detail) === kind),
    kind,
  })).filter((group) => group.details.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {groups.map((group, index) => (
        <section key={group.kind}>
          <div className="flex items-baseline gap-2">
            <StepMarker step={index + 1} />
            <h3 className="text-heading-24 font-semibold text-gray-1000">
              {KIND_COPY[group.kind].title}
            </h3>
            <span className="text-label-12-mono text-gray-700 tabular-nums">
              {group.details.length}
            </span>
          </div>
          <p className="mt-1.5 max-w-2xl text-copy-14 text-pretty text-muted-foreground">
            {KIND_COPY[group.kind].lead}
          </p>
          <div className="mt-4">
            <SetupGroupTabs details={group.details} />
          </div>
        </section>
      ))}
    </div>
  );
}
