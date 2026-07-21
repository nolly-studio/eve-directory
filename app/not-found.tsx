import { PageShell } from "@/components/page-shell";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <PageShell className="flex min-h-[50vh] max-w-lg flex-col items-start justify-center">
      <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450]">
        Not found
      </h1>
      <p className="mt-3 text-copy-16 text-pretty text-gray-900">
        That listing is not in the catalog yet.
      </p>
      <ButtonLink href="/agents" className="mt-6">
        Browse agents
      </ButtonLink>
    </PageShell>
  );
}
