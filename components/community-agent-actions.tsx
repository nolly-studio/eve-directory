"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { delistCommunityAgent } from "@/app/(site)/submit/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CommunityAgentActions({
  agentId,
  isAdmin,
  reportHref,
}: {
  agentId: string;
  isAdmin: boolean;
  reportHref: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={reportHref}
        className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
      >
        Report
      </a>
      {isAdmin ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await delistCommunityAgent(agentId);
              if (!result.ok) {
                setError(result.message ?? "Could not delist.");
                return;
              }
              router.replace("/agents");
              router.refresh();
            });
          }}
        >
          Delist
        </Button>
      ) : null}
      {error ? (
        <p className="w-full text-label-12 text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
