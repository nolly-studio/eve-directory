import { connection } from "next/server";
import { Suspense } from "react";

async function Connection() {
  await connection();
  return null;
}

/**
 * Marks a route as intentionally dynamic for Cache Components so
 * `generateMetadata` (and similar) can read runtime `params` while the
 * static shell still prerenders.
 */
export function DynamicMarker() {
  return (
    <Suspense fallback={null}>
      <Connection />
    </Suspense>
  );
}
