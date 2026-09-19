"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  getCleanResultUrl,
  loadPagefind,
  type PagefindResultData,
} from "@/lib/search/pagefind";

const maximumResults = 8;
const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

type SearchStatus = "idle" | "loading" | "ready" | "error";

interface DisplayResult {
  date?: string;
  excerpt: string;
  href: string;
  id: string;
  path: string;
  section?: string;
  title: string;
}

interface SearchDialogProps {
  basePath?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function getDisplayResult(
  id: string,
  result: PagefindResultData,
): DisplayResult {
  const section = result.sub_results?.find(({ url }) => url.includes("#"));
  const canonicalPath = getCleanResultUrl(result.meta.url ?? result.url);
  const sectionHash = section?.url.includes("#")
    ? section.url.slice(section.url.indexOf("#"))
    : "";
  const href = `${canonicalPath.split("#")[0]}${sectionHash}`;

  let displayPath = href;
  try {
    displayPath = decodeURI(href);
  } catch {
    // Keep Pagefind's encoded URL when it contains a malformed escape sequence.
  }

  return {
    date: result.meta.date,
    excerpt: section?.excerpt ?? result.excerpt,
    href,
    id,
    path: displayPath,
    section:
      section && section.title !== result.meta.title
        ? section.title
        : undefined,
    title: result.meta.title ?? "Untitled",
  };
}

function formatDate(date: string | undefined) {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.valueOf())
    ? undefined
    : dateFormatter.format(parsedDate);
}

function getEmptyMessage(status: SearchStatus, query: string) {
  if (status === "error") {
    return "Search is unavailable in this preview.";
  }
  if (status === "loading") {
    return "Searching…";
  }
  if (query.trim()) {
    return "No results found.";
  }
  return "Start typing to search posts and pages.";
}

export function SearchDialog({
  basePath = "",
  onOpenChange,
  open,
}: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultCount, setResultCount] = useState(0);
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");

  useEffect(() => {
    let cancelled = false;

    void loadPagefind(basePath).catch(() => {
      if (!cancelled) {
        setStatus("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [basePath]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setResults([]);
      setResultCount(0);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const search = async () => {
      try {
        const pagefind = await loadPagefind(basePath);
        const response = await pagefind.debouncedSearch(
          normalizedQuery,
          {},
          250,
        );

        if (cancelled || response === null) {
          return;
        }

        const loadedResults = await Promise.all(
          response.results
            .slice(0, maximumResults)
            .map(async (result) =>
              getDisplayResult(result.id, await result.data()),
            ),
        );

        if (cancelled) {
          return;
        }

        setResults(loadedResults);
        setResultCount(response.results.length);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setResults([]);
          setResultCount(0);
          setStatus("error");
        }
      }
    };

    void search();

    return () => {
      cancelled = true;
    };
  }, [basePath, query]);

  const statusMessage =
    status === "ready"
      ? `${resultCount} ${resultCount === 1 ? "result" : "results"}`
      : status === "loading"
        ? "Searching"
        : "";

  return (
    <CommandDialog
      className="top-4 translate-y-0 sm:top-[15vh] sm:max-w-2xl"
      description="Search across posts and pages."
      onOpenChange={onOpenChange}
      open={open}
      showCloseButton
      title="Search site"
    >
      <Command label="Site search" loop shouldFilter={false}>
        <CommandInput
          autoFocus
          className="pr-8"
          onValueChange={setQuery}
          placeholder="Search notes, code, and ideas…"
          value={query}
        />
        <CommandList className="max-h-[min(65vh,30rem)]" label="Search results">
          <CommandEmpty className="text-muted-foreground px-6 py-12">
            {getEmptyMessage(status, query)}
          </CommandEmpty>

          {results.length > 0 ? (
            <CommandGroup
              className="**:[[cmdk-group-heading]]:text-popover-foreground/80"
              heading={statusMessage}
            >
              {results.map((result) => {
                const formattedDate = formatDate(result.date);

                return (
                  <CommandItem
                    className="items-start py-3 [&>svg:last-child]:hidden"
                    key={result.id}
                    onSelect={() => {
                      onOpenChange(false);
                      router.push(result.href);
                    }}
                    value={result.id}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex min-w-0 items-baseline gap-2">
                        <span className="truncate font-medium">
                          {result.title}
                        </span>
                        {result.section ? (
                          <span className="text-popover-foreground/80 truncate text-xs">
                            {result.section}
                          </span>
                        ) : null}
                      </div>
                      <p
                        className="text-popover-foreground/80 line-clamp-2 leading-relaxed [&_mark]:bg-primary/20 [&_mark]:text-foreground"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind escapes indexed HTML before inserting its own mark tags.
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                      <div className="text-popover-foreground/80 flex min-w-0 items-center justify-between gap-3 font-mono text-xs">
                        <span className="truncate">{result.path}</span>
                        {formattedDate ? (
                          <time className="shrink-0" dateTime={result.date}>
                            {formattedDate}
                          </time>
                        ) : null}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : null}
        </CommandList>
        <span aria-live="polite" className="sr-only">
          {statusMessage}
        </span>
      </Command>
    </CommandDialog>
  );
}
