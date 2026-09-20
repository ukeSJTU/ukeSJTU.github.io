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
topics: [markdown]
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
    "topics/markdown.yaml": "slug: markdown\nname: Markdown\n",
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

test("notes referencing an unknown topic are rejected with a useful diagnostic", async () => {
  const { allBlogs, errors } = await buildContent({
    "blog/unknown-topic.md": note("A note").replace(
      "topics: [markdown]",
      "topics: [missing-topic]",
    ),
  });

  expect(allBlogs).toEqual([]);
  expect(errors).toEqual([
    expect.stringContaining('Unknown topics in "unknown-topic": missing-topic'),
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

test("topic slugs must be unique even when the source filenames differ", async () => {
  await expect(
    buildContent({
      "topics/another-file.yaml": "slug: markdown\nname: Another name\n",
    }),
  ).rejects.toThrow('Duplicate topic slug "markdown"');
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

test("projects retain their public slug independently of the source filename", async () => {
  const { allProjects, errors } = await buildContent({
    "projects/nested/renamed.md":
      "---\nslug: stable-project\nname: Project\ndescription: A project\nyear: 2026\norder: 1\n---\n## Details\nAn article.",
  });

  expect(errors).toEqual([]);
  expect(allProjects[0]).toMatchObject({
    slug: "stable-project",
    hasArticle: true,
  });
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
