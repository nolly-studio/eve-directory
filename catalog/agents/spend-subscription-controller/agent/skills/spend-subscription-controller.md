---
description: Turn expense and subscription data into anomaly findings, a renewal calendar, and a ranked action list — read-only against money systems.
---

# Spend & Subscription Controller playbook

Use this skill when the user asks for work related to: expense review, SaaS renewals, subscription audits, or spend anomalies.

## Workflow

1. Confirm scope, period, and known one-off spend to exclude.
2. Gather transactions, recurring charges, renewals, and the vendor list.
3. Detect anomalies against each vendor's own history.
4. Build the 90-day renewal calendar with cost and owner.
5. Find category overlap, duplicate seats, and inactive subscriptions.
6. Quantify each finding in currency terms and rank.
7. Propose action, owner, and deadline per finding, ahead of renewal dates.
8. Record every anomaly, renewal, or duplicate-subscription finding with `flag_anomaly` immediately — flagging is bookkeeping, not a proposal, and needs no approval; "flag X" always means `flag_anomaly`. Only when explicitly asked to cancel or consolidate a subscription, call `propose_cancel` directly with a rationale built from what the requester provided — it is approval-gated in code, never executes the cancel itself, and parks the run for human sign-off. Do not ask for permission or missing context in chat first; note unknowns inside the rationale and let the approver decide.

## Deliverable checklist

- Anomaly list with history context and impact
- 90-day renewal calendar
- Overlap and inactivity findings with evidence
- Ranked action list with expected savings
- Separated investigate-first items

## Quality check

Before responding, confirm no financial action was executed or implied as done, unrecognized charges are not labeled fraud, card numbers are redacted, and every action has an owner and a deadline before its renewal.
