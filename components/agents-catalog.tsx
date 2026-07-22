"use client";

import {
  ArrowDown01Icon,
  Link01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDeferredValue, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  IntegrationLogo,
  IntegrationMark,
} from "@/components/integration-badge";
import { AgentCard, agentCardKey } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  AgentTierFilter,
  IntegrationFilterOption,
} from "@/lib/catalog/agent-filters";
import {
  filterAgents,
  groupIntegrationFilterOptions,
} from "@/lib/catalog/agent-filters";
import type { Category, DirectoryAgent } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface AgentsCatalogProps {
  agents: DirectoryAgent[];
  categories: Category[];
  integrations: IntegrationFilterOption[];
}

function IntegrationOption({
  selected,
  title,
  subtitle,
  icon,
  onSelect,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors duration-150",
        "hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        selected && "bg-muted"
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-copy-14 font-medium text-gray-1000">
          {title}
        </span>
        <span className="block truncate text-label-12 text-muted-foreground">
          {subtitle}
        </span>
      </span>
      {selected ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={1.5}
          className="size-4 shrink-0 text-foreground"
        />
      ) : null}
    </button>
  );
}

const TIER_OPTIONS: { value: AgentTierFilter; label: string }[] = [
  { value: "all", label: "All tiers" },
  { value: "official", label: "Official" },
  { value: "community", label: "Community" },
];

export function AgentsCatalog({
  agents,
  categories,
  integrations,
}: AgentsCatalogProps) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [integrationSlug, setIntegrationSlug] = useState<string | null>(null);
  const [tier, setTier] = useState<AgentTierFilter>("all");
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [integrationQuery, setIntegrationQuery] = useState("");

  const deferredQuery = useDeferredValue(query);
  const deferredIntegrationQuery = useDeferredValue(integrationQuery);

  const selectedIntegration =
    integrations.find((item) => item.slug === integrationSlug) ?? null;

  const filteredIntegrations = useMemo(() => {
    const normalized = deferredIntegrationQuery.trim().toLowerCase();
    if (!normalized) {
      return integrations;
    }

    return integrations.filter((item) => {
      const haystack = [item.name, item.slug, item.badge]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [deferredIntegrationQuery, integrations]);

  const integrationGroups = useMemo(
    () => groupIntegrationFilterOptions(filteredIntegrations),
    [filteredIntegrations]
  );

  const filteredAgents = useMemo(
    () =>
      filterAgents({
        agents,
        categorySlug,
        integrationSlug,
        query: deferredQuery,
        tier,
      }),
    [agents, categorySlug, deferredQuery, integrationSlug, tier]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search from ${agents.length} agents`}
            aria-label="Search agents"
            className="h-10 rounded-xl pl-9"
          />
        </div>

        <Popover
          open={integrationOpen}
          onOpenChange={(open) => {
            setIntegrationOpen(open);
            if (!open) {
              setIntegrationQuery("");
            }
          }}
        >
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 justify-between gap-2 rounded-xl px-3 sm:min-w-52"
              />
            }
          >
            <span className="flex min-w-0 items-center gap-2">
              {selectedIntegration ? (
                <span className="flex size-5 items-center justify-center rounded-md bg-muted/60">
                  <IntegrationLogo
                    slug={selectedIntegration.slug}
                    className="size-3.5"
                  />
                </span>
              ) : (
                <HugeiconsIcon
                  icon={Link01Icon}
                  strokeWidth={1.5}
                  className="size-4 text-muted-foreground"
                  data-icon="inline-start"
                />
              )}
              <span className="truncate">
                {selectedIntegration?.name ?? "All integrations"}
              </span>
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={1.5}
              className="size-4 text-muted-foreground"
              data-icon="inline-end"
            />
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-80 gap-0 p-2">
            <div className="px-1 pt-1 pb-2">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={integrationQuery}
                  onChange={(event) => setIntegrationQuery(event.target.value)}
                  placeholder="Search integrations"
                  aria-label="Search integrations"
                  className="h-9 rounded-lg pl-8"
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto px-1 pb-1">
              <IntegrationOption
                selected={integrationSlug === null}
                title="All integrations"
                subtitle="Show every agent"
                icon={
                  <IntegrationMark className="size-8 rounded-lg shadow-none">
                    <HugeiconsIcon
                      icon={Link01Icon}
                      strokeWidth={1.5}
                      className="size-4 text-muted-foreground"
                    />
                  </IntegrationMark>
                }
                onSelect={() => {
                  setIntegrationSlug(null);
                  setIntegrationOpen(false);
                  setIntegrationQuery("");
                }}
              />

              {integrationGroups.map((group) => (
                <div key={group.category} className="mt-2">
                  <p className="px-2 py-1.5 text-label-12 font-medium text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <IntegrationOption
                        key={item.slug}
                        selected={integrationSlug === item.slug}
                        title={item.name}
                        subtitle={item.badge}
                        icon={
                          <IntegrationMark
                            slug={item.slug}
                            className="size-8"
                          />
                        }
                        onSelect={() => {
                          setIntegrationSlug(item.slug);
                          setIntegrationOpen(false);
                          setIntegrationQuery("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {filteredIntegrations.length === 0 ? (
                <p className="px-2 py-6 text-center text-copy-14 text-muted-foreground">
                  No integrations match.
                </p>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {TIER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={tier === option.value ? "default" : "outline"}
            onClick={() => setTier(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={categorySlug === null ? "default" : "outline"}
          onClick={() => setCategorySlug(null)}
        >
          All agents
        </Button>
        {categories.map((category) => (
          <Button
            key={category.slug}
            type="button"
            size="sm"
            variant={categorySlug === category.slug ? "default" : "outline"}
            onClick={() => setCategorySlug(category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {filteredAgents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard key={agentCardKey(agent)} agent={agent} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-copy-14 text-muted-foreground">
          No agents match these filters.
        </p>
      )}
    </div>
  );
}
