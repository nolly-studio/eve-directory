"use client";

import {
  Cancel01Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useActionState, useId, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { AuthorMark } from "@/components/author-mark";
import { IntegrationLogo } from "@/components/integration-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Category,
  CommunityAgentFile,
  CommunityAgentFileKind,
  OfficialIntegration,
} from "@/lib/catalog/types";
import type { AgentActionState } from "@/lib/community/validation";
import {
  FILE_CONTENT_MAX_LENGTH,
  FILE_DESCRIPTION_MAX_LENGTH,
  FILE_NAME_MAX_LENGTH,
  initialAgentActionState,
  INSTRUCTIONS_MAX_LENGTH,
  MAX_FILES_PER_KIND,
  MAX_INTEGRATIONS,
  SUMMARY_MAX_LENGTH,
} from "@/lib/community/validation";
import { getIntegrationLogo } from "@/lib/integrations/resolve";
import { cn } from "@/lib/utils";

interface CommunityAgentFormProps {
  categories: Category[];
  integrations: OfficialIntegration[];
  action: (
    prev: AgentActionState,
    formData: FormData
  ) => Promise<AgentActionState>;
  submitLabel: string;
  authorHandle?: string;
  authorImage?: string | null;
  initial?: {
    id?: string;
    slug?: string;
    name?: string;
    summary?: string;
    instructions?: string;
    categorySlug?: string;
    integrations?: string[];
    files?: CommunityAgentFile[];
  };
}

interface EditableFile extends CommunityAgentFile {
  /** Client-only key so removals don't remount sibling editors. */
  editorId: string;
}

const FILE_KIND_COPY: Record<
  CommunityAgentFileKind,
  { folder: string; addLabel: string; blurb: string }
> = {
  example: {
    folder: "examples",
    addLabel: "Add example",
    blurb:
      "Sample runs and expected outputs — shows installers what good looks like.",
  },
  skill: {
    folder: "skills",
    addLabel: "Add skill",
    blurb:
      "On-demand knowledge the agent loads when the description matches the task.",
  },
};

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 50);
}

function FieldMessage({ error, hint }: { error?: string; hint?: ReactNode }) {
  if (error) {
    return <p className="text-label-12 text-destructive">{error}</p>;
  }

  if (hint) {
    return <p className="text-label-12 text-muted-foreground">{hint}</p>;
  }

  return null;
}

function FormSection({
  title,
  description,
  children,
  stagger,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  stagger: number;
}) {
  return (
    <section
      className="animate-enter"
      style={{ "--stagger": stagger } as CSSProperties}
    >
      <div>
        <h2 className="text-heading-24 font-semibold text-gray-1000">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-copy-14 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function CharacterCount({
  current,
  max,
  invalid,
}: {
  current: number;
  max: number;
  invalid?: boolean;
}) {
  return (
    <span
      className={cn(
        "ml-auto font-mono text-label-12 tabular-nums",
        invalid ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {current}/{max}
    </span>
  );
}

function IntegrationPicker({
  integrations,
  selected,
  onToggle,
  error,
}: {
  integrations: OfficialIntegration[];
  selected: string[];
  onToggle: (slug: string, checked: boolean) => void;
  error?: string;
}) {
  const atLimit = selected.length >= MAX_INTEGRATIONS;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label-12 text-muted-foreground">
          Optional - up to {MAX_INTEGRATIONS} services.
        </p>
        <span className="font-mono text-label-12 text-muted-foreground tabular-nums">
          {selected.length}/{MAX_INTEGRATIONS}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {integrations.map((integration) => {
          const checked = selected.includes(integration.slug);
          const disabled = !checked && atLimit;
          const hasLogo = Boolean(getIntegrationLogo(integration.slug));

          return (
            <button
              key={integration.slug}
              type="button"
              disabled={disabled}
              aria-pressed={checked}
              onClick={() => {
                onToggle(integration.slug, !checked);
              }}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                "transition-[box-shadow,background-color,transform,opacity] duration-150",
                "active:scale-[0.99] motion-reduce:transition-none",
                "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-40",
                checked
                  ? "bg-muted/50 shadow-surface-active"
                  : "bg-card shadow-chip hover:shadow-surface"
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-chip">
                {hasLogo ? (
                  <IntegrationLogo slug={integration.slug} className="size-4" />
                ) : (
                  <span className="text-label-12 font-medium text-muted-foreground uppercase">
                    {integration.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-copy-14 text-foreground">
                {integration.name}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,opacity,transform] duration-150",
                  checked
                    ? "bg-primary text-primary-foreground opacity-100"
                    : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-60"
                )}
              >
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={1.5}
                  className="size-3"
                />
              </span>
            </button>
          );
        })}
      </div>
      {selected.map((slug) => (
        <input key={slug} type="hidden" name="integrations" value={slug} />
      ))}
      <FieldMessage error={error} />
    </div>
  );
}

function FileKindEditor({
  kind,
  files,
  onAdd,
  onChange,
  onRemove,
}: {
  kind: CommunityAgentFileKind;
  files: EditableFile[];
  onAdd: (kind: CommunityAgentFileKind) => void;
  onChange: (editorId: string, patch: Partial<CommunityAgentFile>) => void;
  onRemove: (editorId: string) => void;
}) {
  const copy = FILE_KIND_COPY[kind];
  const ofKind = files.filter((file) => file.kind === kind);
  const atLimit = ofKind.length >= MAX_FILES_PER_KIND;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-mono text-label-13 text-foreground">
            agent/{copy.folder}/
          </h3>
          <p className="mt-1 text-label-12 text-pretty text-muted-foreground">
            {copy.blurb}
          </p>
        </div>
        <span className="shrink-0 font-mono text-label-12 text-muted-foreground tabular-nums">
          {ofKind.length}/{MAX_FILES_PER_KIND}
        </span>
      </div>

      {ofKind.length > 0 ? (
        <div className="mt-3 space-y-3">
          {ofKind.map((file) => (
            <div
              key={file.editorId}
              className="rounded-xl bg-card p-4 shadow-surface"
            >
              <div className="flex items-center justify-between gap-3">
                <code className="truncate font-mono text-label-13 text-gray-1000">
                  {copy.folder}/{file.name || "untitled"}.md
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${file.name || "file"}`}
                  onClick={() => {
                    onRemove(file.editorId);
                  }}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
                </Button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${file.editorId}-name`}>File name</Label>
                  <Input
                    id={`${file.editorId}-name`}
                    value={file.name}
                    maxLength={FILE_NAME_MAX_LENGTH}
                    placeholder={
                      kind === "skill" ? "meeting-analysis" : "weekly-sync"
                    }
                    onChange={(event) => {
                      onChange(file.editorId, {
                        name: event.target.value
                          .toLowerCase()
                          .replaceAll(/[^a-z0-9-]/g, "-"),
                      });
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`${file.editorId}-description`}>
                    Description{kind === "example" ? " (optional)" : ""}
                  </Label>
                  <Input
                    id={`${file.editorId}-description`}
                    value={file.description}
                    maxLength={FILE_DESCRIPTION_MAX_LENGTH}
                    placeholder={
                      kind === "skill"
                        ? "Load when analyzing meeting notes"
                        : "What this example demonstrates"
                    }
                    onChange={(event) => {
                      onChange(file.editorId, {
                        description: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-3">
                  <Label htmlFor={`${file.editorId}-content`}>Content</Label>
                  <CharacterCount
                    current={file.content.length}
                    max={FILE_CONTENT_MAX_LENGTH}
                    invalid={file.content.length > FILE_CONTENT_MAX_LENGTH}
                  />
                </div>
                <Textarea
                  id={`${file.editorId}-content`}
                  value={file.content}
                  rows={8}
                  maxLength={FILE_CONTENT_MAX_LENGTH}
                  placeholder={
                    kind === "skill"
                      ? "# Knowledge\n\nFacts, playbooks, and rules the agent should apply..."
                      : "# Scenario\n\nUser: ...\n\nAgent: ..."
                  }
                  className="min-h-32 font-mono text-label-13"
                  onChange={(event) => {
                    onChange(file.editorId, { content: event.target.value });
                  }}
                />
                {kind === "skill" ? (
                  <p className="text-label-12 text-muted-foreground">
                    The description becomes frontmatter — it tells the agent
                    when to load this file.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        disabled={atLimit}
        onClick={() => {
          onAdd(kind);
        }}
      >
        <HugeiconsIcon
          icon={PlusSignIcon}
          strokeWidth={1.5}
          data-icon="inline-start"
        />
        {copy.addLabel}
      </Button>
    </div>
  );
}

function StarterFileTree({ files }: { files: EditableFile[] }) {
  const skills = files.filter((file) => file.kind === "skill");
  const examples = files.filter((file) => file.kind === "example");

  const rows: { indent: boolean; label: string; muted?: boolean }[] = [
    { indent: false, label: "agent.ts", muted: true },
    { indent: false, label: "instructions.md" },
  ];

  if (skills.length > 0) {
    rows.push({ indent: false, label: "skills/" });
    for (const file of skills) {
      rows.push({ indent: true, label: `${file.name || "untitled"}.md` });
    }
  }

  if (examples.length > 0) {
    rows.push({ indent: false, label: "examples/" });
    for (const file of examples) {
      rows.push({ indent: true, label: `${file.name || "untitled"}.md` });
    }
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-surface">
      <p className="font-mono text-label-12 text-gray-700">agent/</p>
      <ul className="mt-1.5 space-y-1 border-l border-border pl-3">
        {rows.map((row) => (
          <li
            key={`${row.indent ? "child-" : ""}${row.label}`}
            className={cn(
              "truncate font-mono text-label-13",
              row.indent && "pl-4",
              row.muted ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {row.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-label-12 text-pretty text-muted-foreground">
        Plus the standard Eve scaffold: package.json, README, SETUP, evals.
      </p>
    </div>
  );
}

function ListingPreview({
  name,
  slug,
  summary,
  categoryName,
  integrations,
  authorHandle,
  authorImage,
}: {
  name: string;
  slug: string;
  summary: string;
  categoryName?: string;
  integrations: OfficialIntegration[];
  authorHandle?: string;
  authorImage?: string | null;
}) {
  const markSlug =
    integrations.find((item) => getIntegrationLogo(item.slug))?.slug ??
    integrations[0]?.slug;
  const displayName = name.trim() || "Untitled agent";
  const displaySummary =
    summary.trim() || "Your summary will appear here as the listing blurb.";
  const pathLabel = authorHandle
    ? `@${authorHandle}/${slug || "slug"}`
    : slug || "your-slug";

  return (
    <div className="rounded-xl bg-card p-5 shadow-surface">
      <div className="flex items-start justify-between gap-3">
        <AuthorMark src={authorImage} alt="" fallbackSlug={markSlug} />
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge variant="secondary">Community</Badge>
          {categoryName ? (
            <Badge variant="secondary">{categoryName}</Badge>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-copy-16 font-semibold text-balance text-gray-1000">
        {displayName}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-copy-14 text-pretty text-muted-foreground">
        {displaySummary}
      </p>
      <p className="mt-2 font-mono text-label-12 text-muted-foreground">
        {pathLabel}
      </p>

      {integrations.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
          {integrations.map((integration) => (
            <li
              key={integration.slug}
              className="inline-flex items-center gap-1.5 text-label-13 text-muted-foreground"
            >
              <IntegrationLogo slug={integration.slug} className="size-3.5" />
              {integration.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-border pt-4 text-label-12 text-muted-foreground">
          No integrations selected yet.
        </p>
      )}
    </div>
  );
}

function ReadinessList({
  name,
  slug,
  summary,
  categorySlug,
  instructionsLength,
}: {
  name: string;
  slug: string;
  summary: string;
  categorySlug: string;
  instructionsLength: number;
}) {
  const items = [
    {
      label: "Name",
      done: name.trim().length >= 3,
    },
    {
      label: "Slug",
      done: slug.trim().length >= 3,
    },
    {
      label: "Summary",
      done: summary.trim().length >= 10,
    },
    {
      label: "Category",
      done: Boolean(categorySlug),
    },
    {
      label: "Instructions",
      done: instructionsLength >= 50,
    },
  ];

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2.5 text-label-13"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-5 items-center justify-center rounded-full transition-colors duration-150",
              item.done
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={1.5}
              className="size-3"
            />
          </span>
          <span
            className={item.done ? "text-foreground" : "text-muted-foreground"}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface FormDefaults {
  name: string;
  slug: string;
  slugTouched: boolean;
  summary: string;
  instructionsLength: number;
  categorySlug: string;
  integrations: string[];
  files: CommunityAgentFile[];
}

function formDefaults(
  initial?: CommunityAgentFormProps["initial"]
): FormDefaults {
  return {
    categorySlug: initial?.categorySlug ?? "",
    files: initial?.files ?? [],
    instructionsLength: initial?.instructions?.length ?? 0,
    integrations: initial?.integrations ?? [],
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    slugTouched: Boolean(initial?.slug),
    summary: initial?.summary ?? "",
  };
}

function ListingFields({
  authorHandle,
  categories,
  errors,
  name,
  slug,
  summary,
  categorySlug,
  onNameChange,
  onSlugChange,
  onSummaryChange,
  onCategoryChange,
}: {
  authorHandle?: string;
  categories: Category[];
  errors: AgentActionState["fieldErrors"];
  name: string;
  slug: string;
  summary: string;
  categorySlug: string;
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(event) => {
            onNameChange(event.target.value);
          }}
          placeholder="Support Triage Helper"
          aria-invalid={Boolean(errors?.name)}
        />
        <FieldMessage error={errors?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex min-w-0 items-stretch overflow-hidden rounded-lg bg-card shadow-chip focus-within:ring-3 focus-within:ring-ring/30">
          {authorHandle ? (
            <span className="flex shrink-0 items-center border-r border-border/60 bg-muted/40 px-3 font-mono text-label-12 text-muted-foreground">
              @{authorHandle}/
            </span>
          ) : null}
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              onSlugChange(event.target.value);
            }}
            placeholder="support-triage-helper"
            aria-invalid={Boolean(errors?.slug)}
            className="rounded-none border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <FieldMessage
          error={errors?.slug}
          hint="Lowercase letters, numbers, hyphens. Auto-fills from the name until you edit it."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Label htmlFor="summary">Summary</Label>
          <CharacterCount
            current={summary.length}
            max={SUMMARY_MAX_LENGTH}
            invalid={summary.length > SUMMARY_MAX_LENGTH}
          />
        </div>
        <Textarea
          id="summary"
          name="summary"
          required
          rows={3}
          maxLength={SUMMARY_MAX_LENGTH}
          value={summary}
          onChange={(event) => {
            onSummaryChange(event.target.value);
          }}
          placeholder="One or two sentences describing what this agent does."
          aria-invalid={Boolean(errors?.summary)}
        />
        <FieldMessage
          error={errors?.summary}
          hint="Shown next to the title on the agent detail page."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorySlug">Category</Label>
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <Select
          value={categorySlug || undefined}
          onValueChange={(value) => {
            if (typeof value === "string") {
              onCategoryChange(value);
            }
          }}
        >
          <SelectTrigger
            id="categorySlug"
            className="w-full min-w-0"
            aria-invalid={Boolean(errors?.categorySlug)}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldMessage error={errors?.categorySlug} />
      </div>
    </>
  );
}

function InstructionsField({
  initialContent,
  length,
  error,
  onLengthChange,
}: {
  initialContent?: string;
  length: number;
  error?: string;
  onLengthChange: (length: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Label htmlFor="instructions">Prompt</Label>
        <CharacterCount
          current={length}
          max={INSTRUCTIONS_MAX_LENGTH}
          invalid={length > INSTRUCTIONS_MAX_LENGTH}
        />
      </div>
      <Textarea
        id="instructions"
        name="instructions"
        required
        rows={18}
        defaultValue={initialContent}
        onChange={(event) => {
          onLengthChange(event.target.value.length);
        }}
        placeholder={
          "# Identity\n\nYou are...\n\n# Goal\n\n...\n\n# Operating workflow\n\n1. ..."
        }
        className="min-h-72 font-mono text-label-13"
        aria-invalid={Boolean(error)}
      />
      <FieldMessage
        error={error}
        hint="At least 50 characters. Structure with Identity, Goal, and Operating workflow."
      />
    </div>
  );
}

function FormError({ state }: { state: AgentActionState }) {
  if (!state.message || state.ok) {
    return null;
  }

  return (
    <p className="rounded-xl bg-destructive/10 px-3 py-2 text-copy-14 text-destructive">
      {state.message}
    </p>
  );
}

function FormAside({
  name,
  slug,
  summary,
  categoryName,
  integrations,
  authorHandle,
  authorImage,
  files,
  categorySlug,
  instructionsLength,
  state,
  canSubmit,
  pending,
  pendingLabel,
  submitLabel,
}: {
  name: string;
  slug: string;
  summary: string;
  categoryName?: string;
  integrations: OfficialIntegration[];
  authorHandle?: string;
  authorImage?: string | null;
  files: EditableFile[];
  categorySlug: string;
  instructionsLength: number;
  state: AgentActionState;
  canSubmit: boolean;
  pending: boolean;
  pendingLabel: string;
  submitLabel: string;
}) {
  return (
    <aside
      className="animate-enter space-y-5 lg:sticky lg:top-24"
      style={{ "--stagger": 4 } as CSSProperties}
    >
      <div>
        <h2 className="text-label-12 text-muted-foreground">Preview</h2>
        <div className="mt-3">
          <ListingPreview
            name={name}
            slug={slug}
            summary={summary}
            categoryName={categoryName}
            integrations={integrations}
            authorHandle={authorHandle}
            authorImage={authorImage}
          />
        </div>
      </div>

      <div>
        <h2 className="text-label-12 text-muted-foreground">Installs as</h2>
        <div className="mt-3">
          <StarterFileTree files={files} />
        </div>
      </div>

      <div className="rounded-xl bg-card p-5 shadow-surface">
        <h2 className="text-label-12 text-muted-foreground">
          Ready to publish
        </h2>
        <div className="mt-3">
          <ReadinessList
            name={name}
            slug={slug}
            summary={summary}
            categorySlug={categorySlug}
            instructionsLength={instructionsLength}
          />
        </div>

        <div className="mt-4 empty:hidden">
          <FormError state={state} />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-5 hidden w-full lg:inline-flex"
          disabled={!canSubmit}
        >
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </aside>
  );
}

export function CommunityAgentForm({
  categories,
  integrations,
  action,
  submitLabel,
  authorHandle,
  authorImage,
  initial,
}: CommunityAgentFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialAgentActionState
  );
  const defaults = useMemo(() => formDefaults(initial), [initial]);
  const [name, setName] = useState(defaults.name);
  const [slug, setSlug] = useState(defaults.slug);
  const [slugTouched, setSlugTouched] = useState(defaults.slugTouched);
  const [summary, setSummary] = useState(defaults.summary);
  const [instructionsLength, setInstructionsLength] = useState(
    defaults.instructionsLength
  );
  const [categorySlug, setCategorySlug] = useState(defaults.categorySlug);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    defaults.integrations
  );
  const editorIdPrefix = useId();
  const [files, setFiles] = useState<EditableFile[]>(() =>
    defaults.files.map((file, index) => ({
      ...file,
      editorId: `${editorIdPrefix}-${index}`,
    }))
  );
  const [nextFileId, setNextFileId] = useState(defaults.files.length);

  const sortedIntegrations = useMemo(
    () => [...integrations].toSorted((a, b) => a.name.localeCompare(b.name)),
    [integrations]
  );

  const selectedIntegrationDetails = useMemo(
    () =>
      selectedIntegrations
        .map((selectedSlug) =>
          sortedIntegrations.find((item) => item.slug === selectedSlug)
        )
        .filter((item): item is OfficialIntegration => Boolean(item)),
    [selectedIntegrations, sortedIntegrations]
  );

  const categoryName = categories.find(
    (category) => category.slug === categorySlug
  )?.name;

  const canSubmit = Boolean(categorySlug) && !pending;
  const pendingLabel = submitLabel.toLowerCase().includes("save")
    ? "Saving…"
    : "Publishing…";

  function toggleIntegration(integrationSlug: string, checked: boolean) {
    setSelectedIntegrations((current) => {
      if (checked) {
        if (current.includes(integrationSlug)) {
          return current;
        }
        if (current.length >= MAX_INTEGRATIONS) {
          return current;
        }
        return [...current, integrationSlug];
      }
      return current.filter((item) => item !== integrationSlug);
    });
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugFromName(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value);
  }

  function addFile(kind: CommunityAgentFileKind) {
    setFiles((current) => [
      ...current,
      {
        content: "",
        description: "",
        editorId: `${editorIdPrefix}-new-${nextFileId}`,
        kind,
        name: "",
      },
    ]);
    setNextFileId((current) => current + 1);
  }

  function changeFile(editorId: string, patch: Partial<CommunityAgentFile>) {
    setFiles((current) =>
      current.map((file) =>
        file.editorId === editorId ? { ...file, ...patch } : file
      )
    );
  }

  function removeFile(editorId: string) {
    setFiles((current) => current.filter((file) => file.editorId !== editorId));
  }

  const serializedFiles = useMemo(
    () =>
      JSON.stringify(
        files.map(({ content, description, kind, name: fileName }) => ({
          content,
          description,
          kind,
          name: fileName,
        }))
      ),
    [files]
  );

  return (
    <form action={formAction}>
      {initial?.id ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-10">
          <FormSection
            title="Listing"
            description="Name, slug, and summary - the same fields people see on the agent page."
            stagger={0}
          >
            <ListingFields
              authorHandle={authorHandle}
              categories={categories}
              errors={state.fieldErrors}
              name={name}
              slug={slug}
              summary={summary}
              categorySlug={categorySlug}
              onNameChange={handleNameChange}
              onSlugChange={handleSlugChange}
              onSummaryChange={setSummary}
              onCategoryChange={setCategorySlug}
            />
          </FormSection>

          <FormSection
            title="Integrations"
            description="Optional - pick services this agent is meant to work with. Shown as logos on the listing."
            stagger={1}
          >
            <IntegrationPicker
              integrations={sortedIntegrations}
              selected={selectedIntegrations}
              onToggle={toggleIntegration}
              error={state.fieldErrors?.integrations}
            />
          </FormSection>

          <FormSection
            title="Instructions"
            description={
              <>
                Markdown that becomes{" "}
                <code className="font-mono text-caption">
                  agent/instructions.md
                </code>{" "}
                in the installable starter.
              </>
            }
            stagger={2}
          >
            <InstructionsField
              initialContent={initial?.instructions}
              length={instructionsLength}
              error={state.fieldErrors?.instructions}
              onLengthChange={setInstructionsLength}
            />
          </FormSection>

          <FormSection
            title="Skills & examples"
            description="Optional markdown files installed alongside the instructions - the same structure official agents ship."
            stagger={3}
          >
            <input type="hidden" name="files" value={serializedFiles} />
            <FileKindEditor
              kind="skill"
              files={files}
              onAdd={addFile}
              onChange={changeFile}
              onRemove={removeFile}
            />
            <FileKindEditor
              kind="example"
              files={files}
              onAdd={addFile}
              onChange={changeFile}
              onRemove={removeFile}
            />
            <FieldMessage error={state.fieldErrors?.files} />
          </FormSection>

          <div className="space-y-4 lg:hidden">
            <FormError state={state} />
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {pending ? pendingLabel : submitLabel}
            </Button>
          </div>
        </div>

        <FormAside
          name={name}
          slug={slug}
          summary={summary}
          categoryName={categoryName}
          integrations={selectedIntegrationDetails}
          authorHandle={authorHandle}
          authorImage={authorImage}
          files={files}
          categorySlug={categorySlug}
          instructionsLength={instructionsLength}
          state={state}
          canSubmit={canSubmit}
          pending={pending}
          pendingLabel={pendingLabel}
          submitLabel={submitLabel}
        />
      </div>
    </form>
  );
}
