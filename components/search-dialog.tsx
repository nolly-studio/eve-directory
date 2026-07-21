"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
} from "fumadocs-ui/components/dialog/search";
import type { SharedProps, TagItem } from "fumadocs-ui/contexts/search";
import { useMemo, useState } from "react";

const EMPTY_TAGS: TagItem[] = [];
const EMPTY_LINKS: [string, string][] = [];

type SiteSearchDialogProps = SharedProps & {
  tags?: TagItem[];
  links?: [string, string][];
  api?: string;
  delayMs?: number;
  allowClear?: boolean;
  defaultTag?: string;
};

/**
 * Fumadocs' default dialog renders TagsList outside DialogContent, so tags
 * leak into the page as a permanent top strip. Keep tags inside the dialog.
 */
export function SiteSearchDialog({
  tags = EMPTY_TAGS,
  links = EMPTY_LINKS,
  api,
  delayMs,
  allowClear = true,
  defaultTag,
  ...props
}: SiteSearchDialogProps) {
  const [tag, setTag] = useState(defaultTag);
  const client = fetchClient({ api, tag });
  const { search, setSearch, query } = useDocsSearch({ client, delayMs });

  const defaultItems = useMemo(() => {
    if (links.length === 0) {
      return null;
    }

    return links.map(([name, link]) => ({
      content: name,
      id: name,
      type: "page" as const,
      url: link,
    }));
  }, [links]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data === "empty" ? defaultItems : query.data}
        />
        {tags.length > 0 ? (
          <SearchDialogFooter>
            <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
              {tags.map((item) => (
                <TagsListItem key={item.value} value={item.value}>
                  {item.name}
                </TagsListItem>
              ))}
            </TagsList>
          </SearchDialogFooter>
        ) : null}
      </SearchDialogContent>
    </SearchDialog>
  );
}
