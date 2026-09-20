import type { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";

export type TableOfContentsItem = {
  depth: number;
  id: string;
  text: string;
};

const minimumDepth = 2;
const maximumDepth = 4;

export function normalizeTableOfContents(toc: Toc) {
  const items: TableOfContentsItem[] = [];

  function visit(entries: TocEntry[]) {
    for (const entry of entries) {
      const text = entry.value.replace(/\s+/g, " ").trim();

      if (
        entry.depth >= minimumDepth &&
        entry.depth <= maximumDepth &&
        entry.id !== undefined &&
        text.length > 0
      ) {
        items.push({
          depth: entry.depth,
          id: entry.id,
          text,
        });
      }

      if (entry.children !== undefined) {
        visit(entry.children);
      }
    }
  }

  visit(toc);
  return items;
}
