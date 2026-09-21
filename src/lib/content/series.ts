import { allSeries } from "content-collections";
import { absoluteUrl, siteConfig } from "@/lib/site/config";
import { type Post, sortedBlogPosts } from "./blog";

type Series = Omit<(typeof allSeries)[number], "_meta">;

type SeriesWithPosts = Series & { posts: Post[] };

export type SeriesNavigation = {
  series: SeriesWithPosts;
  previous: Post | undefined;
  next: Post | undefined;
};

function createSeriesWithPosts(): SeriesWithPosts[] {
  const members = new Map<string, { post: Post; order: number }[]>();
  for (const post of sortedBlogPosts) {
    if (!post.series) continue;
    const { slug, order } = post.series;
    const entries = members.get(slug) ?? [];
    entries.push({ post, order });
    members.set(slug, entries);
  }

  const collator = new Intl.Collator(siteConfig.language);
  return [...allSeries]
    .sort(
      (left, right) =>
        collator.compare(left.name, right.name) ||
        left.slug.localeCompare(right.slug),
    )
    .map(({ _meta, ...series }) => ({
      ...series,
      posts: (members.get(series.slug) ?? [])
        .sort((left, right) => left.order - right.order)
        .map(({ post }) => post),
    }));
}

export const seriesWithPosts = createSeriesWithPosts();
const seriesBySlug = new Map(
  seriesWithPosts.map((series) => [series.slug, series]),
);
const navigationByPostSlug = new Map<string, SeriesNavigation>();

for (const series of seriesWithPosts) {
  series.posts.forEach((post, index) => {
    navigationByPostSlug.set(post.slug, {
      series,
      previous: series.posts[index - 1],
      next: series.posts[index + 1],
    });
  });
}

export function getSeriesBySlug(slug: string) {
  return seriesBySlug.get(slug);
}

export function getSeriesPath(series: Pick<Series, "slug">) {
  return `/series/${series.slug}`;
}

export function getSeriesUrl(series: Pick<Series, "slug">) {
  return absoluteUrl(getSeriesPath(series));
}

export function getPostSeriesNavigation(post: Pick<Post, "slug">) {
  return navigationByPostSlug.get(post.slug);
}
