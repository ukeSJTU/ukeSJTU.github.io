# Project context for AI assistants

This file is for AI assistants working with the owner of this repository. `README.md` is the public introduction for people browsing the source or considering a contribution; keep implementation instructions here rather than turning the README into an internal handbook.

## What this repository is

This is **ukeraser's personal website**, published at <https://ukesjtu.github.io>. It contains technical notes, learning experiments and software projects. It is an open-source personal site, not a reusable theme or a starter template.

- **Application:** Next.js App Router, React and TypeScript, statically exported to GitHub Pages. Preserve compatibility with static export; do not introduce request-time server features without discussing the deployment implications.
- **Presentation:** Tailwind CSS, CSS Modules and shadcn/ui built on Base UI.
- **Content:** Markdown articles and projects, plus YAML topic and series definitions, processed by Content Collections at build time. The Markdown pipeline includes Shiki, KaTeX and Mermaid.
- **Search:** Pagefind indexes the exported site. The browser loads the search bundle lazily.
- **Comments:** Giscus connects article comments to this repository's GitHub Discussions. Threads are mapped by pathname, so changing an article URL can affect its comments as well as incoming links.
- **Toolchain:** mise manages Node.js, pnpm and rumdl. Read `package.json`, `mise.toml` and the lockfiles for current versions rather than assuming them.

## Two kinds of work

Identify which kind of task the owner is asking for. A request may involve both, but keep website changes and editorial changes clearly separated.

### 1. Improve the website

These tasks change the application itself: layout, interaction, accessibility, search, content rendering, metadata, tooling or maintainability.

- Read the relevant source and the installed Next.js documentation before changing framework-dependent code. The managed guidance at the end of this file is important.
- Preserve existing URLs, content, visual behavior and interactions unless the task explicitly calls for changing them.
- Prefer a focused change to the module that owns the behavior. Reuse the existing content queries, metadata helpers, UI primitives and Markdown compiler instead of creating parallel implementations.
- Respect server/client separation. Keep Markdown compilation at build time and preserve lazy loading for browser-only features such as search.
- For refactors, establish the behavior to preserve before moving or simplifying code. Separate mechanical moves, visual changes and functional changes so regressions are easy to locate.
- Treat unused-code reports as candidates. Check imports, dynamic loading, generated markup, CSS selectors and framework conventions before deleting anything. Giscus theme CSS is fetched by URL, Commitlint runs through Lefthook, and rumdl comes from mise; these are not unused merely because a JavaScript analyzer cannot follow them.

### 2. Improve articles and other written content

These tasks improve explanation, structure, technical accuracy, examples or wording, usually under `content/`.

- Read the whole article before editing. Understand its intended reader, central argument and how its examples support the explanation.
- Preserve the author's meaning, voice and chosen language. Articles may be English, Chinese or mixed-language. Do not translate, change the thesis or replace a focused edit with a wholesale rewrite unless asked.
- Prefer precise explanations and a clear progression of ideas over generic introductions, repetitive summaries or promotional language. Distinguish factual corrections from stylistic preferences.
- Verify technical claims you add or correct against primary sources or reproducible experiments. State relevant platform and version assumptions. Never invent citations, command output, benchmarks or the author's personal experience; flag uncertainty when you cannot verify something.
- Keep code examples consistent with the prose. Run examples only when safe, using disposable directories or an appropriate sandbox for commands that modify files. Do not mistake an illustrative transcript for evidence that a command has been executed.
- Preserve published slugs, publication dates and existing references by default. Do not automatically bump `updatedAt` for copyediting; discuss date changes for substantive revisions. Heading changes can alter anchor links, so check links and cross-references when restructuring sections.
- Keep editorial work scoped to the article and its assets. If the problem is in the renderer or another website feature, identify that separately instead of silently expanding the task.
- `content/blog/hello-world.md` is a Markdown rendering showcase, not an ordinary essay. Its varied syntax and deliberate repetitions are test material; do not normalize them away as writing cleanup.

## Where things belong

| Location | Responsibility |
| --- | --- |
| `src/app` | Routes, metadata entry points, root layout and global styles |
| `src/app/**/_components` | UI private to a page or route family |
| `src/components` | UI shared across route families; related modules are grouped under `layout`, `markdown`, `search` and `theme` |
| `src/components/ui` | Used shadcn primitives, not a stockpile of unused generated components |
| `src/lib/content` | Content queries and build-time Markdown processing; application callers use these queries instead of generated collections |
| `src/lib/search` | Pagefind loading and result conversion, without React rendering |
| `src/lib/site` | Site configuration, metadata and structured-data helpers |
| `content-collections.ts` | Collection schemas and cross-document validation |
| `content/` | Blog articles, project descriptions, topic and series definitions |
| `public/` | Public assets, including images and Giscus theme stylesheets |

Do not hand-edit generated `.content-collections/`, `.next/` or `out/` files. `CLAUDE.md` delegates to this file; do not maintain a second copy of these instructions there.

### Code and style conventions

- Use `kebab-case` filenames, `PascalCase` React component names and `camelCase` functions. Hooks use `use-` filenames and `use` function names. Keep Next.js's reserved filenames unchanged.
- Use relative imports within a module or route family and `@/` imports across them. Shared modules must not import route-private code. Avoid barrel files that mix client components with build-only code.
- Import `cn` through `@/lib/utils`. Export only what callers need; keep feature-specific hooks beside their feature.
- Content date getters ending in `Date` return a JavaScript `Date`; those ending in `DateString` return a `YYYY-MM-DD` string.
- Keep feature styles in adjacent `*.module.css` files. `src/app/globals.css` owns Tailwind setup, theme tokens, base rules and the shared page container. Preserve cascade layers when moving styles.
- `src/components/page-transition.css` is intentionally global. Transition identities must agree with React's configuration; moving them into CSS Modules can rename them and break matching.
- Markdown `data-*` attributes connect rehype plugins, prose styles and the copy controller. Check all three before changing that contract.

## Content rules

`content-collections.ts` is the source of truth for frontmatter validation. A blog article requires:

```yaml
---
slug: "note-title"
title: "Note title"
summary: "A short description of the note."
publishedAt: "2026-09-19"
topics:
  - "markdown"
---
```

- Blog articles live in `content/blog` and publish at `/blog/<slug>`. `updatedAt` is an optional date in the same format as `publishedAt`.
- Slugs use lowercase letters, numbers and single hyphens, and must be unique within their collection. The slug, not the Markdown filename, controls the public URL.
- Each article references one to three distinct existing topics. Topic definitions live in `content/topics/*.yaml` and require `slug` and `name`; their pages are `/topics/<slug>`.
- Series definitions live in `content/series/*.yaml` and require `slug`, `name` and a short `description`. `/series` lists them by name; `/series/<slug>` lists their articles in reading order. Empty series are public and searchable.
- A blog may optionally declare `series: { slug: "series-slug", order: 10 }`. Membership is authored only in the blog, not duplicated in the series definition. The order must be a positive integer unique within that series; gaps are allowed. It controls series lists and previous/next links, not public numbering, article URLs or the global recency order.
- Local preview articles under `content/blog/_series-preview/` are temporary writing outlines, not publication-ready content. Keep them out of commits (the local `.git/info/exclude` can guard against accidental staging) and remove them before publishing a local build. Git exclusion does not prevent Content Collections from including them in a build; there is no draft filter.
- Projects live in `content/projects` and require `slug`, `name`, `description`, `year` and `order`. `demo` and `source` are optional URLs. A non-empty Markdown body creates a detail page at `/projects/<slug>`; otherwise the project appears only in the index.
- Images belong in `public/` and can be referenced by site-absolute paths. Preserve attribution and licensing for third-party material.
- Use the existing Markdown features rather than introducing MDX: GFM, CJK-friendly parsing, math, Mermaid, and highlighted code fences. Fence metadata supports titles, captions, line numbers and line/word highlighting; preserve these annotations when editing examples. The rendering showcase demonstrates supported syntax.
- Markdown is trusted repository-owned input and supports raw HTML. Do not reuse its compiler or renderer for untrusted submissions without adding sanitization.

## Working locally and checking changes

With mise activated in the shell:

```bash
mise install
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

Chromium is needed to render Mermaid during the content build, not just for browser tests.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server at `http://localhost:3000` |
| `pnpm test` / `pnpm test:watch` | Run Vitest once or in watch mode |
| `pnpm lint` | Biome checks plus rumdl Markdown checks |
| `pnpm lint:md` | Markdown formatting and lint checks only |
| `pnpm build` | Export the site to `out/` and generate the Pagefind index |
| `pnpm preview` | Build and serve a production preview, including search |
| `pnpm serve` | Re-index and serve the existing export |
| `pnpm check` | Run lint, tests and the production build |

For website code changes, run `pnpm check`. For article changes, run `pnpm lint:md` and `pnpm build`; inspect the rendered page when changing code fences, diagrams, math or layout-sensitive Markdown. Documentation-only changes normally need Markdown checks, not a full application build.

Vitest tests are colocated as `*.test.ts`; root configuration tests stay beside their configuration. Agree on the critical public interfaces before expanding test coverage. Test observable behavior, mock external inputs rather than internal modules, and keep fixtures independent of the current articles and generated build output. Use a failing test first for new behavior or bug fixes; protect existing behavior before refactoring it. There is no coverage-percentage target.

Tests do not replace production-preview checks for real Pagefind integration, keyboard navigation, composition input, focus restoration, clipboard feedback, light/dark themes or responsive layouts. Check the interactions affected by the change and report what was actually verified, including any limitations.

Lefthook checks staged files, validates Conventional Commit messages and runs `pnpm check` before a push. Do not bypass these checks. Changes pushed to `main` are deployed through GitHub Actions.

## Managed framework guidance

Keep the following Next.js-managed block intact. It may be updated by the framework.

<!-- rumdl-disable MD025 -->
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
<!-- rumdl-enable MD025 -->
