export interface ComposerSelection {
  agents: string[];
  extensions: string[];
}

const STORAGE_KEY = "eve-directory-composer";

export function readComposerSelection(): ComposerSelection {
  if (typeof window === "undefined") {
    return { agents: [], extensions: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { agents: [], extensions: [] };
    }

    const parsed = JSON.parse(raw) as ComposerSelection;
    return {
      agents: parsed.agents ?? [],
      extensions: parsed.extensions ?? [],
    };
  } catch {
    return { agents: [], extensions: [] };
  }
}

export function writeComposerSelection(selection: ComposerSelection): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

export function addAgentToComposer(slug: string): ComposerSelection {
  const current = readComposerSelection();
  const next = {
    ...current,
    agents: current.agents.includes(slug)
      ? current.agents
      : [...current.agents, slug],
  };
  writeComposerSelection(next);
  return next;
}

export function addExtensionToComposer(slug: string): ComposerSelection {
  const current = readComposerSelection();
  const next = {
    ...current,
    extensions: current.extensions.includes(slug)
      ? current.extensions
      : [...current.extensions, slug],
  };
  writeComposerSelection(next);
  return next;
}

export function removeAgentFromComposer(slug: string): ComposerSelection {
  const current = readComposerSelection();
  const next = {
    ...current,
    agents: current.agents.filter((item) => item !== slug),
  };
  writeComposerSelection(next);
  return next;
}

export function removeExtensionFromComposer(slug: string): ComposerSelection {
  const current = readComposerSelection();
  const next = {
    ...current,
    extensions: current.extensions.filter((item) => item !== slug),
  };
  writeComposerSelection(next);
  return next;
}

export function clearComposer(): ComposerSelection {
  const next = { agents: [], extensions: [] };
  writeComposerSelection(next);
  return next;
}
