import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, next],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    // Content / generated / vendor UI — not app source under Ultracite style rules
    "catalog/**",
    "scripts/**",
    "components/ui/**",
    ".agents/**",
    ".source/**",
  ],
  rules: {
    // Next.js routes/pages and this repo prefer `function` declarations
    "func-style": "off",
    // Metadata, CVA, and domain objects are clearer in logical key order
    "sort-keys": "off",
    // Slug/path regexes don't need unicode or named groups
    "prefer-named-capture-group": "off",
    "require-unicode-regexp": "off",
    // Intentional sequential fs / zip walks
    "no-await-in-loop": "off",
    // Fumadocs exposes lowercase `MDX` from page data
    "react/jsx-pascal-case": "off",
  },
});
