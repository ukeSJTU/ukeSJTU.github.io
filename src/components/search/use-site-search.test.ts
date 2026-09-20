// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import type {
  PagefindApi,
  PagefindSearchResponse,
} from "@/lib/search/pagefind";
import { useSiteSearch } from "./use-site-search";

afterEach(cleanup);

function response(title: string): PagefindSearchResponse {
  return {
    results: [
      {
        id: title,
        data: async () => ({
          url: `/blog/${title}.html`,
          excerpt: title,
          plain_excerpt: title,
          meta: { title },
        }),
      },
    ],
  };
}

function client(search: PagefindApi["debouncedSearch"]) {
  const api: PagefindApi = { init() {}, options() {}, debouncedSearch: search };
  return { load: async () => api, reset() {} };
}

test("a slower previous query cannot replace the current search results", async () => {
  const first = Promise.withResolvers<PagefindSearchResponse>();
  const second = Promise.withResolvers<PagefindSearchResponse>();
  const searchClient = client((query) =>
    query === "first" ? first.promise : second.promise,
  );
  const { result, rerender } = renderHook(
    (props) => useSiteSearch(props, searchClient),
    { initialProps: { query: "first", open: true, composing: false } },
  );
  await act(async () => {});

  rerender({ query: "second", open: true, composing: false });
  expect(result.current.results).toEqual([]);
  await act(async () => {
    second.resolve(response("second"));
  });
  expect(result.current.results.map(({ title }) => title)).toEqual(["second"]);

  await act(async () => {
    first.resolve(response("first"));
  });
  expect(result.current.status).toBe("ready");
  expect(result.current.results.map(({ title }) => title)).toEqual(["second"]);
});

test("composition hides selectable results until the final query is committed", async () => {
  const searchClient = client(async (query) => response(query));
  const { result, rerender } = renderHook(
    (props) => useSiteSearch(props, searchClient),
    { initialProps: { query: "old", open: true, composing: false } },
  );
  await act(async () => {});
  expect(result.current.results).toHaveLength(1);

  rerender({ query: "中", open: true, composing: true });
  expect(result.current.status).toBe("idle");
  expect(result.current.results).toEqual([]);

  rerender({ query: "中文", open: true, composing: false });
  await act(async () => {});
  expect(result.current.results.map(({ title }) => title)).toEqual(["中文"]);
});

test("retry clears a load error and publishes fresh results", async () => {
  let unavailable = true;
  const available = client(async (query) => response(query));
  const searchClient = {
    load: async () => {
      if (unavailable) throw new Error("Offline");
      return available.load();
    },
    reset: () => {
      unavailable = false;
    },
  };
  const { result } = renderHook(() =>
    useSiteSearch(
      { query: "note", open: true, composing: false },
      searchClient,
    ),
  );
  await act(async () => {});
  expect(result.current.status).toBe("error");

  await act(async () => {
    result.current.retry();
  });
  expect(result.current.status).toBe("ready");
  expect(result.current.results).toMatchObject([{ title: "note" }]);
});
