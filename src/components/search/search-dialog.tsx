"use client";

import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogClose } from "@/components/ui/dialog";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  getCleanResultUrl,
  loadPagefind,
  type PagefindResultData,
  resetPagefind,
} from "@/lib/search/pagefind";

const maximumResults = 8;
const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

interface DisplayResult {
  date?: string;
  excerpt: string;
  href: string;
  id: string;
  section?: string;
  title: string;
}

interface SearchState {
  query: string;
  status: "idle" | "loading" | "ready" | "error";
  results: DisplayResult[];
  total: number;
}

interface SearchDialogProps {
  basePath?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  returnFocusRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
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

export function SearchDialog({
  basePath = "",
  onOpenChange,
  open,
  returnFocusRef,
  triggerRef,
}: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef("");
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [viewport, setViewport] = useState<{ height: number; top: number }>();
  const [state, setState] = useState<SearchState>({
    query: "",
    status: "idle",
    results: [],
    total: 0,
  });
  const completedSearch = useRef<{
    basePath: string;
    attempt: number;
    state: SearchState;
  } | null>(null);
  const normalizedQuery = query.trim();

  // Hide stale items in the render that changes the query, before effects run.
  const status = composing
    ? "idle"
    : state.query === normalizedQuery
      ? state.status
      : normalizedQuery
        ? "loading"
        : "idle";
  const results = status === "ready" ? state.results : [];

  useEffect(() => {
    if (!open || composing) return;
    const cached = completedSearch.current;
    if (
      cached?.basePath === basePath &&
      cached.attempt === attempt &&
      cached.state.query === normalizedQuery
    ) {
      setState(cached.state);
      return;
    }
    let cancelled = false;
    setState({
      query: normalizedQuery,
      status: normalizedQuery ? "loading" : "idle",
      results: [],
      total: 0,
    });
    const search = async () => {
      try {
        const pagefind = await loadPagefind(basePath);
        if (cancelled || !normalizedQuery) return;
        const response = await pagefind.debouncedSearch(
          normalizedQuery,
          {},
          250,
        );
        if (cancelled || response === null) return;
        const loadedResults = await Promise.all(
          response.results
            .slice(0, maximumResults)
            .map(async (result) =>
              getDisplayResult(result.id, await result.data()),
            ),
        );
        if (cancelled) return;
        const next: SearchState = {
          query: normalizedQuery,
          status: "ready",
          results: loadedResults,
          total: response.results.length,
        };
        completedSearch.current = { basePath, attempt, state: next };
        setState(next);
      } catch {
        if (!cancelled)
          setState({
            query: normalizedQuery,
            status: "error",
            results: [],
            total: 0,
          });
      }
    };
    void search();
    return () => {
      cancelled = true;
    };
  }, [basePath, normalizedQuery, open, composing, attempt]);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!open || !visualViewport) return;
    const update = () =>
      setViewport({
        height: visualViewport.height,
        top: visualViewport.offsetTop,
      });
    update();
    visualViewport.addEventListener("resize", update);
    visualViewport.addEventListener("scroll", update);
    return () => {
      visualViewport.removeEventListener("resize", update);
      visualViewport.removeEventListener("scroll", update);
    };
  }, [open]);

  function updateQuery(value: string) {
    queryRef.current = value.trim();
    setQuery(value);
  }

  function retry() {
    resetPagefind();
    completedSearch.current = null;
    setState({
      query: normalizedQuery,
      status: "loading",
      results: [],
      total: 0,
    });
    setAttempt((value) => value + 1);
    inputRef.current?.focus();
  }

  const countMessage =
    state.total > maximumResults
      ? `Showing ${maximumResults} of ${state.total} results. Refine your search for more.`
      : `${state.total} ${state.total === 1 ? "result" : "results"}`;
  const emptyTitle =
    status === "error"
      ? "Search couldn't load."
      : status === "loading"
        ? "Searching…"
        : normalizedQuery && !composing
          ? "No results found."
          : "Search posts and pages.";
  const emptyHint =
    status === "error"
      ? "Check your connection and try again."
      : status === "loading"
        ? ""
        : normalizedQuery && !composing
          ? "Try a different word or a shorter phrase."
          : "Type a word or phrase in English or Chinese.";

  return (
    <CommandDialog
      className="site-search-dialog top-[var(--search-top)] flex flex-col gap-0 sm:max-w-xl [--popover:var(--background)] [--popover-foreground:var(--foreground)]"
      contentProps={{
        initialFocus: inputRef,
        finalFocus: () =>
          returnFocusRef.current?.isConnected
            ? returnFocusRef.current
            : triggerRef.current,
        style: viewport
          ? ({
              "--search-viewport-height": `${viewport.height}px`,
              "--search-viewport-top": `${viewport.top}px`,
            } as CSSProperties)
          : undefined,
      }}
      description="Search posts and pages in English or Chinese. Use arrow keys to choose a result and Enter to open it."
      onOpenChange={onOpenChange}
      open={open}
      title="Search site"
    >
      <Command
        label="Site search"
        loop
        shouldFilter={false}
        onKeyDownCapture={(event) => {
          if (
            event.key === "Enter" &&
            event.target === inputRef.current &&
            (composing ||
              event.nativeEvent.isComposing ||
              event.nativeEvent.keyCode === 229 ||
              status !== "ready")
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <CommandInput
          aria-label="Search posts and pages"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onValueChange={updateQuery}
          placeholder="Search…"
          ref={inputRef}
          value={query}
          trailing={
            query ? (
              <InputGroupButton
                aria-label="Clear search"
                className="h-10 px-2"
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.stopPropagation();
                }}
                onClick={() => {
                  updateQuery("");
                  inputRef.current?.focus();
                }}
                size="sm"
              >
                Clear
              </InputGroupButton>
            ) : null
          }
        />
        <CommandEmpty className="min-h-0 overflow-y-auto px-5 py-6">
          <p>{emptyTitle}</p>
          {emptyHint ? (
            <p className="search-secondary mt-2">{emptyHint}</p>
          ) : null}
          {status === "error" ? (
            <Button
              className="mt-4"
              onClick={retry}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.stopPropagation();
              }}
              variant="outline"
            >
              Try again
            </Button>
          ) : null}
        </CommandEmpty>
        <CommandList
          className="max-h-none flex-1"
          label="Search results"
          aria-busy={status === "loading"}
        >
          {results.length > 0 ? (
            <CommandGroup className="p-2" heading={countMessage}>
              {results.map((result) => (
                <CommandItem
                  className="cursor-pointer items-start px-3 py-3"
                  key={result.id}
                  onSelect={() => {
                    if (
                      status !== "ready" ||
                      state.query !== queryRef.current ||
                      composing
                    )
                      return;
                    onOpenChange(false);
                    router.push(result.href);
                  }}
                  showIndicator={false}
                  value={result.id}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="text-base font-medium leading-snug">
                      {result.title}
                    </span>
                    {result.section ? (
                      <span className="text-primary text-xs leading-relaxed">
                        {result.section}
                      </span>
                    ) : null}
                    <p
                      className="search-excerpt search-secondary line-clamp-2 leading-relaxed"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind escapes indexed HTML before inserting its own mark tags.
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                    {result.date ? (
                      <span className="search-secondary text-xs">
                        {result.date}
                      </span>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {status === "ready"
            ? `${countMessage} for ${normalizedQuery}.`
            : emptyTitle}
        </span>
      </Command>
      <div className="search-secondary flex shrink-0 items-center justify-between gap-3 border-t px-4 py-1 text-xs">
        <span aria-hidden="true" className="hidden items-center gap-3 sm:flex">
          <span>
            <kbd>↑↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
        </span>
        <span className="sm:hidden">Search posts and pages</span>
        <DialogClose render={<Button className="h-10" variant="ghost" />}>
          Close <kbd className="ml-1 text-xs">Esc</kbd>
        </DialogClose>
      </div>
    </CommandDialog>
  );
}
