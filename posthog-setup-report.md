# PostHog post-wizard report

The wizard completed a deep PostHog integration for this Next.js App Router project. It installed the browser and server SDKs, initialized browser analytics and exception capture, added a server client with per-request flushing, configured an ingestion proxy, identified authenticated users, reset identity on logout, and instrumented critical composer and community publishing flows. PostHog configuration is sourced from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.

| Event | Description | File |
| --- | --- | --- |
| `agent_added_to_composer` | A visitor adds an agent or extension to the composer from a listing. | `components/add-to-composer-button.tsx` |
| `composer_export_requested` | A visitor requests a starter archive export from the composer. | `components/composer-workspace.tsx` |
| `composer_export_completed` | A starter archive is successfully generated and returned by the export API. | `app/api/composer/export/route.ts` |
| `setup_prompt_copied` | A visitor copies an agent setup prompt to the clipboard. | `components/setup-with-prompt-button.tsx` |
| `user_signed_in` | An authenticated session becomes available and the user is identified. | `components/auth-menu.tsx` |
| `user_signed_out` | An authenticated user signs out from the account menu. | `components/auth-menu.tsx` |
| `community_agent_published` | A signed-in author successfully publishes a new community agent. | `app/(site)/submit/actions.ts` |
| `community_agent_updated` | A signed-in author successfully updates a community agent. | `app/(site)/submit/actions.ts` |
| `community_agent_unpublished` | A signed-in author removes a community agent from the published directory. | `app/(site)/submit/actions.ts` |

## Next steps

We've built insights and a dashboard to monitor user behavior based on the newly instrumented events:

- [Analytics basics dashboard (wizard)](https://us.posthog.com/project/523081/dashboard/1886564)
- [Composer export funnel (wizard)](https://us.posthog.com/project/523081/insights/MC04aoNQ)
- [Community publishing activity (wizard)](https://us.posthog.com/project/523081/insights/vTOl2YNK)
- [Community agent unpublishes (wizard)](https://us.posthog.com/project/523081/insights/8DcDMkSd)
- [Setup prompt adoption (wizard)](https://us.posthog.com/project/523081/insights/kIxJfZvm)
- [Authentication activity (wizard)](https://us.posthog.com/project/523081/insights/pYLFX1tZ)

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard successfully ran `pnpm typecheck` and `pnpm build`, but CI and deployment settings may differ.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the deployment bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify`; the authenticated menu now identifies any already-loaded session as well as fresh sessions.
- [ ] PostgreSQL and Twilio data sources were found; run `npx @posthog/wizard warehouse` to connect them to PostHog's data warehouse.

### Agent skill

We've left an agent skill folder in the project. This context can support further PostHog development in Claude Code with current Next.js integration guidance.
