import type { PagefindResultData } from "./pagefind";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export interface SearchResult {
  date?: string;
  excerpt: string;
  href: string;
  id: string;
  section?: string;
  title: string;
}

function normalizeResultUrl(url: string) {
  const hashIndex = url.indexOf("#");
  const pathname = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
  const cleanPathname = pathname
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "");

  return `${cleanPathname}${hash}`;
}

export function toSearchResult(
  id: string,
  result: PagefindResultData,
): SearchResult {
  const section = result.sub_results?.find(({ url }) => url.includes("#"));
  const canonicalPath = normalizeResultUrl(result.meta.url ?? result.url);
  const sectionHash = section?.url.includes("#")
    ? section.url.slice(section.url.indexOf("#"))
    : "";
  const date = result.meta.date ? new Date(result.meta.date) : undefined;

  return {
    date:
      date && !Number.isNaN(date.valueOf())
        ? dateFormatter.format(date)
        : undefined,
    excerpt: section?.excerpt ?? result.excerpt,
    href: canonicalPath.split("#")[0] + sectionHash,
    id,
    section:
      section && section.title !== result.meta.title
        ? section.title
        : undefined,
    title: result.meta.title ?? "Untitled",
  };
}
