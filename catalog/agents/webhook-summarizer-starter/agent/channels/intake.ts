import { defineChannel, POST } from "eve/channels";

import slack from "./slack";

type IntakeBody = {
  text?: string;
  source?: string;
};

/**
 * Custom ingress: POST any text payload, hand it to Slack for a classified
 * summary. Mounted at POST /eve/v1/intake/submit.
 */
export default defineChannel({
  routes: [
    POST("/eve/v1/intake/submit", async (req, args) => {
      const secret = process.env.WEBHOOK_SECRET;
      if (secret) {
        const auth = req.headers.get("authorization") ?? "";
        if (auth !== `Bearer ${secret}`) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }
      }

      const channelId = process.env.SLACK_SUMMARY_CHANNEL_ID;
      if (!channelId) {
        return Response.json(
          { error: "SLACK_SUMMARY_CHANNEL_ID is not set" },
          { status: 500 }
        );
      }

      let body: IntakeBody;
      try {
        body = (await req.json()) as IntakeBody;
      } catch {
        return Response.json({ error: "invalid JSON body" }, { status: 400 });
      }

      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) {
        return Response.json(
          { error: "body.text is required (non-empty string)" },
          { status: 400 }
        );
      }

      const source =
        typeof body.source === "string" && body.source.trim()
          ? body.source.trim()
          : "webhook";

      args.waitUntil(
        args.receive(slack, {
          message: [
            "Summarize and classify this inbound submission.",
            `Source: ${source}`,
            "",
            text,
          ].join("\n"),
          target: { channelId },
          auth: {
            authenticator: "intake-webhook",
            principalType: "service",
            principalId: source,
            attributes: { source },
          },
        })
      );

      return Response.json({ ok: true });
    }),
  ],
});
