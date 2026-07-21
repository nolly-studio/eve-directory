---
cron: "0 14 * * 1-5"
---

Scan open pull requests that need review.

1. List open PRs that have been idle or that match the team's review queue.
2. For each PR, draft a structured review using the skill playbook — verdict, findings ordered by severity, risk callouts, and test gaps.
3. Write drafts to `/workspace/reviews/drafts/`. Do not post reviews or request changes; posting requires human approval via `post_review` in a live session.
