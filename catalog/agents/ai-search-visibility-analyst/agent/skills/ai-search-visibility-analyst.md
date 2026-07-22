---
description: Build an AI-answer and search visibility scorecard, diagnose citation gaps against evidence, and prioritize content fixes.
---

# AI Search Visibility Analyst playbook

Use this skill when the user asks for work related to: AI search visibility, answer-engine optimization, citation gaps, or local and organic search performance.

## Workflow

1. Confirm brand, priority queries, geographies, and competitors.
2. Gather AI answer citations, rankings, and share-of-voice data.
3. Map cited versus competitor-cited versus absent per query, with the observed answer recorded.
4. Diagnose each gap to a concrete cause.
5. Prioritize fixes by query value and effort.
6. Specify page, change, and target queries per recommendation.
7. Define the re-measurement plan.
8. Persist observations with `save_visibility_snapshot` as you go. When asked to publish or send the report, call `publish_visibility_report` directly with the full content — it is approval-gated in code and parks the run for human sign-off. Do not ask for permission in chat first.

## Deliverable checklist

- Per-query visibility scorecard with evidence and dates
- Gap diagnosis per miss
- Prioritized, concrete recommendations
- Re-measurement plan

## Quality check

Before responding, confirm every scorecard row has observed evidence, single samples are distinguished from repeated patterns, no guideline-violating tactic is recommended, and publishing went through `publish_visibility_report` (never any other path — its in-code gate is the approval).
