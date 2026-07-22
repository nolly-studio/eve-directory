import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

const components: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="underline underline-offset-4 hover:text-foreground"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded-md bg-muted px-1 py-0.5 font-mono text-caption text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl bg-muted/60 p-4 font-mono text-label-13">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <h1 className="mt-8 text-heading-24 font-semibold text-gray-1000 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 text-copy-16 font-semibold text-gray-1000">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 text-copy-14 font-semibold text-gray-1000">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-copy-14 text-pretty text-muted-foreground">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-copy-14 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-copy-14 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-pretty">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-2 border-border pl-4 text-copy-14 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
};

/** Renders untrusted markdown without raw HTML (react-markdown default). */
export function SafeMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-none", className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
