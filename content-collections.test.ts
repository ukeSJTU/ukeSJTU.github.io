import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createBuilder } from "@content-collections/core";
import { afterEach, expect, test } from "vitest";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

function note(content: string) {
  return `---
slug: test-note
title: Test note
summary: A test note
publishedAt: "2026-01-01"
tags: [markdown]
---
${content}`;
}

async function buildContent(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), "site-content-test-"));
  directories.push(directory);
  await symlink(
    fileURLToPath(new URL("./node_modules", import.meta.url)),
    join(directory, "node_modules"),
    "dir",
  );
  const configPath = join(directory, "content-collections.ts");
  const sourceConfig = fileURLToPath(
    new URL("./content-collections.ts", import.meta.url),
  );
  await writeFile(
    configPath,
    `export { default } from ${JSON.stringify(sourceConfig)};`,
  );

  for (const [path, content] of Object.entries({
    "tags/markdown.yaml": "slug: markdown\nname: Markdown\n",
    ...files,
  })) {
    const destination = join(directory, "content", path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }

  const builder = await createBuilder(configPath);
  const errors: string[] = [];
  builder.on("_error", ({ error }) => errors.push(error.message));
  await builder.build();
  const generated = join(directory, ".content-collections/generated/index.js");
  const collections = (await import(
    generated
  )) as typeof import("content-collections");
  return { ...collections, errors };
}

test("blog headings have unique anchors matching the published table of contents", async () => {
  const { allBlogs, errors } = await buildContent({
    "blog/nested/source-name.md": note(
      "# Title\n\n## Hello *world*\n\n### Details\n\n## Hello *world*\n\n##### Too deep",
    ),
  });

  expect(errors).toEqual([]);
  expect(allBlogs[0].slug).toBe("test-note");
  expect(allBlogs[0].tableOfContents).toEqual([
    { depth: 2, id: "hello-world", text: "Hello world" },
    { depth: 3, id: "details", text: "Details" },
    { depth: 2, id: "hello-world-1", text: "Hello world" },
  ]);
  expect(allBlogs[0].html).toContain('<h2 id="hello-world">');
  expect(allBlogs[0].html).toContain('<h3 id="details">');
  expect(allBlogs[0].html).toContain('<h2 id="hello-world-1">');
});

test.each([
  "blog",
  "projects",
] as const)("%s code fences retain their title, line highlights, and copy controls", async (collection) => {
  const markdown =
    '```ts title="example.ts" showLineNumbers {2}\nconst answer = 42;\nconsole.log(answer);\n```';
  const content =
    collection === "blog"
      ? note(markdown)
      : `---\nslug: test-project\nname: Test project\ndescription: A project\nyear: 2026\norder: 1\n---\n${markdown}`;
  const { allBlogs, allProjects, errors } = await buildContent({
    [`${collection}/code.md`]: content,
  });
  const html = (collection === "blog" ? allBlogs : allProjects)[0].html;

  expect(errors).toEqual([]);
  expect(html).toContain("example.ts");
  expect(html).toContain("data-line-numbers");
  expect(html).toContain("data-highlighted-line");
  expect(html).toContain("data-copy-code");
  expect(html).toContain('aria-label="Copy code"');
});

test("notes referencing an unknown tag are rejected with a useful diagnostic", async () => {
  const { allBlogs, errors } = await buildContent({
    "blog/unknown-tag.md": note("A note").replace(
      "tags: [markdown]",
      "tags: [missing-tag]",
    ),
  });

  expect(allBlogs).toEqual([]);
  expect(errors).toEqual([
    expect.stringContaining('Unknown tags in "unknown-tag": missing-tag'),
  ]);
});

test("duplicate blog slugs fail the content build before any page imports them", async () => {
  await expect(
    buildContent({
      "blog/first.md": note("First"),
      "blog/second.md": note("Second"),
    }),
  ).rejects.toThrow('Duplicate blog slug "test-note"');
});

test("tag slugs must be unique even when the source filenames differ", async () => {
  await expect(
    buildContent({
      "tags/another-file.yaml": "slug: markdown\nname: Another name\n",
    }),
  ).rejects.toThrow('Duplicate tag slug "markdown"');
});

test("duplicate project slugs fail the content build even without articles", async () => {
  const project =
    "---\nslug: same-project\nname: Project\ndescription: A project\nyear: 2026\norder: 1\n---\n";
  await expect(
    buildContent({
      "projects/first.md": project,
      "projects/second.md": project,
    }),
  ).rejects.toThrow('Duplicate project slug "same-project"');
});

test("tags define article taxonomy without accepting the retired topics field", async () => {
  const { allBlogs, errors } = await buildContent({
    "tags/markdown.yaml": "slug: markdown\nname: Markdown\n",
    "blog/tagged.md": note("A tagged note"),
  });
  expect(errors).toEqual([]);
  expect(allBlogs[0]).toMatchObject({ slug: "test-note", tags: ["markdown"] });
  expect(allBlogs[0]).not.toHaveProperty("topics");
});

test("projects retain their public slug independently of the source filename", async () => {
  const { allProjects, errors } = await buildContent({
    "projects/nested/renamed.md":
      "---\nslug: stable-project\nname: Project\ndescription: A project\nyear: 2026\norder: 1\n---\n## Details\nAn article.",
  });

  expect(errors).toEqual([]);
  expect(allProjects[0]).toMatchObject({
    slug: "stable-project",
    hasArticle: true,
    tableOfContents: [{ depth: 2, id: "details", text: "Details" }],
  });
});

const seriesDefinition =
  "slug: test-series\nname: Test series\ndescription: A short introduction.\n";

function seriesNote(slug: string, series: string) {
  return note("A series note")
    .replace("slug: test-note", `slug: ${slug}`)
    .replace("tags: [markdown]", `tags: [markdown]\nseries: ${series}`);
}

test("series are independent definitions, including ones without posts", async () => {
  const { allSeries, allBlogs, errors } = await buildContent({
    "series/nested/renamed.yaml": seriesDefinition,
    "blog/standalone.md": note("No series"),
  });

  expect(errors).toEqual([]);
  expect(allSeries).toEqual([
    expect.objectContaining({
      slug: "test-series",
      name: "Test series",
      description: "A short introduction.",
    }),
  ]);
  expect(allBlogs[0]).not.toHaveProperty("series");
});

test("series membership retains explicit, non-contiguous ordering", async () => {
  const { allBlogs, errors } = await buildContent({
    "series/test.yaml": seriesDefinition,
    "series/another.yaml": seriesDefinition.replaceAll(
      "test-series",
      "another-series",
    ),
    "blog/first.md": seriesNote("first", "{ slug: test-series, order: 10 }"),
    "blog/second.md": seriesNote("second", "{ slug: test-series, order: 30 }"),
    "blog/other.md": seriesNote("other", "{ slug: another-series, order: 10 }"),
  });

  expect(errors).toEqual([]);
  expect(allBlogs.find((post) => post.slug === "second")?.series).toEqual({
    slug: "test-series",
    order: 30,
  });
  expect(allBlogs).toHaveLength(3);
});

test.each([
  "{ slug: test-series }",
  "{ order: 10 }",
  "{ slug: test-series, order: 0 }",
  "{ slug: test-series, order: -1 }",
  "{ slug: test-series, order: 1.5 }",
  '{ slug: test-series, order: "10" }',
  "[{ slug: test-series, order: 10 }]",
  "null",
])("invalid series membership is rejected: %s", async (membership) => {
  const { allBlogs, errors } = await buildContent({
    "series/test.yaml": seriesDefinition,
    "blog/invalid.md": seriesNote("invalid", membership),
  });

  expect(allBlogs).toEqual([]);
  expect(errors).toEqual([expect.stringContaining("series")]);
});

test("unknown series references identify the source article", async () => {
  const { allBlogs, errors } = await buildContent({
    "blog/unknown.md": seriesNote("unknown", "{ slug: missing, order: 10 }"),
  });

  expect(allBlogs).toEqual([]);
  expect(errors).toEqual([
    expect.stringContaining('Unknown series in "unknown": missing'),
  ]);
});

test("duplicate series slugs fail the content build", async () => {
  await expect(
    buildContent({
      "series/first.yaml": seriesDefinition,
      "series/second.yaml": seriesDefinition,
    }),
  ).rejects.toThrow('Duplicate series slug "test-series"');
});

test("duplicate positions within a series fail with both source paths", async () => {
  await expect(
    buildContent({
      "series/test.yaml": seriesDefinition,
      "blog/first.md": seriesNote("first", "{ slug: test-series, order: 10 }"),
      "blog/nested/second.md": seriesNote(
        "second",
        "{ slug: test-series, order: 10 }",
      ),
    }),
  ).rejects.toThrow(
    /Duplicate order 10 in series "test-series".*first.*nested\/second/,
  );
});

test.each([
  "slug: Bad Slug\nname: Test\ndescription: Introduction\n",
  "slug: test-series\nname: ' '\ndescription: Introduction\n",
  "slug: test-series\nname: Test\ndescription: ' '\n",
])("invalid series definitions are rejected", async (definition) => {
  const { allSeries, errors } = await buildContent({
    "series/test.yaml": definition,
  });
  expect(allSeries).toEqual([]);
  expect(errors).toHaveLength(1);
});

test("invalid public slugs are rejected before a note is published", async () => {
  const { allBlogs, errors } = await buildContent({
    "blog/invalid-slug.md": note("A note").replace(
      "slug: test-note",
      "slug: Invalid Slug",
    ),
  });

  expect(allBlogs).toEqual([]);
  expect(errors).toEqual([
    expect.stringContaining("Slug must contain lowercase letters"),
  ]);
});
