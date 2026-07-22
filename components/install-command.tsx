import Link from "next/link";

import { CommandBar } from "@/components/command-bar";
import { IntegrationMark } from "@/components/integration-badge";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Surface } from "@/components/ui/surface";
import { communityRegistryPath } from "@/lib/community/paths";
import { siteUrl } from "@/lib/site";

interface InstallCommandProps {
  slug: string;
  kind?: "agent" | "extension";
  handle?: string;
}

export function InstallCommand({
  slug,
  kind = "agent",
  handle,
}: InstallCommandProps) {
  const isCommunity = Boolean(handle);

  if (isCommunity && handle) {
    const registryPath = communityRegistryPath(handle, slug);
    const itemJsonUrl = siteUrl(registryPath);
    const addCommand = `npx shadcn@latest add ${itemJsonUrl}`;

    return (
      <Surface className="space-y-3 p-4">
        <div className="flex gap-3">
          <IntegrationMark className="overflow-hidden p-0 size-7">
            <ShadcnIcon className="size-7" />
          </IntegrationMark>
          <div className="min-w-0">
            <p className="text-label">Install with shadcn</p>
            <p className="mt-0.5 text-label-12 text-pretty text-muted-foreground">
              Community-submitted. Generated from the standard Eve starter
              template — instructions authored by @{handle.replace(/^@/, "")}.
            </p>
          </div>
        </div>

        <CommandBar command={addCommand} className="w-full" />

        <p className="text-label-12 text-muted-foreground">
          Raw item:{" "}
          <a
            href={itemJsonUrl}
            className="font-mono text-caption text-foreground underline-offset-4 hover:underline"
          >
            {registryPath}
          </a>
        </p>
      </Surface>
    );
  }

  const addCommand = `npx shadcn@latest add @evedirectory/${slug}`;
  const registryCommand =
    "npx shadcn@latest registry add @evedirectory=https://www.evedirectory.com/r/{name}.json";
  const itemJsonUrl = siteUrl(`/r/${slug}.json`);

  return (
    <Surface className="space-y-3 p-4">
      <div className="flex gap-3">
        <IntegrationMark className="overflow-hidden p-0 size-7">
          <ShadcnIcon className="size-7" />
        </IntegrationMark>
        <div className="min-w-0">
          <p className="text-label">Install with shadcn</p>
          <p className="mt-0.5 text-label-12 text-pretty text-muted-foreground">
            Drops the full {kind} into your Eve project — same CLI as UI blocks.
          </p>
        </div>
      </div>

      <CommandBar command={addCommand} className="w-full" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <details className="group min-w-0 flex-1 text-label-12">
          <summary className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
            First time? Add the @evedirectory registry
          </summary>
          <div className="mt-2 space-y-2">
            <CommandBar command={registryCommand} className="w-full" />
            <p className="text-label-12 text-pretty text-muted-foreground">
              Or paste the URL template into{" "}
              <code className="font-mono text-caption text-foreground">
                components.json
              </code>{" "}
              under{" "}
              <code className="font-mono text-caption text-foreground">
                registries
              </code>
              . See the{" "}
              <Link
                href="/docs/install-with-shadcn"
                className="text-foreground underline-offset-4 hover:underline"
              >
                install guide
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="shrink-0 text-label-12 text-muted-foreground">
          Raw item:{" "}
          <a
            href={itemJsonUrl}
            className="font-mono text-caption text-foreground underline-offset-4 hover:underline"
          >
            /r/{slug}.json
          </a>
        </p>
      </div>
    </Surface>
  );
}
