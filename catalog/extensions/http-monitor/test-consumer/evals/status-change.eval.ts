import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

import { startLocalServer } from "./lib/local-server";

export default defineEval({
  description:
    "A second check of the same URL after the endpoint degrades reports down with changed=true.",
  async test(t) {
    const server = await startLocalServer(200);
    try {
      const first = await t.send(server.url);
      first.expectOk();
      t.check(first.message, includes('"status":"up"'));

      server.setStatusCode(503);

      await t.send(server.url);
      t.succeeded();
      t.check(t.reply, includes('"status":"down"'));
      t.check(t.reply, includes('"previousStatus":"up"'));
      t.check(t.reply, includes('"changed":true'));
    } finally {
      await server.close();
    }
  },
});
