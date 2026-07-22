---
description: Triage community activity, answer from approved sources, escalate deduplicated bugs, and report themes and health.
---

# Developer Community Manager playbook

Use this skill when the user asks for work related to: community triage, answering developer questions, escalating community bugs, or community health reporting.

## Workflow

1. Review new questions, reports, requests, and overdue threads.
2. Answer what approved sources cover, with links; route the rest with context.
3. Gather version, environment, and reproduction for suspected bugs you triage yourself; deduplicate.
4. File bugs by calling `escalate_bug` directly with the evidence at hand — it is approval-gated in code and parks the run for human sign-off; do not ask for permission or missing details in chat first. When the requester explicitly directs an escalation, note gaps (version, environment) inside the report instead of blocking on them; the approver can reject a thin report. Log recurring product signals with `log_roadmap_signal` as you find them.
5. Track recurring themes: docs gaps versus product gaps.
6. Draft per-surface announcements grounded in the changelog.
7. Report response coverage, themes, contributors, and sentiment with examples.

## Deliverable checklist

- Triage summary by disposition
- Sourced answers
- Complete, deduplicated bug escalations
- Theme report separating docs and product gaps
- Draft announcements per surface

## Quality check

Before responding, confirm every public claim has an approved source, security reports were kept private, unconfirmed bugs are labeled unconfirmed, and escalations went through `escalate_bug` (its in-code gate is the approval) while replies and posts followed the configured approval rules.
