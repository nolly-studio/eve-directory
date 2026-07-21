"use client";

import { useEffect, useState } from "react";

import type { ComposerSelection } from "@/lib/composer/storage";
import {
  clearComposer,
  readComposerSelection,
  removeAgentFromComposer,
  removeExtensionFromComposer,
  writeComposerSelection,
} from "@/lib/composer/storage";

const EMPTY_SELECTION: ComposerSelection = { agents: [], extensions: [] };

/** Client selection state backed by localStorage (SSR-safe empty initial state). */
export function useComposerSelection() {
  const [selection, setSelection] =
    useState<ComposerSelection>(EMPTY_SELECTION);

  useEffect(() => {
    // Hydrate from localStorage after mount.
    // oxlint-disable-next-line react/react-compiler -- intentional client hydration
    setSelection(readComposerSelection());
  }, []);

  function toggleAgent(slug: string) {
    const next = selection.agents.includes(slug)
      ? selection.agents.filter((item) => item !== slug)
      : [...selection.agents, slug];
    const updated = { ...selection, agents: next };
    writeComposerSelection(updated);
    setSelection(updated);
  }

  function toggleExtension(slug: string) {
    const next = selection.extensions.includes(slug)
      ? selection.extensions.filter((item) => item !== slug)
      : [...selection.extensions, slug];
    const updated = { ...selection, extensions: next };
    writeComposerSelection(updated);
    setSelection(updated);
  }

  function removeAgent(slug: string) {
    setSelection(removeAgentFromComposer(slug));
  }

  function removeExtension(slug: string) {
    setSelection(removeExtensionFromComposer(slug));
  }

  function clear() {
    setSelection(clearComposer());
  }

  return {
    clear,
    removeAgent,
    removeExtension,
    selection,
    toggleAgent,
    toggleExtension,
  };
}
