# Expressive Code Plugins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Expressive Code plugins, publish a compact showcase post, and verify rendering in the Astro blog.

**Architecture:** Keep Expressive Code setup centralized in `src/site.config.ts`, where the project already exports `expressiveCodeOptions`. Add a focused component stylesheet for plugin-specific fixes and import it through the existing global CSS component layer. Publish a new Markdown post under `src/content/post/markdown-elements/` so the plugin syntax is both reader-visible and easy to regress-test.

**Tech Stack:** Astro 6, `astro-expressive-code@0.42.0`, pnpm, TypeScript, Tailwind v4 global CSS, Markdown content collections.

## Global Constraints

- Use the existing centralized `expressiveCodeOptions` export in `src/site.config.ts`.
- Do not introduce a new Expressive Code configuration module.
- Register plugins in this order: caption, output, file icons, color chips, typewriter, fullscreen.
- Keep Typewriter opt-in through the `typed` meta flag.
- Keep Fullscreen off untitled blocks with `addToUntitledBlocks: false`.
- Preserve existing Expressive Code themes, code font, border radius, spacing, and `themeCssSelector` behavior.
- Leave `src/content/post/markdown-elements/index.md` unchanged.
- Create a public post at `src/content/post/markdown-elements/expressive-code-plugins.md`.
- Each plugin section in the public post must include a plugin link, a short effect description, and a minimal visible example.
- Verify with `pnpm check`, `pnpm build`, and local rendering of `/posts/markdown-elements/expressive-code-plugins/`.

---

### Task 1: Install Missing Plugin Dependencies

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: Existing `astro-expressive-code@0.42.0` integration and the already-installed `@xt0rted/expressive-code-file-icons`.
- Produces: Importable packages for later tasks:
  - `@fujocoded/expressive-code-caption`
  - `@fujocoded/expressive-code-output`
  - `expressive-code-color-chips`
  - `expressive-code-typewriter`
  - `expressive-code-fullscreen`

- [ ] **Step 1: Check current dependency state**

Run:

```bash
git status --short
pnpm list @xt0rted/expressive-code-file-icons expressive-code-typewriter expressive-code-fullscreen expressive-code-color-chips @fujocoded/expressive-code-caption @fujocoded/expressive-code-output --depth 0
```

Expected:

```text
@xt0rted/expressive-code-file-icons is listed.
The five missing packages are not listed yet.
```

- [ ] **Step 2: Add the missing packages**

Run:

```bash
pnpm add expressive-code-typewriter@^0.1.2 expressive-code-fullscreen@^1.1.0 expressive-code-color-chips@^0.1.4 @fujocoded/expressive-code-caption@^0.0.3 @fujocoded/expressive-code-output@^0.1.0
```

Expected:

```text
package.json and pnpm-lock.yaml are updated.
pnpm may print a peer dependency warning for expressive-code-fullscreen and @astrojs/starlight; keep it for verification unless install fails.
```

- [ ] **Step 3: Verify dependencies are importable**

Run:

```bash
pnpm list expressive-code-typewriter expressive-code-fullscreen expressive-code-color-chips @fujocoded/expressive-code-caption @fujocoded/expressive-code-output --depth 0
```

Expected:

```text
expressive-code-typewriter 0.1.2
expressive-code-fullscreen 1.1.0
expressive-code-color-chips 0.1.4
@fujocoded/expressive-code-caption 0.0.3
@fujocoded/expressive-code-output 0.1.0
```

- [ ] **Step 4: Commit dependency changes**

Run:

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add expressive code plugin packages"
```

Expected:

```text
A commit is created containing only package.json and pnpm-lock.yaml.
```

### Task 2: Register Expressive Code Plugins

**Files:**
- Modify: `src/site.config.ts`

**Interfaces:**
- Consumes:
  - Packages installed in Task 1.
  - Existing `expressiveCodeOptions: AstroExpressiveCodeOptions`.
- Produces:
  - `expressiveCodeOptions.plugins` containing the six approved plugins.
  - `expressiveCodeOptions.frames.extractFileNameFromCode` set to `true`.
  - Existing `styleOverrides`, `themeCssSelector`, `themes`, and `useThemedScrollbars` retained.

- [ ] **Step 1: Add plugin imports**

Modify the top of `src/site.config.ts` to include these imports before the existing type imports:

```ts
import { pluginCodeCaption } from "@fujocoded/expressive-code-caption";
import { pluginCodeOutput } from "@fujocoded/expressive-code-output";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";
import { pluginColorChips } from "expressive-code-color-chips";
import { pluginFullscreen } from "expressive-code-fullscreen";
import { pluginTypewriter } from "expressive-code-typewriter";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";
import type { SiteConfig } from "@/types";
```

- [ ] **Step 2: Add `plugins` and `frames` to `expressiveCodeOptions`**

Modify the beginning of `expressiveCodeOptions` so it starts with this block before the existing `styleOverrides` key:

```ts
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	plugins: [
		pluginCodeCaption(),
		pluginCodeOutput(),
		pluginFileIcons({
			iconClass: "ec-file-icon",
			titleClass: "ec-title-with-icon",
		}),
		pluginColorChips(),
		pluginTypewriter({
			speed: 40,
			trigger: "visible",
			startDelay: 300,
			lineDelay: 150,
			showReplayButton: true,
			replayButtonText: "Replay",
			showSkipButton: false,
			outputDelay: 0,
			loop: false,
			typingVariance: 0,
		}),
		pluginFullscreen({
			fullscreenButtonTooltip: "Toggle fullscreen view",
			enableEscapeKey: true,
			exitOnBrowserBack: true,
			addToUntitledBlocks: false,
			showOnHoverOnly: true,
			animationDuration: 180,
		}),
	],
	frames: {
		extractFileNameFromCode: true,
	},
	styleOverrides: {
```

Keep the rest of the existing object intact, including:

```ts
	themeCssSelector(theme, { styleVariants }) {
```

and:

```ts
	themes: ["dracula", "github-light"],
	useThemedScrollbars: false,
```

- [ ] **Step 3: Verify TypeScript accepts the configuration**

Run:

```bash
pnpm check
```

Expected:

```text
astro check completes without TypeScript errors from src/site.config.ts.
biome check completes or reports only pre-existing formatting issues.
```

- [ ] **Step 4: Commit configuration changes**

Run:

```bash
git add src/site.config.ts
git commit -m "feat: register expressive code plugins"
```

Expected:

```text
A commit is created containing only src/site.config.ts.
```

### Task 3: Add Targeted Plugin Styles

**Files:**
- Create: `src/styles/components/expressive-code-plugins.css`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes:
  - `ec-file-icon` and `ec-title-with-icon` class names configured in Task 2.
  - Caption plugin output: `.expressive-code > figcaption:last-child`.
  - Output plugin output: `.expressive-code .frame pre.output`.
- Produces:
  - Theme-compatible caption styling.
  - Theme-compatible output styling.
  - Stable sizing for file icons in code frame titles.

- [ ] **Step 1: Create the component stylesheet**

Create `src/styles/components/expressive-code-plugins.css` with exactly this content:

```css
.expressive-code .ec-title-with-icon {
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
}

.expressive-code .ec-file-icon {
	width: 1rem;
	height: 1rem;
	flex: 0 0 auto;
}

.expressive-code > figcaption:last-child {
	margin-block: 0;
	padding: 0.75rem 1rem;
	border: var(--ec-brdWd) solid var(--ec-brdCol);
	border-top: 0;
	border-radius: 0 0 var(--ec-brdRad) var(--ec-brdRad);
	background: color-mix(
		in oklch,
		var(--color-global-bg) 92%,
		var(--color-global-text) 8%
	);
	color: var(--color-muted);
	font-size: 0.8125rem;
	line-height: 1.5;
}

.expressive-code > figcaption:last-child > * {
	margin-block: 0;
}

.expressive-code .frame pre.output {
	margin: 0;
	border-color: var(--ec-brdCol);
	background: color-mix(
		in oklch,
		var(--color-global-bg) 90%,
		var(--color-global-text) 10%
	);
	color: var(--color-global-text);
}
```

- [ ] **Step 2: Import the stylesheet in the component layer**

Modify the `@layer components` block in `src/styles/global.css` from:

```css
@layer components {
	@import "./components/admonition.css";
	@import "./components/github-card.css";
```

to:

```css
@layer components {
	@import "./components/admonition.css";
	@import "./components/expressive-code-plugins.css";
	@import "./components/github-card.css";
```

- [ ] **Step 3: Verify CSS parses through Astro and Tailwind**

Run:

```bash
pnpm build
```

Expected:

```text
Astro builds the site without CSS parsing errors.
The build may still expose plugin runtime issues; fix only CSS syntax issues in this task.
```

- [ ] **Step 4: Commit style changes**

Run:

```bash
git add src/styles/components/expressive-code-plugins.css src/styles/global.css
git commit -m "style: align expressive code plugin output"
```

Expected:

```text
A commit is created containing only the new component stylesheet and global import.
```

### Task 4: Add the Public Plugin Showcase Post

**Files:**
- Create: `src/content/post/markdown-elements/expressive-code-plugins.md`

**Interfaces:**
- Consumes:
  - Plugin configuration from Task 2.
  - Plugin styling from Task 3.
  - Existing post collection schema in `src/content.config.ts`.
- Produces:
  - Public route `/posts/markdown-elements/expressive-code-plugins/`.
  - Searchable tags: `test`, `markdown`, `expressive-code`.
  - One visible example per plugin, each with a plugin link and short effect description.

- [ ] **Step 1: Create the Markdown post**

Create `src/content/post/markdown-elements/expressive-code-plugins.md` with exactly this content:

````md
---
title: "Expressive Code plugin examples"
description: "A compact showcase of extra Expressive Code plugins used by this site"
publishDate: "22 Jun 2026"
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

## [Typewriter](https://frostybee.github.io/expressive-code-typewriter/)

The `typed` flag animates short terminal examples so commands appear as if they are being entered.

```bash typed title="Terminal demo" speed=35 delay=200
$ pnpm build
Done in 4.2s
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
````

- [ ] **Step 2: Validate content schema**

Run:

```bash
pnpm astro check
```

Expected:

```text
The post frontmatter passes the post collection schema.
No content collection error references expressive-code-plugins.md.
```

- [ ] **Step 3: Commit the post**

Run:

```bash
git add src/content/post/markdown-elements/expressive-code-plugins.md
git commit -m "docs: add expressive code plugin examples"
```

Expected:

```text
A commit is created containing only the new Markdown post.
```

### Task 5: Run Full Verification and Inspect Rendering

**Files:**
- Read: `src/site.config.ts`
- Read: `src/styles/components/expressive-code-plugins.css`
- Read: `src/content/post/markdown-elements/expressive-code-plugins.md`

**Interfaces:**
- Consumes:
  - All implementation commits from Tasks 1-4.
- Produces:
  - Verification evidence that configuration, content, and rendering are working.
  - A final commit only if verification requires a focused fix.

- [ ] **Step 1: Run project checks**

Run:

```bash
pnpm check
```

Expected:

```text
astro check exits 0.
biome check exits 0.
```

- [ ] **Step 2: Run production build**

Run:

```bash
pnpm build
```

Expected:

```text
Astro completes a production build.
The generated route list includes /posts/markdown-elements/expressive-code-plugins/.
Pagefind postbuild behavior is not required here because the build script does not invoke postbuild.
```

- [ ] **Step 3: Start a local dev server**

Run:

```bash
pnpm dev -- --host 127.0.0.1 --port 4321
```

Expected:

```text
Astro reports a local URL at http://127.0.0.1:4321/.
Keep this session running until Step 5 is complete.
```

- [ ] **Step 4: Inspect the public article**

Open:

```text
http://127.0.0.1:4321/posts/markdown-elements/expressive-code-plugins/
```

Expected:

```text
The page loads without a browser console error.
Each plugin section shows a link, a short description, and a rendered code block.
```

- [ ] **Step 5: Verify plugin-specific rendering**

Check the page manually or with browser inspection:

```text
File icons: the astro.config.ts frame title includes a file icon.
Typewriter: only the Terminal demo block animates; normal code blocks are immediately readable.
Fullscreen: titled code blocks show a fullscreen button; untitled snippets do not.
Caption: the Caption example has a styled caption below the code block.
Output: the Build output example separates the command from the output area.
Color chips: the CSS example shows chips beside #2bbc8a, rgb(), hsl(), transparent, CanvasText, and rebeccapurple.
```

- [ ] **Step 6: Verify light and dark themes**

On the same local page, toggle the site's theme control between light and dark.

Expected:

```text
Caption and output areas remain readable in both themes.
No plugin controls overlap code text at desktop width.
```

- [ ] **Step 7: Stop the dev server**

Stop the running dev server with:

```text
Ctrl-C
```

Expected:

```text
The dev server exits cleanly.
```

- [ ] **Step 8: Commit verification fixes or record clean verification**

If verification required a code or content fix, commit only those fix files:

```bash
git add src/site.config.ts src/styles/components/expressive-code-plugins.css src/styles/global.css src/content/post/markdown-elements/expressive-code-plugins.md
git commit -m "fix: polish expressive code plugin rendering"
```

If no fix was required, do not create an empty commit. Record the successful `pnpm check`, `pnpm build`, and visual inspection results in the final handoff.

Expected:

```text
The working tree contains no uncommitted implementation changes from Tasks 1-5.
```
