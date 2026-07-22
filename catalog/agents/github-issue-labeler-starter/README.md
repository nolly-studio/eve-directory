# GitHub Issue Labeler Starter

New issue opened → the agent applies one label from your taxonomy and asks for reproduction steps when a bug report is missing them.

One channel file, no tools. The label taxonomy lives in `agent/instructions.md`; the label is applied by the channel's `message.completed` handler, which parses the agent's final `LABEL:` line and calls the GitHub API.

## Layout

```text
github-issue-labeler-starter/
├── package.json
├── agent/
│   ├── agent.ts              # model choice
│   ├── instructions.md       # ← edit the taxonomy here
│   └── channels/github.ts    # dispatch on issues.opened + label application
├── evals/
```

## Run

```bash
npm install
npm run dev
```

You can exercise the triage behavior in the dev terminal by pasting an issue (see `examples/sample-input.md`). See `SETUP.md` to connect a GitHub App.

## Make it yours

Edit the `Label taxonomy` section of `agent/instructions.md` to match the labels that exist in your repository. That is the only required change.

## Verify

```bash
npm run eval
```

## License

MIT
