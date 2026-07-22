import { defineTool } from "eve/tools";
import { z } from "zod";

// CUSTOMIZE HERE: set DIGEST_FEED_URL to the RSS/Atom feed you want digested.
const DEFAULT_FEED_URL = "https://hnrss.org/frontpage";
const MAX_CHARS = 12_000;

export default defineTool({
  description:
    "Fetch the configured RSS/Atom feed and return its raw XML (truncated). Call this before writing the digest.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const url = process.env.DIGEST_FEED_URL ?? DEFAULT_FEED_URL;
    const response = await fetch(url, {
      signal: ctx.abortSignal,
      headers: { accept: "application/rss+xml, application/atom+xml, */*" },
    });
    if (!response.ok) {
      throw new Error(`Feed fetch failed: ${response.status} ${url}`);
    }
    const body = await response.text();
    return {
      url,
      truncated: body.length > MAX_CHARS,
      content: body.slice(0, MAX_CHARS),
    };
  },
});
