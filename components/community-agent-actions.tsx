"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { delistCommunityAgent } from "@/app/(site)/submit/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useHasSessionCookie } from "@/lib/auth/session-cookie";
import { cn } from "@/lib/utils";

function AdminDelistButton({ agentId }: { agentId: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <>
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
      {error ? (
        <p className="w-full text-label-12 text-destructive">{error}</p>
      ) : null}
    </>
  );
}

export function CommunityAgentActions({
  agentId,
  reportHref,
}: {
  agentId: string;
  reportHref: string;
}) {
  const likelySignedIn = useHasSessionCookie();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={reportHref}
        className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
      >
        Report
      </a>
      {likelySignedIn ? <AdminDelistButton agentId={agentId} /> : null}
    </div>
  );
}
