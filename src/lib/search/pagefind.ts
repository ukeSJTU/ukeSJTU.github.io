export interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
  plain_excerpt: string;
}

export interface PagefindResultData {
  url: string;
  excerpt: string;
  plain_excerpt: string;
  meta: Record<string, string | undefined>;
  sub_results?: PagefindSubResult[];
}

interface PagefindRawResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

export interface PagefindSearchResponse {
  results: PagefindRawResult[];
}

export interface PagefindApi {
  init: () => Promise<void> | void;
  options: (options: {
    basePath?: string;
    excerptLength?: number;
  }) => Promise<void> | void;
  debouncedSearch: (
    query: string,
    options?: Record<string, unknown>,
    debounceTimeout?: number,
  ) => Promise<PagefindSearchResponse | null>;
}

let activeBasePath: string | undefined;
let pagefindPromise: Promise<PagefindApi> | undefined;

export function normalizeBasePath(basePath: string) {
  const trimmed = basePath.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export function loadPagefind(basePath = "") {
  const normalizedBasePath = normalizeBasePath(basePath);

  if (pagefindPromise && activeBasePath === normalizedBasePath) {
    return pagefindPromise;
  }

  activeBasePath = normalizedBasePath;
  const bundlePath = `${normalizedBasePath}/pagefind/`;
  const moduleUrl = `${bundlePath}pagefind.js`;
  const pending = import(
    /* webpackIgnore: true */
    /* turbopackIgnore: true */
    moduleUrl
  ).then(async (module) => {
    const pagefind = module as PagefindApi;
    await pagefind.options({ basePath: bundlePath, excerptLength: 24 });
    await pagefind.init();
    return pagefind;
  });

  pagefindPromise = pending.catch((error) => {
    pagefindPromise = undefined;
    activeBasePath = undefined;
    throw error;
  });

  return pagefindPromise;
}

export function getCleanResultUrl(url: string) {
  const hashIndex = url.indexOf("#");
  const pathname = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
  const cleanPathname = pathname
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "");

  return `${cleanPathname}${hash}`;
}
