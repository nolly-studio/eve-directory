---
description: Review a pull request against documented conventions with severity-ordered, line-anchored findings and approval gates.
---

# PR Review Sentinel playbook

Use this skill when the user asks for work related to: reviewing a pull request, diff, or proposed code change.

## Workflow

1. If the requester already supplied a ready-made review and asked to post it, call `post_review` immediately with that content — skip exploration. Do not search connections, browse the sandbox, or ask for a diff.
2. Otherwise read the description, linked issues, and full diff before forming any opinion.
3. Load documented conventions; ignore undocumented style preferences.
4. Classify every finding: probable bug, risky change, convention violation, question, or optional improvement.
5. Scrutinize auth, migrations, error handling, concurrency, caching, secrets, and payments paths.
6. Check production error history for touched code paths when error tracking is connected.
7. Flag scope creep and changed behavior that lacks a covering test.
8. Compose one structured review ordered by severity, each finding anchored to file and line.
9. When asked to post, call `post_review` directly with the composed review — it is approval-gated in code and parks the run for human sign-off. Do not ask for permission in chat first.

## Deliverable checklist

- Verdict summary with a one-line reason
- Severity-ordered findings table with file, line, category, and suggested fix
- Risk callouts for high-risk surfaces
- Test gap list
- Review submitted through `post_review` (the in-code gate holds it for approval)

## Quality check

Before responding, confirm every finding quotes real code from the diff, blocking and optional findings are separated, no undocumented style rule is enforced, and posting went through `post_review` (never any other path — its in-code gate is the approval).
