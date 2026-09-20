"use client";

import { useEffect, useRef, useState } from "react";
import { loadPagefind, resetPagefind } from "@/lib/search/pagefind";
import { type SearchResult, toSearchResult } from "@/lib/search/search-result";

export const searchResultLimit = 8;

interface SearchState {
  query: string;
  status: "idle" | "loading" | "ready" | "error";
  results: SearchResult[];
  total: number;
}

type SearchSnapshot = {
  basePath: string;
  attempt: number;
  state: SearchState;
};

const pagefindClient = { load: loadPagefind, reset: resetPagefind };

export function useSiteSearch(
  {
    basePath = "",
    query,
    open,
    composing,
  }: {
    basePath?: string;
    query: string;
    open: boolean;
    composing: boolean;
  },
  client = pagefindClient,
) {
  const normalizedQuery = query.trim();
  const [attempt, setAttempt] = useState(0);
  const [snapshot, setSnapshot] = useState<SearchSnapshot>({
    basePath,
    attempt: 0,
    state: { query: "", status: "idle", results: [], total: 0 },
  });
  const completedSearch = useRef<SearchSnapshot | null>(null);

  useEffect(() => {
    if (!open || composing) return;
    const cached = completedSearch.current;
    if (
      cached?.basePath === basePath &&
      cached.attempt === attempt &&
      cached.state.query === normalizedQuery
    ) {
      setSnapshot(cached);
      return;
    }

    let cancelled = false;
    setSnapshot({
      basePath,
      attempt,
      state: {
        query: normalizedQuery,
        status: normalizedQuery ? "loading" : "idle",
        results: [],
        total: 0,
      },
    });

    async function search() {
      try {
        const pagefind = await client.load(basePath);
        if (cancelled || !normalizedQuery) return;
        const response = await pagefind.debouncedSearch(
          normalizedQuery,
          {},
          250,
        );
        if (cancelled || response === null) return;
        const results = await Promise.all(
          response.results
            .slice(0, searchResultLimit)
            .map(async (result) =>
              toSearchResult(result.id, await result.data()),
            ),
        );
        if (cancelled) return;
        const next: SearchSnapshot = {
          basePath,
          attempt,
          state: {
            query: normalizedQuery,
            status: "ready",
            results,
            total: response.results.length,
          },
        };
        completedSearch.current = next;
        setSnapshot(next);
      } catch {
        if (!cancelled)
          setSnapshot({
            basePath,
            attempt,
            state: {
              query: normalizedQuery,
              status: "error",
              results: [],
              total: 0,
            },
          });
      }
    }

    void search();
    return () => {
      cancelled = true;
    };
  }, [basePath, normalizedQuery, open, composing, attempt, client]);

  function retry() {
    client.reset();
    completedSearch.current = null;
    setAttempt((value) => value + 1);
  }

  // Hide stale items in the same render as an input change, before effects run.
  const isCurrent =
    snapshot.basePath === basePath &&
    snapshot.attempt === attempt &&
    snapshot.state.query === normalizedQuery;
  const status = composing
    ? "idle"
    : isCurrent
      ? snapshot.state.status
      : normalizedQuery
        ? "loading"
        : "idle";

  return {
    query: snapshot.state.query,
    status,
    results: status === "ready" ? snapshot.state.results : [],
    total: status === "ready" ? snapshot.state.total : 0,
    retry,
  };
}
