# Security

Report vulnerabilities privately. Do not open a public GitHub issue for a security problem in Eve Directory, the catalog install path, or auth flows.

## Report a vulnerability

Email **hello@evedirectory.com** with subject line `Security report` and:

- A description of the issue and its impact
- Steps to reproduce, or a proof of concept
- Affected paths (for example `/api/auth`, `/submit`, `/r/<slug>.json`)
- Whether you plan to disclose publicly and on what timeline

You should receive an acknowledgement within a few business days. We will coordinate a fix and disclosure window when the report is confirmed.

## Scope

In scope for this repository:

- The Eve Directory Next.js app (auth, community submit, composer export, APIs)
- Curated catalog packaging and the shadcn registry build under `public/r/`
- Dependency issues that are exploitable through this project's documented install or run paths

Out of scope unless they are specific to this project:

- Vulnerabilities in [Eve](https://eve.dev) itself (report upstream)
- Issues that require physical access, social engineering, or stolen credentials
- Reports from automated scanners without a demonstrated impact

## Safe harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption
- Report promptly and keep details private until we confirm a fix or agree on disclosure
- Do not access data that is not their own beyond what is needed to demonstrate the issue
