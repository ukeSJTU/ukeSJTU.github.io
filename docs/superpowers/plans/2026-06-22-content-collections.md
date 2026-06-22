# Content Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add project and series content collections, normalized post/project detail routes, project list/detail pages, and series list/detail pages.

**Architecture:** Astro content collections remain the source of truth for authored content. Shared helpers normalize content slugs and keep filtering/sorting out of page components. New project and series pages follow the existing Astro Cactus layout, typography, and pagination patterns.

**Tech Stack:** Astro 6 content collections, Astro file routes, MD/MDX, TypeScript, Zod, Tailwind CSS utilities, existing `pnpm check` and `pnpm build` verification.

## Global Constraints

- Use a `project` content collection, not hardcoded project data.
- Build both project list and detail pages in the first implementation.
- Use flat project Markdown files by default, while supporting folder `index.md` files without URL changes.
- Do not add `kind` to post frontmatter.
- Require `series` in post frontmatter.
- Make `series` its own metadata collection and generate series pages.
- Normalize `index.md` slugs for both posts and projects.
- Keep tags as cross-cutting topics, separate from series.
- Do not split `courses`, `sources`, and `topics` into separate content collections.
- Preserve the current simple Astro Cactus visual language.
- Verify with `pnpm check` and `pnpm build`.
- Do not run `pnpm postbuild` unless implementation changes Pagefind indexing behavior.

---

## File Structure

- `src/content.config.ts`: declares `post`, `note`, `tag`, `series`, and `project` collections. Adds required `post.data.series` reference and project metadata schema.
- `src/content/series/astro-cactus.md`: sample series metadata used by existing template posts.
- `src/content/project/personal-blog.md`: sample project entry used by the new projects pages.
- Existing `src/content/post/**/*.md`: add `series: astro-cactus` so stricter post schema passes.
- `src/utils/content.ts`: shared `normalizeContentSlug(id: string): string`.
- `src/utils/date.ts`: expands collection date sorting to include projects.
- `src/data/post.ts`: keeps post/tag helpers and adds series helpers.
- `src/data/project.ts`: returns sorted projects and project slugs.
- `src/components/blog/PostPreview.astro`: links posts with normalized slugs.
- `src/layouts/BlogPost.astro`: resolves post series metadata and uses normalized OG image slug.
- `src/components/blog/Masthead.astro`: displays the linked series on post detail pages.
- `src/pages/posts/[...slug].astro`: generates normalized post detail routes.
- `src/pages/og-image/[...slug].png.ts`: generates OG image routes using normalized post slugs.
- `src/components/series/SeriesPreview.astro`: small preview for `/series/`.
- `src/pages/series/index.astro`: series overview.
- `src/pages/series/[series]/[...page].astro`: paginated series detail page.
- `src/components/project/ProjectCard.astro`: project card for `/projects/`.
- `src/components/project/ProjectMasthead.astro`: project metadata header for detail pages.
- `src/pages/projects/index.astro`: project card wall.
- `src/pages/projects/[...slug].astro`: project detail page.
- `src/site.config.ts`: adds `Projects` and `Series` to the existing navigation.

---

### Task 1: Add Content Schemas And Seed Content

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/series/astro-cactus.md`
- Create: `src/content/project/personal-blog.md`
- Modify: `src/content/post/markdown-elements/admonitions.md`
- Modify: `src/content/post/markdown-elements/index.md`
- Modify: `src/content/post/markdown-elements/expressive-code-plugins.md`
- Modify: `src/content/post/webmentions.md`
- Modify: `src/content/post/testing/cover-image/index.md`
- Modify: `src/content/post/testing/long-title.md`
- Modify: `src/content/post/testing/social-image.md`
- Modify: `src/content/post/testing/draft-post.md`

**Interfaces:**
- Consumes: existing Astro content collection setup.
- Produces: `post.data.series` as a required `reference("series")`; `series` collection entries; `project` collection entries.

- [ ] **Step 1: Replace the content collection config**

Replace `src/content.config.ts` with:

```ts
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
});

const postDateSchema = z
	.string()
	.or(z.date())
	.transform((val) => new Date(val));

const optionalDateSchema = z
	.string()
	.or(z.date())
	.optional()
	.transform((val) => (val ? new Date(val) : undefined));

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			series: reference("series"),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: postDateSchema,
			updatedDate: optionalDateSchema,
			pinned: z.boolean().default(false),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z.iso
			.datetime({ offset: true })
			.transform((val) => new Date(val)),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

const series = defineCollection({
	loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
	}),
});

const project = defineCollection({
	loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string(),
		publishDate: postDateSchema,
		updatedDate: optionalDateSchema,
		status: z.enum(["active", "completed", "archived"]),
		techStack: z.array(z.string()).default([]),
		repoUrl: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { post, note, tag, series, project };
```

- [ ] **Step 2: Add seed series content**

Create `src/content/series/astro-cactus.md`:

```md
---
title: Astro Cactus
description: Example posts and theme notes from the Astro Cactus starter.
---

This series collects the starter posts that ship with the current site.
```

- [ ] **Step 3: Add seed project content**

Create `src/content/project/personal-blog.md`:

```md
---
title: Personal Blog
description: A personal writing and portfolio site built on Astro Cactus.
publishDate: 2026-06-22
status: active
techStack: ["Astro", "Tailwind CSS", "MDX"]
featured: true
---

This project is the home for posts, notes, series, and finished projects.
```

- [ ] **Step 4: Run schema validation to confirm the new required field fails before migration**

Run:

```bash
pnpm check
```

Expected: FAIL with content schema errors for existing post entries missing required `series`.

- [ ] **Step 5: Add `series: astro-cactus` to all existing post frontmatter**

Add this line inside the frontmatter block of each listed post:

```yaml
series: astro-cactus
```

Update these files:

```txt
src/content/post/markdown-elements/admonitions.md
src/content/post/markdown-elements/index.md
src/content/post/markdown-elements/expressive-code-plugins.md
src/content/post/webmentions.md
src/content/post/testing/cover-image/index.md
src/content/post/testing/long-title.md
src/content/post/testing/social-image.md
src/content/post/testing/draft-post.md
```

Place `series: astro-cactus` near the existing date metadata, before `tags` when `tags` exists.

- [ ] **Step 6: Run validation after migration**

Run:

```bash
pnpm check
```

Expected: PASS.

- [ ] **Step 7: Commit schema and content changes**

Run:

```bash
git add src/content.config.ts src/content/series/astro-cactus.md src/content/project/personal-blog.md src/content/post
git commit -m "feat: add project and series collections"
```

Expected: commit succeeds.

---

### Task 2: Normalize Post Slugs And Display Series On Posts

**Files:**
- Create: `src/utils/content.ts`
- Modify: `src/pages/posts/[...slug].astro`
- Modify: `src/components/blog/PostPreview.astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/components/blog/Masthead.astro`
- Modify: `src/pages/og-image/[...slug].png.ts`

**Interfaces:**
- Consumes: `post.data.series` from Task 1.
- Produces: `normalizeContentSlug(id: string): string`; normalized post links and route params; `Masthead` requires a `series: CollectionEntry<"series">` prop.

- [ ] **Step 1: Add shared content slug utility**

Create `src/utils/content.ts`:

```ts
export function normalizeContentSlug(id: string): string {
	return id.replace(/\/index$/, "");
}
```

- [ ] **Step 2: Update post detail route generation**

Replace `src/pages/posts/[...slug].astro` with:

```astro
---
import { render } from "astro:content";
import type { GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getAllPosts } from "@/data/post";
import PostLayout from "@/layouts/BlogPost.astro";
import { normalizeContentSlug } from "@/utils/content";

// if you're using an adaptor in SSR mode, getStaticPaths wont work -> https://docs.astro.build/en/guides/routing/#modifying-the-slug-example-for-ssr
export const getStaticPaths = (async () => {
	const blogEntries = await getAllPosts();
	return blogEntries.map((post) => ({
		params: { slug: normalizeContentSlug(post.id) },
		props: { post },
	}));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { post } = Astro.props;
const { Content } = await render(post);
---

<PostLayout post={post}>
	<Content />
</PostLayout>
```

- [ ] **Step 3: Update post preview links**

Replace `src/components/blog/PostPreview.astro` with:

```astro
---
import type { CollectionEntry } from "astro:content";
import type { HTMLTag, Polymorphic } from "astro/types";
import FormattedDate from "@/components/FormattedDate.astro";
import { normalizeContentSlug } from "@/utils/content";

type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }> & {
	post: CollectionEntry<"post">;
	withDesc?: boolean;
};

const { as: Tag = "div", post, withDesc = false } = Astro.props;
const postUrl = `/posts/${normalizeContentSlug(post.id)}/`;
---

<FormattedDate class="text-muted min-w-30 font-semibold" date={post.data.publishDate} />
<Tag>
	{post.data.draft && <span class="text-red-500">(Draft) </span>}
	<a class="cactus-link" href={postUrl}>
		{post.data.title}
	</a>
</Tag>
{withDesc && <q class="line-clamp-3 italic">{post.data.description}</q>}
```

- [ ] **Step 4: Resolve series metadata in the blog post layout**

Replace `src/layouts/BlogPost.astro` with:

```astro
---
import { type CollectionEntry, getEntry, render } from "astro:content";

import Masthead from "@/components/blog/Masthead.astro";
import TOC from "@/components/blog/TOC.astro";
import WebMentions from "@/components/blog/webmentions/index.astro";
import { normalizeContentSlug } from "@/utils/content";

import BaseLayout from "./Base.astro";

interface Props {
	post: CollectionEntry<"post">;
}

const { post } = Astro.props;
const { ogImage, title, description, updatedDate, publishDate } = post.data;
const normalizedSlug = normalizeContentSlug(post.id);
const socialImage = ogImage ?? `/og-image/${normalizedSlug}.png`;
const articleDate = updatedDate?.toISOString() ?? publishDate.toISOString();
const { headings, remarkPluginFrontmatter } = await render(post);
const readingTime: string = remarkPluginFrontmatter.readingTime;
const series = await getEntry(post.data.series);

if (!series) {
	throw new Error(`Post "${post.id}" references missing series "${post.data.series.id}".`);
}
---

<BaseLayout
	meta={{
		articleDate,
		description,
		ogImage: socialImage,
		title,
	}}
>
	<article class="grow break-words" data-pagefind-body>
		<div id="blog-hero" class="mb-12">
			<Masthead content={post} readingTime={readingTime} series={series} />
		</div>
		<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
			{!!headings.length && <TOC headings={headings} />}
			<div
				class="prose prose-sm prose-headings:font-semibold prose-headings:text-accent-2 prose-headings:before:absolute prose-headings:before:-ms-4 prose-headings:before:text-muted prose-headings:hover:before:text-accent sm:prose-headings:before:content-['#'] sm:prose-th:before:content-none"
			>
				<slot />
				<WebMentions />
			</div>
		</div>
	</article>
	<button
		class="hover:border-link fixed end-4 bottom-8 z-90 flex h-10 w-10 translate-y-28 cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-zinc-200 text-3xl opacity-0 transition-all transition-discrete duration-300 data-[show=true]:translate-y-0 data-[show=true]:opacity-100 sm:end-8 sm:h-12 sm:w-12 dark:bg-zinc-700"
		data-show="false"
		id="to-top-btn"
	>
		<span class="sr-only">Back to top</span>
		<svg
			aria-hidden="true"
			class="h-6 w-6"
			fill="none"
			focusable="false"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M4.5 15.75l7.5-7.5 7.5 7.5" stroke-linecap="round" stroke-linejoin="round"></path>
		</svg>
	</button>
</BaseLayout>

<script>
	const scrollBtn = document.getElementById("to-top-btn") as HTMLButtonElement;
	const targetHeader = document.getElementById("blog-hero") as HTMLDivElement;

	function callback(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			// only show the scroll to top button when the heading is out of view
			scrollBtn.dataset.show = (!entry.isIntersecting).toString();
		});
	}

	scrollBtn.addEventListener("click", () => {
		document.documentElement.scrollTo({ behavior: "smooth", top: 0 });
	});

	const observer = new IntersectionObserver(callback);
	observer.observe(targetHeader);
</script>
```

- [ ] **Step 5: Show series metadata in the post masthead**

Replace `src/components/blog/Masthead.astro` with:

```astro
---
import { Image } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import FormattedDate from "@/components/FormattedDate.astro";

interface Props {
	content: CollectionEntry<"post">;
	readingTime: string;
	series: CollectionEntry<"series">;
}

const {
	content: { data },
	readingTime,
	series,
} = Astro.props;

const dateTimeOptions: Intl.DateTimeFormatOptions = {
	month: "long",
};
---

{
	data.coverImage && (
		<div class="mb-6 aspect-video">
			<Image
				alt={data.coverImage.alt}
				layout="constrained"
				width={748}
				height={420}
				priority
				src={data.coverImage.src}
			/>
		</div>
	)
}
{data.draft ? <span class="text-base text-red-500">(Draft)</span> : null}
<h1 class="title">
	{data.title}
</h1>
<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
	<p class="font-semibold">
		<FormattedDate date={data.publishDate} dateTimeOptions={dateTimeOptions} /> /{" "}
		{readingTime} / <a class="cactus-link" href={`/series/${series.id}/`}>{series.data.title}</a>
	</p>
	{
		data.updatedDate && (
			<span class="bg-quote/5 text-quote rounded-lg px-2 py-1">
				Updated:
				<FormattedDate class="ms-1" date={data.updatedDate} dateTimeOptions={dateTimeOptions} />
			</span>
		)
	}
</div>
{
	!!data.tags?.length && (
		<div class="mt-2">
			<svg
				aria-hidden="true"
				class="inline-block h-6 w-6"
				fill="none"
				focusable="false"
				stroke="var(--color-muted)"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M0 0h24v24H0z" fill="none" stroke="none" />
				<path d="M7.859 6h-2.834a2.025 2.025 0 0 0 -2.025 2.025v2.834c0 .537 .213 1.052 .593 1.432l6.116 6.116a2.025 2.025 0 0 0 2.864 0l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-6.117 -6.116a2.025 2.025 0 0 0 -1.431 -.593z" />
				<path d="M17.573 18.407l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-7.117 -7.116" />
				<path d="M6 9h-.01" />
			</svg>
			{data.tags.map((tag, i) => (
				<>
					{/* prettier-ignore */}
					<span class="contents">
						<a class="cactus-link inline-block before:content-['#']" data-pagefind-filter={`tag:${tag}`} href={`/tags/${tag}/`}><span class="sr-only">View more blogs with the tag&nbsp;</span>{tag}
						</a>{i < data.tags.length - 1 && ", "}
					</span>
				</>
			))}
		</div>
	)
}
```

- [ ] **Step 6: Normalize generated OG image routes**

In `src/pages/og-image/[...slug].png.ts`, add:

```ts
import { normalizeContentSlug } from "@/utils/content";
```

Change the `params` expression in `getStaticPaths()` to:

```ts
params: { slug: normalizeContentSlug(post.id) },
```

- [ ] **Step 7: Build and verify normalized post routes**

Run:

```bash
pnpm build
test -f dist/posts/markdown-elements/index.html
test ! -e dist/posts/markdown-elements/index/index.html
```

Expected: `pnpm build` succeeds; first `test` succeeds; second `test` succeeds because the old nested `/index/` route no longer exists.

- [ ] **Step 8: Commit normalized post routing**

Run:

```bash
git add src/utils/content.ts src/pages/posts/[...slug].astro src/components/blog/PostPreview.astro src/layouts/BlogPost.astro src/components/blog/Masthead.astro src/pages/og-image/[...slug].png.ts
git commit -m "feat: normalize post content slugs"
```

Expected: commit succeeds.

---

### Task 3: Add Series Helpers And Pages

**Files:**
- Modify: `src/data/post.ts`
- Create: `src/components/series/SeriesPreview.astro`
- Create: `src/pages/series/index.astro`
- Create: `src/pages/series/[series]/[...page].astro`

**Interfaces:**
- Consumes: `post.data.series.id`, `normalizeContentSlug()`, `PostPreview`.
- Produces: `SeriesWithPostCount`, `getPostsBySeries(seriesSlug)`, `getAllSeriesWithPostCount()`, `/series/`, and `/series/<slug>/`.

- [ ] **Step 1: Replace post data helpers**

Replace `src/data/post.ts` with:

```ts
import { type CollectionEntry, getCollection } from "astro:content";
import { collectionDateSort } from "@/utils/date";

export type SeriesWithPostCount = CollectionEntry<"series"> & {
	postCount: number;
};

/** filter out draft posts based on the environment */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => {
		return entry.id === tag;
	});
	return tagEntries[0];
}

/** Get posts that reference a series slug. */
export async function getPostsBySeries(seriesSlug: string): Promise<CollectionEntry<"post">[]> {
	const posts = await getAllPosts();
	return posts
		.filter((post) => post.data.series.id === seriesSlug)
		.sort(collectionDateSort);
}

/** Get every series with its associated post count. */
export async function getAllSeriesWithPostCount(): Promise<SeriesWithPostCount[]> {
	const [seriesEntries, posts] = await Promise.all([getCollection("series"), getAllPosts()]);
	const counts = posts.reduce((acc, post) => {
		const seriesId = post.data.series.id;
		return acc.set(seriesId, (acc.get(seriesId) ?? 0) + 1);
	}, new Map<string, number>());

	return seriesEntries
		.map((series) => ({
			...series,
			postCount: counts.get(series.id) ?? 0,
		}))
		.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: CollectionEntry<"post">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
```

- [ ] **Step 2: Create series preview component**

Create `src/components/series/SeriesPreview.astro`:

```astro
---
import type { SeriesWithPostCount } from "@/data/post";

interface Props {
	series: SeriesWithPostCount;
}

const { series } = Astro.props;
const postLabel = series.postCount === 1 ? "Post" : "Posts";
---

<article>
	<h2 class="title text-lg">
		<a class="cactus-link" href={`/series/${series.id}/`}>{series.data.title}</a>
	</h2>
	{series.data.description && <p class="mt-2 text-muted">{series.data.description}</p>}
	<p class="mt-2 text-sm">
		{series.postCount} {postLabel}
	</p>
</article>
```

- [ ] **Step 3: Create series index page**

Create `src/pages/series/index.astro`:

```astro
---
import SeriesPreview from "@/components/series/SeriesPreview.astro";
import { getAllSeriesWithPostCount } from "@/data/post";
import PageLayout from "@/layouts/Base.astro";

const allSeries = await getAllSeriesWithPostCount();

const meta = {
	description: "A list of all post series",
	title: "Series",
};
---

<PageLayout meta={meta}>
	<h1 class="title mb-6">Series</h1>
	<ul class="space-y-8">
		{
			allSeries.map((series) => (
				<li>
					<SeriesPreview series={series} />
				</li>
			))
		}
	</ul>
</PageLayout>
```

- [ ] **Step 4: Create paginated series detail page**

Create `src/pages/series/[series]/[...page].astro`:

```astro
---
import { render } from "astro:content";
import type { GetStaticPaths, InferGetStaticPropsType } from "astro";
import { Icon } from "astro-icon/components";
import PostPreview from "@/components/blog/PostPreview.astro";
import Pagination from "@/components/Paginator.astro";
import { getAllSeriesWithPostCount, getPostsBySeries } from "@/data/post";
import PageLayout from "@/layouts/Base.astro";

export const getStaticPaths = (async ({ paginate }) => {
	const allSeries = await getAllSeriesWithPostCount();

	return (
		await Promise.all(
			allSeries.map(async (seriesEntry) => {
				const postsInSeries = await getPostsBySeries(seriesEntry.id);
				return paginate(postsInSeries, {
					pageSize: 10,
					params: { series: seriesEntry.id },
					props: { seriesEntry },
				});
			}),
		)
	).flat();
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { page, seriesEntry } = Astro.props as Props;
const { Content } = await render(seriesEntry);

const meta = {
	description: seriesEntry.data.description ?? `View all posts in the ${seriesEntry.data.title} series`,
	title: seriesEntry.data.title,
};

const paginationProps = {
	...(page.url.prev && {
		prevUrl: {
			text: "← Previous Series Posts",
			url: page.url.prev,
		},
	}),
	...(page.url.next && {
		nextUrl: {
			text: "Next Series Posts →",
			url: page.url.next,
		},
	}),
};
---

<PageLayout meta={meta}>
	<nav class="mb-8" aria-label="Breadcrumbs">
		<ul class="flex items-center">
			<li class="flex items-center">
				<a class="text-accent" href="/series/">Series</a>
				<Icon aria-hidden="true" name="mdi:chevron-right" class="mx-1.5" />
			</li>
			<li aria-current="page">{seriesEntry.data.title}</li>
		</ul>
	</nav>
	<h1 class="title">{seriesEntry.data.title}</h1>
	<div class="prose prose-sm prose-cactus mb-16 max-w-none">
		{seriesEntry.data.description && <p>{seriesEntry.data.description}</p>}
		<Content />
	</div>
	<ul class="space-y-4">
		{
			page.data.map((p) => (
				<li class="grid gap-1 sm:grid-cols-[auto_1fr]">
					<PostPreview as="h2" post={p} />
				</li>
			))
		}
	</ul>
	<Pagination {...paginationProps} />
</PageLayout>
```

- [ ] **Step 5: Build and verify series routes**

Run:

```bash
pnpm build
test -f dist/series/index.html
test -f dist/series/astro-cactus/index.html
```

Expected: build succeeds and both generated files exist.

- [ ] **Step 6: Commit series pages**

Run:

```bash
git add src/data/post.ts src/components/series/SeriesPreview.astro src/pages/series
git commit -m "feat: add series pages"
```

Expected: commit succeeds.

---

### Task 4: Add Project Helpers, Components, And Pages

**Files:**
- Modify: `src/utils/date.ts`
- Create: `src/data/project.ts`
- Create: `src/components/project/ProjectCard.astro`
- Create: `src/components/project/ProjectMasthead.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[...slug].astro`

**Interfaces:**
- Consumes: `project` collection from Task 1 and `normalizeContentSlug()` from Task 2.
- Produces: `getAllProjects()`, `getProjectSlug(project)`, `/projects/`, and `/projects/<slug>/`.

- [ ] **Step 1: Allow project entries in date sorting**

Replace `src/utils/date.ts` with:

```ts
import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat(siteConfig.date.locale, {
		...(siteConfig.date.options as Intl.DateTimeFormatOptions),
		...options,
	}).format(date);
}

export function collectionDateSort(
	a: CollectionEntry<"post" | "note" | "project">,
	b: CollectionEntry<"post" | "note" | "project">,
) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}
```

- [ ] **Step 2: Add project data helpers**

Create `src/data/project.ts`:

```ts
import { type CollectionEntry, getCollection } from "astro:content";
import { normalizeContentSlug } from "@/utils/content";
import { collectionDateSort } from "@/utils/date";

export async function getAllProjects(): Promise<CollectionEntry<"project">[]> {
	const projects = await getCollection("project");
	return projects.sort((a, b) => {
		if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
		return collectionDateSort(a, b);
	});
}

export function getProjectSlug(project: CollectionEntry<"project">): string {
	return normalizeContentSlug(project.id);
}
```

- [ ] **Step 3: Create project card component**

Create `src/components/project/ProjectCard.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import { getProjectSlug } from "@/data/project";

interface Props {
	project: CollectionEntry<"project">;
}

const { project } = Astro.props;
const { data } = project;
const projectUrl = `/projects/${getProjectSlug(project)}/`;
const statusLabel = `${data.status.charAt(0).toUpperCase()}${data.status.slice(1)}`;
const year = data.publishDate.getFullYear();
---

<article class="h-full rounded-md border border-global-text/10 p-4">
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
		<span>{statusLabel}</span>
		<span aria-hidden="true">/</span>
		<span>{year}</span>
	</div>
	<h2 class="title mt-3 text-lg">
		<a class="cactus-link" href={projectUrl}>{data.title}</a>
	</h2>
	<p class="mt-3">{data.description}</p>
	{
		data.techStack.length > 0 && (
			<ul class="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
				{data.techStack.map((tech) => (
					<li class="rounded-md bg-global-text/5 px-2 py-1 text-xs">{tech}</li>
				))}
			</ul>
		)
	}
	{
		(data.demoUrl || data.repoUrl) && (
			<div class="mt-4 flex flex-wrap gap-4">
				{data.demoUrl && (
					<a class="cactus-link" href={data.demoUrl} rel="noreferrer" target="_blank">
						Demo
					</a>
				)}
				{data.repoUrl && (
					<a class="cactus-link" href={data.repoUrl} rel="noreferrer" target="_blank">
						Repository
					</a>
				)}
			</div>
		)
	}
</article>
```

- [ ] **Step 4: Create project masthead component**

Create `src/components/project/ProjectMasthead.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import FormattedDate from "@/components/FormattedDate.astro";

interface Props {
	project: CollectionEntry<"project">;
}

const { project } = Astro.props;
const { data } = project;
const statusLabel = `${data.status.charAt(0).toUpperCase()}${data.status.slice(1)}`;
---

<div class="mb-12">
	<div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
		<span>{statusLabel}</span>
		<span aria-hidden="true">/</span>
		<FormattedDate date={data.publishDate} />
		{
			data.updatedDate && (
				<>
					<span aria-hidden="true">/</span>
					<span>
						Updated <FormattedDate date={data.updatedDate} />
					</span>
				</>
			)
		}
	</div>
	<h1 class="title">{data.title}</h1>
	<p class="mt-4 text-base">{data.description}</p>
	{
		data.techStack.length > 0 && (
			<ul class="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
				{data.techStack.map((tech) => (
					<li class="rounded-md bg-global-text/5 px-2 py-1 text-xs">{tech}</li>
				))}
			</ul>
		)
	}
	{
		(data.demoUrl || data.repoUrl) && (
			<div class="mt-5 flex flex-wrap gap-4">
				{data.demoUrl && (
					<a class="cactus-link" href={data.demoUrl} rel="noreferrer" target="_blank">
						Demo
					</a>
				)}
				{data.repoUrl && (
					<a class="cactus-link" href={data.repoUrl} rel="noreferrer" target="_blank">
						Repository
					</a>
				)}
			</div>
		)
	}
</div>
```

- [ ] **Step 5: Create projects index page**

Create `src/pages/projects/index.astro`:

```astro
---
import ProjectCard from "@/components/project/ProjectCard.astro";
import { getAllProjects } from "@/data/project";
import PageLayout from "@/layouts/Base.astro";

const projects = await getAllProjects();

const meta = {
	description: "A collection of completed and active projects",
	title: "Projects",
};
---

<PageLayout meta={meta}>
	<h1 class="title mb-6">Projects</h1>
	<ul class="grid gap-4 sm:grid-cols-2" role="list">
		{
			projects.map((project) => (
				<li>
					<ProjectCard project={project} />
				</li>
			))
		}
	</ul>
</PageLayout>
```

- [ ] **Step 6: Create project detail page**

Create `src/pages/projects/[...slug].astro`:

```astro
---
import { render } from "astro:content";
import type { GetStaticPaths, InferGetStaticPropsType } from "astro";
import ProjectMasthead from "@/components/project/ProjectMasthead.astro";
import { getAllProjects, getProjectSlug } from "@/data/project";
import PageLayout from "@/layouts/Base.astro";

export const getStaticPaths = (async () => {
	const projects = await getAllProjects();
	return projects.map((project) => ({
		params: { slug: getProjectSlug(project) },
		props: { project },
	}));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { project } = Astro.props as Props;
const { Content } = await render(project);

const meta = {
	description: project.data.description,
	title: project.data.title,
};
---

<PageLayout meta={meta}>
	<article class="grow break-words">
		<ProjectMasthead project={project} />
		<div
			class="prose prose-sm prose-headings:font-semibold prose-headings:text-accent-2 prose-headings:before:absolute prose-headings:before:-ms-4 prose-headings:before:text-muted prose-headings:hover:before:text-accent sm:prose-headings:before:content-['#'] sm:prose-th:before:content-none"
		>
			<Content />
		</div>
	</article>
</PageLayout>
```

- [ ] **Step 7: Build and verify project routes**

Run:

```bash
pnpm build
test -f dist/projects/index.html
test -f dist/projects/personal-blog/index.html
```

Expected: build succeeds and both generated files exist.

- [ ] **Step 8: Commit project pages**

Run:

```bash
git add src/utils/date.ts src/data/project.ts src/components/project src/pages/projects
git commit -m "feat: add project pages"
```

Expected: commit succeeds.

---

### Task 5: Add Navigation And Final Verification

**Files:**
- Modify: `src/site.config.ts`

**Interfaces:**
- Consumes: `/projects/` from Task 4 and `/series/` from Task 3.
- Produces: header and footer navigation links for Projects and Series.

- [ ] **Step 1: Update menu links**

In `src/site.config.ts`, replace only the `menuLinks` array with:

```ts
export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/about/",
		title: "About",
	},
	{
		path: "/posts/",
		title: "Blog",
	},
	{
		path: "/projects/",
		title: "Projects",
	},
	{
		path: "/series/",
		title: "Series",
	},
	{
		path: "/notes/",
		title: "Notes",
	},
];
```

- [ ] **Step 2: Run full verification**

Run:

```bash
pnpm check
pnpm build
```

Expected: both commands pass.

- [ ] **Step 3: Verify generated route files**

Run:

```bash
test -f dist/posts/markdown-elements/index.html
test -f dist/series/index.html
test -f dist/series/astro-cactus/index.html
test -f dist/projects/index.html
test -f dist/projects/personal-blog/index.html
```

Expected: all commands exit with status 0.

- [ ] **Step 4: Confirm Pagefind postbuild is not required**

Run:

```bash
rg -n "data-pagefind-body" src/layouts/BlogPost.astro src/components/note/Note.astro src/pages/projects
```

Expected: matches appear only in `src/layouts/BlogPost.astro` and `src/components/note/Note.astro`; no match appears under `src/pages/projects`, so `pnpm postbuild` is not required for this implementation.

- [ ] **Step 5: Commit navigation**

Run:

```bash
git add src/site.config.ts
git commit -m "feat: add content navigation links"
```

Expected: commit succeeds.

---

## Final Review Checklist

- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.
- [ ] `/posts/markdown-elements/` exists and `/posts/markdown-elements/index/` does not.
- [ ] `/series/` exists.
- [ ] `/series/astro-cactus/` exists and lists posts.
- [ ] `/projects/` exists.
- [ ] `/projects/personal-blog/` exists.
- [ ] Existing tag pages still build.
- [ ] Existing notes pages still build.
- [ ] Header navigation contains Home, About, Blog, Projects, Series, and Notes.
