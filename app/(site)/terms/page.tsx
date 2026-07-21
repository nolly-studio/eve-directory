import { PageShell } from "@/components/page-shell";
import { SITE } from "@/lib/site";

export default function TermsPage() {
  return (
    <PageShell narrow>
      <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450]">
        Terms of Service
      </h1>
      <div className="mt-6 max-w-prose space-y-4 text-copy-16 leading-relaxed text-gray-900">
        <p>
          {SITE.name} provides an open catalog of Eve agents and extensions for
          inspection and download. Content is provided as-is under each
          listing&apos;s license.
        </p>
        <p>
          By using this site you agree not to misuse catalog content, attempt to
          bypass security controls, or misrepresent authorship of listed agents.
        </p>
      </div>
    </PageShell>
  );
}
