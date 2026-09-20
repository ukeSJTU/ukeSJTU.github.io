# ukeSJTU.github.io

The source code for [ukesjtu.github.io](https://ukesjtu.github.io), a statically exported personal site built with Next.js, Content Collections, and shadcn/ui.

## Development

This project uses [mise](https://mise.jdx.dev/) to manage Node.js, pnpm, and rumdl. With mise activated in your shell, install the locked tool versions before installing dependencies:

```bash
mise install
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Content

Blog notes live in `content/blog` and are published at `/blog/<slug>`. Each Markdown file must include the following frontmatter:

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

The slug must be unique and use lowercase letters, numbers, and single hyphens. It controls the public URL, so Markdown files can move into nested directories without changing their URLs. An optional `updatedAt` field records when a note was revised. Images used within Markdown belong in `public/` and can be referenced by their site-absolute path.

Each note must reference between one and three topics by slug. Topics are defined as YAML files in `content/topics` and contain a unique `slug` and display `name`; builds fail when a note references an unknown topic. Topic slugs control their public URLs at `/topics/<slug>`.

Projects live in `content/projects`. Each project requires a unique `slug` using the same format as blog slugs, plus `name`, `description`, `year`, and `order`. `demo` and `source` are optional URLs. A non-empty Markdown body creates an article at `/projects/<slug>`; projects without a body appear only in the index. Keep the slug unchanged when moving or renaming a file to preserve public links.

The shared Markdown compiler in `src/lib/content/markdown/compile-markdown.ts` supports CommonMark, GitHub Flavored Markdown, CJK-friendly parsing, KaTeX, Shiki syntax highlighting, and Mermaid diagrams with light and dark themes. Collection schemas and cross-document validation live in `content-collections.ts`. Pages use `src/lib/content` queries rather than generated collections or filesystem metadata.

### Code blocks

Code highlighting runs at build time. Fence metadata controls presentation without introducing MDX components:

````md
```ts title="src/lib/content/blog.ts" caption="Optional caption" showLineNumbers {2,4-6} /parsePostDate/
export function parsePostDate(value: string) {
  return new Date(value);
}
```
````

- `{2,4-6}` highlights lines and `/parsePostDate/` highlights matching text.
- `showLineNumbers` enables line numbers; `showLineNumbers{20}` starts at 20.
- `title` supplies a filename or context and `caption` supplies an accessible figure caption.
- Shiki comments support `[!code highlight]`, `[!code focus]`, `[!code word:name]`, `[!code ++]`, `[!code --]`, `[!code error]`, `[!code warning]`, and `[!code info]`.
- Add `{:js}` after inline code to opt into inline syntax highlighting.

## Checks

```bash
pnpm check
```

`pnpm check` runs lint, tests, and the production build in that order.

`pnpm lint` checks source files with Biome and Markdown files with rumdl. Use `pnpm format` to format both, or the `:code` and `:md` variants to run either tool independently.

`pnpm build` writes the static site to `out/`, including the sitemap, robots file, RSS feed, manifest, and Pagefind search index.

Use `pnpm preview` for a fresh production build and local preview, or `pnpm serve` to re-index and serve the existing `out/` directory.

### Tests

```bash
pnpm test        # Run once
pnpm test:watch  # Watch mode
```

Vitest tests live beside their source files as `*.test.ts`. The suite covers the real content build (Markdown output, heading anchors, and slug/topic validation), content queries, Pagefind loading/retry, search result conversion and asynchronous search state, and metadata/structured-data output. Most tests run in Node; search hook tests use React Testing Library with jsdom. Temporary content and generated-script fixtures keep tests independent of prior builds and current articles.

Agree on the public interfaces and critical behaviors before adding tests. Assert observable results rather than private helpers, call counts, or full HTML snapshots. Mock only external inputs, not internal modules. For new behavior or bug fixes, add and run one failing test, make it pass, then move to the next behavior; existing behavior is protected by regression tests. There is no coverage-percentage gate. Full browser interactions and real Pagefind index integration still need production-preview checks.

## Git hooks

Lefthook installs the repository hooks automatically during `pnpm install`:

- `pre-commit` checks staged source files with Biome and verifies staged Markdown formatting and lint rules with rumdl. It does not modify or stage files automatically.
- `commit-msg` enforces [Conventional Commits](https://www.conventionalcommits.org/) with Commitlint, for example `feat: add blog search`.
- `pre-push` runs lint, tests, and the static build.

Run a hook manually with `pnpm exec lefthook run <hook>`, such as `pnpm exec lefthook run pre-push`.

## Deployment

Pull requests are checked by the CI workflow. Pushes to `main` are built and deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`.

The deployment workflow installs Chromium because Mermaid diagrams are rendered to SVG during the build.

## License

The source code in this repository, excluding `content/`, is licensed under the [MIT License](LICENSE).

Unless otherwise noted, original written content under `content/` is licensed under the [Creative Commons Attribution 4.0 International License](content/LICENSE).
