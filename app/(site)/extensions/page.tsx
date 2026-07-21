import { AdSlot } from "@/components/ad-slot";
import { ExtensionCard } from "@/components/listing-card";
import { PageHeader, PageShell } from "@/components/page-shell";
import { getExtensions } from "@/lib/catalog";

export default async function ExtensionsPage() {
  const extensions = await getExtensions();

  return (
    <PageShell>
      <PageHeader
        title="Extensions"
        description="Reusable Eve extension packages. Mount under agent/extensions in your project."
        action={
          <AdSlot placement="extensions-sidebar" className="w-full max-w-xs" />
        }
      />
      {extensions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {extensions.map((extension) => (
            <ExtensionCard key={extension.slug} extension={extension} />
          ))}
        </div>
      ) : (
        <p className="text-body text-muted-foreground">
          No extensions published yet.
        </p>
      )}
    </PageShell>
  );
}
