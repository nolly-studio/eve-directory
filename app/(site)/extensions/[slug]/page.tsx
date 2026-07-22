import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { AddToComposerButton } from "@/components/add-to-composer-button";
import { InstallCommand } from "@/components/install-command";
import { PageShell } from "@/components/page-shell";
import { RelatedGuides } from "@/components/related-guides";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";
import {
  getExtension,
  getExtensions,
  readExtensionReadme,
} from "@/lib/catalog";
import { getRelatedGuidesForIntegrations } from "@/lib/docs/related-guides";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const extensions = await getExtensions();
  return extensions.map((extension) => ({ slug: extension.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const extension = await getExtension(slug);

  if (!extension) {
    return {};
  }

  return pageMetadata({
    description: extension.summary,
    pathname: `/extensions/${extension.slug}`,
    title: `${extension.name} — Eve extension`,
  });
}

export default async function ExtensionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const extension = await getExtension(slug);

  if (!extension) {
    notFound();
  }

  const readme = (await readExtensionReadme(slug)) ?? extension.summary;
  const relatedGuides = getRelatedGuidesForIntegrations(extension.integrations);

  return (
    <PageShell>
      <ButtonLink href="/extensions" variant="ghost" size="sm">
        Extensions
      </ButtonLink>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450] md:text-heading-40">
              {extension.name}
            </h1>
            <p className="mt-3 max-w-2xl text-copy-16 text-pretty text-gray-900 md:text-copy-18">
              {extension.summary}
            </p>
          </div>
          <AddToComposerButton slug={extension.slug} kind="extension" />
          <div className="space-y-4">
            <InstallCommand slug={extension.slug} kind="extension" />
            <RelatedGuides guides={relatedGuides} />
          </div>
          <Surface className="overflow-hidden p-0">
            <pre className="max-h-[560px] overflow-auto bg-muted/20 p-4 text-copy-14-mono leading-relaxed whitespace-pre-wrap text-gray-1000">
              {readme}
            </pre>
          </Surface>
        </div>
        <aside className="space-y-5">
          <Surface className="p-4 text-body">
            <p className="text-label">Package</p>
            <dl className="mt-3 space-y-2.5 text-muted-foreground">
              <div className="flex justify-between gap-3">
                <dt>npm</dt>
                <dd className="font-mono text-caption text-foreground">
                  {extension.npm ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Version</dt>
                <dd className="text-foreground tabular-nums">
                  {extension.version}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>License</dt>
                <dd className="text-foreground">{extension.license}</dd>
              </div>
            </dl>
          </Surface>
          <AdSlot placement="extension-detail" />
        </aside>
      </div>
    </PageShell>
  );
}
