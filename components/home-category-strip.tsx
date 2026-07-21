import { ButtonLink } from "@/components/ui/button-link";
import type { Category } from "@/lib/catalog/types";

interface CategoryWithCount {
  category: Category;
  count: number;
}

interface HomeCategoryStripProps {
  categories: CategoryWithCount[];
}

/** Quiet browse facet above the footer — chips at chip scale, no section anatomy. */
export function HomeCategoryStrip({ categories }: HomeCategoryStripProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-label-12-mono text-gray-700">Browse by category</p>
          <ButtonLink href="/agents" variant="ghost" size="sm">
            All agents
          </ButtonLink>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(({ category, count }) => (
            <ButtonLink
              key={category.slug}
              href={`/categories/${category.slug}`}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              {category.name}
              <span className="text-label-12 text-gray-700 tabular-nums">
                {count}
              </span>
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
