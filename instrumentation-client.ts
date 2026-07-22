import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  throw new Error("PostHog environment variables are required");
}

posthog.init(projectToken, {
  api_host: "/ingest",
  ui_host: host,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  defaults: "2026-01-30",
});
