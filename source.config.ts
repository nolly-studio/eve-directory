import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      // Enables page.data.getText("processed") for /llms.txt and /llms.mdx.
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema.extend({
      // Eve-style marker for integration recipe pages (optional for now).
      type: z.string().optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
    },
  },
});
