# Expressive Code Plugins Design

Date: 2026-06-22

## Goal

Add a curated set of Expressive Code plugins to the Astro blog while keeping the default reader experience quiet and predictable. The implementation should enable richer code block examples for authors, document the new capabilities in a public post, and preserve the existing theme, typography, and light/dark mode behavior.

## Selected Approach

Use the existing centralized `expressiveCodeOptions` export in `src/site.config.ts`.

This matches the current project structure: Astro registers `expressiveCode(expressiveCodeOptions)` from `astro.config.ts`, and all theme-specific Expressive Code settings already live in `src/site.config.ts`. The implementation should add plugin imports and plugin registration there instead of introducing a new configuration module.

## Plugins

Register these plugins:

- `@fujocoded/expressive-code-caption`
- `@fujocoded/expressive-code-output`
- `@xt0rted/expressive-code-file-icons`
- `expressive-code-color-chips`
- `expressive-code-typewriter`
- `expressive-code-fullscreen`

`@xt0rted/expressive-code-file-icons` is already present in `package.json` and `pnpm-lock.yaml`. The remaining packages need to be added as dependencies.

## Configuration

Plugin order should favor preprocessors first:

1. `pluginCodeCaption()`
2. `pluginCodeOutput()`
3. `pluginFileIcons(...)`
4. `pluginColorChips()`
5. `pluginTypewriter(...)`
6. `pluginFullscreen(...)`

Caption and output run early because they alter code block contents before later render hooks.

File icons should use title/file-name metadata to show icons in framed code blocks. Enable `frames.extractFileNameFromCode: true` so title strings such as `title="astro.config.ts"` can drive filename-aware rendering.

Typewriter should be opt-in only through the `typed` meta flag. Configure it for a readable default: no looping, replay enabled through the plugin's supported API, and reduced-motion users respected. If the installed plugin version does not expose a replay option, document that implementation deviation during verification.

Fullscreen should be enabled only for titled code blocks by setting `addToUntitledBlocks: false`. Escape-key exit and hover behavior can remain enabled. This keeps short untitled snippets from gaining extra controls.

Color chips can use its default behavior. It only affects CSS dialect code blocks such as `css`, `scss`, `sass`, `less`, and `stylus`.

## Public Example Page

Create a new public post at:

`src/content/post/markdown-elements/expressive-code-plugins.md`

The existing `src/content/post/markdown-elements/index.md` should remain unchanged.

The new post should be a compact plugin showcase. Each plugin section must include:

- A heading with the plugin name.
- A link to the plugin website, documentation, or GitHub page.
- A short description of the effect the plugin adds.
- A minimal code block that visibly exercises the plugin.

Required examples:

- File icons: a titled block such as `title="astro.config.ts"` or `title="package.json"` so the icon appears in the frame.
- Typewriter: a short `bash typed title="Terminal demo"` block.
- Fullscreen: a titled, slightly longer code block where the fullscreen button is useful.
- Caption: a block with a trailing `---` caption fence.
- Output: a `withOutput` block that separates typed commands from command output.
- Color chips: a CSS block containing hex, rgb, hsl, named, and transparent colors.

The post should be published, not a draft, and use tags like `test`, `markdown`, and `expressive-code` so it is discoverable through the existing posts, tags, RSS, and static routes.

## Styling

Avoid broad global style changes. Preserve the existing Expressive Code themes, code font, border radius, spacing, and `themeCssSelector` behavior.

Add only targeted CSS overrides where plugin defaults clash with the blog theme:

- Caption styling should use current theme variables instead of the caption plugin's default black background.
- Output styling should align with Expressive Code or site color variables for border, background, and spacing.
- Fullscreen controls should remain visible and usable on titled blocks without dominating the normal article layout.

The preferred location for these targeted overrides is the existing global styling path, alongside other article-level component styles.

## Risks

`expressive-code-fullscreen` declares a peer dependency on `@astrojs/starlight` even though this project is not a Starlight site. Installation and build verification must confirm whether this is only a package warning or a real compatibility problem.

`@fujocoded/expressive-code-caption` and `@fujocoded/expressive-code-output` are young plugins with small APIs. The public example page should encode the intended authoring syntax so future changes are easier to verify.

`@xt0rted/expressive-code-file-icons@1.0.0` currently resolves an older `@expressive-code/core` dependency than the app's `astro-expressive-code@0.42.0` stack. Verification should cover real rendering, not only TypeScript.

## Verification

Implementation is complete only after these checks pass or any failures are clearly documented:

- `pnpm check`
- `pnpm build`
- Render the new public article locally and inspect the code block output.

The visual inspection should confirm:

- File icons appear on titled frames.
- Typewriter animation is opt-in and does not affect normal code blocks.
- Fullscreen controls appear on titled blocks but not untitled snippets.
- Caption text renders below the code block.
- Output blocks separate commands from output.
- Color chips appear beside CSS color values in both light and dark themes.
