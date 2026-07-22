"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton({
  callbackURL = "/account",
  label = "Sign in with GitHub",
}: {
  callbackURL?: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      onClick={() => {
        void authClient.signIn.social({
          provider: "github",
          callbackURL,
        });
      }}
    >
      {label}
    </Button>
  );
}
