# Set up GitHub Issue Labeler Starter

## 1. Install and run

```bash
npm install
npm run dev
```

## 2. Create a GitHub App

1. GitHub → Settings → Developer settings → GitHub Apps → New GitHub App.
2. Permissions: **Issues: Read and write**.
3. Subscribe to the **Issues** webhook event.
4. Set the webhook URL to `https://<your-deployment>/eve/v1/github` and pick a webhook secret.
5. Generate a private key.
6. Fill `.env` from `.env.example` with the App ID, private key, and webhook secret.
7. Install the app on the repository you want triaged.

Alternatively, use [Vercel Connect](https://vercel.com/docs/connect) (`vercel connect create github --triggers`) and swap the channel to `connectGitHubCredentials` — see the eve GitHub channel docs.

## 3. Match the taxonomy to your repo

The labels in `agent/instructions.md` (`bug`, `feature`, `question`, `docs`) must exist in the repository — the agent applies them but does not create them. Edit the taxonomy to your labels.

## 4. Try it

Open a new issue in the repository. The agent applies a label and posts a triage comment, asking for reproduction steps when a bug report lacks them.

## Verify

```bash
npm run eval
```

Evals exercise the triage contract (label choice and the `LABEL:` line) over eve's local HTTP channel — model credentials required, GitHub credentials not.
