# Content Collections Design

Date: 2026-06-22

## Summary

The site will keep posts and notes as separate content shapes, add projects as a real content collection, and add series as a metadata collection for grouping posts. Projects will have both a card-wall list page and detail pages. Posts will remain the home for formal writing, including course notes, source-reading notes, topic notes, and essays.

The design follows this split:

- `post`: formal articles and structured learning notes.
- `note`: short-form notes, quick thoughts, and lightweight fragments.
- `project`: portfolio projects with frontmatter metadata and Markdown/MDX detail content.
- `series`: metadata pages for post series.
- `tag`: existing cross-topic metadata pages.

## Goals

- Add a `project` content collection with `/projects/` and `/projects/<slug>/` pages.
- Add a `series` content collection with `/series/` and `/series/<slug>/` pages.
- Require every post to reference one series by slug.
- Keep tags as cross-cutting topics, separate from series.
- Normalize `index.md` slugs for both posts and projects so content can later grow local assets without changing public URLs.
- Preserve the current simple Astro Cactus visual language.

## Non-Goals

- Do not split `courses`, `sources`, and `topics` into separate content collections.
- Do not add a `kind` frontmatter field to posts.
- Do not redesign the whole homepage or visual system.
- Do not make projects a hardcoded Astro page.
- Do not require long case-study content for every project detail page.

## Content Model

Posts remain in `src/content/post/`. The first path segment can express the public section. The recognized section folders for this design are `courses`, `sources`, `topics`, and `essays`; root-level posts are still allowed for existing or uncategorized articles.

```txt
src/content/post/courses/csapp/cache-lab.md
src/content/post/sources/react/reconciler.md
src/content/post/topics/type-systems/hm.md
src/content/post/essays/personal-site.md
```

That path segment is not duplicated in frontmatter. Each post must instead declare a `series` slug:

```yaml
title: Cache Lab Notes
description: Notes on cache behavior and memory locality.
publishDate: 2026-06-22
series: csapp
tags: ["cache", "systems"]
```

Series entries live in `src/content/series/` and provide human-readable metadata:

```yaml
title: "CS:APP"
description: "Notes from reading Computer Systems: A Programmer's Perspective."
```

Projects live in `src/content/project/`. The default authoring style is flat:

```txt
src/content/project/personal-blog.md
```

If a project later needs colocated images or assets, it can move to:

```txt
src/content/project/personal-blog/index.md
src/content/project/personal-blog/cover.png
```

Both forms produce `/projects/personal-blog/`.

Notes remain in `src/content/note/` and keep their current lightweight role.

## Schemas

The `post` schema will keep existing fields and add:

```yaml
series: string
```

The value is a required slug that must match an entry in the `series` collection.

The `series` schema will include:

```yaml
title: string
description?: string
```

Series Markdown/MDX body content is optional and can be rendered on the series detail page.

The `project` schema will include:

```yaml
title: string
description: string
publishDate: date
updatedDate?: date
status: active | completed | archived
techStack: string[]
repoUrl?: url
demoUrl?: url
featured: boolean # defaults to false
```

`techStack` defaults to an empty array. Project body content is optional. A detail page should still render cleanly when the body is short or empty.

The existing `tag` and `note` schemas stay conceptually the same.

## Routing

Current routes remain:

```txt
/posts/
/posts/<slug>/
/notes/
/notes/<slug>/
/tags/
/tags/<tag>/
```

New routes:

```txt
/projects/
/projects/<slug>/
/series/
/series/<slug>/
```

Post and project slugs will be normalized with the same rule:

```txt
foo/index -> foo
foo/bar   -> foo/bar
```

Examples:

```txt
src/content/project/personal-blog.md
  -> /projects/personal-blog/

src/content/project/personal-blog/index.md
  -> /projects/personal-blog/

src/content/post/topics/type-systems/index.md
  -> /posts/topics/type-systems/

src/content/post/courses/csapp/cache-lab.md
  -> /posts/courses/csapp/cache-lab/
```

## Pages And Components

New pages:

```txt
src/pages/projects/index.astro
src/pages/projects/[...slug].astro
src/pages/series/index.astro
src/pages/series/[series]/[...page].astro
```

Adjusted pages:

```txt
src/pages/posts/[...slug].astro
```

The posts detail route will use normalized slugs.

New components:

```txt
src/components/project/ProjectCard.astro
src/components/project/ProjectMasthead.astro
src/components/series/SeriesPreview.astro
```

`/projects/` displays a portfolio card wall. Cards show title, description, status, year or publish date, tech stack, and optional repository/demo links. Cards link to project detail pages. Sorting is `featured` first, then `publishDate` descending.

`/projects/<slug>/` renders a project masthead with metadata, then the project Markdown/MDX body using the existing prose style.

`/series/` lists all series with title, description, and post count. It sorts by series title ascending.

`/series/<slug>/` renders the series title, description, optional body content, and a paginated list of posts where `post.data.series === slug`, sorted by publish date descending. The page size should match the existing posts pagination size of 10.

The header navigation will add `Projects` and `Series`.

## Data Helpers

Post helpers should keep collection filtering and grouping out of page components:

```txt
src/data/post.ts
  getAllPosts()
  getPostsBySeries(seriesSlug)
  getAllSeriesWithPostCount()
  normalizeContentSlug(id)
```

Project helpers should provide sorted project access and slug normalization:

```txt
src/data/project.ts
  getAllProjects()
  getProjectSlug(project)
```

`normalizeContentSlug(id)` can be shared by posts and projects. Prefer placing it in `src/utils/content.ts`; if implementation context makes another location clearly more idiomatic, there must still be one shared source of truth.

## Validation And Error Handling

Every post must reference an existing series. If a post references a missing series slug, the build should fail with a clear error.

Project `status` must be one of:

```txt
active
completed
archived
```

Project `repoUrl` and `demoUrl` are optional. If present, they must be valid URLs.

Project detail pages must tolerate short or empty body content.

Existing posts must be updated with a valid `series` field so the stricter post schema does not break the current build.

## Search And RSS

Existing post and note RSS feeds stay in place.

Projects do not need an RSS feed in the first implementation.

Pagefind should continue indexing post and note detail pages through existing `data-pagefind-body` behavior. Project detail pages can be indexed if they use the same body marker pattern, but project indexing is not required for the first implementation unless it falls out naturally from the shared layout.

## Testing

Implementation should be verified with:

```bash
pnpm check
pnpm build
```

Run `pnpm postbuild` only if implementation changes Pagefind indexing behavior or search needs explicit verification.

## Accepted Design Decisions

- Use a `project` content collection, not hardcoded project data.
- Build both project list and detail pages in the first implementation.
- Use flat project Markdown files by default, while supporting folder `index.md` files without URL changes.
- Do not add `kind` to post frontmatter.
- Require `series` in post frontmatter.
- Make `series` its own metadata collection and generate series pages.
- Normalize `index.md` slugs for both posts and projects.
