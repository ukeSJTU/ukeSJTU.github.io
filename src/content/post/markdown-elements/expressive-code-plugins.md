---
title: "Expressive Code plugin examples"
description: "A compact showcase of extra Expressive Code plugins used by this site"
publishDate: "22 Jun 2026"
series: astro-cactus
tags: ["test", "markdown", "expressive-code"]
---

This page collects small examples for the extra [Expressive Code](https://expressive-code.com/) plugins enabled on this site.

## [File icons](https://github.com/xt0rted/expressive-code-file-icons)

File icons add a recognizable file-type icon to code frames when the block title contains a filename.

```ts title="astro.config.ts"
import expressiveCode from "astro-expressive-code";

export default {
	integrations: [expressiveCode()],
};
```

## [Fullscreen](https://frostybee.github.io/expressive-code-fullscreen/configuration/)

Fullscreen adds a button to titled code blocks so longer examples can be read in a focused overlay.

```ts title="src/utils/createSlug.ts"
export function createSlug(input: string) {
	return input
		.trim()
		.toLowerCase()
		.replace(/['"]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function createPostUrl(slug: string) {
	return `/posts/${createSlug(slug)}/`;
}
```

## [Caption](https://github.com/FujoWebDev/fujocoded-plugins/tree/main/expressive-code-caption)

Caption turns text wrapped in trailing `---` lines into a caption below the rendered code block.

```bash title="Caption example"
pnpm check

---
The caption appears below the code block and can include `inline code`.
---
```

## [Output](https://github.com/FujoWebDev/fujocoded-plugins/tree/main/expressive-code-output)

Output mode separates entered commands from the result they produce, keeping terminal examples easier to scan.

```bash withOutput title="Build output"
> pnpm astro check

Result (23 files):
- 0 errors
- 0 warnings
```

## [Color chips](https://delucis.github.io/expressive-code-color-chips/configuration/)

Color chips show small previews beside CSS color values, including transparent colors.

```css title="tokens.css"
:root {
	--brand: #2bbc8a;
	--accent: rgb(238 99 82);
	--surface: hsl(210 20% 98%);
	--overlay: transparent;
	color: CanvasText;
}

.notice {
	border-color: rebeccapurple;
	box-shadow: 0 0 0 2px rgb(43 188 138 / 35%);
}
```
