import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import {
  isValidHandle,
  normalizeHandle,
  withHandleSuffix,
} from "@/lib/auth/handles";
import { db } from "@/lib/db";
import { authSchema, user } from "@/lib/db/schema";

async function allocateHandle(preferred: string): Promise<string> {
  const base = normalizeHandle(preferred) || "user";

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = withHandleSuffix(base, attempt);

    if (!isValidHandle(candidate) && attempt === 0) {
      continue;
    }

    if (!isValidHandle(candidate)) {
      continue;
    }

    const existing = await db.query.user.findFirst({
      columns: { id: true },
      where: eq(user.handle, candidate),
    });

    if (!existing) {
      return candidate;
    }
  }

  return `user-${crypto.randomUUID().slice(0, 8)}`;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser(profile) {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          handle: normalizeHandle(profile.login),
        };
      },
    },
  },
  user: {
    additionalFields: {
      handle: {
        type: "string",
        required: true,
        unique: true,
        input: false,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(userData) {
          const preferred =
            typeof userData.handle === "string" && userData.handle.length > 0
              ? userData.handle
              : userData.name || userData.email.split("@")[0] || "user";

          return {
            data: {
              ...userData,
              handle: await allocateHandle(preferred),
              role:
                typeof userData.role === "string" && userData.role.length > 0
                  ? userData.role
                  : "user",
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
