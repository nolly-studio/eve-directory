import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

import { startLocalServer } from "./lib/local-server";

export default defineEval({
  description:
    "monitor__check_url reports a healthy local endpoint as up with no prior status.",
  async test(t) {
    const server = await startLocalServer(200);
    try {
      await t.send(server.url);
      t.succeeded();
      t.calledTool("monitor__check_url");
      t.check(t.reply, includes('"status":"up"'));
      t.check(t.reply, includes('"previousStatus":null'));
      t.check(t.reply, includes('"changed":false'));
    } finally {
      await server.close();
    }
  },
});
