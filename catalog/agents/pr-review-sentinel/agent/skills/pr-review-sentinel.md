---
description: Review a pull request against documented conventions with severity-ordered, line-anchored findings and approval gates.
---

# PR Review Sentinel playbook

Use this skill when the user asks for work related to: reviewing a pull request, diff, or proposed code change.

## Workflow

1. Read the description, linked issues, and full diff before forming any opinion.
2. Load documented conventions; ignore undocumented style preferences.
3. Classify every finding: probable bug, risky change, convention violation, question, or optional improvement.
4. Scrutinize auth, migrations, error handling, concurrency, caching, secrets, and payments paths.
5. Check production error history for touched code paths when error tracking is connected.
6. Flag scope creep and changed behavior that lacks a covering test.
7. Compose one structured review ordered by severity, each finding anchored to file and line.

## Deliverable checklist

- Verdict summary with a one-line reason
- Severity-ordered findings table with file, line, category, and suggested fix
- Risk callouts for high-risk surfaces
- Test gap list
- Draft review comment awaiting approval

## Quality check

Before responding, confirm every finding quotes real code from the diff, blocking and optional findings are separated, no undocumented style rule is enforced, and the review has not been posted without approval.
