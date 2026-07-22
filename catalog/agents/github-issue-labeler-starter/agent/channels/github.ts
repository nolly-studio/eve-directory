import { defaultGitHubAuth, githubChannel } from "eve/channels/github";

// Credentials come from env: GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and
// GITHUB_WEBHOOK_SECRET. See SETUP.md.
//
// The agent ends its triage reply with a "LABEL: <name>" line (see
// instructions.md). The message.completed handler below extracts that line,
// applies the label through the GitHub API, and posts the rest as the
// triage comment.
const LABEL_LINE = /^LABEL:[ \t]*(.+)$/m;

export default githubChannel({
  onIssue: (ctx, issue) => {
    if (issue.action !== "opened") return null;
    const raw = issue.raw.issue as
      | { title?: string; body?: string | null }
      | undefined;
    return {
      auth: defaultGitHubAuth(ctx),
      context: [
        [
          `A new issue (#${issue.issueNumber}) was just opened in`,
          `${ctx.repository.owner}/${ctx.repository.name}. Triage it now.`,
          "",
          `Title: ${raw?.title ?? "(missing)"}`,
          "",
          `Body:\n${raw?.body ?? "(empty)"}`,
        ].join("\n"),
      ],
    };
  },
  events: {
    async "message.completed"(eventData, channel) {
      if (eventData.finishReason === "tool-calls" || !eventData.message) return;

      const label = eventData.message.match(LABEL_LINE)?.[1]?.trim();
      const comment = eventData.message.replace(LABEL_LINE, "").trim();

      if (label && channel.state.issueNumber !== null) {
        const { owner, repo, issueNumber } = channel.state;
        await channel.github.request({
          method: "POST",
          path: `/repos/${owner}/${repo}/issues/${issueNumber}/labels`,
          body: { labels: [label] },
        });
      }
      if (comment.length > 0) await channel.thread.post(comment);
    },
  },
});
