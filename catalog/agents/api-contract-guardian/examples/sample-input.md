# Example request

Our OpenAPI spec says `GET /v2/invoices` returns `total` as an integer of cents, but customers report it now comes back as a decimal string. The docs still show the v1 response shape entirely. Here is the spec, a fresh sample response, and the docs page. What broke, when, and what do we tell consumers?

# Expected behavior

Follow the agent workflow: three-way diff the endpoint, classify the type change as breaking with the affected consumers stated, trace when it appeared if history is available, and end with a draft changelog entry, migration note with before/after payloads, and the doc correction — all awaiting approval.
