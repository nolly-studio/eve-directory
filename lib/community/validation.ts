import { z } from "zod";

import type { CommunityAgentFileKind } from "@/lib/catalog/types";

export const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SUMMARY_MAX_LENGTH = 240;
export const INSTRUCTIONS_MAX_LENGTH = 20_000;
export const MAX_INTEGRATIONS = 8;
export const MAX_SUBMISSIONS_PER_DAY = 5;

export const FILE_KINDS = [
  "skill",
  "example",
] as const satisfies readonly CommunityAgentFileKind[];
export const MAX_FILES_PER_KIND = 3;
export const FILE_NAME_MAX_LENGTH = 40;
export const FILE_DESCRIPTION_MAX_LENGTH = 160;
export const FILE_CONTENT_MAX_LENGTH = 10_000;

const communityAgentFileSchema = z
  .object({
    kind: z.enum(FILE_KINDS),
    name: z
      .string()
      .trim()
      .min(2, "File name must be at least 2 characters")
      .max(
        FILE_NAME_MAX_LENGTH,
        `File name must be at most ${FILE_NAME_MAX_LENGTH} characters`
      )
      .regex(KEBAB_CASE, "Use lowercase letters, numbers, and hyphens"),
    description: z
      .string()
      .trim()
      .max(
        FILE_DESCRIPTION_MAX_LENGTH,
        `Description must be at most ${FILE_DESCRIPTION_MAX_LENGTH} characters`
      )
      .default(""),
    content: z
      .string()
      .trim()
      .min(20, "File content must be at least 20 characters")
      .max(
        FILE_CONTENT_MAX_LENGTH,
        `File content must be at most ${FILE_CONTENT_MAX_LENGTH} characters`
      ),
  })
  .refine(
    (file) => file.kind !== "skill" || file.description.length >= 10,
    "Skills need a description of at least 10 characters — it tells the agent when to load the file"
  );

const communityAgentFilesSchema = z
  .array(communityAgentFileSchema)
  .default([])
  .superRefine((files, ctx) => {
    for (const kind of FILE_KINDS) {
      const ofKind = files.filter((file) => file.kind === kind);
      if (ofKind.length > MAX_FILES_PER_KIND) {
        ctx.addIssue({
          code: "custom",
          message: `Add at most ${MAX_FILES_PER_KIND} ${kind} files`,
        });
      }
      const names = new Set<string>();
      for (const file of ofKind) {
        if (names.has(file.name)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate ${kind} file name: ${file.name}`,
          });
        }
        names.add(file.name);
      }
    }
  });

export const communityAgentFieldsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(KEBAB_CASE, "Use lowercase letters, numbers, and hyphens"),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters")
    .max(
      SUMMARY_MAX_LENGTH,
      `Summary must be at most ${SUMMARY_MAX_LENGTH} characters`
    ),
  instructions: z
    .string()
    .trim()
    .min(50, "Instructions must be at least 50 characters")
    .max(
      INSTRUCTIONS_MAX_LENGTH,
      `Instructions must be at most ${INSTRUCTIONS_MAX_LENGTH} characters`
    ),
  categorySlug: z.string().trim().min(1, "Pick a category"),
  integrations: z
    .array(z.string().trim().min(1))
    .max(MAX_INTEGRATIONS, `Pick at most ${MAX_INTEGRATIONS} integrations`)
    .default([]),
  files: communityAgentFilesSchema,
});

export type CommunityAgentFields = z.infer<typeof communityAgentFieldsSchema>;

export type ActionFieldErrors = Partial<
  Record<keyof CommunityAgentFields | "form", string>
>;

export interface AgentActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: ActionFieldErrors;
}

export const initialAgentActionState: AgentActionState = { ok: false };
