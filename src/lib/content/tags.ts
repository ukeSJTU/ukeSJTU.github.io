import { allTags } from "content-collections";
import { absoluteUrl, siteConfig } from "@/lib/site/config";
import { getPostModifiedDate, type Post, sortedBlogPosts } from "./blog";

export type Tag = Omit<(typeof allTags)[number], "_meta">;
export type TagWithPosts = Tag & { posts: Post[] };
export type TagGroup = { initial: string; tags: TagWithPosts[] };

const collator = new Intl.Collator(siteConfig.language);
const postsByTag = new Map<string, Post[]>();
for (const post of sortedBlogPosts) {
  for (const slug of post.tags) {
    const members = postsByTag.get(slug) ?? [];
    members.push(post);
    postsByTag.set(slug, members);
  }
}

export const tagsWithPosts: TagWithPosts[] = [...allTags]
  .sort((left, right) => collator.compare(left.name, right.name))
  .map(({ _meta, ...tag }) => ({
    ...tag,
    posts: postsByTag.get(tag.slug) ?? [],
  }));

const tagsBySlug = new Map(tagsWithPosts.map((tag) => [tag.slug, tag]));
export const tagGroups: TagGroup[] = [];
for (const tag of tagsWithPosts) {
  const initial =
    Array.from(tag.name.trim()).at(0)?.toLocaleUpperCase(siteConfig.language) ??
    "#";
  const group = tagGroups.find((entry) => entry.initial === initial);
  if (group) group.tags.push(tag);
  else tagGroups.push({ initial, tags: [tag] });
}

export function getTagBySlug(slug: string) {
  return tagsBySlug.get(slug);
}

export function getTagPath(tag: Pick<Tag, "slug">) {
  return `/tags/${tag.slug}`;
}

export function getTagUrl(tag: Pick<Tag, "slug">) {
  return absoluteUrl(getTagPath(tag));
}

export function getTagsModifiedDate(): Date | undefined {
  const latest = sortedBlogPosts.at(0);
  return latest ? getPostModifiedDate(latest) : undefined;
}
