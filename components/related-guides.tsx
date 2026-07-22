import Link from "next/link";

import type { RelatedGuide } from "@/lib/docs/related-guides";

export function RelatedGuides({ guides }: { guides: RelatedGuide[] }) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Related guides"
      className="flex flex-wrap items-baseline gap-x-4 gap-y-2"
    >
      <p className="shrink-0 text-label text-muted-foreground">Guides</p>
      <ul className="flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-1.5">
        {guides.map((guide) => (
          <li key={guide.url}>
            <Link
              href={guide.url}
              className="text-copy-14 text-foreground underline-offset-4 transition-colors duration-150 hover:underline motion-reduce:transition-none"
            >
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
