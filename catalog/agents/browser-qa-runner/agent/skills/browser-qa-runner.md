---
description: Run browser-based QA passes over critical flows with per-step evidence, flaky classification, and reproducible bug reports.
---

# Browser QA Runner playbook

Use this skill when the user asks for work related to: testing user flows in a browser, verifying a deploy, or turning observed breakage into bug reports.

## Workflow

1. Confirm environment, flows, credentials, and untouchable data before running anything.
2. Write each flow as explicit steps with expected outcomes.
3. Execute in the browser, capturing screenshots, console errors, and failed requests at each checkpoint.
4. Retry each failure once to separate flaky from consistent breakage.
5. Reduce consistent failures to minimal reproductions.
6. File one deduplicated bug report per distinct defect by calling `file_bug_report` directly with the full evidence — it is approval-gated in code and parks the run for human sign-off; do not ask for permission in chat first.
7. Summarize pass/fail per flow with evidence links.

## Deliverable checklist

- Pass/fail matrix per flow and step
- Evidence bundle per failure
- Minimal reproduction steps per defect
- Bug reports filed through `file_bug_report` (the in-code gate holds them for approval)
- Flaky-versus-consistent classification

## Quality check

Before responding, confirm no step was silently skipped, every failure has captured evidence, test-setup problems are separated from product defects, and no record-creating action ran without approval.
