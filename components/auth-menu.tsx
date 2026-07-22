"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function AuthMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div aria-hidden className="size-8 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!session?.user) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          void authClient.signIn.social({
            provider: "github",
            callbackURL: "/account",
          });
        }}
      >
        Submit
      </Button>
    );
  }

  const handle =
    "handle" in session.user && typeof session.user.handle === "string"
      ? session.user.handle
      : null;
  const image =
    typeof session.user.image === "string" ? session.user.image : null;
  const initials = (session.user.name || "U").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ size: "sm", variant: "ghost" }),
          "size-8 rounded-full p-0"
        )}
        aria-label="Account menu"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar
          <img
            src={image}
            alt=""
            className="size-8 rounded-full object-cover"
            width={32}
            height={32}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-label-12 font-medium">
            {initials}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="truncate text-copy-14 font-medium text-foreground">
            {session.user.name}
          </p>
          {handle ? (
            <p className="truncate text-label-12 text-muted-foreground">
              @{handle}
            </p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/submit" />}>
          Submit agent
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account" />}>
          My agents
        </DropdownMenuItem>
        {handle ? (
          <DropdownMenuItem render={<Link href={`/u/${handle}`} />}>
            Profile
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void authClient.signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
