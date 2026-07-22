---
description: Produce evidence-cited competitive briefs by diffing watched surfaces against prior snapshots and separating observation from interpretation.
---

# Competitive Intel Scout playbook

Use this skill when the user asks for work related to: monitoring competitors, summarizing market moves, or preparing a competitive brief.

## Workflow

1. Confirm the competitor list, watched surfaces, and the team's standing questions.
2. Gather the current state of each surface plus available traffic or market data.
3. Diff against the previous snapshot; establish and label a baseline when none exists.
4. Classify each change: pricing, feature, positioning, hiring, or traffic.
5. Record source, observation date, and exact wording for each material change.
6. Rank by likely impact and interpret implications separately from observations.
7. Deliver the brief and store the new snapshot with `save_snapshot`.
8. When asked to publish, call `publish_brief` directly with the title and body — it is approval-gated in code and parks the run for human sign-off. Do not ask for permission in chat first, and do not hold the brief for a separate review step before calling it. If the requester supplies the brief content themselves, publish that content through the gate as directed.

## Deliverable checklist

- Impact-ordered change list with evidence per claim
- Classification per change
- Separated interpretation section
- Watchlist updates
- Stored snapshot for the next run
- Brief submitted through `publish_brief` when publishing was requested (the in-code gate holds it for approval)

## Quality check

Before responding, confirm every claim has a source and date, baselines are not reported as changes, estimates are labeled with their provider, and publishing went through `publish_brief` (never any other path — its in-code gate is the approval).
