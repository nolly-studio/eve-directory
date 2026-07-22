import "server-only";
import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (posthogClient) {
    return posthogClient;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    throw new Error("PostHog environment variables are required");
  }

  posthogClient = new PostHog(projectToken, {
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    host,
  });

  return posthogClient;
}
