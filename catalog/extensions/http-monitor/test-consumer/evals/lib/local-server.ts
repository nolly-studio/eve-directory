import { createServer, type Server } from "node:http";

export type LocalServer = {
  url: string;
  setStatusCode: (code: number) => void;
  close: () => Promise<void>;
};

/**
 * Throwaway HTTP endpoint on an ephemeral localhost port. The eval flips
 * the response code between turns to reproduce "up" and "down" states
 * without any external dependency.
 */
export async function startLocalServer(
  initialStatusCode = 200
): Promise<LocalServer> {
  let statusCode = initialStatusCode;

  const server: Server = createServer((_req, res) => {
    res.writeHead(statusCode, { "content-type": "text/plain" });
    res.end(statusCode < 400 ? "ok" : "unavailable");
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("local server did not bind to a TCP port");
  }

  return {
    url: `http://127.0.0.1:${address.port}/`,
    setStatusCode: (code) => {
      statusCode = code;
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}
