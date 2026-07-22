export type UrlStatus = "up" | "down";

export type CheckOutcome = {
  status: UrlStatus;
  statusCode: number | null;
  latencyMs: number;
  error: string | null;
};

export function classify(statusCode: number | null, ok: boolean): UrlStatus {
  if (!ok || statusCode === null) {
    return "down";
  }
  return statusCode >= 200 && statusCode < 400 ? "up" : "down";
}

/**
 * Fetch the URL once and classify the result. Pure with respect to eve:
 * no config or state access, so it is unit-testable outside the runtime.
 */
export async function performCheck(
  url: string,
  timeoutMs: number,
  abortSignal?: AbortSignal
): Promise<CheckOutcome> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  abortSignal?.addEventListener("abort", onAbort);

  let statusCode: number | null = null;
  let ok = false;
  let error: string | null = null;

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    statusCode = response.status;
    ok = response.ok;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    ok = false;
  } finally {
    clearTimeout(timer);
    abortSignal?.removeEventListener("abort", onAbort);
  }

  return {
    status: classify(statusCode, ok),
    statusCode,
    latencyMs: Date.now() - started,
    error,
  };
}
