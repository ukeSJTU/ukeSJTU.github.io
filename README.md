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
---
```

An optional `updatedAt` field can be used when a post is revised. Nested directories are supported and become part of the post URL.

The Markdown pipeline supports CommonMark, GitHub Flavored Markdown, CJK-friendly parsing, KaTeX, Shiki syntax highlighting, and Mermaid diagrams with light and dark themes.

## Checks

```bash
pnpm lint
pnpm build
```

`pnpm build` writes the static site to `out/`, including the sitemap, robots file, RSS feed, manifest, and social preview images.

## Deployment

Pull requests are checked by the CI workflow. Pushes to `main` are built and deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`.

The deployment workflow installs Chromium because Mermaid diagrams are rendered to SVG during the build.
