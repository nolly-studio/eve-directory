"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { unpublishCommunityAgent } from "@/app/(site)/submit/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";

interface AccountAgent {
  id: string;
  name: string;
  slug: string;
  summary: string;
  status: string;
  installCount: number;
  href: string;
  editHref: string;
}

export function AccountAgents({ agents }: { agents: AccountAgent[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (agents.length === 0) {
    return (
      <Surface className="p-8 text-center">
        <p className="text-copy-14 text-muted-foreground">
          You haven&apos;t submitted any agents yet.
        </p>
        <ButtonLink href="/submit" className="mt-4">
          Submit an agent
        </ButtonLink>
      </Surface>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-copy-14 text-destructive">
          {error}
        </p>
      ) : null}
      {agents.map((agent) => (
        <Surface
          key={agent.id}
          className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={
                  agent.status === "published" ? agent.href : agent.editHref
                }
                className="text-copy-16 font-semibold text-gray-1000 hover:underline hover:underline-offset-4"
              >
                {agent.name}
              </Link>
              <Badge variant="secondary">
                {agent.status === "published" ? "Published" : "Unpublished"}
              </Badge>
            </div>
            <p className="text-copy-14 text-pretty text-muted-foreground">
              {agent.summary}
            </p>
            <p className="font-mono text-label-12 text-muted-foreground tabular-nums">
              {agent.installCount} installs · {agent.slug}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <ButtonLink href={agent.editHref} variant="outline" size="sm">
              Edit
            </ButtonLink>
            {agent.status === "published" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending && pendingId === agent.id}
                onClick={() => {
                  setError(null);
                  setPendingId(agent.id);
                  startTransition(async () => {
                    const result = await unpublishCommunityAgent(agent.id);
                    if (!result.ok) {
                      setError(result.message ?? "Could not unpublish.");
                      return;
                    }
                    router.refresh();
                  });
                }}
              >
                Unpublish
              </Button>
            ) : null}
          </div>
        </Surface>
      ))}
    </div>
  );
}
