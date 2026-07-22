import { z } from "zod";

export const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SUMMARY_MAX_LENGTH = 240;
export const INSTRUCTIONS_MAX_LENGTH = 20_000;
export const MAX_INTEGRATIONS = 8;
export const MAX_SUBMISSIONS_PER_DAY = 5;

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
