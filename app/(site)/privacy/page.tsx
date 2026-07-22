import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  description: `How ${SITE.name} handles privacy for the open Eve agent catalog.`,
  pathname: "/privacy",
  title: "Privacy Policy",
});

export default function PrivacyPage() {
  return (
    <PageShell narrow>
      <h1 className="text-heading-32 font-semibold tracking-tighter text-balance text-gray-1000 [--font-weight-semibold:450]">
        Privacy Policy
      </h1>
      <div className="mt-6 max-w-prose space-y-4 text-copy-16 leading-relaxed text-gray-900">
        <p>
          {SITE.name} v1 does not require accounts and does not collect
          analytics by default. Composer selections may be stored locally in
          your browser.
        </p>
        <p>
          If you follow outbound links (for example to aisdkagents.com), those
          sites operate under their own privacy policies.
        </p>
      </div>
    </PageShell>
  );
}
