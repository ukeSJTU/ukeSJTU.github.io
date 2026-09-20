import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test } from "vitest";
import { loadPagefind, resetPagefind } from "./pagefind";

// A stand-in for Pagefind's externally generated browser module. Exercise real
// dynamic imports; do not mock the loader or its private promise/cache state.
const pagefindModule = `
let configured = false;
let ready = false;
export async function options() {
  await Promise.resolve();
  configured = true;
}
export async function init() {
  if (!configured) throw new Error("Options are not ready");
  ready = true;
}
export async function debouncedSearch(query) {
  if (!ready) throw new Error("Search is not ready");
  return { results: [{ id: query }] };
}
`;

let directory: string;
let modulePath: string;

beforeEach(async () => {
  resetPagefind();
  directory = await mkdtemp(join(tmpdir(), "site-pagefind-test-"));
  await mkdir(join(directory, "pagefind"));
  await writeFile(join(directory, "package.json"), '{"type":"module"}');
  modulePath = join(directory, "pagefind/pagefind.js");
});

afterEach(async () => {
  resetPagefind();
  await rm(directory, { recursive: true, force: true });
});

test("concurrent callers receive the same ready-to-search module", async () => {
  await writeFile(modulePath, pagefindModule);

  const [first, second] = await Promise.all([
    loadPagefind(directory),
    loadPagefind(` ${directory}/ `),
  ]);

  expect(first).toBe(second);
  await expect(first.debouncedSearch("markdown")).resolves.toEqual({
    results: [{ id: "markdown" }],
  });
});

test("explicit retry recovers from a failed module import", async () => {
  await writeFile(modulePath, 'throw new Error("Search bundle unavailable");');
  await expect(loadPagefind(directory)).rejects.toThrow(
    "Search bundle unavailable",
  );

  await writeFile(modulePath, pagefindModule);
  resetPagefind();
  const pagefind = await loadPagefind(directory);

  await expect(pagefind.debouncedSearch("recovered")).resolves.toEqual({
    results: [{ id: "recovered" }],
  });
});

test("a failed initialization does not poison subsequent loads", async () => {
  await writeFile(
    modulePath,
    `let attempts = 0;\n${pagefindModule.replace(
      "ready = true;",
      'if (++attempts === 1) throw new Error("Index unavailable"); ready = true;',
    )}`,
  );
  await expect(loadPagefind(directory)).rejects.toThrow("Index unavailable");

  const pagefind = await loadPagefind(directory);

  await expect(pagefind.debouncedSearch("retry")).resolves.toEqual({
    results: [{ id: "retry" }],
  });
});
