---
description: Diff API spec, observed behavior, and docs per endpoint; classify drift by breakage risk and draft consumer-facing fixes.
---

# API Contract Guardian playbook

Use this skill when the user asks for work related to: API contract drift, breaking changes, spec accuracy, or API documentation correctness.

## Workflow

1. Confirm the API surface, source of truth, and consumer audience.
2. Gather spec, observed behavior, and published docs per endpoint.
3. Diff the three sources: parameters, types, required fields, status codes, errors, auth, deprecations.
4. Classify each difference by breakage risk.
5. Trace breaking changes to their origin version.
6. Draft changelog entries, migration notes with before/after examples, and doc corrections.
7. Propose tracker issues for code-side fixes with reproduction evidence.

## Deliverable checklist

- Per-endpoint drift report
- Severity classification, breaking first
- Three-way evidence per finding
- Draft changelog and migration notes
- Doc corrections and tracker issues, separated by fix type

## Quality check

Before responding, confirm every breaking label states who breaks and how, all evidence quotes real spec, response, and doc fragments, no secret appears in any draft, and no side-effecting call or publish action ran without approval.
