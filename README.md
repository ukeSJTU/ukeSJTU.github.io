# ukeSJTU.github.io

The source code for [ukesjtu.github.io](https://ukesjtu.github.io), a statically exported personal site built with Next.js, Content Collections, and shadcn/ui.

## Development

This project uses Node.js 24 and pnpm.

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Content

Posts live in `content/posts`. Each Markdown file must include the following frontmatter:

```yaml
---
title: "Post title"
summary: "A short description of the post."
publishedAt: "2026-09-19"
# Optional: use a repository image instead of an auto-generated OG image.
ogImage: "/og/my-post.png"
---
```

Optional `updatedAt` and `ogImage` fields can be used when a post is revised or needs a custom social image. Custom images belong in `public/` and `ogImage` contains their site-absolute path. Without `ogImage`, the build creates a deterministic gradient image from the post path and overlays the title. Nested directories are supported and become part of the post URL.

The Markdown pipeline supports CommonMark, GitHub Flavored Markdown, CJK-friendly parsing, KaTeX, Shiki syntax highlighting, and Mermaid diagrams with light and dark themes.

### Code blocks

Code highlighting runs at build time. Fence metadata controls presentation without introducing MDX components:

````md
```ts title="src/lib/content/posts.ts" caption="Optional caption" showLineNumbers {2,4-6} /parsePostDate/
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

`pnpm build` writes the static site to `out/`, including the sitemap, robots file, RSS feed, manifest, social preview images, and Pagefind search index.

Use `pnpm preview` for a fresh production build and local preview, or `pnpm serve` to re-index and serve the existing `out/` directory.

## Git hooks

Lefthook installs the repository hooks automatically during `pnpm install`:

- `pre-commit` checks staged files with Biome.
- `commit-msg` enforces [Conventional Commits](https://www.conventionalcommits.org/) with Commitlint, for example `feat: add post search`.
- `pre-push` runs the full lint and static build checks.

Run a hook manually with `pnpm exec lefthook run <hook>`, such as `pnpm exec lefthook run pre-push`.

## Deployment

Pull requests are checked by the CI workflow. Pushes to `main` are built and deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`.

The deployment workflow installs Chromium because Mermaid diagrams are rendered to SVG during the build.
