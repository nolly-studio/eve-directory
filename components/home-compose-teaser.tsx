import { FileRow } from "@/components/file-row";
import { StepMarker } from "@/components/step-marker";
import { ButtonLink } from "@/components/ui/button-link";
import type { AgentListing, ExtensionListing } from "@/lib/catalog/types";

interface HomeComposeTeaserProps {
  agents: AgentListing[];
  extensions: ExtensionListing[];
}

const STEPS = [
  {
    title: "Pick from the catalog",
    body: "Add any agents and extensions to your stack — mix roles freely.",
  },
  {
    title: "Review before you commit",
    body: "See the composition graph and every required secret up front.",
  },
  {
    title: "Export a runnable starter",
    body: "Download starter.zip with full source. No login, no gate.",
  },
];

/** Static mock of the composer workspace — stack in, starter.zip out. */
function ComposerMock({ agents, extensions }: HomeComposeTeaserProps) {
  const stackAgents = agents.slice(0, 2);
  const [stackExtension] = extensions;

  return (
    <div className="shadow-surface overflow-hidden rounded-xl bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-gray-500/40" />
          <span className="size-2.5 rounded-full bg-gray-500/30" />
          <span className="size-2.5 rounded-full bg-gray-500/20" />
        </div>
        <p className="truncate text-label-12-mono text-gray-700">composer</p>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <p className="text-label-12-mono text-gray-700">Your stack</p>
        <ul className="space-y-1">
          {stackAgents.map((agent) => (
            <FileRow key={agent.slug} name={agent.slug} status="agent" />
          ))}
          {stackExtension ? (
            <FileRow name={stackExtension.slug} status="extension" />
          ) : null}
          <FileRow name="+ add agents or extensions" muted />
        </ul>
        <p className="text-label-12-mono text-gray-700">Export</p>
        <ul className="space-y-1">
          <FileRow name="starter.zip" status="ready" />
        </ul>
      </div>
    </div>
  );
}

export function HomeComposeTeaser({
  agents,
  extensions,
}: HomeComposeTeaserProps) {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-4">
          <div className="col-span-full lg:col-span-5">
            <StepMarker step={2} className="mb-3" />
            <h2 className="text-heading-32 font-semibold text-balance text-gray-1000 [--font-weight-semibold:450] lg:text-heading-40">
              Compose a starter
            </h2>
          </div>
          <p className="col-span-full text-copy-16 text-pretty text-gray-900 lg:col-span-5 lg:col-start-8">
            Pick agents and extensions, review the graph and required secrets,
            then export a runnable starter for your Eve project.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-12 items-center gap-x-6 gap-y-10">
          <div className="col-span-full lg:col-span-5">
            <ol className="space-y-6">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 text-label-12-mono text-gray-500 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-copy-16 font-medium text-gray-1000">
                      {step.title}
                    </p>
                    <p className="mt-1 text-copy-14 text-pretty text-gray-700">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/composer">Open the composer</ButtonLink>
              <ButtonLink href="/docs/compose-vs-clone" variant="ghost">
                Compose vs. clone
              </ButtonLink>
            </div>
          </div>
          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            <ComposerMock agents={agents} extensions={extensions} />
          </div>
        </div>
      </div>
    </section>
  );
}
