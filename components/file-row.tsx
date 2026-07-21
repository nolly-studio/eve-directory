import { cn } from "@/lib/utils";

/** Mono file row with a trailing status, used for install/compose previews. */
export function FileRow({
  name,
  status,
  muted = false,
}: {
  name: string;
  status?: string;
  muted?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-copy-14-mono",
        muted ? "text-gray-700" : "bg-muted text-gray-1000"
      )}
    >
      <span className="truncate">{name}</span>
      {status ? (
        <span className="shrink-0 text-label-12-mono text-gray-700">
          {status}
        </span>
      ) : null}
    </li>
  );
}
