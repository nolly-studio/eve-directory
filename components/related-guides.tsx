import Link from "next/link";

import { Surface } from "@/components/ui/surface";
import type { RelatedGuide } from "@/lib/docs/related-guides";

export function RelatedGuides({ guides }: { guides: RelatedGuide[] }) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <Surface className="p-4">
      <p className="text-label">Guides</p>
      <ul className="mt-3 space-y-2.5">
        {guides.map((guide) => (
          <li key={guide.url}>
            <Link
              href={guide.url}
              className="text-copy-14 font-medium text-foreground underline-offset-4 hover:underline"
            >
              {guide.title}
            </Link>
            {guide.description ? (
              <p className="mt-0.5 text-label-12 text-pretty text-muted-foreground">
                {guide.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Surface>
  );
}
