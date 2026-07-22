import { IntegrationCard } from "@/components/integration-card";
import { StepMarker } from "@/components/step-marker";
import { ButtonLink } from "@/components/ui/button-link";
import type { OfficialIntegration } from "@/lib/catalog/types";

interface FeaturedIntegration {
  integration: OfficialIntegration;
  agentCount: number;
}

interface HomeIntegrationsSectionProps {
  integrations: FeaturedIntegration[];
}

export function HomeIntegrationsSection({
  integrations,
}: HomeIntegrationsSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20">
      <div className="mb-8 grid grid-cols-12 items-end gap-x-6 gap-y-4">
        <div className="col-span-full lg:col-span-5">
          <StepMarker step={3} className="mb-3" />
          <h2 className="text-heading-32 font-semibold text-balance text-gray-1000 [--font-weight-semibold:450] lg:text-heading-40">
            Filter by what you already run
          </h2>
        </div>
        <div className="col-span-full flex justify-end lg:col-span-5 lg:col-start-8">
          <ButtonLink href="/integrations" variant="ghost" size="sm">
            View all
          </ButtonLink>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map(({ agentCount, integration }) => (
          <IntegrationCard
            key={integration.slug}
            integration={integration}
            agentCount={agentCount}
          />
        ))}
      </div>
    </section>
  );
}
