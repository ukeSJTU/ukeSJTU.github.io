# ukeraser's website

The source code for my personal website, [ukeraser.is-a.dev](https://ukeraser.is-a.dev), where I share technical notes, experiments and projects.

This repository is open source, but it is **a personal website, not a template or theme**. The code and content are tailored to my own use rather than designed to be cloned and deployed unchanged. You are welcome to explore the source, learn from it and borrow ideas for your own projects under the licenses below.

The site is built with Next.js, React, TypeScript, Tailwind CSS and shadcn/ui, and deployed as a static export to GitHub Pages. Content Collections processes the Markdown content, and Pagefind provides search.

## Feedback and contributions

Found a bug, a broken link or something that could be explained better? [Open an issue](https://github.com/ukeSJTU/ukeSJTU.github.io/issues). Fixes, article corrections and other thoughtful contributions are welcome. For larger changes, please start with an issue so we can discuss whether they fit the direction of this personal site.

For a question or conversation about a particular article, use its comment section. Comments are powered by [Giscus](https://giscus.app), which uses this repository's [GitHub Discussions](https://github.com/ukeSJTU/ukeSJTU.github.io/discussions) as the backing discussion threads. Sign in with GitHub to participate; the Discussions threads and the comments on the site are the same conversations.

## Run locally

To explore the implementation or work on a contribution, install [mise](https://mise.jdx.dev/) and activate it in your shell, then run:

```bash
mise install
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

Open <http://localhost:3000>. Chromium is required for build-time Mermaid diagram rendering.

- `pnpm check` runs lint, tests and the production build.
- `pnpm preview` builds and serves the static site locally, including the Pagefind search index.

## License

The source code in this repository, excluding `content/`, is licensed under the [MIT License](LICENSE).

Unless otherwise noted, original written content under `content/` is licensed under the [Creative Commons Attribution 4.0 International License](content/LICENSE).
