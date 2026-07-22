"use client";

import { useActionState, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Category, OfficialIntegration } from "@/lib/catalog/types";
import type {
  ActionFieldErrors,
  AgentActionState,
} from "@/lib/community/validation";
import {
  initialAgentActionState,
  SUMMARY_MAX_LENGTH,
} from "@/lib/community/validation";
import { cn } from "@/lib/utils";

interface CommunityAgentFormProps {
  categories: Category[];
  integrations: OfficialIntegration[];
  action: (
    prev: AgentActionState,
    formData: FormData
  ) => Promise<AgentActionState>;
  submitLabel: string;
  initial?: {
    id?: string;
    slug?: string;
    name?: string;
    summary?: string;
    instructions?: string;
    categorySlug?: string;
    integrations?: string[];
  };
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

function BasicsFields({
  initial,
  errors,
}: {
  initial?: CommunityAgentFormProps["initial"];
  errors?: ActionFieldErrors;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={initial?.name}
            placeholder="Support Triage Helper"
            aria-invalid={Boolean(errors?.name)}
          />
          <FieldMessage error={errors?.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            defaultValue={initial?.slug}
            placeholder="support-triage-helper"
            aria-invalid={Boolean(errors?.slug)}
          />
          <FieldMessage
            error={errors?.slug}
            hint="Lowercase letters, numbers, hyphens."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          required
          rows={3}
          maxLength={SUMMARY_MAX_LENGTH}
          defaultValue={initial?.summary}
          placeholder="One or two sentences describing what this agent does."
          aria-invalid={Boolean(errors?.summary)}
        />
        <FieldMessage
          error={errors?.summary}
          hint={`Up to ${SUMMARY_MAX_LENGTH} characters.`}
        />
      </div>
    </>
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
  return (
    <div className="space-y-3">
      <div>
        <Label>Integrations</Label>
        <p className="mt-1 text-label-12 text-muted-foreground">
          Optional — pick services this agent is meant to work with.
        </p>
      </div>
      <div className="grid max-h-64 gap-2 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
        {integrations.map((integration) => {
          const checked = selected.includes(integration.slug);
          return (
            <label
              key={integration.slug}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-copy-14",
                "hover:bg-muted/60"
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => {
                  onToggle(integration.slug, value === true);
                }}
              />
              <span className="min-w-0 truncate">{integration.name}</span>
              {checked ? (
                <input
                  type="hidden"
                  name="integrations"
                  value={integration.slug}
                />
              ) : null}
            </label>
          );
        })}
      </div>
      <FieldMessage error={error} />
    </div>
  );
}

function CategoryField({
  categories,
  categorySlug,
  onChange,
  error,
}: {
  categories: Category[];
  categorySlug: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="categorySlug">Category</Label>
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <Select
        value={categorySlug || undefined}
        onValueChange={(value) => {
          if (typeof value === "string") {
            onChange(value);
          }
        }}
      >
        <SelectTrigger
          id="categorySlug"
          className="w-full min-w-0"
          aria-invalid={Boolean(error)}
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
      <FieldMessage error={error} />
    </div>
  );
}

function InstructionsField({
  initial,
  error,
}: {
  initial?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="instructions">Instructions (Markdown)</Label>
      <Textarea
        id="instructions"
        name="instructions"
        required
        rows={16}
        defaultValue={initial}
        placeholder={
          "# Identity\n\nYou are...\n\n# Goal\n\n...\n\n# Operating workflow\n\n1. ..."
        }
        className="font-mono text-label-13"
        aria-invalid={Boolean(error)}
      />
      <FieldMessage
        error={error}
        hint={
          <>
            This becomes{" "}
            <code className="font-mono text-caption">
              agent/instructions.md
            </code>{" "}
            in the installable starter.
          </>
        }
      />
    </div>
  );
}

export function CommunityAgentForm({
  categories,
  integrations,
  action,
  submitLabel,
  initial,
}: CommunityAgentFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialAgentActionState
  );
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug ?? "");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    initial?.integrations ?? []
  );

  const sortedIntegrations = useMemo(
    () => [...integrations].toSorted((a, b) => a.name.localeCompare(b.name)),
    [integrations]
  );

  function toggleIntegration(slug: string, checked: boolean) {
    setSelectedIntegrations((current) => {
      if (checked) {
        return current.includes(slug) ? current : [...current, slug];
      }
      return current.filter((item) => item !== slug);
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      {initial?.id ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <BasicsFields initial={initial} errors={state.fieldErrors} />

      <CategoryField
        categories={categories}
        categorySlug={categorySlug}
        onChange={setCategorySlug}
        error={state.fieldErrors?.categorySlug}
      />

      <IntegrationPicker
        integrations={sortedIntegrations}
        selected={selectedIntegrations}
        onToggle={toggleIntegration}
        error={state.fieldErrors?.integrations}
      />

      <InstructionsField
        initial={initial?.instructions}
        error={state.fieldErrors?.instructions}
      />

      {state.message && !state.ok ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-copy-14 text-destructive">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || !categorySlug}>
        {pending ? "Publishing…" : submitLabel}
      </Button>
    </form>
  );
}
