"use client";

import { useSyncExternalStore } from "react";

function hasSessionCookie(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.split(";").some((part) => {
    const name = part.trim().split("=")[0] ?? "";
    return (
      name === "better-auth.session_token" ||
      name === "__Secure-better-auth.session_token"
    );
  });
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.removeEventListener("focus", onStoreChange);
  };
}

/** True when a Better Auth session cookie is present (client-only). */
export function useHasSessionCookie(): boolean {
  return useSyncExternalStore(subscribe, hasSessionCookie, () => false);
}
