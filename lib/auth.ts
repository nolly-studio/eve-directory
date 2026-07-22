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
        const handle =
          normalizeHandle(profile.login) ||
          normalizeHandle(profile.name || "") ||
          "user";

        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          handle,
        };
      },
    },
  },
  user: {
    additionalFields: {
      // input:true so GitHub mapProfileToUser can supply it on OAuth signup.
      // databaseHooks still re-allocate for uniqueness / reserved names.
      handle: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      // Server-owned — never accept from client or mapProfileToUser.
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
          const data = userData as {
            handle?: string;
            name?: string;
            email?: string;
            role?: string;
          };

          const preferred =
            typeof data.handle === "string" && data.handle.length > 0
              ? data.handle
              : data.name || data.email?.split("@")[0] || "user";

          return {
            data: {
              ...userData,
              handle: await allocateHandle(preferred),
              role: "user",
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
