import Link from "next/link";

import { CommandBar } from "@/components/command-bar";
import { Surface } from "@/components/ui/surface";
import { siteUrl } from "@/lib/site";

interface InstallCommandProps {
  slug: string;
  kind?: "agent" | "extension";
}

export function InstallCommand({ slug, kind = "agent" }: InstallCommandProps) {
  const addCommand = `npx shadcn@latest add @evedirectory/${slug}`;
  const registryCommand =
    "npx shadcn@latest registry add @evedirectory=https://evedirectory.com/r/{name}.json";
  const itemJsonUrl = siteUrl(`/r/${slug}.json`);

  return (
    <Surface className="space-y-4 p-4">
      <div>
        <p className="text-label">Install with shadcn</p>
        <p className="mt-1 text-copy-14 text-pretty text-muted-foreground">
          Drops the full {kind} into your Eve project — same CLI as UI blocks.
        </p>
      </div>

      <CommandBar command={addCommand} className="w-full" />

      <details className="group text-copy-14">
        <summary className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
          First time? Add the @evedirectory registry
        </summary>
        <div className="mt-3 space-y-3">
          <CommandBar command={registryCommand} className="w-full" />
          <p className="text-copy-14 text-pretty text-muted-foreground">
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

      <p className="text-copy-14 text-muted-foreground">
        Raw item:{" "}
        <a
          href={itemJsonUrl}
          className="font-mono text-caption text-foreground underline-offset-4 hover:underline"
        >
          /r/{slug}.json
        </a>
      </p>
    </Surface>
  );
}
