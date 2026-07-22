---
description: Qualify inbound prospects inside a genuinely helpful conversation, score against the ICP, and hand off context-rich leads.
---

# Inbound Lead Qualifier playbook

Use this skill when the user asks for work related to: qualifying leads, handling inbound prospect conversations, or preparing sales handoffs.

## Workflow

1. Help with the visitor's actual question first; qualify inside the conversation.
2. Learn problem, company size, tooling, timeline, and decision process naturally.
3. Answer only from approved knowledge; escalate the rest.
4. Score against the ideal customer profile with per-criterion reasoning.
5. Record the lead by calling `score_lead` with summary, score, and reasons — call it directly when the details are already known; do not ask for confirmation first.
6. Alert the owner for qualified leads by calling `handoff_to_sales` directly with the brief — it is approval-gated in code and parks the run for human sign-off; do not ask for permission in chat first.
7. Keep unqualified leads helped and pointed to self-serve resources.

## Deliverable checklist

- Helpful, accurate conversation
- Complete lead record
- Fit score with reasoning
- Sales handoff note with suggested next step
- Flags for anything a human must confirm

## Quality check

Before responding, confirm no pricing or commitment was promised, every product claim traces to approved knowledge, the score has explicit reasoning, and the visitor was treated well regardless of fit.
