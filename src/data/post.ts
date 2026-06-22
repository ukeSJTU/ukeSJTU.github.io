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
	return posts.filter((post) => post.data.series.id === seriesSlug).sort(collectionDateSort);
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
